import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const createTeamCompatibility = (company_id, data) => {
  return defaultSecuredAxios.post(`/pod/compatibility/${company_id}`, data);
};
