import { useState } from "react";
import { useSelector } from "react-redux";
import CustomInput from "../../../../../CustomInput/CustomInput";
import styles from "./ProportionDropMenu.module.css";
import useWeightage from "../../../../../../Hooks/useWeightage";
import usePopup from "../../../../../../Hooks/usePopup";
import ProportionConfirmPopup from "./ProportionConfirmPopup";
function ProportionDropMenu({
  proportionDropMenuPosition,
  weightages,
  setWeightages,
  setIsProportionMenuOpen,
  jobId,
  percentageAdjustment,
  setInputValues,
  setDesiredWeight,
  selectedWeightage
}) {
  const [proportionName, setProportionName] = useState("");
  const { handleCreateWeightage, handleGetAllWeightages } = useWeightage();
  const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup();
  const [isProportionConfirmPopupOpen, setIsProportionConfirmPopupOpen] = useState(false);
  const [isProportionConfirmationCancel, setIsProportionConfirmationCancel] = useState(false);
  const [isProportionConfirmationContinue, setIsProportionConfirmationContinue] = useState(true);
  const [data, setData] = useState();
  const { weightageData: weightagesData } = useSelector((state) => state.weightage);

  const hanldeProportionConfirmPopup = () => {
    setIsProportionConfirmPopupOpen(true);
  };

  const handleSave = async (e) => {
    percentageAdjustment();
    const isExist = weightagesData?.some(item => item?.name === proportionName);
    const newData = { ...weightages };
    const weightageData = { ...newData, name: proportionName };
    const data = { jobId, weightageData };
    if (isExist) {
      const weightageId = weightagesData?.filter(item => item?.name === proportionName)[0]?._id;
      const data = { weightageId, weightageData };
      setData(data);
      return hanldeProportionConfirmPopup();
    }
    handleCreateWeightage(data, jobId);
    setInputValues({
      culture: selectedWeightage ? selectedWeightage?.weightages.culture : "25",
      cognitive: selectedWeightage ? selectedWeightage?.weightages.cognitive : "25",
      teamCompatibility: selectedWeightage ? selectedWeightage?.weightages.teamCompatibility : "25",
      technical: selectedWeightage ? selectedWeightage?.weightages.technical : "25",
    });
    setWeightages({
      culture: 25,
      cognitive: 25,
      teamCompatibility: 25,
      technical: 25,
    });
    await handleGetAllWeightages(jobId);
    setIsProportionMenuOpen(false);
  };

  const handleCancel = (e) => {
    setIsProportionMenuOpen(false);
  };

  const handleInputChange = (e) => {
    // if (!(/^([^0-9$%]*)$/).test(e.target.value)) {
    if (Number(e.target.value.length) > 30) {
      return;
    }
    if (/[^a-zA-Z0-9 ]/g.test(e.target.value)) {
      return;
    }
    setProportionName(e.target.value);
  };
  return (
    <>
      {isProportionConfirmPopupOpen && <ProportionConfirmPopup
        data={data}
        jobId={jobId}
        setInputValues={setInputValues}
        setWeightages={setWeightages}
        setIsProportionMenuOpen={setIsProportionMenuOpen}
        setIsProportionConfirmPopupOpen={setIsProportionConfirmPopupOpen}
        setIsProportionConfirmationCancel={setIsProportionConfirmationCancel}
        setIsProportionConfirmationContinue={setIsProportionConfirmationContinue}
        setDesiredWeight={setDesiredWeight}
      />}
      <div
        className={`${styles.tagMenuContainer}`}
        style={{
          top: `${proportionDropMenuPosition.top}px`,
          left: `${proportionDropMenuPosition.left}px`,
        }}
      >
        <div style={{ padding: "17px 12px 6px 17px", fontSize: "15px" }}>
          <h1 className={styles.enterProportion}>Add new proportion name</h1>
        </div>
        <div className={`${styles.common} ${styles.container}`}>
          <CustomInput
            placeholder="Proportion Name"
            className={styles.fullWidth}
            name="name"
            value={proportionName}
            onChange={(e) => handleInputChange(e)}
          ></CustomInput>
        </div>
        <div className={`${styles.common} ${styles.buttonContainer}`}>
          <button className={styles.btnStyle} onClick={(e) => handleSave(e)}>
            Save
          </button>
          <button className={styles.btnStyle} onClick={(e) => handleCancel(e)}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default ProportionDropMenu;
