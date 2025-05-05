import { Divider } from "@mui/material";
import styles from "./CreatePodComponent.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "../../Button/Button";
import { Draggable, Droppable } from "react-beautiful-dnd";
import MemberCard from "../components/MemberCard";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TaggedMemberCard from "../components/TaggedMemberCard/TaggedMemberCard";
import { useSelector } from "react-redux";
import usePod from "../../../Hooks/usePod";
import getStorage, { getSessionStorage, setSessionStorage, removeSessionStorage } from "../../../service/storageService";
import { useEffect, useState } from "react";
import usePopup from "../../../Hooks/usePopup";
import PodDetailsPopup from "./PodDetailsPopup/PodDetailsPopup";
import TaggedWeightageCard from "../components/TaggedWeightageCard/TaggedWeightageCard";
import usePodMember from "../../../Hooks/usePodMember";
import { notify } from "../../../utils/notify";

const CreatePodComponent = ({ state, companyId, podType, editPod, jobId, setState, setShowPopup, handleCreatePodClose }) => {

  const isSelectedMembersEmpty = state?.selected?.length === 0 ? true : false;
  const [user, setUser] = useState("");
  const [selectedMem, setSelectedMem] = useState(true);
  const [isCustomiseWeightageActive, setIsCustomiseWeightageActive] =
    useState(false);
  const { handleCreatePod, handleUpdatePod, handleGetPodById, handleGetAllPods } = usePod();
  const { handlePopupCenterOpen, handlePopupCenterComponentRender } =
    usePopup();
  const { handleGetAllPodMembers, handleUpdatePodMember } = usePodMember();

  const handleCreateNewPod = async (podDetails) => {
    const podMembers = await handleGetAllPodMembers()
    const selectedMember = podMembers?.filter((value => state?.selected?.some(item => item['_id'] === value['_id'])));
    const data = {
      name: podDetails?.name,
      podFunction: podDetails?.podFunction,
      podType,
      //members: state?.selected,
      members: selectedMember,
      jobId,
      company_id: user?.company_id
    };

    const res = await handleCreatePod(data, user?.company_id, jobId);
    if (res?.status === 200) {
      await handleGetAllPods(jobId);
      await handleGetAllPodMembers();
      //handleSetValue(res?.data);    
    }
    if (res?.status === 400) {
      notify(`${res?.data?.message}`, 'error');
    }
  };

  const handleSetValue = (data) => {
    //alert(data);
  }



  const handleEditPod = async () => {
    const podId = editPod.id;
    const podMembers = await handleGetAllPodMembers()

    const pod = await handleGetPodById(podId);

    const selectedMember = podMembers?.filter((value => state?.selected?.some(item => item['_id'] === value['_id'])));


    const allPodMemberIds = pod.members.map(item => item._id.toString());
    const selectedMemberIds = state.selected.map(item => item._id.toString());

    const filteredPodMemberIds = allPodMemberIds.filter(value => !selectedMemberIds.includes(value));

    const updatedData = {
      isAddedToPod: false,
      jobId,
    }
    if (filteredPodMemberIds.length > 0) {
      for (let memberId of filteredPodMemberIds) {
        const res = await handleUpdatePodMember(memberId, updatedData);

      }
    }

    //handleCreatePodClose()
    const data = {
      //name: podDetails?.name,
      //podFunction: podDetails?.podFunction,
      podType,
      members: selectedMember,
      isEdited: true,
      jobId,
    };
    const res = await handleUpdatePod(podId, data);
    //setShowPopup(true);

    return res;
  }

  const handleCustomiseWeightage = () => {
    setIsCustomiseWeightageActive((prev) => !prev);
  };

  const createPodValidation = (podMembers) => {
    let requiredPodMember = false;
    let isTeamleadOrReportingManager = false;
    let isReportingManager = 0;
    const minimumMembersInPod = JSON.parse(getSessionStorage("configurations"))?.minimumMembersInPod ? JSON.parse(getSessionStorage("configurations"))?.minimumMembersInPod > 0 ? JSON.parse(getSessionStorage("configurations"))?.minimumMembersInPod : 1 : 1;

    if (podMembers.length >= minimumMembersInPod && podMembers.length <= 20 && podType === 'candidate') {
      requiredPodMember = true;
      podMembers.forEach(element => {
        if (element.tag === "Team Lead" || element.tag === "Reporting Manager") {
          isTeamleadOrReportingManager = true;
        }
        if (element.tag === "Reporting Manager") {
          isReportingManager += 1;
        }
      });

      if (!isTeamleadOrReportingManager) {
        notify(`One Team Lead/Reporting manager is required!`, "error");
        setShowPopup(true)
      }

      if (isReportingManager > 1) {
        notify(`You can't add more than one Reporting Manager!`, "error");
        setShowPopup(true);
      }
    } else {
      if (podMembers.length >= 1 && podMembers.length <= 20 && podType === 'other') {
        return true;
      }
      notify(`You can't add less than ${minimumMembersInPod} and more than 20 employees!`, "error");
    }
    return (requiredPodMember && isTeamleadOrReportingManager && isReportingManager <= 1)
  }


  const handleShowPopup = async () => {
    const podMembers = await handleGetAllPodMembers()
    if (state?.selected?.length > 0) {
      const selectedMember = podMembers?.filter((value => state?.selected?.some(item => item['_id'] === value['_id'])));
      const weightage = selectedMember?.reduce((acc, cur) => {
        return acc + cur.weightage;
      }, 0);
      const alreadyAddMember = state?.selected?.filter(item => item.isAddedToPod === true && item?.jobId.includes(jobId));
      if (alreadyAddMember.length > 0) {
        alreadyAddMember.forEach((item) => notify(`${item.name} is already added in another pod!`, "error"));
      } else if (weightage === 100) {
        setShowPopup(false)
        if (createPodValidation(state?.selected)) {
          if (editPod?.isEdited) {
            const res = await handleEditPod();
            if (res)
              return notify(`${res?.updatedPod?.name} is updated successfully!`, "success");
          } else {
            handlePopupCenterOpen(true);
            handlePopupCenterComponentRender(
              <PodDetailsPopup onSaveFn={handleCreateNewPod} setShowPopup={setShowPopup} />
              //  <PodDetailsPopup onSaveFn={!editPod?.isEdited ? handleCreateNewPod : handleEditPod} setShowPopup={setShowPopup} />
            );
          }
        }
      } else {
        notify(`Total weight-age should be 100!`, "error");
      }
    } else {
      notify(`Please add the members before save the pod!`, "error");
    }
  };

  const getUserInfo = async () => {
    let user = JSON.parse(await getSessionStorage("user"));
    setUser(user);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleMemberSelection = (memberId) => {

  }

  return (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <span className={styles.Heading}>Create pod</span>
        <span className={styles.Subheading} onClick={handleCustomiseWeightage} style={{ color: "var(--primary-green)" }}>
          {isCustomiseWeightageActive ? "cancel" : "Customise weight-age"}
        </span>
      </div>
      <Droppable droppableId="droppable2">
        {(provided, snapshot) => (
          <div
            className={isSelectedMembersEmpty ? styles.DropZone : ""}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {isSelectedMembersEmpty ? (
              <>
                <AddBoxIcon sx={{ color: "var(--font-grey-75)" }} />
                <p className={styles.Subheading}>
                  Drag and drop members to the pod
                </p>
                <p className={styles.AddUptoText}> Add up to 20 employees </p>
              </>
            ) : null}
            {state?.selected?.map(
              ({ name, designation, _id, tag, weightage, image }, index) => {
                return (
                  <Draggable key={_id} index={index} draggableId={_id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.TestRow}
                      >
                        {isCustomiseWeightageActive ? (
                          <TaggedWeightageCard
                            id={_id}
                            firstName={name}
                            designation={designation}
                            memberTag={tag}
                            weightage={weightage}
                            image={image}
                            selectedMem={selectedMem}
                            handleMemberSelection={handleMemberSelection}
                          />
                        ) : (
                          <TaggedMemberCard
                            firstName={name}
                            designation={designation}
                            memberTag={tag}
                            weightage={weightage}
                            image={image}
                            selectedMem={selectedMem}
                            handleMemberSelection={handleMemberSelection}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              }
            )}
          </div>
        )}
      </Droppable>
      {
        state?.selected?.length < 4 ? (
          <div className={styles.TipWrapper}>
            <InfoOutlinedIcon className={styles.InfoIcon} />
            <span className={styles.TipText}>
              Add 4 more members to build a better team
            </span>
          </div>
        ) : null
      }

      <div className={styles.BottomSection}>
        <Divider />
        <Button
          text={"Save pod"}
          btnType={"primary"}
          className={styles.Btn}
          onClick={handleShowPopup}
        />
      </div>
    </div>
  );
};

export default CreatePodComponent;
