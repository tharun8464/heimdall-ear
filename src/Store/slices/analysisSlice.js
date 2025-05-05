import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  analysisData: null,
  isAnalysisLoading: false,
  analysisError: null,
};

const analysisSlice = createSlice({
  name: "analysisSlice",
  initialState,
  reducers: {
    startAnalysisLoading: (state) => {
      state.isAnalysisLoading = true;
      state.analysisError = null; // Clear any previous errors
    },
    analysisSuccess: (state, { payload }) => {
      state.isAnalysisLoading = false;
      state.analysisData = payload;
      state.analysisError = null; // Clear any previous errors
    },
    analysisError: (state, { payload }) => {
      state.isAnalysisLoading = false;
      state.analysisError = payload;
    },
  },
});

export default analysisSlice.reducer;
export const { startAnalysisLoading, analysisSuccess, analysisError } =
  analysisSlice.actions;
