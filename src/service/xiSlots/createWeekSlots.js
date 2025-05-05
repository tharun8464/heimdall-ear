import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const createWeekSlots = (data) => {
    return defaultSecuredAxios.post("/createWeekSlots", data);
}