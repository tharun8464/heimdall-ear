import { INVITE_URL } from "../../utils/constants";
import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const inviteCandidateForPsychometry = () => {
  return defaultSecuredAxios.post(`${INVITE_URL}/psychometry`);
};
