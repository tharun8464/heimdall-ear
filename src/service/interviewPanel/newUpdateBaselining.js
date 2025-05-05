import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const newUpdateBaselining = (data, interviewID, section) => {
  return defaultSecuredAxios.post(
    `/v2/participant/candidate/baseline/${interviewID}/${section}`,
    data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
};
