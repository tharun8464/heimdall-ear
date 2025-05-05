import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const uploadResume = data => {
  return defaultSecuredAxios.post("/uploadCandidateResume", data);
};
