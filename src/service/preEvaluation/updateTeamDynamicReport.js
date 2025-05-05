import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateTeamDynamicReport = (jobId, data) => {
  return defaultSecuredAxios.post(`/hasTeamDynamicReport/${jobId}`, data);
};
