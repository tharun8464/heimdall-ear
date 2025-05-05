import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const createWeightage = (data) => {
    const {jobId, weightageData} = data;
  return defaultSecuredAxios.post("/weightage/"+jobId, weightageData);
};