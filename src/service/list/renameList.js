import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const renameList = (data) => {
    return defaultSecuredAxios.post(`/renameList`, data);
};