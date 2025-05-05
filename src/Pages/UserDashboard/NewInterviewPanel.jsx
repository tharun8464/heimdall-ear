import earpieceVideo from "../../assets/videos/earpieceVideo.mp4";
import StepInfoBox from "../../Components/UserDashboard/InterviewPanelComponents/VerticalStepperComponent/StepInfoBox/StepInfoBox";
import VerticalStepperComponent from "../../Components/UserDashboard/InterviewPanelComponents/VerticalStepperComponent/VerticalStepperComponent";
import { Divider } from "@mui/material";
import ReadyToJoinComponent from "../../Components/UserDashboard/InterviewPanelComponents/ReadyToJoinComponent/ReadyToJoinComponent";
import Swal from "sweetalert2";
import styles from "../../assets/stylesheet/interviewPanel.module.css";
import WebcamComponent from "../../Components/UserDashboard/InterviewPanelComponents/WebcamComponent/WebcamComponent";
import NewNavbar from "../../Components/UserDashboard/NewNavbar/NewNavbar";
import useNewBaselining from "../../Hooks/useNewBaselining";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import InterviewPanelShimmer from "../../Components/UserDashboard/InterviewPanelComponents/InterviewPanelShimmer/InterviewPanelShimmer";
import EarPieceDetectionComponent from "../../Components/UserDashboard/InterviewPanelComponents/EarPieceDetectionComponent/EarPieceDetectionComponent";
import MeetingComponent from "../../Components/UserDashboard/InterviewPanelComponents/MeetingComponent/MeetingComponent";
import useMediaCheck from "../../Hooks/useMediaCheck";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCandidateParticipant,
  getinterviewdetailsForBaseline,
  startMeeting,
} from "../../service/api";
import getStorage, { getSessionStorage } from "../../service/storageService";
import { useDyteClient } from "@dytesdk/react-web-core";
import AccordianComponent from "./AccordianComponent";
import interviewerTermsAndConditions from "../../Pages/XIDashboard/interview-v2/interviewererTermsAndConditions.json";
import { useDispatch } from "react-redux";
import { setInterviewMeetingId } from "../../Store/slices/baseliningSlice";


