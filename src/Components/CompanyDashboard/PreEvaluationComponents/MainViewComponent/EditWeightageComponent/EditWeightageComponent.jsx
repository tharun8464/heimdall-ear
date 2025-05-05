import { Close } from "@material-ui/icons";
import styles from "./EditWeightageComponent.module.css";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Checkbox, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomInput from "../../../../CustomInput/CustomInput";
import Button from "../../../../Button/Button";
import { useEffect, useRef, useState } from "react";
import ViewDropMenu from "./components/ViewDropMenu";
import ProportionDropMenu from "./components/ProportionDropMenu";
import { Tooltip } from "@material-ui/core/";
import { useParams } from "react-router-dom";
import useWeightage from "../../../../../Hooks/useWeightage";
import { Popover } from "@headlessui/react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import teamDynamic from "../../../../../assets/images/teamDynamics.svg";
import cognitiveMatch from "../../../../../assets/images/cognitiveMatch.svg";
import technicalRating from "../../../../../assets/images/technicalRating.svg";
import culturalMatch from "../../../../../assets/images/culturalMatch.svg";
import teamDynamics from "../../../../../assets/images/teamDynamics1.svg";
import cognitiveMatchs from "../../../../../assets/images/cognitiveMatch1.svg";
import technicalRatings from "../../../../../assets/images/technicalRating1.svg";
import culturalMatchs from "../../../../../assets/images/culturalMatch1.svg";
import "react-toastify/dist/ReactToastify.css";
import WeightageDropMenu from "./components/WeightageDropMenu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const names = [
  { name: "sudhanshu" },
  { name: "sudhanshu" },
  { name: "sudhanshu" },
  { name: "sudhanshu" },
  { name: "sudhanshu" },
];
const weightageArr = [
  { num: 1, weightage: "25%", title: "Cultural Match", icon: culturalMatch, icons: culturalMatchs, name: "culture" },
  { num: 2, weightage: "25%", title: "Team Compatibility", icon: teamDynamic, icons: teamDynamics, name: "teamCompatibility" },
  { num: 3, weightage: "25%", title: "Cognitive Match", icon: cognitiveMatch, icons: cognitiveMatchs, name: "cognitive" },
  { num: 4, weightage: "25%", title: "Technical Rating", icon: technicalRating, icons: technicalRatings, name: "technical" },
];

