import { useDispatch } from "react-redux";
import {
    setBlockedDates, setBlockedDatesError, startBlockedDatesLoading,
    startCreateSlotLoading, setCreateSlotData, setCreateSlotError,
    startGetTodaySlotsLoading, setGetTodaySlotsData, setGetTodaySlotsError,
    startGetMonthlySlotsLoading, getMonthlySlotsData, getMonthlySlotsError,
    setGetWeeklySlotsData, setGetWeeklySlotsError, startGetWeeklySlotsLoading,
    setCurrentWeek, setCurrentMonth, setCurrentYear, setMonth,
    getDateSlotLoading, getDateSlot, getDateSlotError,
    getWeekSlotLoading, getWeekSlot, getWeekSlotError

} from "../Store/slices/xiSlotsSlice";
import { getXiBlockedDates } from "../service/xiSlots/getXiBlockedDates";
import { createSlot } from "../service/xiSlots/createSlot";
import { getBookedSlotsToday } from "../service/xiSlots/getBookedSlotsToday";
import { getSlotByMonth } from "../service/xiSlots/getSlotsByMonth";
import { deleteSlots } from "../service/xiSlots/deleteSlot";
import { getBookedSlotsWeekly } from "../service/xiSlots/getBookedSlotsWeekly"
import { updateBlockedDates } from "../service/xiSlots/updateBlockedDates"
import { updateSlot } from "../service/xiSlots/updateSlots";
import { toast } from "react-toastify";
import { createWeekSlots } from "../service/xiSlots/createWeekSlots";
import { markUnavailableSlots } from "../service/xiSlots/deleteSlot";
import { getDateSlots } from "../service/xiSlots/getDateSlots";
import { getWeekDaySlots } from "../service/xiSlots/getWeekDaySlots"
const useXiSlots = () => {
    const dispatch = useDispatch()
    // Get blocked dates
    const getBlockedDatesOfXi = async () => {
        try {
            dispatch(startBlockedDatesLoading())
            const response = await getXiBlockedDates()
            dispatch(setBlockedDates(response?.data?.data))
        } catch (error) {
            // dispatch(setBlockedDatesError(error))
            //console.log("error", error);
        }
    }

    // To create a slot
    const createSlotOfXi = async (data) => {
        try {
            dispatch(startCreateSlotLoading())
            const response = await createSlot(data)
            dispatch(setCreateSlotData(response?.data?.data))
            toast(`${response?.data?.message}`, 'success');
        } catch (error) {
            //console.log("error", error);
            toast(`${error?.response?.data?.message}`, 'error');
        }
    }

    // To get today slots
    const getTodaySlotsOfXi = async () => {
        try {
            dispatch(startGetTodaySlotsLoading())
            const response = await getBookedSlotsToday()
            dispatch(setGetTodaySlotsData(response?.data?.data))
        } catch (error) {
            // dispatch(setGetTodaySlotsError(error))
            //console.log("error", error);
        }
    }

    // To delete slots
    const deleteSlot = async (slotId) => {
        try {
            const res = await deleteSlots(slotId);
            if (res?.data?.success === true) {
                toast('Slot deleted successfully!', 'success');
                const month = new Date().getMonth() + 1;
                const year = new Date().getFullYear();
                await getSlotsByMonth(month, year);
            }
        } catch (error) {
            // toast('Slot not deleted successfully!', 'error');
            toast(`${error?.response?.data?.message}`, 'error');
            ////console.log("error", error);

        }
    }

    const markUnavailable = async (unavailableDate) => {
        try {
            const res = await markUnavailableSlots(unavailableDate);
            if (res?.data?.success === true) {
                const month = new Date().getMonth() + 1;
                const year = new Date().getFullYear();
                await getSlotsByMonth(month, year);
            }
        } catch (error) {
            ////console.log("error", error);
            toast(`${error?.response?.data?.message}`, 'error');

        }
    }

    // To get slots by month
    const getSlotsByMonth = async (month, year) => {
        try {
            dispatch(startGetMonthlySlotsLoading())
            const response = await getSlotByMonth(month, year)
            dispatch(getMonthlySlotsData(response?.data?.data))
        } catch (error) {
            dispatch(getMonthlySlotsError(error))
        }
    }

    // To get weekly slots

    const getWeeklySlotsOfXi = async (week, month, year) => {
        try {
            dispatch(startGetWeeklySlotsLoading())
            const response = await getBookedSlotsWeekly(week, month, year)
            dispatch(setGetWeeklySlotsData(response?.data?.data))
        } catch (error) {
            // dispatch(setGetWeeklySlotsError(error))
            dispatch(setGetWeeklySlotsData([]))
        }
    }

    // To update blocked dates

    const updateBlockedDatesOfXi = async (data) => {
        try {
            const response = await updateBlockedDates(data)
            // dispatch(setBlockedDates(response?.data?.data))
            if (response?.data?.success === true) {
                if (response?.data?.slotAvailableMessage) {
                    toast(`${response?.data?.slotAvailableMessage}`, "error")
                }
                if (response?.data?.acceptedMessage) {
                    toast(`${response?.data?.acceptedMessage}`, "error")
                }
                await getBlockedDatesOfXi()
            }
        } catch (error) {
            //console.log("error", error);
        }
    }

    // To update slots
    const updateSlotsOfXi = async (data) => {
        try {
            const response = await updateSlot(data)
            if (response && response?.status === 200) {
                const month = new Date().getMonth() + 1;
                const year = new Date().getFullYear();
                await getSlotsByMonth(month, year);
                toast('Slots updated successfully!', 'success');
            }

        } catch (error) {
            toast('Slots not updated successfully!', 'error');
            //console.log("error", error);
        }
    }

    // To create weekly slots
    const createWeeklySlotsOfXi = async (data) => {
        try {
            dispatch(startCreateSlotLoading())
            const response = await createWeekSlots(data)
            dispatch(setCreateSlotData(response?.data?.data))
            toast(`${response?.data?.message}`, 'success');
        }

        catch (error) {
            toast(`${error?.response?.data?.message}`, 'error');
        }
    }

    // To set the weeks and months

    const handleSetCurrentWeek = (weekNumber) => {
        dispatch(setCurrentWeek(weekNumber))
    }

    const handleSetCurrentMonth = (month) => {
        dispatch(setCurrentMonth(month))
    }

    const handleSetCurrentYear = (year) => {
        dispatch(setCurrentYear(year))
    }
    setCurrentMonth
    const handleMonth = (month) => {
        dispatch(setMonth(month))
    }

    // To get for a partuicular date

    const handleGetDateSlots = async (date) => {
        try {
            dispatch(getDateSlotLoading(true))
            const response = await getDateSlots(date)
            if (response?.status === 200) {
                dispatch(getDateSlot(response?.data?.data))
                dispatch(getDateSlotLoading(false))
            }
        } catch (error) {
            dispatch(getDateSlotLoading(false))
            dispatch(getDateSlot([]))
            // toast(`${error?.response?.data?.message}`, 'error');
        }
    }

    const handleWeekSlots = async (date) => {
        try {
            dispatch(getWeekSlotLoading(true))
            const response = await getWeekDaySlots(date)
            if (response?.status === 200) {
                dispatch(getWeekSlot(response?.data?.data))
                dispatch(getWeekSlotLoading(false))
            }
        } catch (error) {
            dispatch(getWeekSlotLoading(false))
            dispatch(getWeekSlot([]))
        }
    }

    return {
        getBlockedDatesOfXi, createSlotOfXi, getTodaySlotsOfXi, getSlotsByMonth, deleteSlot, markUnavailable, getWeeklySlotsOfXi, updateBlockedDatesOfXi, updateSlotsOfXi, createWeeklySlotsOfXi
        , handleSetCurrentWeek, handleSetCurrentMonth, handleSetCurrentYear, handleMonth, handleGetDateSlots, handleWeekSlots
    }
}

export default useXiSlots