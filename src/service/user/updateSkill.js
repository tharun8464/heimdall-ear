import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateSkill = data => {
  return defaultSecuredAxios.post("/user/updateSkills", data);
};
