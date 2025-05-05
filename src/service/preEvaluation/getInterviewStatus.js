import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getInterviewStatus = (jobId) => {
  return defaultSecuredAxios.get(`/interview/list/${jobId}`);
};
