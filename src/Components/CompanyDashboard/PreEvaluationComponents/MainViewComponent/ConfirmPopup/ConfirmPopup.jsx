import React, { useState, useEffect } from "react";
import CustomInput from "../../../../CustomInput/CustomInput";
import Button from "../../../../Button/Button";
import usePopup from "../../../../../Hooks/usePopup";
import styles from "../InvitePopup/InvitePopup.module.css";
import { Dialog } from "@mui/material";
import useInvite from "../../../../../Hooks/useInvite";
import usePreEvaluation from "../../../../../Hooks/usePreEvaluation";
import { useParams } from "react-router";
import getStorage, { getSessionStorage } from "../../../../../service/storageService";
import { decreaseCredit } from "../../../../../service/creditMapService";
import { useSelector } from "react-redux";
import { notify } from "../../../../../utils/notify";
const yourBaseUrl = process.env.REACT_APP_NEW_HEIMDALL_BASELINING_URL;


const ConfirmationComponent = ({ action }) => {
  let confirmationMessage;

  switch (action) {
    case 211:
      confirmationMessage = "Are you sure you want to pull the cultural report?";
      break;
    case 3:
      confirmationMessage = "Are you sure you want to proceed with cognitive interview?";
      break;
    case 1:
      confirmationMessage = "Are you sure you want to proceed with technical interview?";
      break;
    case 212:
      confirmationMessage = "Are you sure you want to proceed with team dynamics report?";
      break;
    case 213:
      confirmationMessage = 'Inviting the candidate for "Gamified Psychometry" Do you want to proceed?';
      break;
    default:
      confirmationMessage = "Invalid action";
  }

  return <h2>{confirmationMessage}</h2>;
};

const InviteComponent = ({ action, firstName, lastName }) => {
  let confirmationMessage;

  switch (action) {
    case 211:
      confirmationMessage = "Pull Report for";
      break;
    case 3:
      confirmationMessage = "Inviting";
      break;
    case 1:
      confirmationMessage = "Inviting";
      break;
    case 212:
      confirmationMessage = "Pull Report for";
      break;
    case 213:
      confirmationMessage = "Invite";
      break;
    default:
      confirmationMessage = "Invalid action";
  }

  return <h1 className="text-black/70 font-bold">{confirmationMessage} {firstName} {lastName} {action === 213 ? "for Gamified Psychometry" : ""}</h1>;
};

