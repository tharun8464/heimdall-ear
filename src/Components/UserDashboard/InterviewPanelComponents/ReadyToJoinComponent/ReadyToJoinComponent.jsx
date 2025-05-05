import { Chip } from "@mui/material";
import { getlivestatus, slotDetailsOfUser } from "../../../../service/api";
import { useParams } from "react-router-dom";
import getStorage, { getSessionStorage, setSessionStorage, removeSessionStorage } from "../../../../service/storageService";
import { useEffect, useState } from "react";
import styles from "../../../../assets/stylesheet/ReadyToJoinComponent.module.css";
import useNewBaselining from "../../../../Hooks/useNewBaselining";
import { useSelector } from "react-redux";

const ReadyToJoinComponent = ({ setActiveStep }) => {
  const [jobs, setJobs] = useState(null);
  const [displayTime, setDisplayTime] = useState("");
  const [isTimeDiffInPast, setIsTimeDiffInPast] = useState(false);
  const { liveStatus } = useSelector(state => state.baselining);
  const { interviewState } = liveStatus?.stats ?? {};

  const { id: interviewId } = useParams;
  let user = JSON.parse(getSessionStorage("user"));

  const handleJoinClick = () => {
    setActiveStep(6);
  };

  const handleUserSlot = async () => {
    try {
      const response = await slotDetailsOfUser(user._id);
      setJobs(response?.data);
    } catch (error) { }
  };

  function getTimeLeft(endTime) {
    const countdownInterval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = endTime - currentTime;

      if (timeDifference < 0) {
        setIsTimeDiffInPast(true);
      }

      const hours = String(Math.abs(Math.floor(timeDifference / 3600000))).padStart(
        2,
        "0",
      ); // 1 hour = 3600000 milliseconds
      const minutes = String(
        Math.abs(Math.floor((timeDifference % 3600000) / 60000)),
      ).padStart(2, "0");
      const seconds = String(
        Math.abs(Math.floor((timeDifference % 60000) / 1000)),
      ).padStart(2, "0");
      const displayTime = `${timeDifference < 0 ? "-" : null
        } ${hours}:${minutes}:${seconds}`;
      setDisplayTime(displayTime);
      return displayTime;
    }, 1000);
  }

  const getStartAndEndDateOfJob = () => {
    if (jobs) {
      const job = jobs?.find(job => job?.interviewId);
      return getTimeLeft(new Date(job?.startDate));
    } else {
      return "";
    }
  };

  // const liveStatusCall = async () => {
  //   try {
  //     const response = await getlivestatus(interviewId);
  //     //console.log"response:", response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleGetLiveStatus = () => {
    // setInterval(liveStatusCall, 2000);
  };

  const getChipLabel = () => {
    if (interviewState === 0) {
      return "Waiting";
    } else if (interviewState === 1) {
      return "Join";
    } else {
      return "Loading..";
    }
  };

  useEffect(() => {
    handleUserSlot();
  }, []);

  useEffect(() => {
    getStartAndEndDateOfJob();
  }, [jobs]);

  return (
    <div className={`flex flex-col gap-4 items-start ${styles.Wrapper}`}>
      <h1 className={styles.Heading}>Ready to Join</h1>
      <p className={styles.SubHeading}>Your interview is about to begin shortly</p>
      <Chip
        label={getChipLabel()}
        sx={{
          // backgroundColor: `${
          //   isTimeDiffInPast ? "rgba(214, 97, 90, 0.1)" : "rgba(34, 130, 118, 0.10)"
          // }`,
          backgroundColor: "rgba(34, 130, 118, 0.10)",
          borderRadius: "6px",
          // color: `${isTimeDiffInPast ? "#D6615A" : "#228276"}`,
          color: `#228276`,
          fontSize: "14px",
          fontWeight: "510",
          padding: ".8rem 1rem",
        }}
        onClick={handleJoinClick}
        disabled={interviewState === 0 ? true : false}
      />
    </div>
  );
};

export default ReadyToJoinComponent;
