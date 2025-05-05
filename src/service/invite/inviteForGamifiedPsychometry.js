import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const inviteForGamifiedPsychometry = (data) => {
  return defaultSecuredAxios.post("/invite/gamifiedPsychometry", data);
};
