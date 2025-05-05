import { useState } from "react";
import styles from "./RightSection.module.css";
import PodManagementMenu from "../PodManagementMenu/PodManagementMenu";
import CandidatePodComponent from "../CandidatePodComponent/CandidatePodComponent";
import OtherPodComponent from "../OtherPodComponent/OtherPodComponent";
import CreatePodComponent from "../CreatePodComponent/CreatePodComponent";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const RightSection = ({ state, setState, jobId, setIsAddToPod, isAddToPod, editPod, setEditPod, setShowPopup, handleCreatePodClose }) => {
  const [podViewType, setPodViewType] = useState("candidate");
  const [showCreatePod, setShowCreatePod] = useState(true);
  const [createdPod, setCreatedPod] = useState();

  useEffect(() => {
    if (isAddToPod === false)
      setState({
        items: [...state.selected, ...state.items],
        selected: []
      });
  }, [isAddToPod]);

  return (
    <div className={styles.Wrapper}>
      <PodManagementMenu
        podViewType={podViewType}
        setPodViewType={setPodViewType}
        setShowCreatePod={setShowCreatePod}
        showCreatePod={showCreatePod}
        setIsAddToPod={setIsAddToPod}
        isAddToPod={isAddToPod}
      />
      {podViewType === "candidate" && showCreatePod && editPod.isEdited ? (
        <CreatePodComponent state={state} podType={"candidate"} editPod={editPod} jobId={jobId} setState={setState} setShowPopup={setShowPopup} handleCreatePodClose={handleCreatePodClose} />
      ) : null}
      {podViewType === "candidate" && showCreatePod && !editPod.isEdited ? (
        <CreatePodComponent state={state} podType={"candidate"} jobId={jobId} setState={setState} setShowPopup={setShowPopup} handleCreatePodClose={handleCreatePodClose} />
      ) : null}
      {podViewType === "candidate" ? (
        <CandidatePodComponent state={state} createdPod={createdPod} jobId={jobId} setState={setState} setEditPod={setEditPod} setIsAddToPod={setIsAddToPod} isAddToPod={isAddToPod} setShowCreatePod={setShowCreatePod} showCreatePod={showCreatePod} />
      ) : null}
      {podViewType === "other" && showCreatePod && editPod.isEdited ? (
        <CreatePodComponent state={state} podType={"other"} editPod={editPod} jobId={jobId} setShowPopup={setShowPopup} handleCreatePodClose={handleCreatePodClose} />
      ) : null}
      {podViewType === "other" && showCreatePod && !editPod.isEdited ? (
        <CreatePodComponent state={state} podType={"other"} jobId={jobId} setShowPopup={setShowPopup} handleCreatePodClose={handleCreatePodClose} />
      ) : null}
      {podViewType === "other" ? (
        <OtherPodComponent state={state} jobId={jobId} setState={setState} setEditPod={setEditPod} setIsAddToPod={setIsAddToPod} isAddToPod={isAddToPod} setShowCreatePod={setShowCreatePod} showCreatePod={showCreatePod} />
      ) : null}
    </div>
  );
};

export default RightSection;
