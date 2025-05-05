import { useDispatch } from "react-redux";
import {
  startCreatePodMemberLoading,
  createPodMemberSuccess,
  createPodMemberError,
  startGetAllPodMembersLoading,
  getAllPodMembersSuccess,
  getAllPodMembersError,
  updatePodMemberTagError,
  startUpdatePodMemberTagLoading,
  updatePodMemberTagSuccess,
  startUpdatePodMemberWeightageLoading,
  updatePodMemberWeightageSuccess,
  updatePodMemberWeightageError,
  startFilterPodMembersLoading,
  filterPodMembersSuccess,
  filterPodMembersError,
  startDeletePodMemberLoading,
  deletePodMemberSuccess,
  deletePodMemberError,
  startUpdatePodMemberLoading,
  updatePodMemberSuccess,
  updatePodMemberError
} from "../Store/slices/podMemberSlice"; // Update with the actual import paths
import { createPodMember } from "../service/podMember/createPodMember";
import { getAllPodMembers } from "../service/podMember/getAllPodMembers";
import { updatePodMemberTag } from "../service/podMember/updatePodMemberTag";
import { updatePodMemberWeightage } from "../service/podMember/updatePodMemberWeightage";
import { filterPodMembersByName } from "../service/podMember/filterPodMemberByName";
import { deletePodMember } from "../service/podMember/deletePodMember";
import { getAllPodMemberByCompanyId } from "../service/podMember/getAllPodMemberByCompanyId";
import { updatePodMember } from "../service/podMember/updatePodMember";
import getStorage, { getSessionStorage, setSessionStorage, removeSessionStorage } from "../service/storageService";

const usePodMember = () => {
  const dispatch = useDispatch();

  // Handler function to get all pod members
  const handleGetAllPodMembers = async () => {
    try {
      dispatch(startGetAllPodMembersLoading());
      //const response = await getAllPodMembers();
      let user = await JSON.parse(await getSessionStorage("user"));
      if (user && user?.company_id) {
        const response = await getAllPodMemberByCompanyId(user?.company_id);
        dispatch(getAllPodMembersSuccess(response.data));
        return response.data;
      } else {
        dispatch(getAllPodMembersError("User is empty or company id not found for the user"));
      }
    } catch (error) {
      dispatch(getAllPodMembersError(error));
    }
  };

  // Handler function to create a new pod member
  const handleCreatePodMember = async (company_id, data) => {
    try {
      dispatch(startCreatePodMemberLoading());
      await createPodMember(company_id, data);
      dispatch(createPodMemberSuccess());
      handleGetAllPodMembers();
    } catch (error) {
      dispatch(createPodMemberError(error));
      return error.response;
    }
  };

  // update member tag
  const handleUpdatePodMemberTag = async (memberId, data) => {
    try {
      dispatch(startUpdatePodMemberTagLoading());
      const response = await updatePodMemberTag(memberId, data);
      handleGetAllPodMembers();
      dispatch(updatePodMemberTagSuccess(response.data));
    } catch (error) {
      dispatch(updatePodMemberTagError(error));
    }
  };

  // update member weightage
  const handleUpdatePodMemberWeightage = async (memberId, data) => {
    try {
      dispatch(startUpdatePodMemberWeightageLoading());
      const response = await updatePodMemberWeightage(memberId, data);
      dispatch(updatePodMemberWeightageSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(updatePodMemberWeightageError(error));
      // Handle the error or show an error notification here if needed
    }
  };

  const handleFilterPodMembersByName = async (partialName) => {
    try {
      dispatch(startFilterPodMembersLoading());
      const response = await filterPodMembersByName(partialName);
      dispatch(filterPodMembersSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(filterPodMembersError(error));
      // Handle the error or show an error notification here if needed
    }
  };

  const handleDeletePodMember = async (id) => {
    try {
      dispatch(startDeletePodMemberLoading());
      await deletePodMember(id);
      handleGetAllPodMembers();
      dispatch(deletePodMemberSuccess());
      // Optionally update the state or perform any necessary actions
    } catch (error) {
      dispatch(deletePodMemberError(error));
      // Handle the error or show an error notification here if needed
    }
  };


  const handleUpdatePodMember = async (memberId, data) => {
    try {
      dispatch(startUpdatePodMemberLoading());
      const res = await updatePodMember(memberId, data);
      dispatch(updatePodMemberSuccess(res.data))
      return res.data;
    } catch (error) {
      dispatch(updatePodMemberError(error));
    }
  };

  return {
    handleCreatePodMember,
    handleGetAllPodMembers,
    handleUpdatePodMemberTag,
    handleUpdatePodMemberWeightage,
    handleFilterPodMembersByName,
    handleDeletePodMember,
    handleUpdatePodMember,
  };
};

export default usePodMember;
