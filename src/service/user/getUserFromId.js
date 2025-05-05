import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getUserFromId = id => {
  return defaultSecuredAxios.post("/getUserFromId", { id });
};
