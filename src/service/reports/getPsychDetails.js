import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getVmLiteReport = (data) => {
  return defaultSecuredAxios.post(`/vmLiteReport`, data);
};
