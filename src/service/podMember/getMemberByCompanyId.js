import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getAllMemberByCompanyId = (companyId) => {
  return defaultSecuredAxios.get(`/members/${companyId}`);
};
