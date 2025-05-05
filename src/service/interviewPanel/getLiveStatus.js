import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const getlivestatus = meetingid => {
  return defaultSecuredAxios.post(`/getlivestatus`, {
    meetingID: meetingid,
  });
};
