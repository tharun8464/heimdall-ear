import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getAllWeightages = (jobId) => {
  return defaultSecuredAxios.get("/weightage/"+jobId);
};

export const deleteAllWeightages = (jobId) => {
  return defaultSecuredAxios.delete("/deleteAllWeightage/"+jobId);
};

export const deleteWeightageById = (data) => {
  return defaultSecuredAxios.post(`/deleteWeightageById/`,data);
};