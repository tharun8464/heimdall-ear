import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const createPod = (data, companyId) => {
  return defaultSecuredAxios.post(`/pod/${companyId}`, data);
};
