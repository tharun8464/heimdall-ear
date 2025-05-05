import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import earDetectionSuccess from "../../../../assets/sounds/earDetectionSuccess.mp3";
import earDetectionError from "../../../../assets/sounds/earDetectionError.mp3";
import useNewBaselining from "../../../../Hooks/useNewBaselining";
import leftEarGrey from "../../../../assets/images/InterviewPanel/earpieceImages/leftEarGrey.svg";
import rightEarGrey from "../../../../assets/images/InterviewPanel/earpieceImages/rightEarGrey.svg";
import leftEarSuccess from "../../../../assets/images/InterviewPanel/earpieceImages/leftEarSuccess.svg";
import rightEarSuccess from "../../../../assets/images/InterviewPanel/earpieceImages/rightEarSuccess.svg";
import leftEarError from "../../../../assets/images/InterviewPanel/earpieceImages/leftEarError.svg";
import rightEarError from "../../../../assets/images/InterviewPanel/earpieceImages/rightEarError.svg";
import styles from "./EarPieceDetectionComponent.module.css";
import { useSelector } from "react-redux";

const EarPieceDetectionComponent = ({
  handleTakeScreenShot,
  earpieceCounter,
  setEarpieceCounter,
  handleEarpieceCounter,
  counterIntervalId,
  setActiveStep,
  setAttemptsCount,
  attemptsCount,
  showTryAgain,
  setShowTryAgain,
  setIsCounterRunning,
  earPieceDetectionCountDB,
}) => {
  // default should be 1
  const [earpieceDetectionStep, setEarpiecedetectionStep] = useState(1);
  const [leftEarState, setLeftEarState] = useState("active");
  const [rightEarState, setRightEarState] = useState("active");

  const { handleEarpieceDetection } = useNewBaselining();
  const {
    faceDetectionLoading,
    gazeDetectionLoading,
    earpieceDetectionLoading,
    personDetectionLoading,
  } = useSelector(state => state.baselining);

  const earDetectionSuccessSound = new Audio(earDetectionSuccess);
  const earDetectionErrorSound = new Audio(earDetectionError);

  const earpieceDetectionProcessSuccess = () => {
    earDetectionSuccessSound.play();

    if (earpieceDetectionStep === 1) {
      setRightEarState("success");
      setEarpiecedetectionStep(2);
    } else {
      setLeftEarState("success");
    }
    if (earpieceDetectionStep === 2) {
      setEarpiecedetectionStep(3);
      setActiveStep(prevStep => prevStep + 1);
    }
    clearInterval(counterIntervalId);
    setIsCounterRunning(false);
  };

  const earpieceDetectionProcessFailed = () => {

    earDetectionErrorSound.play();
    setShowTryAgain(true);
    if (earpieceDetectionStep === 1) {
      setRightEarState("error");
    } else if (earpieceDetectionStep === 2) {
      setLeftEarState("error");
    }
    clearInterval(counterIntervalId);
    setIsCounterRunning(false);

    // Increment attemptsCount and move to the next step if the detection attempt exceeds earPieceDetectionCountDB
    setAttemptsCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount >= earPieceDetectionCountDB) {
        setActiveStep(prevStep => prevStep + 1);
      }
      return newCount;
    });
  };

  const handleTryAgain = () => {
    setEarpieceCounter(5);
    setShowTryAgain(false);
    // if(earpieceDetectionStep)
    // setEarpiecedetectionStep(1);
    // restart the timer
    handleEarpieceCounter();
  };

  useEffect(() => {
    if (earpieceCounter === 0) {
      if (earpieceDetectionStep < 3) {
        const earPieceImg = handleTakeScreenShot();
        if (
          faceDetectionLoading ||
          gazeDetectionLoading ||
          earpieceDetectionLoading ||
          personDetectionLoading
        ) {
          // do nothing
        } else {
          handleEarpieceDetection(
            {
              img: earPieceImg,
            },
            null,
            setAttemptsCount,
            earpieceDetectionProcessSuccess,
            earpieceDetectionProcessFailed,
            earpieceDetectionStep,
          );
        }
      }
      // setEarpiecedetectionStep(prev => prev + 1);
      setEarpieceCounter(5);
    }
  }, [earpieceCounter]);

  return (
    <div className={styles.Wrapper}>
      <div className={styles.LeftComponent}>
        {/* leftEar */}
        {leftEarState === "active" ? <img src={leftEarGrey} alt="earpiece" /> : null}
        {leftEarState === "success" ? <img src={leftEarSuccess} alt="earpiece" /> : null}
        {leftEarState === "error" ? <img src={leftEarError} alt="earpiece" /> : null}
        {/* rightEar */}
        {rightEarState === "active" ? <img src={rightEarGrey} alt="earpiece" /> : null}
        {rightEarState === "success" ? (
          <img src={rightEarSuccess} alt="earpiece" />
        ) : null}
        {rightEarState === "error" ? <img src={rightEarError} alt="earpiece" /> : null}
      </div>
      <div className={styles.RightComponent}>
        {`Rotate your head to ${earpieceDetectionStep === 1 ? "right" : "left"}`}
        {faceDetectionLoading ||
          gazeDetectionLoading ||
          earpieceDetectionLoading ||
          personDetectionLoading ? (
          <Chip
            label={"Wait.."}
            sx={{
              backgroundColor: "rgba(34, 130, 118, 0.10)",
              borderRadius: "6px",
              color: "#228276",
              fontSize: "14px",
              fontWeight: "510",
              padding: ".8rem 1rem",
            }}
            onClick={handleTryAgain}
          />
        ) : (
          <Chip
            label={
              showTryAgain
                ? "Try Again"
                : earpieceDetectionStep < 3
                  ? `00:0${earpieceCounter > 0 ? earpieceCounter : 0}`
                  : "00:05"
            }
            sx={{
              backgroundColor: "rgba(34, 130, 118, 0.10)",
              borderRadius: "6px",
              color: "#228276",
              fontSize: "14px",
              fontWeight: "510",
              padding: ".8rem 1rem",
            }}
            onClick={() => {
              if (showTryAgain) {
                handleTryAgain();
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EarPieceDetectionComponent;
