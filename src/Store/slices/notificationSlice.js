import {createSlice } from "@reduxjs/toolkit";

const initialState = {
    notificationData: null,
    isNotificationLoading: false,
    notificationError: null,
};

const notificationSlice = createSlice({
    name: "notificationSlice",
    initialState,
    reducers: {
        getNotificationDataLoading: state => {
            state.isNotificationLoading = true;
        },
        getNotificationDataSuccess: (state, action) => {
            state.isNotificationLoading = false;
            state.notificationData = action.payload;
        },
        getNotificationDataFailure: (state, action) => {
            state.isNotificationLoading = false;
            state.notificationError = action.payload;
        },
    }
})

export const { getNotificationDataLoading, getNotificationDataSuccess, getNotificationDataFailure } = notificationSlice.actions;
export default notificationSlice.reducer