const ConfirmPopup = ({ data, isCognitive, handleCloseLoader, handleCultLoader, handleTeamLoader, handleTechLoader, handleCognitiveLoader }) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    linkedinURL,
    evaluationId,
    phoneNo,
    companyId,
    jobId,
    action,
    company,
    creditPop,
    maxCredit,
    indiProfileId,
    userId: candidateUserId,
    companyName,
  } = data ?? {};
  const [podDetails, setPodDetails] = useState({});
  const { handlePopupCenterOpen } = usePopup();
  const [user, setUser] = useState();
  const { heimdallToken } = useSelector((state) => state.baselining);



  const {
    handleInviteCandidateForCognitive,
    handleInviteCandidateForInterview,
    handleInviteCandidateForGamifiedPsychometry,
  } = useInvite();


  const { handleGetCompanyNameById, handleGetCultureMatch, handleGetMainViewProfiles, handleTeamDynamicsConfidence, handleCreateTeamCompatibility, handleGetMainViewProf, } = usePreEvaluation();

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

  const handleTeamDynamicsfidence = async () => {

    const data = {
      linkedinURL,
      jobId,
    };


    // handleTeamDynamicsConfidence(user?.company_id, evaluationId, jobId);
    // handleCreateTeamCompatibility(user?.company_id, data, evaluationId, company, action, maxCredit);
    handleTeamDynamicsConfidence(company, evaluationId, jobId);
    handleCreateTeamCompatibility(company, data, evaluationId, user?.company_id, action, maxCredit);
    handleClosePopup();
    handleTeamLoader();
    setTimeout(() => {
      handleCloseLoader();
    }, 7000);


    let timeoutId;

    if (evaluationId) {
      // Set a timer for 10 seconds

      timeoutId = setTimeout(() => {
        handleGetMainViewProfiles(jobId);

      }, 5000);
    }

    return () => {
      // Clear the timer if the component unmounts or if the dependency changes
      clearTimeout(timeoutId);
    };

  };


  const handleGetCultureMatchReport = async () => {

    const data = {
      organizationID: user.company_id,
      profileID: indiProfileId,
    };

    // Trigger the asynchronous operations
    // handleGetCultureMatch(data, evaluationId, jobId, company, action, maxCredit);
    handleGetCultureMatch(data, evaluationId, jobId, user?.company_id, action, maxCredit);
    handleClosePopup();
    handleCultLoader();
    setTimeout(() => {
      handleCloseLoader();
    }, 7000);
    let timeoutId;

    if (indiProfileId) {
      // Set a timer for 10 seconds

      timeoutId = setTimeout(() => {
        //console.log("lake")
        handleGetMainViewProfiles(jobId);

      }, 5000);
    }

    return () => {
      // Clear the timer if the component unmounts or if the dependency changes
      clearTimeout(timeoutId);
    };
  };

  const handleInviteForInterview = async () => {
    const data = {
      email,
      contact,
      firstName,
      lastName,
      linkedinURL,
      jobId,
      companyId: user?.company_id,
      evaluationId,
    };
    handleInviteCandidateForInterview(data, company, action, maxCredit);
    handleTechLoader();
    handleClosePopup();
    setTimeout(() => {
      handleCloseLoader();
    }, 7000);



  };

  const handleInviteCognitive = async () => {
    const data = {
      jobId,
      email,
      contact,
      evaluationId,
      firstName,
      lastName,
      linkedinURL,
      companyId,
      candidateUserId,
    };
    await handleInviteCandidateForCognitive(candidateUserId, data, company, action, maxCredit);
    handleCognitiveLoader();
    handleClosePopup();
    setTimeout(() => {
      handleCloseLoader();
    }, 7000);
  };

  const handleClosePopup = () => {
    handlePopupCenterOpen(false);
    handleCloseLoader();
  };

  async function handleInvitePsychometry() {
    const data = {
      jobId,
      email,
      contact,
      evaluationId,
      firstName,
      lastName,
      linkedinURL,
      companyId,
      candidateUserId,
      inviteType: 'Psychometry'
    };
    await handleInviteCandidateForGamifiedPsychometry(data, company, action, maxCredit);
    handleClosePopup();
  }

  const handleClick = () => {
    // console.log("aaaaaaaaaaappppppppp1111111", action)
    if (action === 3) {
      handleInviteCognitive();
    } else if (action === 1) {
      handleInviteForInterview();
    } else if (action === 211) {
      handleGetCultureMatchReport();
    } else if (action === 212) {
      handleTeamDynamicsfidence();
    } else if (action === 213) {
      handleInvitePsychometry();
    }
    // Add additional conditions as needed
  };

  return (
    //
    <>
      <div className={styles.DarkOverlay} onClick={handleClosePopup}></div>
      <div className={styles.Wrapper}>
        <InviteComponent action={action} firstName={firstName} lastName={lastName} />
        <ConfirmationComponent action={action} />
        <div className="flex space-x-2">
          <h2>Required Credits {maxCredit}</h2>
          <h2 className="text-[#228276]">Available Credits {creditPop}</h2>
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
          <Button
            text={"Cancel"}
            btnType={"secondary"}
            onClick={handleClosePopup}
          />
          <Button
            text={"Confirm"}
            btnType={"primary"}
            onClick={
              handleClick
            }

          />
        </div>
      </div>
    </>
  );
};

export default ConfirmPopup;
