import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getAllPodMembers = () => {
  return defaultSecuredAxios.get("/podMember");
};
