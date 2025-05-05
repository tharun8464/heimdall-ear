import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance"

export const getSlotByMonth = (month, year) => {
    return defaultSecuredAxios.get(`/getSlotsByMonth?month=${month}&year=${year}`)
}