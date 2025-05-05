import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    //create list data
    createListData: null,
    isCreateListDataLoading: false,
    createListDataError: null,

    //get list by job id
    listDataByJobId: null,
    isListDataByJobIdLoading: false,
    listDataByJobIdError: null,
};

const listSlice = createSlice({
    name: "listSlice",
    initialState,
    reducers: {
        //create list
        startCreateListDataLoading: (state) => {
            state.isCreateListDataLoading = true;
            state.createListDataError = null;
        },
        getCreateListDataSuccess: (state, { payload }) => {
            state.isCreateListDataLoading = false;
            state.createListData = payload;
        },
        getCreateListDataError: (state, { payload }) => {
            state.isCreateListDataLoading = false;
            state.createListDataError = payload;
        },

        //get list by job id
        startListDataByJobIdLoading: (state) => {
            state.isListDataByJobIdLoading = true;
            state.listDataByJobIdError = null;
        },
        getListDataByJobIdSuccess: (state, { payload }) => {
            state.isListDataByJobIdLoading = false;
            state.listDataByJobId = payload;
        },
        getListDataByJobIdError: (state, { payload }) => {
            state.isListDataByJobIdLoading = false;
            state.listDataByJobIdError = payload;
        },
    },
});

export default listSlice.reducer;
export const {
    startCreateListDataLoading,
    getCreateListDataSuccess,
    getCreateListDataError,
    startListDataByJobIdLoading,
    getListDataByJobIdSuccess,
    getListDataByJobIdError } = listSlice.actions;
