import React, { useCallback, useEffect, useRef, useState } from 'react'
import NewNavbar from '../../../Components/UserDashboard/NewNavbar/NewNavbar'
import WebcamComponent from '../../../Components/UserDashboard/InterviewPanelComponents/WebcamComponent/WebcamComponent'
import VerticalStepperComponent from '../../../Components/UserDashboard/InterviewPanelComponents/VerticalStepperComponent/VerticalStepperComponent'
import { getBase64StringFromDataURL } from '../../../utils/util';
import earpieceVideo from "../../../assets/videos/earpieceVideo.mp4";
import EarPieceDetectionComponent from '../../../Components/UserDashboard/InterviewPanelComponents/EarPieceDetectionComponent/EarPieceDetectionComponent';
import { useSelector } from 'react-redux';
import StepInfoBox from '../../../Components/UserDashboard/InterviewPanelComponents/VerticalStepperComponent/StepInfoBox/StepInfoBox';
import useNewBaselining from '../../../Hooks/useNewBaselining';
import HeadMovementDetectionComponent from '../../../Components/UserDashboard/InterviewPanelComponents/HeadMovementDetectionComponent/HeadMovementDetectionComponent';
import Swal from 'sweetalert2';

function GamifiedPsychometryBaseline({ onBaselineCompleted, inviteId, earPieceDetectionCountDB }) {

  const webcamRef = useRef();
  const [screenShot, setScreenShot] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [earpieceCounter, setEarpieceCounter] = useState(5);
  const [counterIntervalId, setCounterIntervalId] = useState(null);
  const [isMediaAccessStateLoading, setIsMediaAccessStateLoading] = useState(false);
  const [camAccessGranted, setCamAccessGranted] = useState(false);
  const [isCounterRunning, setIsCounterRunning] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [startHeadMovementDetection, setStartHeadMovementDetection] = useState(false);
  const {
    faceDetectionData,
    faceDetectionLoading,
    gazeDetectionLoading,
    gazeDetectionData,
    personDetectionLoading,
    personDetectionData,
  } = useSelector(state => state.baselining);
  const { handleGetHeimdallToken } = useNewBaselining();

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

  useEffect(() => {

    setIsMediaAccessStateLoading(true);
    askPermission();

  }, [camAccessGranted]);

  useEffect(() => {
    if (!isMediaAccessStateLoading) {
      if (!camAccessGranted) {
        const handleNoPermision = async () => {
          const { value } = await Swal.fire({
            title: "Camera Access",
            html: "Please allow camera access to proceed forward",
          });
          if (value) {
            askPermission()
          }
        }
        handleNoPermision();
      }
    }
  }, [camAccessGranted]);

  useEffect(() => {
    if (camAccessGranted) {
      handleGetHeimdallToken();
    }
  }, [camAccessGranted])

  async function askPermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCamAccessGranted(true);
    } catch (error) {
      //console.error("Error accessing camera:", error);
      setCamAccessGranted(false);
    }
    // navigator.permissions
    //     .query({ name: "camera" })
    //     .then(permissionStatus => {
    //       setIsMediaAccessStateLoading(false);
    //       permissionStatus.onchange = () => {
    //         if (permissionStatus.state === "granted") {
    //           setCamAccessGranted(true);
    //         } else {
    //           setCamAccessGranted(false);
    //         }
    //       };
    //       if (permissionStatus.state === "granted") {
    //         setCamAccessGranted(true);
    //       } else {
    //         setCamAccessGranted(false);
    //       }
    //     })
    //     .catch(error => {
    //       //console.error("Error checking camera permission:", error);
    //     });
  }

  function handleEarpieceCounter() {
    setIsCounterRunning(true);
    const counterIntervalId = setInterval(() => {
      setEarpieceCounter(prev => prev - 1);
    }, 1500);
    setCounterIntervalId(counterIntervalId);
  };



  const handleTakeScreenShot = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const base64Format = getBase64StringFromDataURL(imageSrc);
    setScreenShot(base64Format);
    return base64Format;
  }, [webcamRef, setScreenShot]);

  function handleStartTest() {
    //console.log("start test");
    onBaselineCompleted(true);
  }

  // Skip earpiece detection if earPieceDetectionCountDB is 0
  useEffect(() => {
    if (earPieceDetectionCountDB === 0 && activeStep === 3) {
      setActiveStep(4);
    }
  }, [earPieceDetectionCountDB, activeStep]);

  return (
    <div className='flex flex-col w-full h-screen overflow-hidden'>
      <NewNavbar />
      <div className='flex flex-row w-full h-full items-stretch justify-between'>
        <div className='flex flex-grow flex-col items-center justify-center space-y-6 border'>
          {activeStep === 3 && earPieceDetectionCountDB > 0 &&
            <EarPieceDetectionComponent
              handleTakeScreenShot={handleTakeScreenShot}
              earpieceCounter={earpieceCounter}
              setEarpieceCounter={setEarpieceCounter}
              handleEarpieceCounter={handleEarpieceCounter}
              counterIntervalId={counterIntervalId}
              setCounterIntervalId={setCounterIntervalId}
              setActiveStep={setActiveStep}
              setAttemptsCount={setAttemptsCount}
              attemptsCount={attemptsCount}
              showTryAgain={showTryAgain}
              setShowTryAgain={setShowTryAgain}
              setIsCounterRunning={setIsCounterRunning}
              earPieceDetectionCountDB={earPieceDetectionCountDB}
            />
          }
          {activeStep === 2 &&
            <HeadMovementDetectionComponent
              start={startHeadMovementDetection}
              onComplete={setActiveStep}
              onScreenshot={handleTakeScreenShot}
              inviteId={inviteId}
            />
          }

          <WebcamComponent setScreenShot={setScreenShot} webcamRef={webcamRef} showOverlay={activeStep === 2} />

          <div className='flex flex-row space-x-4'>
            {steps.map(({ step, inProcessInfo, image, inProcess, detected }, index) => {
              return (
                <StepInfoBox
                  key={index}
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

        <div className='flex flex-col border-l bg-white justify-start items-start overflow-y-scroll overscroll-x-none'>
          <VerticalStepperComponent
            screenShot={screenShot}
            handleTakeScreenShot={handleTakeScreenShot}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            earpieceCounter={earpieceCounter}
            setEarpieceCounter={setEarpieceCounter}
            counterIntervalId={counterIntervalId}
            handleHeadMovementDetection={setStartHeadMovementDetection}
            setCounterIntervalId={setCounterIntervalId}
            handleEarpieceCounter={handleEarpieceCounter}
            setAttemptsCount={setAttemptsCount}
            attemptsCount={attemptsCount}
            showTryAgain={showTryAgain}
            setShowTryAgain={setShowTryAgain}
            isCounterRunning={isCounterRunning}
            setIsCounterRunning={setIsCounterRunning}
            isInterView={false}
          />
          <div className={`border-y flex-col py-4 px-8 w-full items-center justify-center ${activeStep === 4 ? "flex" : "hidden"}`}>
            <video autoPlay="true" muted="true" loop="true" className='flex bg-white/70 w-64 aspect-square justify-center items-center rounded-md'>
              <source src={earpieceVideo} type="video/mp4" />
              your browser does not support video tag
            </video>
          </div>
          <div className={`border-y flex-col py-4 px-8 w-full items-start justify-start ${activeStep === 4 ? "flex" : "hidden"}`}>
            <div className='text-lg font-bold text-black/80'>Ready to Join</div>
            <div className='text-sm text-black/50 mt-2 mb-4'>Your activity is about to begin shortly</div>
            <button className='bg-[#228276] text-white font-semibold px-8 py-2 rounded-md hover:cursor-pointer hover:opacity-90' onClick={handleStartTest}>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamifiedPsychometryBaseline