import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const addUserEducation = data => {
  return defaultSecuredAxios.post("/user/addeducation", data);
};
