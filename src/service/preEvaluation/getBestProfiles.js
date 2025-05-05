import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getBestProfiles = (jobId) => {
  return defaultSecuredAxios.get(`/getBestProfiles/${jobId}`);
};
