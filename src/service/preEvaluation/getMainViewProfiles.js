// services/preEvaluation/getMainViewProfiles.js

import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getMainViewProfiles = (jobId) => {
  return defaultSecuredAxios.get(`/getMainViewProfiles/${jobId}`);
};

export const getMainViewProfileById = (evaluationId) => {
  //console.log("eval",evaluationId)
  return defaultSecuredAxios.get(`/getMainViewProfileById/${evaluationId}`);
};