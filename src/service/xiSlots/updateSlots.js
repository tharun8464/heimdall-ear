import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const updateSlot = data => {
    return defaultSecuredAxios.put("/updateSlot", data);
}