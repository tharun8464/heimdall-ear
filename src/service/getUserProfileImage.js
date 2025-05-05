import { defaultSecuredAxios } from "./DefaultSecuredAxiosInstance";

export const getUserProfileImage = data => {
  return defaultSecuredAxios.post("/getProfileImage", data);
};
