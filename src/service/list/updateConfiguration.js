import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateConfiguration = (data) => {
  return defaultSecuredAxios.post(`/updateListConfiguration`, data);
};