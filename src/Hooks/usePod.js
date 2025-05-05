import { useDispatch, useSelector } from "react-redux";
import {
  startDeletePodLoading,
  deletePodSuccess,
  deletePodError,
  startUpdatePodLoading,
  updatePodSuccess,
  updatePodError,
  startGetPodByIdLoading,
  getPodByIdSuccess,
  getPodByIdError,
  startGetPodsByCompanyIdLoading,
  getPodsByCompanyIdSuccess,
  getPodsByCompanyIdError,
  startGetAllPodsLoading,
  getAllPodsSuccess,
  getAllPodsError,
  startCreatePodLoading,
  createPodSuccess,
  createPodError,
  startSelectCreatePodLoading,
  selectCreatePodSuccess,
  selectCreatePodError
} from "../Store/slices/podSlice";
import { deletePod } from "../service/podManagement/deletePod";
import { updatePod } from "../service/podManagement/updatePod";
import { getPodById } from "../service/podManagement/getPodById";
import { getAllPods } from "../service/podManagement/getAllPods";
import { createPod } from "../service/podManagement/createPod";
import { getPodsByCompanyId } from "../service/podManagement/getPodsByCompanyId";
import { selectCreatePod } from "../service/podManagement/selectCreatePod";

const usePod = () => {
  const dispatch = useDispatch();

  // Handler function to delete a Pod
  const handleDeletePod = async (podId) => {
    try {
      dispatch(startDeletePodLoading());
      await deletePod(podId);
      dispatch(deletePodSuccess());
      // Optionally handle success or perform other actions
    } catch (error) {
      dispatch(deletePodError(error));
    }
  };

  // Handler function to update a Pod
  const handleUpdatePod = async (podId, data) => {
    try {
      dispatch(startUpdatePodLoading());
      let res =  await updatePod(podId, data);
      dispatch(updatePodSuccess(data));
      // Optionally handle success or perform other actions
      return res.data
    } catch (error) {
      dispatch(updatePodError(error));
    }
  };

  // Handler function to get a Pod by ID
  const handleGetPodsByCompanyId = async (CompanyId) => {
    try {
      dispatch(startGetPodsByCompanyIdLoading());
      const response = await getPodsByCompanyId(CompanyId);
      dispatch(getPodsByCompanyIdSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getPodsByCompanyIdError(error));
      return error?.response;
    }
  };

  // Handler function to get a Pod by ID
  const handleGetPodById = async (podId) => {
    try {
      dispatch(startGetPodByIdLoading());
      const response = await getPodById(podId);
      dispatch(getPodByIdSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getPodByIdError(error));
    }
  };

  // Handler function to get all Pods
  const handleGetAllPods = async (jobId) => {
    try {
      dispatch(startGetAllPodsLoading());
      const response = await getAllPods(jobId);
      dispatch(getAllPodsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(getAllPodsError(error));
    }
  };

  // Handler function to create a Pod
  const handleCreatePod = async (data, companyId, jobId) => {
    try {
      dispatch(startCreatePodLoading());
      const res=await createPod(data, companyId);
      dispatch(createPodSuccess());
      handleGetAllPods(jobId);     
      return res;
      // Optionally handle success or perform other actions
    } catch (error) {
      dispatch(createPodError(error));     
      return error.response;
    }
  };


  const handleSelectCreatePod=async(jobId,data)=>{
    try{
      dispatch(startSelectCreatePodLoading());
      const res=await selectCreatePod(jobId,data);
      dispatch(selectCreatePodSuccess());
      handleGetAllPods(jobId);     
      return res;
    }catch(error){
      dispatch(selectCreatePodError(error));
      return error.response;
    }
  }

  return {
    handleDeletePod,
    handleUpdatePod,
    handleGetPodById,
    handleGetAllPods,
    handleCreatePod,
    handleGetPodsByCompanyId,
    handleSelectCreatePod,
  };
};

export default usePod;
