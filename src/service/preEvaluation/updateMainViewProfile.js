import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateMainViewProfile = (evaluationId, candidateId, data) => {
  //console.log("data raaann:", data);
  return defaultSecuredAxios.post(
    `/updateMainViewProfile/${evaluationId}/${candidateId}`,
    data
  );
};
