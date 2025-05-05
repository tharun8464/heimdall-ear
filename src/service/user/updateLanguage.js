import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateLanguage = data => {
  return defaultSecuredAxios.post("/user/updateLanguage", data);
};
