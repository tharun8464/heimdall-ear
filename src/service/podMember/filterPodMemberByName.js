import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const filterPodMembersByName = (partialName) => {
  return defaultSecuredAxios.get("/podMember/filter", {
    params: { partialName },
  });
};
