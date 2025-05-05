import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const createPodMember = (company_id, data) => {
  return defaultSecuredAxios.post(`/pod/member/${company_id}`, data);
};
