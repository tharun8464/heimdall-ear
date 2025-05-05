import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateUserDetails = data => {
  return defaultSecuredAxios.post("/updateUserDetails", data);
};
