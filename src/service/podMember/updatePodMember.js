import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updatePodMember = (memberId, data) => {
  return defaultSecuredAxios.post(`/podMemberUpdate/${memberId}`, data);
};
