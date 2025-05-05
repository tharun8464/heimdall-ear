import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { StepConnector, stepConnectorClasses, styled } from "@mui/material";
import EarpieceImage from "../../../../assets/images/InterviewPanel/EarpieceImage.png";
import CheckIcon from "@mui/icons-material/Check";
import { makeStyles } from "@material-ui/core";
import useNewBaselining from "../../../../Hooks/useNewBaselining";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useUpdateBaselining from "../../../../Hooks/useUpdateBaselining";

const steps = [
  {
    label: "Face Capture",
    description: (
      <>
        1. Face towards your webcam <br /> 2. Make sure you’re sitting under proper
        lighting. <br /> 3. Remove any accessories on your face if present. <br /> 4. Your
        face will be compared against your profile photo.
      </>
    ),
  },
  {
    label: "Gaze Tracking",
    description: "Sit still and look at the webcam",
  },
  {
    label: "Person Detection",
    description: (
      <>
        1. Sit steady in front of the camera.
        <br />
        2. Make sure there is no other person present in your room.
      </>
    ),
  },
  {
    label: "Earpiece Detection",
    description: `1. Make sure you’re not wearing any earpiece.`,
  },
];

function VerticalStepperComponent({
  screenShot,
  handleTakeScreenShot,
  activeStep,
  setActiveStep,
  earpieceCounter,
  setEarpieceCounter,
  counterIntervalId,
  handleHeadMovementDetection,
  setCounterIntervalId,
  handleEarpieceCounter,
  setAttemptsCount,
  attemptsCount,
  showTryAgain,
  setShowTryAgain,
  isCounterRunning,
  isInterview,
}) {
  const {
    heimdallToken,
    faceDetectionData,
    gazeDetectionData,
    faceDetectionLoading,
    gazeDetectionLoading,
    earpieceDetectionLoading,
    personDetectionLoading,
    earpieceDetectionData,
    personDetectionData,
  } = useSelector(state => state.baselining);

  //console.log("earpieceDetectionData:", earpieceDetectionData);
  const { handleFaceDetection, handleGazeDetection, handlePersonDetection } =
    useNewBaselining();
  const {
    updateFaceDetectionBaselining,
    updateGazeDetectionBaselining,
    updatePersonDetectionBaselining,
    updateEarDetectionBaselining,
  } = useUpdateBaselining();

  const StepConnectorClass = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.lineVertical}`]: {
        borderColor: "#228276",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.lineVertical}`]: {
        borderColor: "#228276",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      minHeight: "16px",
    },
  }));

  useEffect(() => {
    if (attemptsCount === 5) {
      setActiveStep(prev => prev + 1);
      setAttemptsCount(0);
    }
  }, [attemptsCount]);

  useEffect(() => {
    if (faceDetectionData?.img) {
      updateFaceDetectionBaselining();
    }
  }, [faceDetectionData?.img]);

  useEffect(() => {
    if (gazeDetectionData?.img) {
      updateGazeDetectionBaselining();
    }
  }, [gazeDetectionData?.img]);

  useEffect(() => {
    if (personDetectionData?.img) {
      updatePersonDetectionBaselining();
    }
  }, [personDetectionData?.img]);

  useEffect(() => {
    if (earpieceDetectionData?.img) {
      updateEarDetectionBaselining();
    }
  }, [earpieceDetectionData?.img]);

  const handleNext = index => {
    //console.log("clicked", index);
    switch (index) {
      case 0:
        const img = handleTakeScreenShot();
        handleFaceDetection(
          heimdallToken.token,
          { img },
          setActiveStep,
          // updateFaceDetectionBaselining,
          null,
          setAttemptsCount,
        );
        break;
      case 1:
        const gazeImg = handleTakeScreenShot();
        handleGazeDetection(
          heimdallToken.token,
          { img: gazeImg },
          setActiveStep,
          updateGazeDetectionBaselining,
          setAttemptsCount,
        );
        break;
      case 2:
        const personImg = handleTakeScreenShot();
        handlePersonDetection(
          { img: personImg },
          setActiveStep,
          updatePersonDetectionBaselining,
          setAttemptsCount,
        );
        break;
      case 3:
        const earPieceImg = handleTakeScreenShot();
        handleEarpieceCounter();
        break;

      default:
        break;
    }
  };

  const useStyles = makeStyles({
    customStepIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "1.5px solid rgba(51, 51, 51, 0.25)",
      padding: ".5rem",
      borderRadius: "100%",
      width: "28px",
      height: "28px",
      "&.active": {
        border: "1.5px solid #228276",
      },
      "&.completed": {
        background: "#228276",
      },
    },
    textClass: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "rgba(51, 51, 51, 0.25)",
      "&.active": {
        color: "#228276",
      },
      "&.completed": {
        color: "#228276",
      },
    },
  });

  const CustomStepIcon = ({ active, completed, icon }) => {
    const classes = useStyles();

    return (
      <div
        className={`${classes.customStepIcon} ${active ? "active" : ""} ${completed ? "completed" : ""
          }`}>
        <span
          className={`${classes.textClass}  ${active ? "active" : ""} ${completed ? "completed" : ""
            }`}>
          {completed ? (
            <CheckIcon sx={{ color: "white", width: "18px", height: "18px" }} />
          ) : (
            icon
          )}
        </span>
      </div>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        padding: "2rem 1.8rem 1rem 1.8rem",
        fontFamily: "BlinkMacSystemFont",
      }}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        connector={<StepConnectorClass />}>
        {steps.map((step, index) => (
          <Step
            key={step.label}
            sx={{
              "& .MuiStepIcon-root.Mui-completed": {
                color: "#228276",
              },
              "& .MuiStepIcon-root.Mui-active": {
                color: "#228276",
              },
              "& .MuiStepLabel-label": {
                fontFamily: "BlinkMacSystemFont",
              },
            }}>
            <StepLabel StepIconComponent={CustomStepIcon}>{step.label}</StepLabel>
            <StepContent>
              {index === 3 ? (
                <img src={EarpieceImage} alt="earpiece" className="mb-2" />
              ) : null}
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(51, 51, 51, 0.50)",
                  fontFamily: "BlinkMacSystemFont",
                }}>
                {step.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    disabled={
                      faceDetectionLoading ||
                      gazeDetectionLoading ||
                      earpieceDetectionLoading ||
                      personDetectionLoading ||
                      showTryAgain ||
                      isCounterRunning
                    }
                    onClick={() => {
                      if (
                        faceDetectionLoading ||
                        gazeDetectionLoading ||
                        earpieceDetectionLoading ||
                        personDetectionLoading
                      ) {
                        return;
                      } else {
                        handleNext(index);
                      }
                    }}
                    sx={{
                      mt: 1,
                      mr: 1,
                      background: "#228276",
                      "&:hover": {
                        boxShadow: "none",
                        background: "#358B80",
                      },
                      textTransform: "none",
                      boxShadow: "none",
                    }}>
                    {index === steps.length - 1 ? "Start" : "Next"}
                  </Button>
                  {/* <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button> */}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {/* {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )} */}
    </Box>
  );
}

export default VerticalStepperComponent;
