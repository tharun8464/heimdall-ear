import {defaultSecuredAxios} from "../DefaultSecuredAxiosInstance"

export const getBookedSlotsWeekly = (week , month , year) => {
    return defaultSecuredAxios.get(`/getSlotsByWeek/?week=${week}&month=${month}&year=${year}`);
}