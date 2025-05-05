import React, { useEffect } from "react";
import { getProfileImage, getXIInfo } from "../../service/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getStorage, setStorage, getSessionStorage, setSessionStorage } from "../../service/storageService";
import { Oval } from "react-loader-spinner";
// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { useNavigate } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import Location from "../../assets/images/Location.svg";
import LinkedInIcon from "../../assets/images/LinkedInIcon.svg";
import styles from "./UserProfile.module.css";
import PhoneCall from "../../assets/images/PhoneCall.svg";
import Message from "../../assets/images/Message.svg";
import { Divider } from "@mui/material";
import NewEdit from "../../assets/images/NewEdit.svg";
import Tabs from "../../Components/Dashbaord/Tabs.jsx";
import usePopup from "../../Hooks/usePopup.js";
import ContactDetailsPopup from "./UserProfileComponents/ContactDetailsPopup.jsx";
import useUser from "../../Hooks/useUser.js";
import { useSelector } from "react-redux";
import UserProfileImageComponent from "../../Components/Dashbaord/UserProfileImageComponent.jsx";
import useWindowSize from "../../Hooks/useWindowSize.js";

const UserProfile = () => {
  // Profile image changes

  const [editImage, setEditImage] = React.useState(null)
  const [openDialog, setOpenDialog] = React.useState(false);
  const userProfileImage = useSelector(state => state?.profile?.userProfileImage);
  // Resume refresh
  const [refresh, setRefresh] = React.useState(false)

  const { handleGetUserFromId } = useUser();
  const { userDetails } = useSelector(state => state.user);
  // console.log("userDetails:", userDetails);
  const userInfo = userDetails?.user ?? {};
  // console.log("userInfo:", userInfo);

  const part = !userDetails?.user?.linkedinurl ? "" : userDetails?.user?.linkedinurl?.split("/")
  let linkedinUserName

  if (part !== "") {
    for (let i = 0; i < part.length; i++) {
      if (part[i] === "in" && i < part.length - 1) {
        linkedinUserName = part[i + 1];
        break;
      }
    }
  }


  const [user, setUser] = React.useState();
  const [level, setLevel] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);
  const [loader, setLoader] = React.useState(true);
  const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup();
  const { width } = useWindowSize();

  // React.useEffect(()=>{

  // },[openDialog , profileImg , user])

  React.useEffect(() => {
    const func = async () => {
      //let user = JSON.parse(await getStorage("user"));
      const user = JSON.parse(getSessionStorage("user"));
      let access_token = getStorage("access_token");

      let xi_info = await getXIInfo(user?._id);
      if (xi_info?.data?.user) {
        setLevel(xi_info?.data?.user?.level);
        setLoader(false);
      }
      // if (user && user.profileImg) {
      if (userProfileImage) {
        setLoader(false);
        //let image = await getProfileImage({ id: user._id }, user.access_token);

        //if (image?.status === 200) {
        setSessionStorage("profileImg", JSON.stringify(userProfileImage));

        let base64string = btoa(
          new Uint8Array(userProfileImage?.Image?.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, ""),
        );
        let src = `data:image/png;base64,${base64string}`;
        await setProfileImg(src);
        //}
      }
      if (access_token === null) window.location.href = "/login";

      setLoader(false);
      await setUser(user);
    };
    func();
  }, [editImage, refresh, userProfileImage]);

  const handleShowContactPopup = () => {
    handlePopupCenterOpen(true);
    handlePopupCenterComponentRender(<ContactDetailsPopup />);
  };

  useEffect(() => {
    if (user) {
      handleGetUserFromId(user?._id);
    }
  }, [user]);

  const handleProfileImagePopup = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <div className="flex bg-slate-50 w-full h-full oflowx-scroll">
        <div className="container mx-auto bg-slate-50 p-4 customMobileCss">
          <div className="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
            <div className={`!bg-primary h-[100px] ${styles.MobileBackground}`}></div>
            {loader ? (
              <div
                className="mt-40 w-full"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  background: "white",
                }}>
                <Oval />
                <Oval />
                <Oval />
                {width > 650 ?
                  <>
                    <Oval />
                    <Oval />
                  </>
                  : null}
              </div>
            ) : (
              <div className={`w-full  ${styles.MobileProfileWrapper}`}>
                {/* <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p> */}
                {user !== null && user !== undefined ? (
                  <>
                    <div className={`${styles.UpperProfileWrapper}`}>
                      {/* <img src={NewEdit} alt="edit" /> */}
                      <div className={styles.LeftSection} onClick={handleProfileImagePopup}>
                        <img
                          src={user && user.profileImg && profileImg ? profileImg : Avatar}
                          alt="user"
                          className={`${styles.UserProfileImg}`}
                        />
                      </div>
                      {openDialog && (
                        <UserProfileImageComponent
                          openDialog={openDialog}
                          setOpenDialog={setOpenDialog}
                          profileImg={profileImg}
                          setProfileImg={setProfileImg}
                          setEditImage={setEditImage}
                        />
                      )}
                      <div className={`${styles.RightSection}`}>
                        <>
                          <div className={`${styles.UserNameWrapper}`}>
                            <h1 className={styles.Heading}>
                              {userInfo?.firstName} {userInfo?.lastname}
                            </h1>
                            {/* <span className={styles.Username}>{userInfo?.username}</span> */}
                            <img
                              src={NewEdit}
                              alt="Edit"
                              className={styles.EditImg}
                              onClick={handleShowContactPopup}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className={styles.CheckpointWrapper}>
                            <div className={styles.Checkpoint}>
                              {userDetails?.user?.sectionCompletion?.contact ? (
                                <CheckCircleIcon className={styles.CheckIcon} />
                              ) : (
                                <div className={`${styles.Circle}`}>1</div>
                              )}
                              <span className={styles.CheckpointItem}>Contact</span>
                            </div>
                            <div className={styles.Checkpoint}>
                              {userDetails?.user?.sectionCompletion?.education ? (
                                <CheckCircleIcon className={styles.CheckIcon} />
                              ) : (
                                <div className={styles.Circle}>2</div>
                              )}
                              <span className={styles.CheckpointItem}>Education</span>
                            </div>
                            <div className={styles.Checkpoint}>
                              {userDetails?.user?.sectionCompletion?.experience ? (
                                <CheckCircleIcon className={styles.CheckIcon} />
                              ) : (
                                <div className={styles.Circle}>3</div>
                              )}
                              <span className={styles.CheckpointItem}>Experiences</span>
                            </div>
                            <div className={styles.Checkpoint}>
                              {userDetails?.user?.sectionCompletion?.skills ? (
                                <CheckCircleIcon className={styles.CheckIcon} />
                              ) : (
                                <div className={styles.Circle}>4</div>
                              )}
                              <span className={styles.CheckpointItem}>Skills</span>
                            </div>
                            <div className={styles.Checkpoint}>
                              {userDetails?.user?.sectionCompletion?.resume ? (
                                <CheckCircleIcon className={styles.CheckIcon} />
                              ) : (
                                <div className={styles.Circle}>5</div>
                              )}
                              <span className={styles.CheckpointItem}>Resume</span>
                            </div>
                          </div>
                          <Divider />
                          <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                              <img src={Location} alt="Location" />
                              <span className={styles.UserInfo}>{userInfo?.location}</span>
                              {/* <span className={styles.UserInfo}>{userInfo?.country}</span> */}
                            </div>
                            <div className="flex items-center gap-1">
                              <img src={PhoneCall} alt="contact" />
                              <span className={styles.UserInfo}>{userInfo?.contact}</span>
                            </div>
                          </div>{" "}
                          <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                              <img src={LinkedInIcon} alt="" />
                              {/* <span className={styles.UserInfo}>{userInfo?.city}</span>
                            // <span className={styles.UserInfo}>{userInfo?.country}</span> */}
                              {linkedinUserName && (
                                <span className={styles.UserInfo}>{linkedinUserName}</span>
                              )}
                            </div>
                            <div className="flex">
                              <div className="flex items-center gap-1">
                                <img src={Message} alt="" />
                                <span className={styles.UserInfo}>{userInfo?.email}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                    <div className={`!bg-primary h-[100px] ${styles.MobileBackground}`}></div>

                    <div className={styles.TabsWrapper} style={{ borderRadius: "12px" }}>
                      <Tabs setRefresh={setRefresh} refresh={refresh} />
                    </div>
                  </>
                ) : null}{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
