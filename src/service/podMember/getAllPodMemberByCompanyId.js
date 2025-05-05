import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getAllPodMemberByCompanyId = (companyId) => {
  return defaultSecuredAxios.get(`/pod/member/${companyId}`);
};
