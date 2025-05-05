import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const setVmLiteReportFlag = ({ evaluationId }) => {
  return defaultSecuredAxios.post(`/checkVmLiteReportFlag`, { evaluationId });
};
