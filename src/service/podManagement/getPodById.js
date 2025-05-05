import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getPodById = (podId) => {
  return defaultSecuredAxios.get(`/getPodById/${podId}`);
};
