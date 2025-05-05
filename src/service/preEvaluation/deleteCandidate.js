import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const deleteCandidate = (data) => {

  return defaultSecuredAxios.post("/deleteCandidate", data);
};
