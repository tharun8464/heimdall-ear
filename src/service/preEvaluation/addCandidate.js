import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const addCandidate = (data) => {
  return defaultSecuredAxios.post(`/AddCandidatesPreevaluation`, data);
};
