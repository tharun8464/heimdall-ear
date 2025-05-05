import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const calculateTalentMatch = (data) => {
  return defaultSecuredAxios.post("/testCalculateTalentMatch", data);
};
