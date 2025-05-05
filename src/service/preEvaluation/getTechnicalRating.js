import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getTechnicalRating = (jobId, data) => {
  return defaultSecuredAxios.post(`/interview/rating/${jobId}`, data);
};
