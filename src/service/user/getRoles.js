import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getRoles = () => {
  return defaultSecuredAxios.post("/getRoles");
};
