import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateMainViewCandidate = (id, data) => {
  return defaultSecuredAxios.post(`/mainViewProfile/update/${id}`, data);
};
