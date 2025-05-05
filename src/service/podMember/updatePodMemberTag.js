import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updatePodMemberTag = (memberId, data) => {
  return defaultSecuredAxios.post(`/podMember/tag/${memberId}`, data);
};
