import { useDispatch, useSelector } from "react-redux";
import { getHeimdallToken } from "../service/userServices/getHeimdallToken";
import {
  earpieceDetectionError,
  earpieceDetectionSuccess,
  faceDetectionError,
  faceDetectionSuccess,
  gazeDetectionError,
  gazeDetectionSuccess,
  getHeimdallTokenError,
  getHeimdallTokenSuccess,
  getLiveStatusError,
  getLiveStatusSuccess,
  personDetectionError,
  personDetectionSuccess,
  setMovementDetectionData,
  setMovementDetectionError,
  setMovementDetectionLoading,
  setMovementDetectionSuccess,
  startBaseliningLoading,
  startEarpieceDetectionLoading,
  startFaceDetectionLoading,
  startGazeDetectionLoading,
  startGetLiveStatusLoading,
  startPersonDetectionLoading,
  updateBaseliningError,
  updateBaseliningSuccess,
} from "../Store/slices/baseliningSlice";
import { getFaceDetectionData } from "../service/userServices/getFaceDetectionData";
import { getGazeDetectionData } from "../service/userServices/getGazeDetectionData";
import { useCallback } from "react";
import { getEarpieceDetectionData } from "../service/userServices/getEarpieceDetectionData";
import { getPersonDetectionData } from "../service/userServices/getPersonDetectionData";
import { notify } from "../utils/notify";
import { serverErrorNotification } from "../utils/serverErrorNotification";
import { logIt, updateBaselining } from "../service/api";
import { getlivestatus } from "../service/interviewPanel/getLiveStatus";
import { newUpdateBaselining } from "../service/interviewPanel/newUpdateBaselining";
import useUpdateBaselining from "./useUpdateBaselining";
import { getMovementDetection } from "../service/userServices/getMovementDetection";