const NewInterviewPanel = () => {
  const [screenShot, setScreenShot] = useState(null);
  // temp 3 should be 0
  const [activeStep, setActiveStep] = useState(0);
  const [camAccessGranted, setCamAccessGranted] = useState(true);
  const [micAccessGranted, setMicAccessGranted] = useState(true);
  const [isMediaAccessStateLoading, setIsMediaAccessStateLoading] = useState(false);
  const [earpieceCounter, setEarpieceCounter] = useState(5);
  const [counterIntervalId, setCounterIntervalId] = useState(null);
  const [isCounterRunning, setIsCounterRunning] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [isTermsAndConditionsAccepted, setIsTermsAndConditionsAccepted] = useState(false);
  const [modal, setModal] = useState(true);

  //let user = JSON.parse(getStorage("user"));
  let user = JSON.parse(getSessionStorage("user"));
  const [initDyte, setInitDyte] = useState(false);
  const [meeting, initMeeting] = useDyteClient();

  const [isLoading, setIsLoading] = useState(false);
  const { id: interviewId } = useParams();

  const { handleGetHeimdallToken, handleGetLiveInterviewStatus } = useNewBaselining();
  const {
    faceDetectionData,
    faceDetectionLoading,
    gazeDetectionLoading,
    gazeDetectionData,
    personDetectionLoading,
    personDetectionData,
  } = useSelector(state => state.baselining);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const webcamRef = useRef();

  //   interview id
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(setInterviewMeetingId(id));
    }
  }, [id]);

  const handleContinue = async () => {
    startMeeting(id).then(mValue => {
      if (mValue?.status === 200) {
        // add the participant into the meeting
        addCandidateParticipant(id, user._id).then(tValue => {
          // ////console.log("tValue:", tValue);
          if (tValue?.status === 200 && tValue?.data?.token) {
            // initialize the meeting client
            initMeeting({
              authToken: tValue?.data?.token,
              defaults: {
                audio: true,
                video: true,
              },
            })
              .then(() => {
                setInitDyte(true);
              })
              .catch(error => {
                ////console.log(error);
              });
          }
        });
      }
    });
  };

  const initial = async () => {
    let interviewStatus = await getinterviewdetailsForBaseline(id);
  };

  useEffect(() => {
    if (initDyte) {
      initial();
    } else {
      handleContinue();
    }
  }, [initDyte]);

  const steps = [
    {
      step: 1,
      inProcessInfo: "loading...",
      inProcess: faceDetectionLoading,
      image: faceDetectionData?.img ?? null,
      detected: faceDetectionData?.data?.FaceDetected || activeStep > 0 ? true : false,
    },
    {
      step: 2,
      inProcessInfo: "In process...",
      inProcess: gazeDetectionLoading,
      image: gazeDetectionData?.img ?? null,
      detected: gazeDetectionData?.data?.Eyes_Detected || activeStep > 1 ? true : false,
    },
    {
      step: 3,
      inProcessInfo: "In process...",
      inProcess: personDetectionLoading,
      image: personDetectionData?.img ?? null,
      detected:
        personDetectionData?.data?.No_of_People === 1 || activeStep > 2 ? true : false,
    },
    {
      step: 4,
      inProcessInfo: "",
    },
  ];

  //save state of cam permission & check if cam permission is changed
  useEffect(() => {
    setIsMediaAccessStateLoading(true);
    navigator.permissions
      .query({ name: "camera" })
      .then(permissionStatus => {
        setIsMediaAccessStateLoading(false);
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setCamAccessGranted(true);
          } else {
            setCamAccessGranted(false);
          }
        };
        if (permissionStatus.state === "granted") {
          setCamAccessGranted(true);
        } else {
          setCamAccessGranted(false);
        }
      })
      .catch(error => {
        ////console.error("Error checking camera permission:", error);
      });
  }, []);

  //save state of mic permission & check if cam permission is changed
  useEffect(() => {
    setIsMediaAccessStateLoading(true);
    navigator.permissions
      .query({ name: "microphone" })
      .then(permissionStatus => {
        setIsMediaAccessStateLoading(false);
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setMicAccessGranted(true);
          } else {
            setMicAccessGranted(false);
          }
        };
        if (permissionStatus.state === "granted") {
          setMicAccessGranted(true);
        } else {
          setMicAccessGranted(false);
        }
      })
      .catch(error => {
        ////console.error("Error checking camera permission:", error);
      });
  }, []);

  const handlePopup = () => {
    Swal.fire({
      title: "Interview Delay: Commencement Unsuccessful",
      text: "Apologies for the inconvenience, but the interview couldn't commence as the interviewer didn't join. We'll reschedule the interview, and you'll have the opportunity to choose new time slots.",
      showCancelButton: true,
      confirmButtonText: "ok",
      padding: "1rem",
    });
  };

  const removeBase64Prefix = base64String => {
    if (base64String.startsWith("data:")) {
      const parts = base64String.split(",");
      if (parts.length === 2) {
        return parts[1];
      }
    }
    return base64String;
  };

  const handleEarpieceCounter = () => {
    setIsCounterRunning(true);
    const counterIntervalId = setInterval(() => {
      setEarpieceCounter(prev => prev - 1);
    }, 1500);

    setCounterIntervalId(counterIntervalId);
  };

  const handleTakeScreenShot = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const base64Format = removeBase64Prefix(imageSrc);
    setScreenShot(base64Format);
    return base64Format;
  }, [webcamRef, setScreenShot]);

  const getLiveStatus = () => {
    setInterval(() => {
      if (activeStep >= 4) {
        handleGetLiveInterviewStatus(interviewId);
      }
    }, 3000);
  };

  const handleAccepTAndC = () => {
    setIsTermsAndConditionsAccepted(true);
    setModal(false);
  };

  const handleCancelTAndC = () => {
    setIsTermsAndConditionsAccepted(false);
    navigate("/");
  };

  useEffect(() => {
    if (activeStep === 4) {
      getLiveStatus();
    }
  }, [activeStep]);

  useEffect(() => {
    handleGetHeimdallToken();
  }, []);

  // useEffect(() => {
  //   handleGetLiveStatus();
  // }, []);

  useEffect(() => {
    if (!isMediaAccessStateLoading) {
      if (!camAccessGranted) {
        Swal.fire({
          title: "Camera Access",
          html: "Please allow camera access to proceed forward",
        });
      }
      if (!micAccessGranted) {
        Swal.fire({
          title: "Mic Access",
          html: "Please allow mic access to proceed forward",
        });
      }
      if (!camAccessGranted && !micAccessGranted) {
        Swal.fire({
          title: "Camera and mic access",
          html: "Please allow camera and mic access to proceed forward",
        });
      }
    }
  }, [camAccessGranted, micAccessGranted]);

  return !isTermsAndConditionsAccepted ? (
    <div>
      <AccordianComponent
        data={interviewerTermsAndConditions}
        modal={modal}
        setModal={setModal}
        conitnueFn={handleAccepTAndC}
        cancelFn={handleCancelTAndC}
      />
    </div>
  ) : !camAccessGranted || !micAccessGranted ? (
    // <div>please allow cam and mic access</div>
    <div></div>
  ) : isLoading ? (
    <InterviewPanelShimmer />
  ) : (
    <>
      <div
        style={{ display: activeStep === 6 ? "none" : "block" }}
        className={styles.Wrapper}>
        {/* <HorizontalNav /> */}
        <NewNavbar />
        <div className="flex justify-between h-full">
          <div className="flex flex-col w-full items-center justify-center gap-5">
            {/* <div>
            <img src={camDemoImage} alt="" className={styles.DemoImage} />
          </div> */}
            {activeStep === 3 ? (
              <EarPieceDetectionComponent
                handleTakeScreenShot={handleTakeScreenShot}
                earpieceCounter={earpieceCounter}
                setEarpieceCounter={setEarpieceCounter}
                handleEarpieceCounter={handleEarpieceCounter}
                counterIntervalId={counterIntervalId}
                setActiveStep={setActiveStep}
                setAttemptsCount={setAttemptsCount}
                showTryAgain={showTryAgain}
                setShowTryAgain={setShowTryAgain}
                setIsCounterRunning={setIsCounterRunning}
              />
            ) : null}
            <WebcamComponent setScreenShot={setScreenShot} webcamRef={webcamRef} />

            <div className="flex gap-x-4">
              {steps.map(({ step, inProcessInfo, image, inProcess, detected }) => {
                return (
                  <StepInfoBox
                    step={step}
                    inProcessInfo={inProcessInfo}
                    inProcess={inProcess}
                    image={image}
                    detected={detected}
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.Sidebar}>
            <div>
              <VerticalStepperComponent
                screenShot={screenShot}
                handleTakeScreenShot={handleTakeScreenShot}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                earpieceCounter={earpieceCounter}
                setEarpieceCounter={setEarpieceCounter}
                counterIntervalId={counterIntervalId}
                setCounterIntervalId={setCounterIntervalId}
                handleEarpieceCounter={handleEarpieceCounter}
                setAttemptsCount={setAttemptsCount}
                attemptsCount={attemptsCount}
                showTryAgain={showTryAgain}
                setShowTryAgain={setShowTryAgain}
                isCounterRunning={isCounterRunning}
                setIsCounterRunning={setIsCounterRunning}
              />

              <Divider />
              {activeStep === 4 ? (
                <ReadyToJoinComponent
                  setActiveStep={setActiveStep}
                // interviewState={}
                />
              ) : null}
              <Divider />
            </div>

            {/* <PlayGamesComponent /> */}
            {activeStep === 3 ? (
              <div className={`flex justify-center ${styles.VideoWrapper}`}>
                <video autoplay="true" muted="true" className={styles.Video} loop="true">
                  <source src={earpieceVideo} type="video/mp4" />
                  your browser does not support video tag
                </video>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div style={{ display: activeStep === 6 ? "block" : "none" }}>
        <MeetingComponent meeting={meeting} />
      </div>
    </>
  );
};

export default NewInterviewPanel;
