import { useDispatch } from "react-redux";
import { createWeightage } from "../service/weightages/createWeightages";
import { getAllWeightages } from "../service/weightages/getAllWeightages";
import { notify } from "../utils/notify";
import {
  createWeightageError,
  createWeightageSuccess,
  startCreateWeightageLoading,
  getAllWeightagesError,
  getAllWeightagesSuccess,
  startGetAllWeightagesLoading,
  startUpdateWeightageFlagLoading,
  updateWeightageFlagSuccess,
  updateWeightageFlagError,
} from "../Store/slices/weightageSlice";
import { updateWeightageFlag } from "../service/weightages/updateWeightageFlag";

const useWeightage = () => {
  const dispatch = useDispatch();

  const handleCreateWeightage = async (data, jobId) => {
    try {
      dispatch(startCreateWeightageLoading());
      const response = await createWeightage(data);
      dispatch(createWeightageSuccess(response.data));
      await handleGetAllWeightages(jobId);
      notify("Saved successfully", "success");
    } catch (error) {
   
      notify("Same name already exists", "error");
      dispatch(createWeightageError(error));
    }
  };

  const handleGetAllWeightages = async (jobId) => {
    try {
      dispatch(startGetAllWeightagesLoading());
      const response = await getAllWeightages(jobId);
      dispatch(getAllWeightagesSuccess(response.data));
    } catch (error) {
      dispatch(getAllWeightagesError(error));
    }
  };

  const handleUpdateWeightageFlag=async(weightageId,jobId)=>{
    try{
      dispatch(startUpdateWeightageFlagLoading());
      const res=await updateWeightageFlag(weightageId,jobId);      
      dispatch(updateWeightageFlagSuccess());
      handleGetAllWeightages(jobId);
    }catch(error){
      dispatch(updateWeightageFlagError(error));
    }
  }
  return {
    handleCreateWeightage,
    handleGetAllWeightages,
    handleUpdateWeightageFlag
  };
};

export default useWeightage;
