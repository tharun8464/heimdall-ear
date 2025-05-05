// update baselining after success functions

import { useSelector } from "react-redux";
import useNewBaselining from "./useNewBaselining";

const useUpdateBaselining = () => {
  const {
    faceDetectionData,
    gazeDetectionData,
    personDetectionData,
    earpieceDetectionData,
    interviewMeetingId,
  } = useSelector(state => state.baselining);
  const { handleUpdateBaselining } = useNewBaselining();
  //console.log("gazeDetectionData:", gazeDetectionData);
  //console.log("personDetectionData:", personDetectionData);
  //console.log("earpieceDetectionData:", earpieceDetectionData);

  const updateFaceDetectionBaselining = async () => {
    const formData = new FormData();
    const img = "data:image/jpeg;base64," + faceDetectionData?.img;
    let blob = await fetch(img).then(r => r.blob());

    formData.append("file", blob);

    handleUpdateBaselining(formData, interviewMeetingId, "face");
  };
  const updateGazeDetectionBaselining = async () => {
    const formData = new FormData();
    //console.log("gazeDetectionData:", gazeDetectionData);
    const img = "data:image/jpeg;base64," + gazeDetectionData?.img;
    if (gazeDetectionData?.img) {
      let blob = await fetch(img).then(r => r.blob());
      formData.append("file", blob);
    }
    handleUpdateBaselining(formData);
    handleUpdateBaselining(formData, interviewMeetingId, "gaze");
  };

  const updatePersonDetectionBaselining = async () => {
    const formData = new FormData();
    const img = "data:image/jpeg;base64," + personDetectionData?.img;
    if (personDetectionData?.img) {
      let blob = await fetch(img).then(r => r.blob());
      formData.append("file", blob);
    }

    handleUpdateBaselining(formData, interviewMeetingId, "person");
  };
  const updateEarDetectionBaselining = async () => {
    const formData = new FormData();
    const img = "data:image/jpeg;base64," + earpieceDetectionData?.img;
    //console.log("earpieceDetectionDataTest:", earpieceDetectionData);

    if (earpieceDetectionData?.img) {
      let blob = await fetch(img).then(r => r.blob());
      formData.append("file", blob);
      handleUpdateBaselining(formData, interviewMeetingId, "ear");
    }
  };

  return {
    updateFaceDetectionBaselining,
    updateEarDetectionBaselining,
    updateGazeDetectionBaselining,
    updatePersonDetectionBaselining,
  };
};

export default useUpdateBaselining;
