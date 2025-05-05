import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const deleteUserEducation = data => {
  return defaultSecuredAxios.post("/user/deleteEducation", data);
};
