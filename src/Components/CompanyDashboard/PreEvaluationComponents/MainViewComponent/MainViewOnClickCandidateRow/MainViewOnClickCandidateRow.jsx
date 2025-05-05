import { BiDotsVerticalRounded } from "react-icons/bi";
import vector from "../../../../../assets/images/Vector.png";
import { AiFillStar } from "react-icons/ai";

import styles from "./MainViewOnClickCandidateRow.module.css";

import Avatar from "../../../../../assets/images/UserAvatar.png";
import CustomChip from "../../../../CustomChip/CustomChip";
import { Popover } from "@headlessui/react";
import { useEffect, useState } from "react";
import usePreEvaluation from "../../../../../Hooks/usePreEvaluation";
import { useParams } from "react-router-dom";
import Button from "../../../../Button/Button";
import CustomInput from "../../../../CustomInput/CustomInput";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSelector } from "react-redux";



const MainViewOnClickCandidateRow = ({
  candidate,
  index,
  showCheckbox = false,
  showStatus = false,
  showAddingMethod = false,
  showEllipsisMenu = true,
  showSourceAdded = true,
  matchColumnLeftAlign = false,
  showCandidateChips = false,
  showTalentMatch = false,
  showTags = false,
  isTeamDynamics = false,
  showTalent = false,
  handleShowReport,
  highlightedCandidateIndex,
  setHighlightedCandidateIndex,
}) => {
  const {
    hasFeedback,
    hasVMProReport,
    hasVmLiteReport,
    hasTeamDynamicReport,
    userImage,
    _id: evaluationId,
    overallTeamCompatibility,
    email,
  } = candidate ?? {};

  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [showEnterTagName, setShowEnterTagName] = useState(false);
  const [customTagName, setCustomTagName] = useState("");

  const { handleAddTags, handleDeleteCandidate } = usePreEvaluation();
  const { id: jobId } = useParams();
  // **************
  const { mainViewProfiles, isGetMainViewProfilesLoading, companyName, mainViewProf } =
    useSelector(state => state.preEvaluation);

  // **************
  useEffect(() => {
    let mam = mainViewProfiles.map((data, index) => {

      return data.culturalMatch
    })

  }, [mainViewProfiles])
  const getTalentMatchChipLabel = talentMatch => {
    if (talentMatch > 0.85) {
      // return { chipType: "solid-success", label: "High+" };
      return { chipType: "high-plus", label: "High+" };
    }
    if (talentMatch >= 0.75 && talentMatch <= 0.85) {
      return { chipType: "solid-success", label: "High" };
    }
    if (talentMatch >= 0.65 && talentMatch < 0.75) {
      return { chipType: "solid-warning", label: "Medium" };
    }
    if (talentMatch < 0.65) {
      return { chipType: "solid-error", label: "Low" };
    }
  };

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

  const handleShowEnterTagName = () => {
    setShowEnterTagName(true);
  };

  const handleRemoveCandidate = candidateId => {
    handleDeleteCandidate(candidateId, jobId);
  };

  const handleAddCustomTag = async (candidateId, tag) => {
    try {
      await handleAddTags(candidateId, tag, jobId);
      setShowEnterTagName(false);
      setCustomTagName("");
      // setPopoverOpen(false);
      // setPopoverVisible(false);
      // await handleGetBestProfiles(jobId);
    } catch (error) { }
  };

  const handleCancel = () => {
    // Close the modal when "Cancel" button is clicked
    setShowEnterTagName(false);
  };

  const handleChange = e => {
    setCustomTagName(e.target.value);
  };

  const handleSetHighlightedCandidate = () => {
    setHighlightedCandidateIndex(index);
  };
  // console.log("ciwdw", candidate)
  return candidate ? (
    <tr
      className={` ${styles.Wrapper} ${highlightedCandidateIndex === index ? styles.HighlightedCandidate : ""
        } bg-[#fff] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)] w-full w[100%]`}
      onClick={() => {
        handleShowReport(candidate);
        handleSetHighlightedCandidate();
      }}>
      <>
        {showCheckbox
          ? // <td className="text-sm text-gray-900 font-medium whitespace-nowrap px-4">
          //   <Checkbox
          //     sx={{
          //       color: "grey",
          //       "&.Mui-checked": {
          //         color: "var(--primary-green)",
          //       },
          //     }}
          //   />
          // </td>
          ""
          : false}
        <td
          className={`${styles.InfoWrapper} text-sm text-gray-900 font-medium whitespace-nowrap px-3 py-2`}>
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
                    src={userImage ? userImage : Avatar}
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
                    src={userImage ? userImage : Avatar}
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
                    src={userImage ? userImage : Avatar}
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
                    className={styles.UserDp}
                    src={userImage ? userImage : Avatar}
                    alt=""></img>
                </div>
              )}
            {/* <img
              className={`${styles.CandidateImg} object-contain`}
              src={candidate.userImage ? candidate.userImage : avatar}
              alt=""
            ></img> */}
            <div className="flex flex-col">
              <div className="">
                {candidate.firstName} {candidate?.lastName}{" "}
              </div>
              <div className="" style={{ color: "rgba(51, 51, 51, 0.5)" }}>
                {candidate?.indiProfileData?.[0]?.title}{" "}
                {`${candidate?.indiProfileData?.[0]?.organization ? "," : ""}`}
                {candidate?.indiProfileData?.[0]?.organization}
              </div>
              {/* {mainViewProfiles?.map((item, index) => { {item.culturalMatch} ? {return ("asd")}:<div>"nulsl" </div>) })} */}
              {showCandidateChips ? (
                <div className={styles.ChipsWrapper}>
                  {/* ************ */}
                  {mainViewProfiles?.map((item, index) => {
                    if (candidate.email == item.email) {

                      {
                        return (<>
                          {hasVmLiteReport && item.culturalMatch && Object.keys(item.culturalMatch).length > 0 ? (
                            <CustomChip customClass={styles.ChipsCustomClass} label={"Vm lite"} />
                          ) : null}
                          {hasVMProReport && hasVmLiteReport && item?.culturalMatch && item?.cognitiveMatch && Object.keys(item.culturalMatch).length > 0 && Object.keys(item.cognitiveMatch).length > 0 ? (
                            <CustomChip customClass={styles.ChipsCustomClass} label={"Vm pro"} />
                          ) : null}
                        </>
                        )
                      }
                    }
                  })}
                  {/* **************** */}

                  {/* {hasVmLiteReport ? (
                    <CustomChip customClass={styles.ChipsCustomClass} label={"Vm lite"} />
                  ) : null} */}

                  {hasFeedback ? (
                    <CustomChip
                      customClass={styles.ChipsCustomClass}
                      label={"Interview"}
                    />
                  ) : null}
                  {hasTeamDynamicReport ? (
                    <CustomChip
                      customClass={styles.ChipsCustomClass}
                      label={"Team dynamics"}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.TeamDynamics}>
            <div
              className={`${showSourceAdded ? styles.ChipAndSourceWrapper : ""} ${styles.TalentMatchWrapper
                }`}>
              {candidate?.talentMatch ? (
                <CustomChip
                  customClass={styles.FontWeight600}
                  label={getTalentMatchChipLabel(candidate?.talentMatch).label}
                  type={getTalentMatchChipLabel(candidate?.talentMatch).chipType}
                />
              ) : null}
              {showEllipsisMenu ? (
                // <BiDotsVerticalRounded sx={{ color: "black !important" }} />
                <Popover className={`relative  text-sm  ${styles.Popover}`}>
                  <Popover.Button
                    className="focus:outline-0  border-none rounded-xl text-[#888888]"
                    onClick={() => setPopoverVisible(true)}>
                    <BiDotsVerticalRounded className="m-auto" />
                  </Popover.Button>
                  <Popover.Panel
                    className={`absolute z-10 w-full flex flex-col ${styles.OnSelectMenu}`}
                    style={{
                      display: isPopoverVisible ? "block" : "none",
                    }}>
                    <div
                      className={`overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 ${styles.OnSelectMenuWrapper}`}>
                      <div
                        className={`flex items-center text-gray-800 w-full gap-2 ${styles.PopoverBtnClass} ${styles.CursorPointer}`}
                        onClick={handleShowEnterTagName}>
                        <AddCircleIcon
                          sx={{
                            fontSize: "20px",
                            color: "var(--dark-grey)",
                          }}
                        />
                        <span
                          className="font-semibold rounded-xl flex w-full justify-left"
                          href="/">
                          Add custom tag
                        </span>
                      </div>
                      {showEnterTagName ? (
                        <div className={`${styles.AddCustomTagPopover}`}>
                          <span className={styles.EnterTagText}>Enter tag name</span>
                          <CustomInput placeholder={"Tag name"} onChange={handleChange} />
                          <div className={styles.BtnWrapper}>
                            <Button
                              btnType={"primary"}
                              text={"Create"}
                              onClick={() =>
                                handleAddCustomTag(evaluationId, customTagName)
                              }
                            />
                            <Button
                              btnType={"secondary"}
                              text={"Cancel"}
                              onClick={handleCancel}
                            />
                          </div>
                        </div>
                      ) : null}
                      {/* <div
                      className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.CursorPointer}`}
                    >
                      <RemoveRedEyeIcon
                        sx={{
                          fontSize: "20px",
                          color: "var(--dark-grey)",
                        }}
                      />
                      <span
                        className="font-semibold rounded-xl flex w-full justify-left"
                        href="/"
                        // onClick={() => handleVDetails(candidate)}
                        onClick={() =>
                          handleTagView({
                            firstName,
                            lastName,
                            email,
                            cultureScore,
                            cognitiveScore,
                            technicalScore,
                            talentMatch,
                            cognitiveMatch,
                            phoneNo,
                            linkedinURL,
                            linkedinUrl,
                            evaluationId,
                            interviewInvited,
                            cognitionInvited,
                            technicalRating,
                            overallTeamCompatibility,
                            linkedinurlkey,
                            culturalMatch,
                            totalExp,
                            userId,
                            source,
                            talentMatchConfidence,
                            teamDynamicsConfidence,
                            indiProfileData,
                            experience,
                            userImage,
                            indiProfileId,
                          })
                        }
                      >
                        View details
                      </span>
                    </div> */}
                      <div
                        className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                        onClick={() => handleRemoveCandidate(evaluationId)}>
                        <DeleteIcon
                          sx={{
                            fontSize: "20px",
                            color: "var(--red-error)",
                          }}
                        />
                        <span className="font-semibold rounded-xl flex w-full justify-left">
                          Remove
                        </span>
                      </div>
                    </div>
                  </Popover.Panel>
                </Popover>
              ) : null}
            </div>
            {showSourceAdded ? (
              <div className={styles.SourceAdded}>
                <span className={styles.GreyText}>Source: </span>
                <span className={styles.DarkGreyText}>Added</span>
              </div>
            ) : null}
          </div>
        </td>
      </>
    </tr>
  ) : null;
};

export default MainViewOnClickCandidateRow;
