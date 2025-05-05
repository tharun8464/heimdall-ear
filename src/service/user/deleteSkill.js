import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const deleteSkill = data => {
  return defaultSecuredAxios.post("/user/deleteSkill", data);
};
