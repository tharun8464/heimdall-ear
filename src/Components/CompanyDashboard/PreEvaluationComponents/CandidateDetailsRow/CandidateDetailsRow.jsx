import { useEffect, useState } from "react";
import { Popover } from "@headlessui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../../../../assets/images/UserAvatar.png";
import vector from "../../../../assets/images/Vector.png";
import { AiFillStar } from "react-icons/ai";
import CustomChip from "../../../CustomChip/CustomChip";
import { Checkbox, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./CandidateDetailsRow.module.css";
import usePreEvaluation from "../../../../Hooks/usePreEvaluation";
import CustomInput from "../../../CustomInput/CustomInput";
import Button from "../../../Button/Button";
import { useParams } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { notify } from "../../../../utils/notify";
import ConfidenceMarker from "../ConfidenceMarker/ConfidenceMarker";
import { useSelector } from "react-redux";

const CandidateDetailsRow = ({
  selectedCandidate,
  candidate,
  index,
  showCheckbox = false,
  showStatus = false,
  showAddingMethod = false,
  showEllipsisMenu = true,
  showTalentMatch = true,
  showSourceAdded = true,
  matchColumnLeftAlign = false,
  showCandidateChips = false,
  isTeamDynamics = false,
  customClass,
  handleTagView,
  handleViewDetails,
  isSelected,
  handleCandidateClick,
  memScore,
}) => {
  let canSelected;
  if (candidate?.candidateId === selectedCandidate?.candidateId) {
    canSelected = candidate;
  }

  const { id: jobId } = useParams();

  const { handleDeleteCandidate, handleAddTags, handleGetBestProfiles, handleGetMainViewProfiles, handleDeleteTag } =
    usePreEvaluation();

  const [hoveredCandidateIndex, setHoveredCandidateIndex] = useState(1);
  const [showEnterTagName, setShowEnterTagName] = useState(false);
  const [customTagName, setCustomTagName] = useState("");
  const [isPopoverVisible, setPopoverVisible] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isPopoverOpen, setPopoverOpen] = useState([]);

  const { mainViewProfiles } = useSelector(state => state.preEvaluation);

  // const handleButtonClick = (index) => {
  //   const newPopoverStates = [...isPopoverOpen];
  //   newPopoverStates[index] = !newPopoverStates[index];
  //   setPopoverOpen(newPopoverStates);
  // };
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

  const handleVDetails = candidate => {
    handleViewDetails(candidate);

    //setPopoverVisible(!isPopoverVisible)
  };

  const handleAddCustomTag = async (candidateId, tag, index) => {
    try {
      await handleAddTags(candidateId, tag, jobId);
      setShowEnterTagName(false);
      setCustomTagName("");
      // handleButtonClick(index);
      handleDeleteClick(index);
      //await handleGetBestProfiles(jobId);
    } catch (error) { }
  };

  const handleClick = () => {
    handleTagView(candidate);
    handleCandidateClick();
  };

  const handleDeleteChip = async (candidateId, tagId) => {
    try {
      handleDeleteTag(candidateId, tagId);
      await handleGetBestProfiles(jobId);
      //setPopoverVisible(!isPopoverVisible)
    } catch (error) { }
  };

  const getTypeFromTagName = tagName => {
    const lowercaseTagName = tagName.toLowerCase();

    if (lowercaseTagName === "may be") {
      return "warning";
    } else if (lowercaseTagName === "not a fit") {
      return "error";
    } else if (lowercaseTagName === "good fit") {
      return "success";
    } else {
      // Default to a type of your choice if none of the above conditions are met
      return "default";
    }
  };

  const filterData = mainViewProfiles
    ? mainViewProfiles.filter(
      profile =>
        profile.email === candidate?.email && profile.phoneNo === candidate?.phoneNo,
    )
    : [];

  const talentmatchpercent =
    filterData.length > 0 ? filterData[0]?.talentMatchConfidence : null;

  const value =
    candidate?.talentMatchConfidence !== undefined
      ? candidate?.talentMatchConfidence * 100
      : 0; // Replace this with your actual dynamic value

  // Calculate the color based on the value
  let chipColor;
  if (value < 40) {
    chipColor = "red";
  } else if (value >= 40 && value < 60) {
    chipColor = "brown";
  } else if (value >= 61 && value < 75) {
    chipColor = "green";
  } else if (value >= 75) {
    // Default color or handle other cases
    chipColor = "blue";
  } else {
    chipColor = "red";
  }

  // Use the calculated color in the style
  const chipStyle = {
    backgroundColor: chipColor,
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

  const GetTagViewRating = (candidate) => {
    if (candidate.tag.toLowerCase() === "best match") {
      // return candidate.tag
      return { chipType: "top-talent", label: candidate.tag };

    }
    else if (candidate.tag.toLowerCase() === "top 3") {
      // return candidate.tag
      return { chipType: "top-talent", label: candidate.tag };

    }
    else if (candidate.tag.toLowerCase() === "top 5") {
      // return candidate.tag
      // return { chipType: candidate.tag.toLowerCase(), label: candidate.tag };
      return { chipType: "top-talent-five", label: candidate.tag };


    }
    else if (parseFloat(candidate.talentMatchConfidence.toFixed(4)) > 0.8500) {
      // return  "High+" 
      return { chipType: "high-plus", label: "High+" };
    }
    else if (parseFloat(candidate.talentMatchConfidence.toFixed(4)) >= 0.750 && parseFloat(candidate.talentMatchConfidence.toFixed(4)) <= 0.8500) {
      // return "High" 
      return { chipType: "high-talent", label: "High" };

    }
    else if (parseFloat(candidate.talentMatchConfidence.toFixed(4)) >= 0.650 && parseFloat(candidate.talentMatchConfidence.toFixed(4)) < 0.7500) {
      // return "Med"
      return { chipType: "medium-talent", label: "Medium" };


    }
    else if (parseFloat(candidate.talentMatchConfidence.toFixed(4)) < 0.6500) {
      //  return "Low"
      return { chipType: "low-talent", label: "Low" };
    }
  }

  return candidate ? (
    <tr
      className={` ${styles.Wrapper} ${customClass ?? ""
        } shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]`}
      onMouseEnter={() => setHoveredCandidateIndex(index)}
    // onMouseLeave={() => setHoveredCandidateIndex(null)}
    >
      <>
        {/* {showCheckbox
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
          : false} */}
        {/* <td>
          <div className="flex items-center justify-center">
            <input type="checkbox" />
          </div>
        </td> */}
        <td
          className={
            canSelected
              ? `text-sm text-gray-900 font-medium whitespace-nowrap px-4 py-2 ${styles.SelectedCandidate}`
              : "text-sm text-gray-900 font-medium whitespace-nowrap px-4 py-2"
          }>
          <div className="flex flex-row gap-4 items-center" onClick={handleClick}>
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
            <div className="flex flex-col">
              <div className="">
                {candidate.firstName} {candidate?.lastName}{" "}
              </div>
              {(candidate?.companyRole || candidate?.companyName) && (
                <div className="" style={{ color: "rgba(51, 51, 51, 0.5)" }}>
                  {candidate?.companyRole} , {candidate?.companyName}
                </div>
              )}

              {showCandidateChips ? (
                <div className={styles.ChipsWrapper}>
                  {candidate?.hasVmLiteReport && candidate?.culturalMatch && Object.keys(candidate?.culturalMatch).length > 0 ? (
                    <CustomChip customClass={styles.ChipsCustomClass} label={"Vm lite"} />
                  ) : null}
                  {candidate?.hasVMProReport && candidate?.cognitiveMatch && Object.keys(candidate?.cognitiveMatch).length > 0 && Object.keys(candidate?.culturalMatch).length > 0 && candidate?.hasVmLiteReport && candidate?.culturalMatch ? (
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
            {isTeamDynamics ? (
              <div className={styles.TeamDynamicsMenu}>
                <div className={`${styles.Common} ${styles.IconBox}`}>
                  <p>{memScore}</p>
                  {/* <BiDotsVerticalRounded sx={{ color: "black !important" }} /> */}
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
                            <CustomInput
                              placeholder={"Tag name"}
                              onChange={handleChange}
                            />
                            <div className={styles.BtnWrapper}>
                              <Button
                                btnType={"primary"}
                                text={"Create"}
                                onClick={() =>
                                  handleAddCustomTag(
                                    candidate?.candidateId,
                                    customTagName,
                                  )
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
                            sx={{ fontSize: "20px", color: "var(--dark-grey)" }}
                          />
                          <span
                            className="font-semibold rounded-xl flex w-full justify-left"
                            href="/"
                            onClick={() => handleVDetails(candidate)}
                          >
                            View details
                          </span>
                        </div> */}
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
                </div>
                <div className={styles.SourceAdded}>
                  <span className={styles.GreyText}>Source: </span>
                  <span className={styles.DarkGreyText}>Added</span>
                </div>
              </div>
            ) : null}
          </div>
        </td>
        {/* </div> */}
        {/* ellipsis and match chip */}
        {isTeamDynamics ? null : (
          <td
            className={`text-sm font-medium whitespace-pre-wrap break-words ${styles.MatchChipCell} `}>
            <div
              className={`${showSourceAdded
                ? styles.ChipAndSourceWrapper && styles.TalentMatchWrapper
                : ""
                }`}>
              {candidate?.companyRole !== "" ? (
                showTalentMatch ? (
                  <div className="items-center flex justify-between">
                    {candidate?.talentMatchConfidence &&
                      candidate?.talentMatchConfidence * 100 > 0 ? (
                      <div>
                        <div
                          className={`flex flex-row w-fit gap-2 ml-3 rounded-3xl py-1 justify-around ${styles.MatchChip}`}
                          style={
                            candidate?.tag?.toLowerCase() === "best match"
                              ? { backgroundColor: "#228276" }
                              : candidate?.tag?.toLowerCase() === "top 3"
                                ? { backgroundColor: "rgba(34, 130, 118, 0.75" }
                                :
                                candidate?.tag?.toLowerCase() === "top 5"
                                  ? { backgroundColor: "rgba(34, 130, 118, 0.1)" }
                                  : { backgroundColor: "transparent" }
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
                              }`}>
                            {/* {candidate?.tag} */}
                            {/* {GetTagViewRating (candidate) } */}
                            <CustomChip
                              style={{ margin: 'auto' }}
                              customClass={styles.FontWeight600}
                              label={GetTagViewRating(candidate)?.label}
                              type={GetTagViewRating(candidate)?.chipType}
                            // customClass={styles.ChipsCustomClass}
                            />
                          </div>

                        </div>
                      </div>

                    ) : (
                      <div className="`flex flex-row w-fit gap-2 ml-3 rounded-3xl py-1 justify-around ${styles.MatchChip}`">
                        <span className={styles.NodataText}> No Data </span>
                      </div>
                    )}

                    {candidate?.talentMatchConfidence &&
                      candidate?.talentMatchConfidence * 100 > 0 ? (
                      <div
                        className={`${styles.RedChip}`}
                        style={chipStyle}
                        title={`${candidate?.talentMatchConfidence !== undefined
                          ? (candidate?.talentMatchConfidence * 100)?.toFixed(2)
                          : 0
                          } %`}>
                        {/* You can customize the styles for the red chip */}
                      </div>
                    ) : null}
                  </div>
                ) : null
              ) : (
                <div className="`flex flex-row w-fit gap-2 ml-3 rounded-3xl py-1 justify-around ${styles.MatchChip}`">
                  <span className={styles.NodataText}> No Data </span>
                </div>
              )}
              {showEllipsisMenu ? (
                <BiDotsVerticalRounded sx={{ color: "black !important" }} />
              ) : null}
            </div>
            {showSourceAdded ? (
              <div className={styles.SourceAdded}>
                <span className={styles.GreyText}>Source: </span>
                <span className={styles.DarkGreyText}>Added</span>
              </div>
            ) : null}
          </td>
        )}
        {showStatus ? (
          <td
            className={` ${styles.TextAlignCenter} text-sm text-gray-900 font-medium whitespace-nowrap`}>
            {/* {candidate?.status === 1 ? (
              <CustomChip label={"Invited"} type={"success"} />
            ) : (
              <CustomChip label={"Pending"} type={"warning"} />
            )} */}

            {candidate?.interviewInvited === true ? (
              <CustomChip label={"Completed"} type={"success"} />
            ) : (
              <CustomChip label={"Pending"} type={"warning"} />
            )}
          </td>
        ) : null}
        {isTeamDynamics ? null : (
          <td className="flex justify-between items-center border-none py-[18px]">
            <div
              className="px-2 py-2"
              style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {candidate?.customtags &&
                candidate?.customtags?.map((tag, index) => (
                  <CustomChip
                    onDelete={() => handleDeleteChip(candidate?.candidateId, tag._id)}
                    key={index}
                    label={tag.tagname}
                    deleteIcon={<Close sx={{ fontSize: "15px !important" }} />}
                    type={getTypeFromTagName(tag.tagname)}
                  />
                ))}
            </div>
            <div className={`${styles.AddingMethodContentWrapper}`}>
              <Popover>
                <Popover.Button
                  className={styles.SelectPopoverButton}
                  onClick={() => setPopoverOpen(true)}>
                  Select
                </Popover.Button>
                <Popover.Panel
                  className={styles.SelectPopoverPanel}
                  style={{ display: isPopoverOpen ? "block" : "none" }}>
                  <ul>
                    <li
                      className={`${styles.CursorPointer} ${false && styles.SelectedClass
                        } ${styles.Options} text-black`}
                      onClick={() => {
                        if (
                          !candidate?.customtags?.some(tag => tag.tagname === "Not a fit")
                        ) {
                          handleAddCustomTag(candidate?.candidateId, "May be", index);
                          setPopoverOpen(false);
                        } else {
                          const notAFitTag = candidate?.customtags?.find(
                            tag => tag.tagname === "Not a fit",
                          );

                          // If the tag is found, delete it using handleDeleteChip
                          if (notAFitTag) {
                            handleDeleteChip(candidate?.candidateId, notAFitTag._id);
                          }
                          handleAddCustomTag(candidate?.candidateId, "May be", index);
                          setPopoverOpen(false);
                        }
                      }}>
                      May be
                    </li>

                    <li
                      className={`${styles.CursorPointer} ${false && styles.SelectedClass
                        } ${styles.Options} text-black`}
                      onClick={() => {
                        if (
                          !candidate?.customtags?.some(tag => tag.tagname === "May be")
                        ) {
                          handleAddCustomTag(candidate?.candidateId, "Not a fit", index);
                          setPopoverOpen(false);
                        } else {
                          const notAFitTag = candidate?.customtags?.find(
                            tag => tag.tagname === "May be",
                          );

                          // If the tag is found, delete it using handleDeleteChip
                          if (notAFitTag) {
                            handleDeleteChip(candidate?.candidateId, notAFitTag._id);
                          }
                          handleAddCustomTag(candidate?.candidateId, "Not a fit", index);
                          setPopoverOpen(false);
                        }
                      }}>
                      Not a fit
                    </li>
                  </ul>
                </Popover.Panel>
              </Popover>
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
                      className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.CursorPointer}`}>
                      <RemoveRedEyeIcon
                        sx={{ fontSize: "20px", color: "var(--dark-grey)" }}
                      />
                      <span
                        className="font-semibold rounded-xl flex w-full justify-left"
                        href="/"
                        onClick={() => handleVDetails(candidate)}>
                        View details
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                      onClick={() => handleRemoveCandidate(candidate?.candidateId)}>
                      <DeleteIcon sx={{ fontSize: "20px", color: "var(--red-error)" }} />
                      <span className="font-semibold rounded-xl flex w-full justify-left">
                        Remove
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Popover>
            </div>
          </td>
        )}

        {/* <button
                          type="submit"
                          className="focus:outline-none w-fit flex justify-between gap-2 cursor-pointer border border-solid border-[#E3E3E3] py-1 px-2 rounded-lg"
                        >
                          <div
                            className="text-[#FFFFFF] text-sm self-center mx-2"
                            style={{ color: "rgba(51, 51, 51, 0.5)" }}
                          >
                            Select
                          </div>
                        </button>
                        <button
                          type="submit"
                          className="focus:outline-none w-fit flex justify-between gap-2 cursor-pointer border border-solid border-[#E3E3E3] py-1 px-2 rounded-lg bg-[#228276]"
                        >
                          <div className="text-[#FFFFFF] text-sm self-center mx-2">Invite</div>
                        </button> */}
      </>
    </tr>
  ) : null;
};

export default CandidateDetailsRow;
