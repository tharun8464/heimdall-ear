import { useDispatch } from "react-redux";
import { inviteCandidateForInterview } from "../service/invite/inviteCandidateForInterview";
import { inviteCandidateForPsychometry } from "../service/invite/inviteCandidateForPsychometry";
import { inviteCandidateForCognitive } from "../service/invite/inviteCandidateForCognitive";
import {
  inviteCandidateForCognitiveError,
  inviteCandidateForCognitiveSuccess,
  inviteCandidateForGamifiedPsychometryError,
  inviteCandidateForGamifiedPsychometrySuccess,
  inviteCandidateForInterviewError,
  inviteCandidateForInterviewSuccess,
  inviteCandidateForPsychometryError,
  inviteCandidateForPsychometrySuccess,
  startInviteCandidateForCognitiveLoading,
  startInviteCandidateForGamifiedPsychometryLoading,
  startInviteCandidateForInterviewLoading,
  startInviteCandidateForPsychometryLoading,
} from "../Store/slices/inviteSlice";
import usePreEvaluation from "./usePreEvaluation";
import { decreaseCredit } from "../service/creditMapService";
import { inviteForGamifiedPsychometry } from "../service/invite/inviteForGamifiedPsychometry";

const useInvite = () => {
  const dispatch = useDispatch();
  const { handleGetMainViewProfiles, handleGetTechnicalRating, handleGetMainViewProf } =
    usePreEvaluation();

  const handleInviteCandidateForCognitive = async (
    candidateId,
    data,
    company,
    action,
    maxCredit,
  ) => {
    try {
      dispatch(startInviteCandidateForCognitiveLoading());
      const response = await inviteCandidateForCognitive(candidateId, data);
      if (response.status === 200) {
        await decreaseCredit(company, action, maxCredit);
      }
      handleGetMainViewProfiles(data?.jobId);
      handleGetMainViewProf(data?.evaluationId);
      dispatch(inviteCandidateForCognitiveSuccess(response.data));
    } catch (error) {
      dispatch(inviteCandidateForCognitiveError(error));
    }
  };

  const handleInviteCandidateForPsychometry = async candidateId => {
    try {
      dispatch(startInviteCandidateForPsychometryLoading());
      const response = await inviteCandidateForPsychometry(candidateId);
      dispatch(inviteCandidateForPsychometrySuccess(response.data));
    } catch (error) {
      dispatch(inviteCandidateForPsychometryError(error));
    }
  };

  const handleInviteCandidateForGamifiedPsychometry = async data => {
    try {
      dispatch(startInviteCandidateForGamifiedPsychometryLoading());
      const response = await inviteForGamifiedPsychometry(data);
      if (response && response.status === 200) {
        //console.log("response", response);
        handleGetMainViewProfiles(data?.jobId);
        dispatch(inviteCandidateForGamifiedPsychometrySuccess(response.data));
      } else {
        dispatch(inviteCandidateForGamifiedPsychometryError(response.status));
      }
    } catch (error) {
      //console.log("error", error);
      dispatch(inviteCandidateForGamifiedPsychometryError(error.response.status));
    }
  };

  const handleInviteCandidateForInterview = async (data, company, action, maxCredit) => {
    try {
      dispatch(startInviteCandidateForInterviewLoading());
      const response = await inviteCandidateForInterview(data);
      if (response.status === 200) {
        await decreaseCredit(company, action, maxCredit);
      }
      handleGetMainViewProfiles(data?.jobId);
      //console.log("evel", data?.evaluationId);
      handleGetMainViewProf(data?.evaluationId);
      // handleGetTechnicalRating(data?.jobId, data?.email);
      dispatch(inviteCandidateForInterviewSuccess(response.data));
    } catch (error) {
      dispatch(inviteCandidateForInterviewError(error));
    }
  };
  return {
    handleInviteCandidateForInterview,
    handleInviteCandidateForCognitive,
    handleInviteCandidateForPsychometry,
    handleInviteCandidateForGamifiedPsychometry,
  };
};

export default useInvite;
