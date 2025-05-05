import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const inviteCandidateForCognitive = (candidateId, data) => {
  return defaultSecuredAxios.post(`invite/cognitive`, data);
};
