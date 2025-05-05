import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const createSlot = (data) => {
    return defaultSecuredAxios.post("/createSlotToday", data);
}