import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const getBookedSlotsToday = () => {
    return defaultSecuredAxios.get("/getTodaysSlots")
}