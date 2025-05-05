import "../../assets/stylesheet/Tabs.scss";


import {
  getUserFromId,
  uploadCandidateResume,
} from "../../service/api";
import { getStorage, removeStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import "react-multi-carousel/lib/styles.css";
import styles from "./Tabs.module.css";
import AboutComponent from "./UserProfileComponents/AboutComponent";
import EducationComponent from "./UserProfileComponents/EducationComponent/EducationComponent";
import Button from "../Button/Button";
import NewEdit from "../../assets/images/NewEdit.svg";
import ExperienceComponent from "./UserProfileComponents/ExperienceComponent/ExperienceComponent";
import AddLanguagePopup from "./UserProfileComponents/AddLanguagePopup/AddLanguagePopup";
import usePopup from "../../Hooks/usePopup";
import SkillsComponent from "./UserProfileComponents/SkillsComponent/SkillsComponent";
import useUser from "../../Hooks/useUser";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert";
import ErrorIcon from "@mui/icons-material/Error";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import useWindowSize from "../../Hooks/useWindowSize";
import MobileContactSection from "./UserProfileComponents/MobileContactSection/MobileContactSection";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ReactComponent as ExpandIcon } from "../../assets/images/Profile/ExpandIcon.svg";
import UserProfileImageComponent from "./UserProfileImageComponent";
import Avatar from "../../assets/images/UserAvatar.png";
// import Avatar from "../../../assets/images/UserAvatar.png";