const EditWeightageComponent = ({ setShowEditWeightage, setDesiredWeight }) => {
  const { id: jobId } = useParams();
  const { handleGetAllWeightages, handleUpdateWeightageFlag } = useWeightage();
  const { weightageData } = useSelector((state) => state.weightage);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [selectedWeightage, setSelectedWeightage] = useState();
  const [vmWeight, setVmWeight] = useState(false);
  const buttonRef = useRef(null);
  const [isSelectedPredefineWeightage, setIsSelectedPredefineWeightage] = useState(true);
  const [inputValues, setInputValues] = useState({
    culture: "25",
    cognitive: "25",
    teamCompatibility: "25",
    technical: "25",
  });
  const [weightages, setWeightages] = useState({
    culture: 25,
    cognitive: 25,
    teamCompatibility: 25,
    technical: 25,
  });
  const [isUserUpdated, setIsUserUpdated] = useState({
    culture: false,
    teamCompatibility: false,
    cognitive: false,
    technical: false,
  });

  const [viewMenuPosition, setViewMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [proportionDropMenuPosition, setProportionDropMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [weightagesDropMenuPosition, setWeightagesDropMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isViewOptionOpen, setIsViewOptionOpen] = useState(false);
  const [isProportionMenuOpen, setIsProportionMenuOpen] = useState(false);
  const [isWeightageMenuOpen, setIsWeightageMenuOpen] = useState(false);
  useEffect(() => {
    handleGetAllWeightages(jobId);
  }, [jobId]);

  const handleClosePopup = () => {
    setShowEditWeightage(false);
  };

  const handleWeightageButtonClick = (e) => {
    const defaultWeightage = "25";
    setIsSelectedPredefineWeightage(true);
    setSelectedWeightage();
    setDesiredWeight('default');
    // Set input values to the default weightage
    setInputValues({
      culture: defaultWeightage,
      teamCompatibility: defaultWeightage,
      cognitive: defaultWeightage,
      technical: defaultWeightage,
    });
    setVmWeight(true);
    if (weightageData?.length > 0) {
      const weightageId = "default";
      handleUpdateWeightageFlag(weightageId, jobId);
    }
  };

  const handleCustomizeWeightage = () => {
    setIsSelectedPredefineWeightage(false);
  }

  const handleViewOption = (e) => {
    const { pageX, pageY } = e;
    setViewMenuPosition({ left: pageX - 80, top: pageY + 15 });
    setIsViewOptionOpen(!isViewOptionOpen);
  };

  const handleViewSaved = (e, data) => {
    setIsSelectedPredefineWeightage(false);
    setSelectedWeightage(data);
    //setSelectedWeightage();
    handleUpdateWeightageFlag(data._id, jobId);
    setPopoverOpen(false);
  };

  const handleSaveProportion = (e) => {
    setIsWeightageMenuOpen(false);
    const { pageX, pageY } = e;
    setProportionDropMenuPosition({ left: pageX - 20, top: pageY + 30 });

    // Check if any percentage value is negative

    const isNegative = Object.values(weightages).some(
      (value) => parseFloat(value) < 0
    );
    const roundToDecimal = (number, decimalPlaces) => {
      const factor = 10 ** decimalPlaces;
      return Math.round(number * factor) / factor;
    };

    const sum = Object.values(weightages).reduce(
      (acc, value) => acc + roundToDecimal(value, 2),
      0
    );

    //const isSumValid = sum >= 99 && sum <= 101;
    const isSumValid = sum === 100 ? true : false;
    // console.log("summ",sum)

    if (isNegative) {
      // Show toast error
      toast.error("Percentage values cannot be negative", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (!isSumValid) {
      // Show toast error for invalid sum
      toast.error("Total weightages should be 100 ", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setIsProportionMenuOpen(!isProportionMenuOpen);
    }
  };

  const handleDeleteProportion = (e) => {
    const { pageX, pageY } = e;
    setWeightagesDropMenuPosition({ left: pageX - 200, top: pageY + 30 });
    setIsProportionMenuOpen(false);
    setIsWeightageMenuOpen(!isWeightageMenuOpen);

  };

  const percentageAdjustment = (weightageData, userUpdatedValue) => {
    let totalPercentage = 100;
    let notUpdatedInputsCnt = 0;
    for (let key in weightageData) {
      if (userUpdatedValue[key]) {
        totalPercentage -= parseInt(weightageData[key]);
      } else {
        notUpdatedInputsCnt++;
      }
    }
    let remPercentage = (totalPercentage / notUpdatedInputsCnt).toFixed(2);

    for (let key in weightageData) {
      if (userUpdatedValue[key] === false) {
        weightageData[key] = remPercentage.toString();
      }
    }
    setWeightages(weightageData);
    return weightageData;
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    let enteredValue = parseInt(value);
    //const enteredValue = parseInt(inputValue?.slice(0, -1));
    //console.log(enteredValue, value)
    if (enteredValue < 0 && enteredValue > 100) return;
    enteredValue = enteredValue ? enteredValue : 0;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: enteredValue,
    }));
  };
  const handleKeyChange = (e) => {
    if (e.key === "Enter") {
      const { name, value } = e.target;
      const userUpdatedValue = { ...isUserUpdated, [name]: true };
      setIsUserUpdated((prevUpdatedValues) => ({
        ...prevUpdatedValues,
        [name]: true,
      }));
      const newValues = { ...weightages, [name]: value };
      setWeightages(newValues);
      const data = percentageAdjustment(newValues, userUpdatedValue);

      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        culture: data.culture,
        cognitive: data.cognitive,
        teamCompatibility: data.teamCompatibility,
        technical: data.technical,
      }));
    }
  };
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const userUpdatedValue = { ...isUserUpdated, [name]: true };
    setIsUserUpdated((prevUpdatedValues) => ({
      ...prevUpdatedValues,
      [name]: true,
    }));
    const newValues = { ...weightages, [name]: value };
    setWeightages(newValues);
    const data = percentageAdjustment(newValues, userUpdatedValue);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      culture: data.culture,
      cognitive: data.cognitive,
      teamCompatibility: data.teamCompatibility,
      technical: data.technical,
    }));
  };

  useEffect(() => {
    // Update input values with saved weightage when an option is selected
    if (selectedWeightage) {
      // console.log("main", selectedWeightage);      
      setDesiredWeight(selectedWeightage?.name)
      setInputValues({
        culture: selectedWeightage?.weightages?.culture,
        teamCompatibility: selectedWeightage?.weightages?.teamCompatibility,
        cognitive: selectedWeightage?.weightages?.cognitive,
        technical: selectedWeightage?.weightages?.technical,
      });

    }
  }, [selectedWeightage]);

  useEffect(() => {
    const isSelected = weightageData?.some(item => item?._id === selectedWeightage?._id);
    if (!isSelected) {
      setSelectedWeightage();
      setInputValues({
        culture: "25",
        cognitive: "25",
        teamCompatibility: "25",
        technical: "25"
      });
    }
  }, [weightageData]);

  const handleWeightageList = (e) => {
    const { pageX, pageY } = e;
    setWeightagesDropMenuPosition({ left: pageX - 1450, top: pageY - 40 });
    setPopoverOpen(!isPopoverOpen);
  }

  useEffect(() => {
    const alreadtelectedWeightage = weightageData?.filter(item => item?.isSelected === true);
    if (alreadtelectedWeightage?.length > 0) {
      setSelectedWeightage(...alreadtelectedWeightage);
      setIsSelectedPredefineWeightage(false);
    }
  }, []);

  return (
    <>
      {isViewOptionOpen && (
        <div>
          <ViewDropMenu viewMenuPosition={viewMenuPosition}></ViewDropMenu>
        </div>
      )}
      {isProportionMenuOpen && (
        <div>
          <ProportionDropMenu
            proportionDropMenuPosition={proportionDropMenuPosition}
            weightages={weightages}
            setWeightages={setWeightages}
            setIsProportionMenuOpen={setIsProportionMenuOpen}
            jobId={jobId}
            percentageAdjustment={percentageAdjustment}
            setInputValues={setInputValues}
            setDesiredWeight={setDesiredWeight}
            selectedWeightage={selectedWeightage}
          ></ProportionDropMenu>
        </div>
      )}
      {weightageData?.length && isWeightageMenuOpen && (
        <div>
          <WeightageDropMenu
            weightagesDropMenuPosition={weightagesDropMenuPosition}
            weightages={weightages}
            setWeightages={setWeightages}
            setIsWeightageMenuOpen={setIsWeightageMenuOpen}
            jobId={jobId}
            percentageAdjustment={percentageAdjustment}
            setInputValues={setInputValues}
          ></WeightageDropMenu>
        </div>
      )}
      <div className={styles.Wrapper}>
        <div className={styles.HeadingWrapper}>
          <h2 className={styles.Heading}>Edit Weightage</h2>
          <Close onClick={handleClosePopup} sx={{ cursor: "pointer" }} />
        </div>
        <div className={styles.PreDefinedWeightageWrapper}>
          <h2 className={styles.Subheading}>Predefined Weightage</h2>
          <div>
            <div
              className={styles.WeightageWrapper}
              style={{ background: isSelectedPredefineWeightage ? "#228276" : "#E9F3F1" }}
              onClick={(e) => handleWeightageButtonClick(e)}
            >
              {weightageArr.map((item) => (
                <>
                  <Tooltip title={`${item.title}`} placement="top" arrow>
                    <div style={{ width: "25%" }} className={styles.WeightageIcon}>
                      <span style={{ paddingBottom: "8px" }}><img src={isSelectedPredefineWeightage ? item.icons : item.icon} alt="" /></span>
                      <Button text={item.weightage}
                        className={isSelectedPredefineWeightage ? styles.WeightageSelectedBtn : styles.WeightageBtn} />
                    </div>
                  </Tooltip>
                </>
              ))}
            </div>
            <p className={`${styles.Subheading} ${styles.WeightageTitle}`}>
              VM Recommended
            </p>
          </div>

        </div>
        <Divider />
        <div className={styles.CustomizeWrapper}>
          <div className={styles.ViewSavedWrapper}>
            <span className={styles.Subheading}>Customize Weightage</span>

            <div className="relative inline-block">
              <button
                ref={buttonRef}
                className="px-4 py-2 bg-white text-black rounded-md flex items-center"
                onClick={handleWeightageList}
              >
                {selectedWeightage ? selectedWeightage.name : "View saved"}
                <ArrowDropDownIcon fontSize="small" />
              </button>

              {isPopoverOpen && weightageData?.length > 0 && (
                <div
                  className="absolute z-50 bg-white border border-gray-300 rounded-md mt-2 p-2 min-w-[150px]"
                  style={{
                    top: buttonRef.current ? `${buttonRef.current.offsetHeight}px` : 'auto',
                  }}
                >
                  <ul>
                    {weightageData.map((data, index) => (
                      <li
                        key={index}
                        className="py-1 px-2 cursor-pointer hover:bg-gray-200"
                        onClick={(e) => handleViewSaved(e, data)}
                      >
                        {data.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className={styles.CustomizeWeight}
              style={{ background: isSelectedPredefineWeightage ? "#E9F3F1" : "#228276" }}
              onClick={e => handleCustomizeWeightage()}
            >
              <div className={styles.CustomizeWeightageBtnWrapper}>
                {weightageArr.map((item) => (
                  // <div style={{ width: "25%" }}>
                  <Tooltip title={item.title} placement="top" arrow>
                    <div style={{ width: "25%" }} className={styles.WeightageIcon}>
                      <span style={{ paddingBottom: "8px" }}><img src={isSelectedPredefineWeightage ? item.icon : item.icons} alt="" /></span>
                      {/* <Button text={item.weightage} className={styles.WeightageBtn} /> */}
                      {isSelectedPredefineWeightage && <Button text={item.weightage} style={{ width: "50%" }}
                        className={!isSelectedPredefineWeightage ? styles.WeightageSelectedBtn : styles.WeightageBtn} />}
                    </div>
                  </Tooltip>
                  // </div>
                ))}
              </div>
              <div className={`${styles.CustomizeWeightageBtnWrapper}`}>
                {!isSelectedPredefineWeightage && ["culture", "teamCompatibility", "cognitive", "technical"].map(
                  (name) => (
                    <div className={styles.InputContainer}>
                      <input
                        type="text"
                        name={name}
                        style={{ minWidth: "70%", width: `${inputValues[name] * 3}%` }}
                        value={`${inputValues[name]}`}
                        className={styles.WeightageInput}
                        onKeyDown={(e) => handleKeyChange(e)}
                        onChange={(e) => handleInputChange(e)}
                        onBlur={(e) => handleInputBlur(e)}
                      />
                      {/* <p className={styles.Percent}>%</p> */}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className={styles.ProportionBtn}>
            <Button
              text={"Save Proportion"}
              className={` ${isProportionMenuOpen ? styles.SavePropBtn : styles.SveProp
                }`}
              onClick={(e) => handleSaveProportion(e)}
            />
            <Button
              text={"Delete Weightage"}
              className={` ${weightageData?.length && isWeightageMenuOpen ? styles.DeleteWeightageBtn : styles.DelWeight
                }`}
              onClick={(e) => handleDeleteProportion(e)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditWeightageComponent;
