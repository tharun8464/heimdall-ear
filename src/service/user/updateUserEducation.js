import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateUserEducationById = data => {
  return defaultSecuredAxios.post("/user/updateEducation", data);
};
