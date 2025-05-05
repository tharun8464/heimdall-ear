import { useDispatch } from "react-redux";
import {
  startAnalysisLoading,
  analysisSuccess,
  analysisError,
} from "../Store/slices/analysisSlice";
import { calculateTalentMatch } from "../service/analysis/calculateTalentMatch";
import usePreEvaluation from "./usePreEvaluation";

const useAnalysis = () => {
  const dispatch = useDispatch();
  const {
    handleUpdateMainViewProfile,
    handleGetMainViewProfiles,
    handleUpdateMainViewCandidate,
  } = usePreEvaluation();

  const handleCalculateTalentMatch = async (data) => {
    try {
      dispatch(startAnalysisLoading());
      const response = await calculateTalentMatch(data);
      //handleGetMainViewProfiles(data?.jobId);
      dispatch(analysisSuccess(response?.data));
      // handleUpdateMainViewCandidate();
      return response?.data;
    } catch (error) {
      dispatch(analysisError(error));
    }
  };

  return {
    handleCalculateTalentMatch,
  };
};

export default useAnalysis;
