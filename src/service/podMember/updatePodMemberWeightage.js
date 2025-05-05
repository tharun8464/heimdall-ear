import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updatePodMemberWeightage = (memberId, data) => {
  return defaultSecuredAxios.post(`/podMember/weightage/${memberId}`, data);
};
