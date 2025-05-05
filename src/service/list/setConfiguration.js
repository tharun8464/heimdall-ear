import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const setConfiguration = (listId, data) => {
    return defaultSecuredAxios.post(`/setListConfiguration/${listId}`, data);
};