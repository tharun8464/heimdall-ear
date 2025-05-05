import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const deleteResume = id => {
  return defaultSecuredAxios.delete(`/user/deleteCandidateResume/${id}`);
};
