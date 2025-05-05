import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getAllLanguages = () => {
  return defaultSecuredAxios.get("/languagesList");
};