export default function Tabs({ setRefresh, refresh }) {
  const { handleDeleteUserResume, handleGetUserProfileImage, handleDownloadResume } = useUser();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [editImage, setEditImage] = useState(null)

  const { userProfileImage } = useSelector(state => state.profile);


  const [userFromId, setUserFromId] = useState(null);
  const { handlePopupCenterComponentRender, handlePopupCenterOpen } = usePopup();

  const [loading, setLoading] = useState(false);


  const [isEditingLanguage, setIsEditingLanguage] = useState(false)
  const { userDetails } = useSelector(state => state.user);
  const [profileImgSrc, setProfileImgSrc] = useState(null)

  const userInfo = userDetails?.user ?? {};


  const { width } = useWindowSize();

  const handleEditingLanguage = () => {
    setIsEditingLanguage(true)
  }

  useEffect(() => {
    const func = async () => {
      //let user = JSON.parse(await getSessionStorage("user"));
      const user = JSON.parse(getSessionStorage("user"));
      let user1 = await getUserFromId({ id: user._id }, user.access_token);
      setUserFromId(user1?.data?.user);
      let access_token = getStorage("access_token");
      if (user1 && user1?.profileImg) {
        const img = user.profileImg;
      }
      if (access_token === null) window.location.href = "/login";
      let primarySkills = {};
      let roles = new Set([]);
      user?.tools?.forEach(skill => {
        roles.add(skill.role);
        if (primarySkills[skill.role]) {
          primarySkills[skill.role].add(skill.primarySkill);
        } else {
          primarySkills[skill.role] = new Set([skill.primarySkill]);
        }
      });
      Array.from(roles).map(el => {
        primarySkills[el] = Array.from(primarySkills[el]);
      });
      // //console.log(user);
      if (
        user.language.length > 0 &&
        user.language !== "null" &&
        user.language !== null
      ) {
        const hasString = user.language.some(element => typeof element == "string");
        if (hasString === true) {
          user.language = user.language.filter(e => typeof e !== "string");
        }
      }
    };
    func();
  }, [refresh]);

  const handleAddLanguagePopup = (isMobile) => {
    handlePopupCenterComponentRender(<AddLanguagePopup isMobile={isMobile} />);
    handlePopupCenterOpen(true);
  };
  const handleFileSelect = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = async event => {
    let file = event.target.files[0];

    if (file?.size > 5000000) {
      swal({
        icon: "error",
        title: "Oops",
        text: "Please upload file less than 5mb",
        button: "Continue",
      });
      return
    }
    let extension = file?.name.split(".")
    extension = extension[extension?.length - 1]
    if (extension === "pdf" || extension === "doc" || extension === "docx") {
      if (file) {
        setLoading(true);

        // Here you can add code to handle the file, such as uploading it
        removeSessionStorage("uploadedFileName");
        file = file?.name?.split(".").pop();
        //let user = JSON.parse(await getSessionStorage("user"));
        let user = JSON.parse(getSessionStorage("user"))
        let access_token = await getStorage("access_token");
        let fd = new FormData();
        fd.append("user_id", user._id);
        fd.append("file", event.target.files[0]);

        let response = await uploadCandidateResume(fd, access_token);
        if (response && response.status === 200) {
          setRefresh(!refresh)
          removeSessionStorage("user");
          setSessionStorage("user", JSON.stringify(response?.data?.user));
          setLoading(false);
          swal({
            icon: "success",
            title: "Resume Uploaded Successfully",
            text: "Please review your profile and edit details wherever is required.",
            button: "Ok",
          }).then(() => {
            setRefresh(!refresh)
            if (user?.user_type === "User") {
              navigate("/user/profile");
            } else if (user?.user_type === "XI") {
              navigate("/XI/profile");
            }
          });
        } else {
          setLoading(false);
          swal({
            icon: "error",
            title: "Resume upload",
            text: "Something went wrong while parsing your resume, Please enter your details manually",
            button: "Ok",
          }).then(() => {
            if (user?.user_type === "User") {
              navigate("/user/profile");
            } else if (user?.user_type === "XI") {
              navigate("/XI/profile");
            }
          });
        }
      }
    }
    else {
      setLoading(false);
      swal({
        icon: "error",
        title: "Oops",
        text: "Please upload file in .doc, .docx or .pdf format",
        button: "Continue",
      });
    }
  };

  // Delete User Resume

  const handleDeleteResume = async () => {
    swal({
      title: "Delete confirmation",
      text: "Are you sure you want to delete the resume?",
      buttons: {
        cancel: true,
        confirm: true,
      }
    }).then(async (value) => {
      if (value === true) {
        const res = await handleDeleteUserResume(userFromId?._id);
        if (res && res?.user) {
          setRefresh(!refresh)
          // window.location.reload();
          swal({
            icon: "success",
            title: "Resume deleted",
            text: "Please upload a new resume whenever time permits!",
            button: "Ok",
          })
        }
      } else return;
    })
  };



  const handleProfileImagePopup = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    const initial = async () => {
      // if (width > 650) {
      //console.log('userDetails:', userDetails)
      await handleGetUserProfileImage(userDetails?.user?._id);

      // }
    }
    initial();
  }, [])//width

  useEffect(() => {
    if (userProfileImage) {
      let base64string = btoa(
        new Uint8Array(userProfileImage?.Image?.data).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, ""),
      );
      let src = `data:image/png;base64,${base64string}`;
      if (src) {
        setProfileImgSrc(src)
      }
    }
  }, [userProfileImage])

  // Resume Download

  const handleDownload = async () => {
    const res = await handleDownloadResume(userDetails?.user?._id)
    const dataBuffer = new Uint8Array(res)

    const blob = new Blob([dataBuffer], { type: 'application/octet-stream' });

    // Create a link element
    const link = document.createElement('a');

    // Set the href to a URL created from the blob
    link.href = URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    link.download = `${userFromId?.resume}`;

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  }

  return (
    width > 650 ?
      <div className={`Tabs w-screen mt-3 ${styles.TabContainer}`}>
        {/* tabs start */}
        <div className="tabList w-fit px-0 border-gray-200 pb-3 pl-3">
          <div
            className={`tabHead ${index === 0 && styles.ActiveTab} ${styles.ErrorIconWrapper
              }`}
            onClick={() => {
              setIndex(0);
            }}>
            <p className="lg:visible  content">About</p>
            {!userDetails?.user?.sectionCompletion?.about ? (
              <ErrorIcon className={styles.ErrorIcon} />
            ) : null}
          </div>
          <div
            className={`tabHead ${index === 1 && styles.ActiveTab} ${styles.ErrorIconWrapper
              }`}
            onClick={() => {
              setIndex(1);
            }}>
            <p className="lg:visible  content">Education</p>
            {!userDetails?.user?.sectionCompletion?.education ? (
              <ErrorIcon className={styles.ErrorIcon} />
            ) : null}
          </div>
          <div
            className={`tabHead ${index === 2 && styles.ActiveTab} ${styles.ErrorIconWrapper
              }`}
            onClick={() => {
              setIndex(2);
            }}>
            <p className="lg:visible  content">Experience</p>
            {!userDetails?.user?.sectionCompletion?.experience ? (
              <ErrorIcon className={styles.ErrorIcon} />
            ) : null}
          </div>

          <div
            className={`tabHead ${index === 4 && styles.ActiveTab} ${styles.ErrorIconWrapper
              }`}
            onClick={() => {
              setIndex(4);
            }}>
            <p className="lg:visible  content">Skills</p>
            {!userDetails?.user?.sectionCompletion?.skills ? (
              <ErrorIcon className={styles.ErrorIcon} />
            ) : null}
          </div>
        </div>
        {/* tabs end */}
        <div className={styles.TabsContentWrapper}>
          <div
            className={`tabContent bg-red py-4 w-full ${styles.Wrapper} `}
            hidden={index != 0}>
            <AboutComponent />
          </div>
          <div
            className={`tabContent bg-white flex flex-col gap-2  ${styles.Wrapper}`}
            hidden={index != 1}>
            <EducationComponent />
          </div>
          <div
            className={`tabContent bg-white flex flex-col gap-2 ${styles.Wrapper}`}
            hidden={index != 2}>
            <ExperienceComponent />
          </div>
          <div className="tabContent mx-5 bg-white py-5 px-6" hidden={index != 3}></div>
          <div
            className={`${styles.Wrapper}  tabContent bg-white py-3 px-1`}
            hidden={index != 4}>
            <SkillsComponent />
          </div>
          <div className={styles.RightSection}>
            {!userFromId?.resume ? (
              <div className={styles.ResumeWrapper}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    alignSelf: "flex-start",
                  }}>
                  <h2 className={styles.Heading} style={{ alignSelf: "flex-start" }}>
                    Resume
                  </h2>
                  {userDetails?.user?.sectionCompletion?.resume ? null : (
                    <ErrorIcon className={styles.ErrorIcon} />
                  )}
                </div>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {loading ? (
                  <>
                    <Button className="bg-white" btnType={"secondary"} text={"Uploading"} />
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-white"
                      btnType={"secondary"}
                      text={"Upload Resume"}
                      onClick={handleFileSelect}
                    />
                  </>
                )}
                <span className={styles.Text}>.doc, .docx and .pdf</span>
              </div>
            ) : (
              <div className={styles.ResumeWrapper}>
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      alignSelf: "flex-start",
                      justifyContent: "space-between",
                      width: "100%",
                    }}>
                    <h2 className={styles.Heading} style={{ alignSelf: "flex-start" }}>
                      Resume
                    </h2>

                    <p
                      style={{
                        cursor: "pointer",
                        color: "var(--primary-green)",
                        fontWeight: 500,
                      }}
                      onClick={handleFileSelect}>
                      Update
                    </p>
                  </div>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {loading ? (
                    <>
                      <Button
                        className="bg-white"
                        btnType={"secondary"}
                        text={"Uploading"}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    justifyContent: "space-between",
                  }}>
                  <div className="cursor-pointer underline" onClick={handleDownload} >{userFromId?.resume}</div>
                  {/* <div>{userFromId?.firstName} - resume </div> */}
                  <DeleteIcon
                    sx={{
                      color: "var(--primary-green)",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={handleDeleteResume}
                  />
                </div>
              </div>
            )}
            <div className={styles.LanguagesWrapper}>
              <div className={styles.Header}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <h2 className={styles.Heading}>Languages</h2>
                  {userDetails?.user?.sectionCompletion?.language ? null : (
                    <ErrorIcon className={styles.ErrorIcon} />
                  )}
                </div>
                <img
                  src={NewEdit}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAddLanguagePopup(false)}
                />
              </div>

              <div>
                {userDetails?.user.languageProficiency?.length > 0 ? userDetails?.user.languageProficiency.map(
                  ({ language, proficiency }, index) => {
                    return (
                      <div className={styles.ProficiencyWrapper} key={index}>
                        <div className={styles.LanguageColumn} >
                          <span className={styles.LanguageText}>{language?.name}</span>
                        </div>
                        <div className={styles.Proficiency}>
                          {Object.entries(proficiency).map(([type, value], index) => {
                            return value ? (
                              <div className={styles.TypeWrapper} key={index}>
                                <CheckCircleIcon className={styles.CheckIcon} />
                                <span className={styles.LanguageText}>{type}</span>
                              </div>
                              // ) : null;
                            ) :
                              type === "read" ?
                                <div className={styles.TypeWrapper} key={index}>
                                  {/* <span className={styles.LanguageText}>&#8202;&#8202;&#8202;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> */}
                                  {/* <span style={{ paddingLeft: '47.5px' }}></span> */}
                                  <span style={{ paddingLeft: '30px' }}></span>
                                </div>
                                :
                                type === "write" ?
                                  <div className={styles.TypeWrapper} key={index}>
                                    {/* <span className={styles.LanguageText}>&#8202;&#8202;&#8202;&#8202;&#8202;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> */}
                                    {/* <span style={{ paddingLeft: '51px' }}></span> */}
                                    <span style={{ paddingLeft: '35px' }}></span>
                                  </div>
                                  :
                                  <div className={styles.TypeWrapper} key={index}>
                                    {/* <span className={styles.LanguageText}>&#8202;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> */}
                                    {/* <span style={{ paddingLeft: '55.6px' }}></span> */}
                                    <span style={{ paddingLeft: '40px' }}></span>
                                  </div>
                          })}
                        </div>
                      </div>
                    );
                  },
                ) : "No Languages Added.."}
              </div>
            </div>
          </div>
        </div>
      </div> : <div className={styles.MobileVersion}>
        {/* <div className={"mx-auto absolute left-24 top-24 flex flex-col gap-3 items-center"} onClick={handleProfileImagePopup}> */}
        <div className={"mx-auto absolute left-1/2 top-24 transform -translate-x-1/2 flex flex-col gap-3 items-center"} onClick={handleProfileImagePopup}>
          <img
            src={profileImgSrc ?? Avatar}
            alt="user"
            className={`${styles.UserProfileImg} rounded-full`}
            style={{ cursor: "pointer", width: "11rem", height: "11rem" }}
          />
          <span className={`font-bold mx-auto text-[16px]`}>{userInfo?.firstName} {userInfo?.lastname}</span>
        </div>
        {openDialog && (
          <UserProfileImageComponent
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            profileImg={profileImgSrc}
            setEditImage={setEditImage}
            setProfileImg={setProfileImgSrc}
          />
        )}
        <MobileContactSection userDetails={userDetails} />
        {/* resume */}
        <div className={styles.ResumeWrapper}>
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                alignSelf: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <h2 className={styles.Heading} style={{ alignSelf: "flex-start" }}>
                Resume
              </h2>

              <p
                style={{
                  cursor: "pointer",
                  color: "var(--primary-green)",
                  fontWeight: 500,
                }}
                onClick={handleFileSelect}>
                Update
              </p>
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {loading ? (
              <>
                <Button
                  className="bg-white"
                  btnType={"secondary"}
                  text={"Uploading"}
                />
              </>
            ) : (
              <></>
            )}
          </>
          <div
            className={styles.ResumeHeader}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              justifyContent: "space-between",

            }}>
            {/* <div>{userFromId?.resume}</div> */}
            <div className="cursor-pointer underline" href="#" onClick={handleDownload}>{userFromId?.resume}</div>
            <DeleteIcon
              sx={{
                color: "var(--primary-green)",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={handleDeleteResume}
            />
          </div>
        </div>
        <AboutComponent isMobile={true} />
        <EducationComponent isMobile={true} />
        <ExperienceComponent isMobile={true} />
        <SkillsComponent isMobile={true} />
        {/* Languages */}
        <Accordion sx={{ borderRadius: "12px", "&::before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            {userDetails?.user?.sectionCompletion?.language ? null : (
              <ErrorIcon className={styles.ErrorIcon} sx={{ color: "rgba(217, 148, 66, 1)", marginRight: "1rem" }} />
            )}
            <span className="font-bold">
              Languages
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.Header}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <h2 className={styles.Heading}>Languages</h2>

              </div>
              <img
                src={NewEdit}
                style={{ cursor: "pointer" }}
                onClick={() => handleAddLanguagePopup(true)}
              />
            </div>
            <div>
              {userDetails?.user.languageProficiency?.length > 0 ? userDetails?.user.languageProficiency.map(
                ({ language, proficiency }, index) => {
                  return (
                    <div className={styles.ProficiencyWrapper} key={index}>
                      <div className={styles.LanguageColumnMobile}>
                        <span className={styles.LanguageText}>{language?.name}</span>
                      </div>
                      <div className={styles.ProficiencyMobile}>
                        {Object.entries(proficiency).map(([type, value], index) => {
                          return value ? (
                            <div className={styles.TypeWrapper} key={index}>
                              <CheckCircleIcon className={styles.CheckIcon} />
                              <span className={styles.LanguageText}>{type}</span>
                            </div>
                            // ) : null;
                          ) : type === "read" ?
                            <div className={styles.TypeWrapper} key={index}>
                              {/* <span className={styles.LanguageText}>&#8239;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> */}
                              {/* <span style={{ paddingLeft: '47.5px' }}></span> */}
                              <span style={{ paddingLeft: '30px' }}></span>
                            </div>
                            :
                            type === "write" ?
                              <div className={styles.TypeWrapper} key={index}>
                                {/* <span className={styles.LanguageText}>&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> */}
                                {/* <span style={{ paddingLeft: '51px' }}></span> */}
                                <span style={{ paddingLeft: '35px' }}></span>
                              </div>
                              :
                              <div className={styles.TypeWrapper} key={index}>
                                {/* <span className={styles.LanguageText}>&#8239;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> */}
                                {/* <span style={{ paddingLeft: '56px' }}></span> */}
                                <span style={{ paddingLeft: '40px' }}></span>
                              </div>
                        })}
                      </div>
                    </div>
                  );
                },
              ) : "No Languages Added.."}
            </div>
          </AccordionDetails>

        </Accordion>

      </div >
  );
}
