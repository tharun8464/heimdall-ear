import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getAllPods = (jobId) => {
  return defaultSecuredAxios.get(`/pod/${jobId}`);
};
