import { BiDotsVerticalRounded } from "react-icons/bi";
import vector from "../../../../assets/images/Vector.png";
import { AiFillStar } from "react-icons/ai";
import CustomChip from "../../../CustomChip/CustomChip";
import Avatar from "../../../../assets/images/UserAvatar.png";
import styles from "./TagViewCandidateDetailsRow.module.css";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import Button from "../../../Button/Button";
import CustomInput from "../../../CustomInput/CustomInput";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import usePreEvaluation from "../../../../Hooks/usePreEvaluation";

const TagViewCandidateDetailsRow = ({
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
  isSelected,
  handleCandidateClick,
  showTalent = false,
  handleShowReport,
}) => {
  const { id: jobId } = useParams();

  const { handleDeleteCandidate, handleAddTags, handleGetBestProfiles, handleDeleteTag } =
    usePreEvaluation();

  const [isPopoverVisible, setPopoverVisible] = useState([]);
  const [showEnterTagName, setShowEnterTagName] = useState(false);
  const [customTagName, setCustomTagName] = useState("");
  const [isPopoverOpen, setPopoverOpen] = useState([]);

  //console.log("ciwdw",candidate)

  const handleDeleteClick = index => {
    const newPopoverSta = [...isPopoverVisible];
    newPopoverSta[index] = !newPopoverSta[index];
    setPopoverVisible(newPopoverSta);
  };

  const handleRemoveCandidate = candidateId => {
    setPopoverOpen(prev => {
      const newPopoverStates = [...prev];
      // Set the state for the removed candidate to false
      newPopoverStates[candidateId] = false;
      return newPopoverStates;
    });
    handleDeleteCandidate(candidateId, jobId);

    handleGetBestProfiles(jobId);
  };

  const handleCancel = () => {
    // Close the modal when "Cancel" button is clicked
    setShowEnterTagName(false);
  };

  const handleShowEnterTagName = () => {
    setShowEnterTagName(true);
  };

  const handleChange = e => {
    setCustomTagName(e.target.value);
  };

  const handleAddCustomTag = async (candidateId, tag, index) => {
    try {
      await handleAddTags(candidateId, tag);
      setShowEnterTagName(false);
      setCustomTagName("");
      // handleButtonClick(index);
      handleDeleteClick(index);
      await handleGetBestProfiles(jobId);
    } catch (error) { }
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

  // console.log("candidate:", candidate);
  return candidate ? (
    <tr
      className={` ${styles.Wrapper
        } bg-[#fff] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)] w-full h-[9vh] w[100%] ${isSelected ? styles.SelectedCandidate : ""
        }`}
      onClick={() => {
        handleCandidateClick();
        handleShowReport(candidate);
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
            <div>
              {/* <img
              className={`${styles.CandidateImg} object-contain`}
              src={candidate.userImage ? candidate.userImage : avatar}
              alt=""></img> */}

              {handleGetProfileImgeBorder(
                candidate?.hasFeedback,
                candidate?.hasVMProReport,
                candidate?.hasVmLiteReport,
                candidate?.overallTeamCompatibility > 0 ? 1 : 0,
              ) === 1 && (
                  <div className={styles.Circle}>
                    <img
                      className="object-contain"
                      src={candidate?.userImage ? candidate?.userImage : Avatar}
                      alt=""></img>
                  </div>
                )}
              {handleGetProfileImgeBorder(
                candidate?.hasFeedback,
                candidate?.hasVMProReport,
                candidate?.hasVmLiteReport,
                candidate?.overallTeamCompatibility > 0 ? 1 : 0,
              ) === 2 && (
                  <div className={styles.Circle}>
                    <ul className={styles.Lines}>
                      <li></li>
                      <li style={{ transform: "rotate(-90deg)" }}></li>
                    </ul>
                    <img
                      className="object-contain"
                      src={candidate?.userImage ? candidate?.userImage : Avatar}
                      alt=""></img>
                  </div>
                )}
              {handleGetProfileImgeBorder(
                candidate?.hasFeedback,
                candidate?.hasVMProReport,
                candidate?.hasVmLiteReport,
                candidate?.overallTeamCompatibility > 0 ? 1 : 0,
              ) === 3 && (
                  <div className={styles.Circle}>
                    <ul className={styles.Lines}>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                    <img
                      className="object-contain"
                      src={candidate?.userImage ? candidate?.userImage : Avatar}
                      alt=""></img>
                  </div>
                )}
              {handleGetProfileImgeBorder(
                candidate?.hasFeedback,
                candidate?.hasVMProReport,
                candidate?.hasVmLiteReport,
                candidate?.overallTeamCompatibility > 0 ? 1 : 0,
              ) === 4 && (
                  <div className={styles.Circle}>
                    <ul className={styles.Lines}>
                      <li style={{ transform: "rotate(0deg)" }}></li>
                      <li style={{ transform: "rotate(90deg)" }}></li>
                      <li style={{ transform: "rotate(180deg)" }}></li>
                      <li style={{ transform: "rotate(270deg)" }}></li>
                    </ul>
                    <img
                      className="object-contain"
                      src={candidate?.userImage ? candidate?.userImage : Avatar}
                      alt=""></img>
                  </div>
                )}
              {handleGetProfileImgeBorder(
                candidate?.hasFeedback,
                candidate?.hasVMProReport,
                candidate?.hasVmLiteReport,
                candidate?.overallTeamCompatibility > 0 ? 1 : 0,
              ) === 0 && (
                  <div className={styles.UserDp}>
                    <img
                      className={`object-contain ${styles.UserDp}`}
                      src={candidate?.userImage ? candidate?.userImage : Avatar}
                      alt=""></img>
                  </div>
                )}
            </div>
            <div className="flex flex-col">
              <div className="">
                {candidate.firstName} {candidate?.lastName}{" "}
              </div>
              <div className="" style={{ color: "rgba(51, 51, 51, 0.5)" }}>
                {candidate?.companyRole} , {candidate?.companyName}
              </div>
              {showCandidateChips ? (
                <div className={styles.ChipsWrapper}>
                  {candidate.hasVmLiteReport && candidate?.culturalMatch && Object.keys(candidate?.culturalMatch).length > 0 ? (
                    <CustomChip customClass={styles.ChipsCustomClass} label={"Vm lite"} />
                  ) : null}
                  {candidate?.hasVMProReport && candidate?.cognitiveMatch && Object.keys(candidate?.cognitiveMatch).length > 0 &&
                    candidate.hasVmLiteReport && candidate?.culturalMatch && Object.keys(candidate?.culturalMatch).length > 0 ? (
                    <CustomChip customClass={styles.ChipsCustomClass} label={"Vm pro"} />
                  ) : null}
                  {candidate.hasFeedback ? (
                    <CustomChip
                      customClass={styles.ChipsCustomClass}
                      label={"Interview"}
                    />
                  ) : null}
                  {candidate.hasTeamDynamicReport ? (
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
              {showTalent ? (
                <div>
                  {candidate?.talentMatchConfidence &&
                    candidate.talentMatchConfidence > 0 ? (
                    <div
                      className={`flex flex-row w-fit gap-2 rounded-3xl py-1 justify-around ${styles.MatchChip}`}
                      style={
                        candidate?.tag?.toLowerCase() === "best match"
                          ? { backgroundColor: "#228276" }
                          : candidate?.tag?.toLowerCase() === "top 3"
                            ? { backgroundColor: "rgba(34, 130, 118, 0.75" }
                            : { backgroundColor: "rgba(34, 130, 118, 0.1)" }
                      }>
                      {candidate.tag?.toLowerCase() === "best match" ? (
                        <img src={vector} className="flex my-auto" alt=""></img>
                      ) : candidate.tag?.toLowerCase() === "top 3" ? (
                        <AiFillStar
                          style={{ color: "var(--white)" }}
                          className="flex my-auto"
                        />
                      ) : candidate.tag?.toLowerCase() === "top 5" ? (
                        <AiFillStar
                          style={{ color: "var(--primary-green)" }}
                          className="flex my-auto"
                        />
                      ) : null}
                      <div
                        className={`${candidate.tag?.toLowerCase() === "best match" ||
                          candidate.tag?.toLowerCase() === "top 3"
                          ? "text-[#FFFFFF]"
                          : "text-[#228276]"
                          }`}
                        style={{ fontSize: "11px" }}>
                        {candidate?.tag}
                      </div>
                    </div>
                  ) : (
                    <div className="`flex flex-row w-fit gap-2 ml-3 rounded-3xl py-1 justify-around ${styles.MatchChip}`">
                      <span className={styles.NodataText}> No Data </span>
                    </div>
                  )}
                </div>
              ) : null}
              {showEllipsisMenu ? (
                <Popover className={`relative  text-sm  ${styles.Popover}`}>
                  <Popover.Button
                    className="focus:outline-0  border-none rounded-xl text-[#888888]"
                    onClick={() => handleDeleteClick(index)}>
                    <BiDotsVerticalRounded className="m-auto" />
                  </Popover.Button>
                  <Popover.Panel
                    className={`absolute z-10 w-full flex flex-col ${styles.OnSelectMenu}`}
                    style={{ display: isPopoverVisible ? "block" : "none" }}>
                    <div
                      className={`overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 ${styles.OnSelectMenuWrapper}`}>
                      <div
                        className={`flex items-center text-gray-800 w-full gap-2 ${styles.PopoverBtnClass} ${styles.CursorPointer}`}
                        onClick={handleShowEnterTagName}>
                        <AddCircleIcon
                          sx={{ fontSize: "20px", color: "var(--dark-grey)" }}
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
                                handleAddCustomTag(candidate?.candidateId, customTagName)
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

                      <div
                        className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                        onClick={() => handleRemoveCandidate(candidate?.candidateId)}>
                        <DeleteIcon
                          sx={{ fontSize: "20px", color: "var(--red-error)" }}
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
                <span className={styles.DarkGreyText}>{candidate?.source}</span>
              </div>
            ) : null}
          </div>
        </td>
      </>
    </tr>
  ) : null;
};

export default TagViewCandidateDetailsRow;
