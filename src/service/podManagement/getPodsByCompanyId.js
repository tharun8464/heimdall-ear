import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getPodsByCompanyId = (Company_id) => {
  return defaultSecuredAxios.get(`/pods/${Company_id}`);
};