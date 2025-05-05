import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const inviteCandidateForInterview = (data) => {
  return defaultSecuredAxios.post("/invite/interview", data);
};
