import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getFeedbackReport = (data ,jobId) => {
  // console.log("roman",jobId)
  return defaultSecuredAxios.post(`interview/feedback/${jobId}`, data);
};