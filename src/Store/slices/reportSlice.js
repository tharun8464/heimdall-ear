import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  psychDetailsData: null,
  isGetPsychDetailsLoading: false,
  getPsychDetailsError: null,

  cultDetailsData: null,
  isGetCultDetailsLoading: false,
  getCultDetailsError: null,

  vmProData:null,
  isGetVmProLoading: false,
  getVmProError:null,

  cultHireData: null,
  isGetCultHireLoading: false,
  getCultHireError: null,

  cultExpData: null,
  isGetCultExpLoading: false,
  getCultExpError: null,

  cultTileData: null,
  isGetCultTileLoading: false,
  getCultTileError: null,

  feedbacksData: null,
  isGetFeedbackLoading: false,
  getFeedbackError: null,

  // List details
  isListDataLoading : false,
  listDataError : null,
  listData : null
};

const reportSlice = createSlice({
  name: "reportSlice",
  initialState,
  reducers: {


    startGetPsychDetailsLoading: (state) => {
      state.isGetPsychDetailsLoading = true;
      state.getPsychDetailsError = null; // Clear any previous errors
    },
    getPsychDetailsSuccess: (state, { payload }) => {
      state.isGetPsychDetailsLoading = false;
      state.psychDetailsData = payload;
    },
    getPsychDetailsError: (state, { payload }) => {
      state.isGetPsychDetailsLoading = false;
      state.getPsychDetailsError = payload;
    },



    startGetCultDetailsLoading: (state) => {
      state.isGetCultDetailsLoading = true;
      state.getCultDetailsError = null; // Clear any previous errors
    },
    getCultDetailsSuccess: (state, { payload }) => {
      state.isGetCultDetailsLoading = false;
      state.cultDetailsData = payload;
    },
    getCultDetailsError: (state, { payload }) => {
      state.isGetCultDetailsLoading = false;
      state.getCultDetailsError = payload;
    },



    startGetVmProLoading: (state) => {
      state.isGetVmProLoading = true;
      state.getVmProError = null; // Clear any previous errors
    },
    getVmProSuccess: (state, { payload }) => {
      state.isGetVmProLoading = false;
      state.vmProData = payload;
    },
    getVmProError: (state, { payload }) => {
      state.isGetVmProLoading= false;
      state.getVmProError = payload;
    },



    startGetCultHireLoading: (state) => {
      state.isGetCultHireLoading = true;
      state.getCultHireError = null; // Clear any previous errors
    },
    getCultHireSuccess: (state, { payload }) => {
      state.isGetCultHireLoading = false;
      state.cultHireData = payload;
    },
    getCultHireError: (state, { payload }) => {
      state.isGetCultHireLoading = false;
      state.getCultHireError = payload;
    },


    startGetCultExpLoading: (state) => {
      state.isGetCultExpLoading = true;
      state.getCultExpError = null; // Clear any previous errors
    },
    getCultExpSuccess: (state, { payload }) => {
      state.isGetCultExpLoading = false;
      state.cultExpData = payload;
    },
    getCultExpError: (state, { payload }) => {
      state.isGetCultExpLoading = false;
      state.getCultExpError = payload;
    },


    startGetCultTileLoading: (state) => {
      state.isGetCultTileLoading = true;
      state.getCultTileError = null; // Clear any previous errors
    },
    getCultTileSuccess: (state, { payload }) => {
      state.isGetCultTileLoading = false;
      state.cultTileData = payload;
    },
    getCultTileError: (state, { payload }) => {
      state.isGetCultTileLoading = false;
      state.getCultTileError = payload;
    },

    startGetFeedbackLoading: (state) => {
      state.isGetFeedbackLoading = true;
      state.getFeedbackError = null; // Clear any previous errors
    },
    getFeedbackSuccess: (state, { payload }) => {
      state.isGetFeedbackLoading = false;
      state.feedbacksData = payload;
    },
    getFeedbackError: (state, { payload }) => {
      state.isGetFeedbackLoading = false;
      state.getFeedbackError = payload;
    },

    // List details
    startListDataLoading: (state) => {
      state.isListDataLoading = true;
      state.listDataError = null; // Clear any previous errors
    },
    listDataSuccess: (state, { payload }) => {
      state.isListDataLoading = false;
      state.listData = payload;
    },
    listDataError: (state, { payload }) => {
      state.isListDataLoading = false;
      state.listDataError = payload;
    },

  },
});

export default reportSlice.reducer;
export const { startGetPsychDetailsLoading, getPsychDetailsSuccess, getPsychDetailsError,  startGetCultDetailsLoading, getCultDetailsSuccess,  getCultDetailsError, startGetVmProLoading, getVmProSuccess, getVmProError, startGetCultHireLoading, getCultHireSuccess,  getCultHireError, startGetCultExpLoading, getCultExpSuccess,  getCultExpError, startGetCultTileLoading, getCultTileSuccess,  getCultTileError, startGetFeedbackLoading, getFeedbackSuccess, getFeedbackError , startListDataLoading, listDataSuccess, listDataError } =
  reportSlice.actions;
