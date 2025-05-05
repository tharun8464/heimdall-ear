import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listOfGames: null,
  isGetListOfGamesLoading: false,
  isGetReportLoading: false,
  candidateReport: null,
  error: null,
};

const cognitionSlice = createSlice({
  name: "cognitionSlice",
  initialState,
  reducers: {
    startListOfGamesLoading: (state) => {
      state.isGetListOfGamesLoading = true;
    },
    getListOfGamesSuccess: (state, { payload }) => {
      state.isGetListOfGamesLoading = false;
      state.listOfGames = payload;
    },
    getListOfGamesError: (state, { payload }) => {
      state.isGetListOfGamesLoading = false;
      state.error = payload;
    },
    startGetReportLoading: (state) => {
      state.isGetReportLoading = true;
    },
    getReportSuccess: (state, { payload }) => {
      state.isGetReportLoading = false;
      state.candidateReport = payload;
    },
    getReportError: (state, { payload }) => {
      state.isGetReportLoading = false;
      state.error = payload;
    },
  },
});

export default cognitionSlice.reducer;
export const {
  startListOfGamesLoading,
  getListOfGamesError,
  getListOfGamesSuccess,
  startGetReportLoading,
  getReportSuccess,
  getReportError,
} = cognitionSlice.actions;
