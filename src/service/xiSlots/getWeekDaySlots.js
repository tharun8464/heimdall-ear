import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const getWeekDaySlots = data => {
    return defaultSecuredAxios.post("/getWeekDaySlot", {date : data});
}