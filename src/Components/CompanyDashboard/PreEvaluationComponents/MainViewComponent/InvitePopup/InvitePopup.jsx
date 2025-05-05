import React, { useState } from "react";
import CustomInput from "../../../../CustomInput/CustomInput";
import Button from "../../../../Button/Button";
import usePopup from "../../../../../Hooks/usePopup";
import styles from "./InvitePopup.module.css";
import { Dialog } from "@mui/material";

const InvitePopup = ({
data
}) => {
  const { firstName, lastName, email, contact, linkedinURL, evaluationId, action, creditPop, maxCredit } = data;
  const [podDetails, setPodDetails] = useState({});
  const { handlePopupCenterOpen } = usePopup();

  const handleChange = (e) => {
    setPodDetails((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleClosePopup = () => {
    handlePopupCenterOpen(false);
  };

  const handleSave = () => {

    handleClosePopup();
  };

  return (

    //
    <>
      <div className={styles.DarkOverlay} onClick={handleClosePopup}></div>
      <div className={styles.Wrapper}>
        <h1>Do you wish to purchase credits ?</h1>
        <div className="flex space-x-2">
          <h1>Required Credits {maxCredit}</h1>
          <h1 className="text-[#228276]">(Avaliable Credits {creditPop})</h1>
        </div>

        {/* <CustomInput
        placeholder={"Enter pod name"}
        value={podDetails?.name}
        onChange={handleChange}
        name={"name"}
      />
      <CustomInput
        placeholder={"Enter pod function"}
        value={podDetails?.podFunction}
        onChange={handleChange}
        name={"podFunction"}
      /> */}
        <div className={styles.BtnWrapper}>
          <Button text={"Cancel"} btnType={"secondary"} onClick={handleClosePopup} />
          <Button text={"Buy Credits"} btnType={"primary"} onClick={handleSave} />
        </div>
      </div>
    </>



  );
};

export default InvitePopup;
