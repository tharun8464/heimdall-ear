import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const addUserExperience = data => {
  return defaultSecuredAxios.post("/user/addExperience", data);
};
