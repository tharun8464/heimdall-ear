import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const selectCreatePod = (jobId,data) => {    
  return defaultSecuredAxios.post(`/podSelect/${jobId}`, data);
};




