import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Existing state properties
  isCreateWeightageLoading: false,
  createWeightageError: null,

  isUpdateWeightageFlagLoading: false,
  updateWeightageFlagError: null,
  // New state properties for getAllWeightages
  weightageData: null,
  isGetAllWeightagesLoading: false,
  getAllWeightagesError: null,
};

const weightageSlice = createSlice({
  name: "weightageSlice",
  initialState,
  reducers: {
    // Existing reducers
    startCreateWeightageLoading: (state) => {
      state.isCreateWeightageLoading = true;
    },
    createWeightageSuccess: (state, { payload }) => {
      state.isCreateWeightageLoading = false;
    },
    createWeightageError: (state, { payload }) => {
      state.isCreateWeightageLoading = false;
      state.createWeightageError = payload;
    },

    // Reducers for getAllWeightages
    startGetAllWeightagesLoading: (state) => {
      state.isGetAllWeightagesLoading = true;
    },
    getAllWeightagesSuccess: (state, { payload }) => {
      state.isGetAllWeightagesLoading = false;
      state.weightageData = payload;
    },
    getAllWeightagesError: (state, { payload }) => {
      state.isGetAllWeightagesLoading = false;
      state.getAllWeightagesError = payload;
    },

    //update weightage flag
    startUpdateWeightageFlagLoading: (state) => {
      state.isUpdateWeightageFlagLoading = true;
      state.updateWeightageFlagError=null;
    },
    updateWeightageFlagSuccess: (state) => {
      state.isUpdateWeightageFlagLoading = false;
      state.updateWeightageFlagError=null;
    },
    updateWeightageFlagError: (state, { payload }) => {
      state.isUpdateWeightageFlagLoading = false;
      state.updateWeightageFlagError= payload;
    },
  },
});

export default weightageSlice.reducer;
export const {
  // Existing actions
  startUpdateWeightageFlagLoading,
  updateWeightageFlagSuccess,
  updateWeightageFlagError,
  startCreateWeightageLoading,
  createWeightageSuccess,
  createWeightageError,
  getAllWeightagesError,
  getAllWeightagesSuccess,
  startGetAllWeightagesLoading
} = weightageSlice.actions;
