import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CustomChip from "../../../../CustomChip/CustomChip";
import styles from "./ReportHeaderComponent.module.css";
import { Close } from "@material-ui/icons";
import { Popover } from "@headlessui/react";
import usePreEvaluation from "../../../../../Hooks/usePreEvaluation";
import { IoArrowDownCircle } from "react-icons/io5";
import StarIcon from "@mui/icons-material/Star";

import Avatar from "../../../../../assets/images/UserAvatar.png";
import { useSelector } from "react-redux";
import Loader from "../../../../Loader/Loader";
import Button from "../../../../Button/Button";
import { useParams } from "react-router-dom";
import { MdOutlineFileDownload } from "react-icons/md";
import getStorage, { getSessionStorage } from "../../../../../service/storageService";
import {
  getCompanyCredit,
  getCreditMapByCompany,
} from "../../../../../service/creditMapService";
import ConfirmPopup from "../../MainViewComponent/ConfirmPopup/ConfirmPopup";
import InvitePopup from "../../MainViewComponent/InvitePopup/InvitePopup";
import usePopup from "../../../../../Hooks/usePopup";
import { notify } from "../../../../../utils/notify";

const ReportHeaderComponent = ({
  isMainView,
  setReportType,
  reportType,
  showSelectReport = true,
  selectedCandidate,
  isReportView,
  setIsOnClickTagView,
  setHasReport,
  downloadReport,
  organizationID
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [user, setUser] = useState();
  const [data, setData] = useState();
  const [isCultureCellLoading, setIsCultureCellLoading] = useState({});
  const [isReport, setIsReport] = useState(false);
  const [isTeamCellLoading, setIsTeamCellLoading] = useState({});
  const [selectedTag, setSelectedTag] = useState(""); // State to track selected tag
  const {
    handleAddTags,
    handleGetCultureMatch,
    handleGetCompanyNameById,
    handleCreateTeamCompatibility,
    handleTeamDynamicsConfidence,
    handleGetMainViewProf,
  } = usePreEvaluation();
  const { mainViewProfiles, isGetMainViewProfilesLoading, companyName, mainViewProf } =
    useSelector(state => state.preEvaluation);
  const [isInviteCellLoading, setIsInviteCellLoading] = useState({});
  const [isCogCellLoading, setIsCogCellLoading] = useState({});
  const { allPodsData } = useSelector(state => state.pod);
  const [selectedPods, setSelectedPods] = useState(0);


  const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup();

  useEffect(() => {
    const data = allPodsData?.filter(value => value?.isSelected === true);
    setSelectedPods(data?.length);
  }, [allPodsData]);

  useEffect(() => {
    setPopoverOpen(false);
    const mayBeOrNotFitTag = selectedCandidate?.customtags?.find(
      tag => tag.tagname === "May be" || tag.tagname === "Not a fit",
    );

    // Set selectedTag based on the presence of "may be" or "notfit" tag
    setSelectedTag(mayBeOrNotFitTag ? mayBeOrNotFitTag.tagname : "");
  }, [selectedCandidate]);

  const { id: jobId } = useParams();
  const getUser = async () => {
    let user = await JSON.parse(getSessionStorage("user"));
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user?.company_id) {
      handleGetCompanyNameById(user?.company_id);
    }
  }, [user]);

  const { isInviteCandidateForInterviewLoading, isInviteCandidateForCognitiveLoading } =
    useSelector(state => state.invite);

  const filterData = mainViewProfiles
    ? mainViewProfiles.filter(
      profile =>
        profile.email === selectedCandidate?.email &&
        profile.phoneNo === selectedCandidate?.phoneNo,
    )
    : [];

  const hasTeamDynamicReport = mainViewProf?.evaluationid?.hasTeamDynamicReport;
  if (isReport) setHasReport(hasTeamDynamicReport);
  const technicalRating = mainViewProf?.evaluationid?.technicalRating;
  const overallTeamCompatibility = mainViewProf?.evaluationid?.overallTeamCompatibility;
  const cognitiveMatch = mainViewProf?.evaluationid?.cognitiveMatch;
  const cognitionInvited = mainViewProf?.evaluationid?.cognitionInvited;
  const culturalMatch = mainViewProf?.evaluationid?.culturalMatch;
  const cultureInvited = mainViewProf?.evaluationid?.cultureInvited;
  const isEnoughDataAvailable = mainViewProf?.isEnoughDataAvailable;
  const psychJobStatus = mainViewProf?.psychJobStatus;
  const interviewInvited = mainViewProf?.evaluationid?.interviewInvited;
  const evaluationId = !isMainView
    ? selectedCandidate?.candidateId
    : selectedCandidate?.evaluationId || selectedCandidate?._id;
  const indiProfileId = !isMainView
    ? selectedCandidate?.mProfileId
    : selectedCandidate?.indiProfileId;
  const linkedinUrl = !isMainView
    ? selectedCandidate?.profileURL
    : selectedCandidate?.linkedinUrl;

  // console.log("candid", data)

  useEffect(() => {
    // console.log("evaluation", evaluationId);

    const fetchData = async () => {
      try {
        // Assuming handleGetMainViewProf is an asynchronous function
        await handleGetMainViewProf(evaluationId);
        setData(mainViewProf);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCandidate]);

  const handleAddCustomTag = async (candidateId, tag) => {
    try {
      await handleAddTags(candidateId, tag);
      setPopoverOpen(false);
      setSelectedTag(tag); // Update selected tag in state
    } catch (error) {
      // Handle error
    }
  };

  const handleReportTypeSelection = type => {
    setReportType(type);
  };

  const handleGetCultureMatchReport = (indiProfileId, evaluationId) => {
    // console.log("indi", indiProfileId, evaluationId)
    if (!indiProfileId) {
      notify("No data yet, Please try again later", "error");
      return;
    }

    const data = {
      organizationID: organizationID,
      profileID: indiProfileId,
    };

    // Trigger the asynchronous operations
    handleGetCultureMatch(data, evaluationId, jobId);

    setData(mainViewProf);
  };

  const handlePullTeamCompatibilityReport = (linkedinURL, evaluationId) => {
    const data = {
      linkedinURL,
      jobId,
    };
    // if (selectedPods) {
    handleTeamDynamicsConfidence(user?.company_id, evaluationId, jobId);
    handleCreateTeamCompatibility(user?.company_id, data);

    // } else {
    //   notify('Pod is not added, please add the pod!','error');
    // }
  };

  const handleShowPopup = async (
    {
      firstName,
      lastName,
      email,
      contact,
      linkedinURL,
      evaluationId,
      action,
      phoneNo,
      indiProfileId,
      company_id,
    },
    isCognitive = false,
  ) => {
    try {
      const respo = await getCreditMapByCompany(user.company_id);

      const response = await getCompanyCredit(user.company_id);
      const creditPop = response?.data?.credit.find(
        entry => entry.action === action,
      )?.credit;

      const maxCredit = respo?.data?.credit.find(
        entry => entry.action === action,
      )?.credit;

      //console.log("renovo", maxCredit)

      if (creditPop > maxCredit) {
        handlePopupCenterOpen(true);
        const handleCloseLoader = () => {
          setIsCultureCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          setIsTeamCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          setIsInviteCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          setIsCogCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          // Additional close actions if needed
        };

        const handleCultLoader = () => {
          setIsCultureCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };

        const handleTeamLoader = () => {
          setIsTeamCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };

        const handleTechLoader = () => {
          setIsInviteCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };

        const handleCognitiveLoader = () => {
          setIsCogCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };
        handlePopupCenterComponentRender(
          <ConfirmPopup
            handleCloseLoader={handleCloseLoader}
            handleCultLoader={handleCultLoader}
            handleTeamLoader={handleTeamLoader}
            handleTechLoader={handleTechLoader}
            handleCognitiveLoader={handleCognitiveLoader}
            data={{
              firstName,
              lastName,
              email,
              contact,
              linkedinURL,
              evaluationId,
              action,
              company: user.company_id,
              phoneNo,
              companyName: companyName?.companyName,
              companyId: company_id,
              jobId,
              creditPop,
              maxCredit,
              indiProfileId,
            }}
            isCognitive={isCognitive}
          />,
        );
      } else {
        handlePopupCenterOpen(true);
        handlePopupCenterComponentRender(
          <InvitePopup
            data={{
              firstName,
              lastName,
              email,
              contact,
              linkedinURL,
              evaluationId,
              action,
              company: user.company_id,
              creditPop,
              maxCredit,
              indiProfileId,
            }}
          />,
        );
      }
    } catch (error) {
      // Handle errors from the verification service
      console.error("Error verifying service:", error);
    }
  };

  const getTeamCompatibilityLabel = teamCompatibility => {
    teamCompatibility = teamCompatibility * 100;
    if (teamCompatibility > 85) {
      return { chipType: "success", label: "High+" };
    }
    if (teamCompatibility >= 75 && teamCompatibility <= 85) {
      return { chipType: "success", label: "High" };
    }
    if (teamCompatibility >= 65 && teamCompatibility < 75) {
      return { chipType: "warning", label: "Medium" };
    }
    if (teamCompatibility < 65) {
      return { chipType: "error", label: "Low" };
    }
  };

  const getCulturalMatchLabel = inputString => {
    switch (inputString) {
      case "low":
        return "Low";
      case "Low":
        return "Low";
      case "medium":
        return "Mid";
      case "Medium":
        return "Mid";
      case "high":
        return "High"
      case "High":
        return "High"
      case "High+":
        return "High+";
      case "high+":
        return "High+";
      default:
        return null; // You can choose an appropriate default value or handle the case as needed
    }
  };

  function getCultureMatchChipType(cultureMatch) {
    if (cultureMatch === "low" || cultureMatch === "Low") {
      return "error";
    } else if (cultureMatch === "medium" || cultureMatch === "med" || cultureMatch === "Medium") {
      return "warning";
    } else if (cultureMatch === "high" || cultureMatch === "high+" || cultureMatch === "High" || cultureMatch === "High+") {
      return "success";
    } else {
      return null; // You can choose an appropriate default value or handle the case as needed
    }
  }

  const {
    hasFeedback,
    hasVMProReport,
    hasVmLiteReport,
  } = selectedCandidate ?? {};
  const handleGetProfileImgeBorder = (
    hasFeedback,
    hasVMProReport,
    hasVmLiteReport,
    overallTeamCompatibility,
  ) => {
    const trueCount = [
      hasFeedback,
      hasVMProReport,
      hasVmLiteReport,
      overallTeamCompatibility,
    ].filter(Boolean).length;


    if (trueCount === 1) {
      return 1;
    } else if (trueCount === 2) {
      return 2;
    } else if (trueCount === 3) {
      return 3;
    } else if (trueCount === 4) {
      return 4;
    } else {
      return 0; // This case should not occur, but added for completeness
    }
  };

  return (
    <div className={styles.Wrapper}>
      {isReportView ? (
        <Close
          className={styles.CloseBtn}
          onClick={() => {
            setIsOnClickTagView(false);
          }}
        />
      ) : null}
      <div className={styles.Header}>
        <div className={styles.CandidateInfoWrapper}>
          <div className="flex flex-row gap-4 items-center">

            {handleGetProfileImgeBorder(
              hasFeedback,
              hasVMProReport,
              hasVmLiteReport,
              overallTeamCompatibility > 0 ? 1 : 0,
            ) === 1 && (
                <div className={styles.Circle}>
                  <img
                    className="object-contain"
                    src={selectedCandidate?.userImage ? selectedCandidate?.userImage : Avatar}
                    alt=""></img>
                </div>
              )}
            {handleGetProfileImgeBorder(
              hasFeedback,
              hasVMProReport,
              hasVmLiteReport,
              overallTeamCompatibility > 0 ? 1 : 0,
            ) === 2 && (
                <div className={styles.Circle}>
                  <ul className={styles.Lines}>
                    <li></li>
                    <li style={{ transform: "rotate(-90deg)" }}></li>
                  </ul>
                  <img
                    className="object-contain"
                    src={selectedCandidate?.userImage ? selectedCandidate?.userImage : Avatar}
                    alt=""></img>
                </div>
              )}

            {handleGetProfileImgeBorder(
              hasFeedback,
              hasVMProReport,
              hasVmLiteReport,
              overallTeamCompatibility > 0 ? 1 : 0,
            ) === 3 && (
                <div className={styles.Circle}>
                  <ul className={styles.Lines}>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                  <img
                    className="object-contain"
                    src={selectedCandidate?.userImage ? selectedCandidate?.userImage : Avatar}
                    alt=""></img>
                </div>
              )}
            {handleGetProfileImgeBorder(
              hasFeedback,
              hasVMProReport,
              hasVmLiteReport,
              overallTeamCompatibility > 0 ? 1 : 0,
            ) === 0 && (
                <div className={styles.UserDp}>
                  <img
                    className="object-contain"
                    src={selectedCandidate?.userImage ? selectedCandidate?.userImage : Avatar}
                    alt=""></img>
                </div>
              )}
          </div>
          {/* <img
            className={`${styles.Circle} object-contain`}
            src={selectedCandidate?.userImage ? selectedCandidate?.userImage : Avatar}
            alt=""></img> */}


          <div className={styles.TextInfo}>
            <h2 className={styles.Name}>
              {selectedCandidate?.firstName} {selectedCandidate?.lastName}
            </h2>

            {isMainView
              ? // Render data from indiProfileData array
              selectedCandidate?.indiProfileData && (
                <span>{`${selectedCandidate?.indiProfileData[0]?.title} @${selectedCandidate?.indiProfileData[0]?.organization}`}</span>
              )
              : selectedCandidate?.companyRole &&
              selectedCandidate?.companyName && (
                <span>{`${selectedCandidate?.companyRole} @${selectedCandidate?.companyName}`}</span>
              )}
          </div>
        </div>
        {selectedCandidate?.companyRole && selectedCandidate?.companyName && (
          <Popover>
            <Popover.Button
              className={styles.SelectPopoverButton}
              onClick={() => setPopoverOpen(!isPopoverOpen)}>
              <div className="flex items-center ">
                {selectedTag || "Select"} {/* Display selected tag or "Select" */}
                <IoArrowDownCircle />
              </div>
            </Popover.Button>
            <Popover.Panel
              className={styles.SelectPopoverPanel}
              style={{ display: isPopoverOpen ? "block" : "none" }}>
              <ul>
                <li
                  className={`${false && styles.SelectedClass} ${styles.Options} ${styles.CursorPointer
                    }`}
                  onClick={() => handleAddCustomTag(evaluationId, "May be")}>
                  May be
                </li>
                <li
                  className={`${false && styles.SelectedClass} ${styles.Options} ${styles.CursorPointer
                    }`}
                  onClick={() => handleAddCustomTag(evaluationId, "Not a fit")}>
                  Not a fit
                </li>
              </ul>
            </Popover.Panel>
          </Popover>
        )}
        {/* <Close onClick={handleSectionClose} /> */}
      </div>

      <div className="grid  border-t border-b grid-cols-4 grid-rows-2 items-center justify-between">
        <div className="col-span-1 p-2 flex justify-left row-span-1">
          <div className={styles.TextColumn}> Culture Match</div>
        </div>
        <div className="col-span-1 p-2 border-r flex justify-end items-end row-span-1">
          <div>
            {
              culturalMatch ? (
                <>
                  <CustomChip
                    customClass={styles.FontWeight600}
                    label={getCulturalMatchLabel(culturalMatch?.FlippedMatch)}
                    type={getCultureMatchChipType(culturalMatch?.FlippedMatch)}
                  />
                </>
              ) : isCultureCellLoading[evaluationId] ||
                (isCultureCellLoading[evaluationId] && isGetMainViewProfilesLoading) ? (
                <Loader />
              ) : isEnoughDataAvailable && psychJobStatus === 'FETCH_EXECUTED'
                ? (//&& indiProfileId
                  <Button
                    type={"secondary"}
                    className={styles.PullBtn}
                    text={"Pull report"}
                    onClick={() => {
                      if (indiProfileId) {
                        handleShowPopup(
                          {
                            firstName: selectedCandidate?.firstName,
                            lastName: selectedCandidate?.lastName,
                            email: selectedCandidate?.email,
                            contact: selectedCandidate?.phoneNo,
                            linkedinURL: linkedinUrl,
                            evaluationId: evaluationId,
                            action: 211,
                            indiProfileId,
                            company_id: user?.company_id,
                          },
                          true,
                        );
                      } else {
                        notify(
                          "No data yet, Please try again later",
                          "error",
                        );
                      }
                    }}
                  />
                ) : (psychJobStatus === 'FETCH_PERMANENT_FAILURE' || psychJobStatus === 'JOB_NOT_CREATED')
                  ? (!cultureInvited ?
                    <div className="flex items-center -mx-2 flex-row">
                      <span className="font-medium mr-2 text-xs italic text-[#d6615a]">
                        Not enough data
                      </span>
                    </div> : (<div className="flex items-center justify-center flex-row">
                      <span className="font-medium text-xs italic text-[#d6615a]">
                        Invited
                      </span>
                    </div>))
                  : (<div className="flex items-center justify-center flex-row">
                    <span className="font-medium mr-1 text-xs italic text-[#d6615a]">
                      Pending...
                    </span>
                  </div>)
            }
          </div>
        </div>
        <div className="col-span-1 p-2 flex justify-left row-span-1">
          <div className={styles.TextColumn}>Cognitive Match</div>
        </div>
        <div className="col-span-1 p-2 flex justify-end items-end row-span-1">
          <div>
            {cognitiveMatch ? (
              <>
                <CustomChip
                  label={
                    cognitiveMatch?.percentageClass?.charAt(0).toUpperCase() +
                    cognitiveMatch?.percentageClass?.slice(1)
                  }
                  type={getCultureMatchChipType(cognitiveMatch?.percentageClass)}
                />
              </>
            ) : !cognitionInvited ? (
              isCogCellLoading[selectedCandidate.candidateId] &&
                isInviteCandidateForCognitiveLoading ? (
                <Loader />
              ) : (
                <Button
                  className={styles.PullBtn}
                  text={"Invite"}
                  onClick={() => {
                    handleShowPopup(
                      {
                        firstName: selectedCandidate?.firstName,
                        lastName: selectedCandidate?.lastName,
                        email: selectedCandidate?.email,
                        contact: selectedCandidate?.phoneNo,
                        linkedinURL: linkedinUrl,
                        evaluationId: evaluationId,
                        action: 3,
                        phoneNo: selectedCandidate?.phoneNo,
                        company_id: user?.company_id,
                        indiProfileId,
                      },
                      true,
                    );

                  }}
                />
              )
            ) : (
              <span className={styles.InvitedText}>Invited</span>
            )}
          </div>
        </div>
        <div className="col-span-1 p-2 flex justify-left">
          <div className={styles.TextColumn}>Team Dynamics</div>
        </div>
        <div className="col-span-1 p-2 border-r flex justify-end items-end">
          <div>
            {/* && allPods?.length>0 */}
            {hasTeamDynamicReport ? (
              <>
                <CustomChip
                  customClass={styles.FontWeight600}
                  label={getTeamCompatibilityLabel(overallTeamCompatibility)?.label}
                  type={getTeamCompatibilityLabel(overallTeamCompatibility)?.chipType}
                />
              </>
            ) : isTeamCellLoading[evaluationId] ||
              (isTeamCellLoading[evaluationId] && isGetMainViewProfilesLoading) ? (
              <Loader />
            ) : isEnoughDataAvailable && psychJobStatus === 'FETCH_EXECUTED'
              ? (//&& indiProfileId
                <Button
                  className={styles.PullBtn}
                  text={"Pull report"}
                  onClick={() => {
                    if (overallTeamCompatibility && selectedPods) {
                      handleShowPopup(
                        {
                          firstName: selectedCandidate?.firstName,
                          lastName: selectedCandidate?.lastName,
                          email: selectedCandidate?.email,
                          contact: selectedCandidate?.phoneNo,
                          linkedinURL: linkedinUrl,
                          evaluationId: evaluationId,
                          action: 212,
                          indiProfileId,
                          company_id: user?.company_id,
                        },
                        true,
                      );

                    } else {
                      notify(
                        "No data yet, Please try again later",
                        "error",
                      );
                    }
                  }}
                />
              ) : (psychJobStatus === 'FETCH_PERMANENT_FAILURE' || psychJobStatus === 'JOB_NOT_CREATED')
                ? (
                  <span className={styles.NodataText}>
                    Not enough data
                  </span>
                ) :
                (<span className={styles.NodataText}>
                  Pending...
                </span>)
            }
          </div>
        </div>
        <div className="col-span-1 p-2 flex justify-left">
          <div className={styles.TextColumn}>Technical Match</div>
        </div>
        <div className="col-span-1 p-2 flex justify-end items-end">
          <div>
            {technicalRating !== undefined &&
              typeof technicalRating === "number" &&
              technicalRating >= 0 ? (
              <>
                {new Array(Math.round(technicalRating))?.fill(1)?.map((_, index) => (
                  <StarIcon
                    key={index}
                    sx={{
                      color: `${"var(--primary-green)"}`,
                      fontSize: "1.2rem",
                    }}
                  />
                ))}
                {Math.round(technicalRating) < 5
                  ? new Array(Math.round(5 - technicalRating))
                    ?.fill(1)
                    ?.map((_, index) => (
                      <StarIcon
                        key={index}
                        sx={{
                          color: `${"var(--border-grey)"}`,
                          fontSize: "1.2rem",
                        }}
                      />
                    ))
                  : null}
              </>
            ) : interviewInvited ? (
              <p className={styles.NodataText}>No data</p>
            ) : isInviteCellLoading[evaluationId] &&
              isInviteCandidateForInterviewLoading ? (
              <Loader />
            ) : (
              <Button
                text={"invite"}
                className={styles.PullBtn}
                onClick={() => {
                  handleShowPopup({
                    firstName: selectedCandidate?.firstName,
                    lastName: selectedCandidate?.lastName,
                    email: selectedCandidate?.email,
                    contact: selectedCandidate?.phoneNo,
                    linkedinURL: linkedinUrl,
                    evaluationId: evaluationId,
                    action: 1,
                  });

                }}
              />
            )}
          </div>
        </div>
      </div>

      {showSelectReport && (
        <div className={styles.SelectReportTypeWrapper}>

          {/* {mainViewProf?.evaluationid?.hasVmLiteReport && (
            //  mainViewProfiles.culturalMatch &&

            <CustomChip
              customClass={` ${reportType === "lite" ? styles.SelectedChipClass : styles.CustomChipsClass
                }`}
              label={"VM Lite reportjhgjhg"}
              onClick={() => handleReportTypeSelection("lite")}
            />
            
          )} */}
          {mainViewProfiles?.map((item, index) => {
            if (mainViewProf?.evaluationid?._id == item._id) {
              return (
                <>{mainViewProf?.evaluationid?.hasVmLiteReport && item.culturalMatch && Object.keys(item.culturalMatch).length > 0 && (
                  //  mainViewProfiles.culturalMatch &&

                  <CustomChip
                    customClass={` ${reportType === "lite" ? styles.SelectedChipClass : styles.CustomChipsClass
                      }`}
                    label={"VM Lite report"}
                    onClick={() => handleReportTypeSelection("lite")}
                  />

                )}
                  {mainViewProf?.evaluationid?.hasVMProReport && item?.cognitiveMatch && Object.keys(item.cognitiveMatch).length > 0 && mainViewProf?.evaluationid?.hasVmLiteReport && item.culturalMatch && Object.keys(item.culturalMatch).length > 0 && (
                    <CustomChip
                      customClass={` ${reportType === "pro" ? styles.SelectedChipClass : styles.CustomChipsClass
                        }`}
                      label={"VM Pro report"}
                      onClick={() => handleReportTypeSelection("pro")}
                    />
                  )}
                </>
              )
            }

          })}
          {mainViewProf?.evaluationid?.hasTeamDynamicReport && (
            <CustomChip
              customClass={` ${reportType === "dynamics"
                ? styles.SelectedChipClass
                : styles.CustomChipsClass
                }`}
              label={"Team Dynamics"}
              onClick={() => handleReportTypeSelection("dynamics")}
            />
          )}


          {mainViewProf?.evaluationid?.hasFeedback && (
            <CustomChip
              customClass={` ${reportType === "feedback"
                ? styles.SelectedChipClass
                : styles.CustomChipsClass
                }`}
              label={"Interview feedbacks"}
              onClick={() => handleReportTypeSelection("feedback")}
            />
          )}
          {downloadReport ? <button title="Download Report" onClick={() => downloadReport("VmLite")}><MdOutlineFileDownload /></button> : <></>}
        </div>
      )}
    </div>
  );
};

export default ReportHeaderComponent;
