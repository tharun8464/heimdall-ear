import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const deletePodMember = (id) => {
  return defaultSecuredAxios.get(`/podMember/delete/${id}`);
};
