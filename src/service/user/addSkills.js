import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const addSkills = data => {
  return defaultSecuredAxios.post("/user/addSkill", data);
};
