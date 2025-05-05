import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // For blocked date
    blockedDatesLoading: false,
    blockedDates: null,
    blockedDatesError: null,

    // To create a slot
    createSlotLoading: false,
    createSlotError: null,
    createSlotData: null,

    // To get today's Slots
    getTodaySlotsLoading: false,
    getTodaySlotsData: null,
    getTodaySlotsError: null,

    // To get monthly Slots
    getMonthlySlotsLoading: false,
    monthlySlotsData: null,
    getMonthlySlotsError: null,

    // To delete Slots
    //getMonthlySlotsLoading: false,
    //monthlySlotsData: null,
    //getMonthlySlotsError: null,
  
   // To get weekly slots
    getWeeklySlotsLoading: false,
    getWeeklySlotsData: null,
    getWeeklySlotsError: null,

    // For week and month
    currentWeek : null,
    month : null,
    currentMonth : null,
    currentYear : null,

    // For a particular date
    dateSlotLoading : false,
    dateSlot : [],
    dateSlotError : null,

    // For a particular week
    weekSlotLoading : false,
    weekSlot : [],
    weekSlotError : null

}

const xiSlotsSlice = createSlice({
    name: "xiSlotsSlice",
    initialState,
    reducers: {
        // Blocked dates

        startBlockedDatesLoading: (state) => {
            state.blockedDatesLoading = true;
        },

        setBlockedDates: (state, action) => {
            state.blockedDates = action.payload
            state.blockedDatesLoading = false

        },

        setBlockedDatesError: (state, action) => {
            state.blockedDatesError = action.payload
        },

        // To create a slot

        startCreateSlotLoading: (state) => {
            state.createSlotLoading = true;
        },

        setCreateSlotData: (state, action) => {
            state.createSlotData = action.payload
            state.createSlotLoading = false
        },

        setCreateSlotError: (state, action) => {
            state.createSlotError = action.payload
        },

        // To get today's slots
        startGetTodaySlotsLoading: (state) => {
            state.getTodaySlotsLoading = true;
        },

        setGetTodaySlotsData: (state, action) => {
            state.getTodaySlotsData = action.payload
            state.getTodaySlotsLoading = false
        },

        setGetTodaySlotsError: (state, action) => {
            state.getTodaySlotsError = action.payload
        },

        // To get monthly slots
        startGetMonthlySlotsLoading: (state) => {
            state.getMonthlySlotsLoading = true;
        },

        getMonthlySlotsData: (state, action) => {
            state.monthlySlotsData = action.payload
            state.getMonthlySlotsLoading = false
        },

        getMonthlySlotsError: (state, action) => {
            state.getMonthlySlotsError = action.payload
            state.getMonthlySlotsLoading = false
        },
      
      // To get weekly slots

        startGetWeeklySlotsLoading: (state) => {
            state.getWeeklySlotsLoading = true;
        },

        setGetWeeklySlotsData: (state, action) => {
            state.getWeeklySlotsData = action.payload
            state.getWeeklySlotsLoading = false
        },

        setGetWeeklySlotsError: (state, action) => {
            state.getWeeklySlotsError = action.payload
        },

        // For week and months

        setCurrentWeek: (state, action) => {
            state.currentWeek = action.payload
        },

        setCurrentMonth: (state, action) => {
            state.currentMonth = action.payload
        },

        setCurrentYear: (state, action) => {
            state.currentYear = action.payload
        },

        setMonth : (state, action) => {
            state.month = action.payload
        },

        // For a particular date

        getDateSlotLoading : (state, action) => {
            state.dateSlotLoading = action.payload
        },
        getDateSlot : (state, action) => {
            state.dateSlot = action.payload
        },
        getDateSlotError : (state, action) => {
            state.dateSlotError = action.payload
        },

        // For a particular week
        getWeekSlotLoading : (state, action) => {
            state.weekSlotLoading = action.payload
        },
        getWeekSlot : (state, action) => {
            state.weekSlot = action.payload
        },
        getWeekSlotError : (state, action) => {
            state.weekSlotError = action.payload
        }

    }
})

export const {
    startBlockedDatesLoading,
    setBlockedDates,
    setBlockedDatesError,

    // To create a slot
    startCreateSlotLoading,
    setCreateSlotData,
    setCreateSlotError,

    // To get today's slots
    startGetTodaySlotsLoading,
    setGetTodaySlotsData,
    setGetTodaySlotsError,
  
   // To get weekly slots
    startGetWeeklySlotsLoading,
    setGetWeeklySlotsData,
    setGetWeeklySlotsError,

    startGetMonthlySlotsLoading,
    getMonthlySlotsData,
    getMonthlySlotsError,

    setCurrentWeek,
    setCurrentMonth,
    setCurrentYear,
    setMonth,

    getDateSlotLoading,
    getDateSlot,
    getDateSlotError,

    getWeekSlotLoading,
    getWeekSlot,
    getWeekSlotError
} = xiSlotsSlice.actions
export default xiSlotsSlice.reducer