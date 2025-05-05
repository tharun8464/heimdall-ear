import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const downloadResumeFromId = userId => {
  return defaultSecuredAxios.post("/downloadCandidateResume", { userId });
};