const useNewBaselining = () => {
  const dispatch = useDispatch();
  const { heimdallToken } = useSelector(state => state.baselining);
  const currentTime = new Date();
  const id = 1234;

  const handleLogit = (id, testName, state) => {
    let data = {
      action: `baseline-${testName}`,
      interviewId: id,
      state,
      createdTime: currentTime,
    };
    logIt(data);
  };

  const handleGetHeimdallToken = async () => {
    const headers = {
      "client-id": process.env.REACT_APP_DS_CLIENT_ID,
      "client-secret": process.env.REACT_APP_DS_CLIENT_SECRET,
    };

    try {
      dispatch(startBaseliningLoading());
      const response = await getHeimdallToken(headers);
      dispatch(getHeimdallTokenSuccess(response.data));
    } catch (error) {
      dispatch(getHeimdallTokenError(error));
      serverErrorNotification();
    }
  };

  const handleFaceDetection = async (
    heimdallToken,
    data,
    setActiveStep,
    afterSuccessFn,
    setAttemptsCount,
  ) => {
    const headers = {
      authorization: `Bearer ${heimdallToken}`,
    };
    try {
      dispatch(startFaceDetectionLoading());
      const response = await getFaceDetectionData(data, headers);
      dispatch(faceDetectionSuccess(response.data));
      if (response?.data?.data?.FaceDetected) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        handleLogit(id, "face", "COMPLETED");
      } else {
        notify(
          "Face not detected, please read the instructions carefully and retry",
          "warning",
        );
        if (setAttemptsCount) {
          setAttemptsCount(prev => prev + 1);
        }
        handleLogit(id, "face", "FAILED");
      }
      if (afterSuccessFn) {
        // afterSuccessFn();
      }
    } catch (error) {
      serverErrorNotification();
      dispatch(faceDetectionError(error));
    }
  };

  const handleGazeDetection = async (
    heimdallToken,
    data,
    setActiveStep,
    afterSuccessFn,
    setAttemptsCount,
  ) => {
    const headers = {
      authorization: `Bearer ${heimdallToken}`,
    };
    try {
      dispatch(startGazeDetectionLoading());
      const response = await getGazeDetectionData(data, headers);
      //console.log("response:", response);
      dispatch(gazeDetectionSuccess(response.data));
      // updateGazeDetectionBaselining(response?.data);
      if (response?.data?.data?.Eyes_Detected === true) {
        setActiveStep(2);
        handleLogit(id, "gaze", "COMPLETED");
      } else {
        notify(
          "Gaze not detected,please read the instructions carefully and retry",
          "warning",
        );
        if (setAttemptsCount) {
          setAttemptsCount(prev => prev + 1);
        }
        handleLogit(id, "gaze", "FAILED");
      }
      if (afterSuccessFn) {
        afterSuccessFn();
      }
    } catch (error) {
      ////console.log"error:", error?.response);
      setActiveStep(2);

      dispatch(gazeDetectionError(error));
      serverErrorNotification();
    }
  };

  const handlePersonDetection = useCallback(
    async (data, setActiveStep, afterSuccessFn, setAttemptsCount) => {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
      };

      try {
        dispatch(startPersonDetectionLoading());
        const response = await getPersonDetectionData(data, headers);
        if (response?.data?.data?.NoOfPeople === 1) {
          setActiveStep(prev => prev + 1);
          handleLogit(id, "person", "COMPLETED");
        } else if (response?.data?.data?.NoOfPeople === 0) {
          notify(
            "No person detected, please read the instructions carefully and retry",
            "warning",
          );
          if (setAttemptsCount) {
            setAttemptsCount(prev => prev + 1);
          }
          handleLogit(id, "person", "FAILED");
        } else if (response?.data?.data?.NoOfPeople > 0) {
          notify(
            "Multiple person detected, please read the instructions carefully and retry",
            "warning",
          );
          if (setAttemptsCount) {
            setAttemptsCount(prev => prev + 1);
          }
          handleLogit(id, "person", "FAILED");
        }
        dispatch(personDetectionSuccess(response.data));
        if (afterSuccessFn) {
          afterSuccessFn();
        }
      } catch (error) {
        dispatch(personDetectionError(error));
        serverErrorNotification();
        setActiveStep(3);
      }
    },
    [dispatch, heimdallToken],
  );

  // check when is the success case
  const handleEarpieceDetection = useCallback(
    async (
      data,
      afterSuccessFn,
      setAttemptsCount,
      earpieceDetectionProcessSuccess,
      earpieceDetectionProcessFailed,
      earpieceDetectionStep,
    ) => {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
      };
      try {
        dispatch(startEarpieceDetectionLoading());
        const response = await getEarpieceDetectionData(data, headers);
        //console.log("response:", response);
        const { data: detectionData } = response?.data;
        //console.log("detectionData:", detectionData);

        dispatch(earpieceDetectionSuccess(response.data));
        if (response?.data?.data?.Earpiece === true) {
          notify("Earpiece Detected, please remvoe earpiece and try again", "error");
          if (setAttemptsCount) {
            setAttemptsCount(prev => prev + 1);
          }
          handleLogit(id, "earpiece", "FAILED");
        }
        if (afterSuccessFn) {
          afterSuccessFn();
        }
        //  check for left ear
        if (earpieceDetectionStep === 1) {
          // if left ear is determined
          if (detectionData?.Orientation === "LeftEar") {
            if (detectionData?.Earpiece === true) {
              notify("Earpiece determined please remove it and try again");
              handleLogit(id, "earpiece", "FAILED");
              earpieceDetectionProcessFailed();
            } else {
              earpieceDetectionProcessSuccess();
            }
          }
          // if left ear not determined
          else {
            earpieceDetectionProcessFailed();
            notify("Left Ear not determined, please try again", "warning");
            if (setAttemptsCount) {
              setAttemptsCount(prev => prev + 1);
            }
            handleLogit(id, "earpiece", "FAILED");
          }
        }
        // check for right ear
        else if (earpieceDetectionStep === 2) {
          // if right ear is determined
          if (detectionData?.Orientation === "RightEar") {
            if (detectionData?.Earpiece === true) {
              notify("Earpiece determined please remove it and try again");
              handleLogit(id, "earpiece", "FAILED");
              if (setAttemptsCount) {
                setAttemptsCount(prev => prev + 1);
              }
              earpieceDetectionProcessFailed();
            } else {
              earpieceDetectionProcessSuccess();
            }
          }
          // if right ear is not determined
          else {
            earpieceDetectionProcessFailed();
            notify("Right Ear not determined,please try again", "warning");
            if (setAttemptsCount) {
              setAttemptsCount(prev => prev + 1);
            }
            handleLogit(id, "earpiece", "FAILED");
          }
        }
        // handleUpdateBaselining();
      } catch (error) {
        dispatch(earpieceDetectionError(error));
        serverErrorNotification();
        earpieceDetectionProcessFailed();
      }
    },
    [dispatch, heimdallToken],
  );

  const handleHeadMovementDetection = useCallback(
    async (
      data,
      onSuccess,
      onError
    ) => {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
      };
      try {
        dispatch(setMovementDetectionLoading());
        const response = await getMovementDetection(data, headers);
        //console.log("Head movement response:", response.data);
        dispatch(setMovementDetectionSuccess(response.data));
        if (response.data.Flag === true) {
          onSuccess();
        } else {
          onError(response.data.Message);
        }
      } catch (error) {
        dispatch(setMovementDetectionError(error));
        //console.log("Head movement error:", error.response.data.Message);
        serverErrorNotification();
        onError(error.response.data.Message);
      }
    },
    [dispatch, heimdallToken],
  )

  const handleUpdateBaselining = useCallback(
    async (data, interviewID, section) => {
      try {
        dispatch(startBaseliningLoading());
        if (data && interviewID && section) {
          await newUpdateBaselining(data, interviewID, section);
        }
        dispatch(updateBaseliningSuccess());
      } catch (error) {
        dispatch(updateBaseliningError(error));
      }
    },
    [dispatch],
  );

  const handleGetLiveInterviewStatus = async interviewId => {
    try {
      dispatch(startGetLiveStatusLoading());
      const response = await getlivestatus(interviewId);
      dispatch(getLiveStatusSuccess(response.data));
    } catch (error) {
      dispatch(getLiveStatusError(error));
    }
  };

  return {
    handleGetHeimdallToken,
    handleFaceDetection,
    handleGazeDetection,
    handleGetLiveInterviewStatus,
    handleEarpieceDetection,
    handlePersonDetection,
    handleUpdateBaselining,
    handleHeadMovementDetection,
  };
};

export default useNewBaselining;
