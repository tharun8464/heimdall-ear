import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  podData: null,
  allPodsData: null,
  podsDataByCompanyId: null,
  selectedPodsData: null,
  isDeletePodLoading: false,
  isUpdatePodLoading: false,
  isGetPodByIdLoading: false,
  isGetAllPodsLoading: false,
  isGetPodsByCompanyIdLoading: false,
  isCreatePodLoading: false,
  isSelectCreatePodLoading: false,
  podError: null,
  // Updated pod
  updatedPod: null
};

const podSlice = createSlice({
  name: "podSlice",
  initialState,
  reducers: {
    // Delete Pod
    startDeletePodLoading: (state) => {
      state.isDeletePodLoading = true;
      state.podError = null;
    },
    deletePodSuccess: (state) => {
      state.isDeletePodLoading = false;
      // Optionally update state if needed
    },
    deletePodError: (state, { payload }) => {
      state.isDeletePodLoading = false;
      state.podError = payload;
    },

    // Update Pod
    startUpdatePodLoading: (state) => {
      state.isUpdatePodLoading = true;
      state.podError = null;
    },
    updatePodSuccess: (state, action) => {
      state.isUpdatePodLoading = false;
      // Optionally update state if needed
      state.updatedPod = action.payload
    },
    updatePodError: (state, { payload }) => {
      state.isUpdatePodLoading = false;
      state.podError = payload;
    },

    // Get Pod by ID
    startGetPodByIdLoading: (state) => {
      state.isGetPodByIdLoading = true;
      state.podError = null;
    },
    getPodByIdSuccess: (state, { payload }) => {
      state.isGetPodByIdLoading = false;
      state.podData = payload;
    },
    getPodByIdError: (state, { payload }) => {
      state.isGetPodByIdLoading = false;
      state.podError = payload;
    },

    // Get Pod by company ID
    startGetPodsByCompanyIdLoading: (state) => {
      state.isGetPodsByCompanyIdLoading = true;
      state.podError = null;
    },
    getPodsByCompanyIdSuccess: (state, { payload }) => {
      state.isGetPodsByCompanyIdLoading = false;
      state.podsDataByCompanyId = payload;
    },
    getPodsByCompanyIdError: (state, { payload }) => {
      state.isGetPodsByCompanyIdLoading = false;
      state.podError = payload;
    },

    // Get All Pods
    startGetAllPodsLoading: (state) => {
      state.isGetAllPodsLoading = true;
      state.podError = null;
    },
    getAllPodsSuccess: (state, { payload }) => {
      state.isGetAllPodsLoading = false;
      state.allPodsData = payload;
    },
    getAllPodsError: (state, { payload }) => {
      state.isGetAllPodsLoading = false;
      state.podError = payload;
    },

    // Create Pod
    startCreatePodLoading: (state) => {
      state.isCreatePodLoading = true;
      state.podError = null;
    },
    createPodSuccess: (state) => {
      state.isCreatePodLoading = false;
      // Optionally update state if needed
    },
    createPodError: (state, { payload }) => {
      state.isCreatePodLoading = false;
      state.podError = payload;
    },

    //Select Create Pod
    startSelectCreatePodLoading: (state) => {
      state.isSelectCreatePodLoading = true;
      state.podError = null;
    },
    selectCreatePodSuccess: (state) => {
      state.isSelectCreatePodLoading = false;
    },
    selectCreatePodError: (state, { payload }) => {
      state.isSelectCreatePodLoading = false;
      state.podError = payload;
    }
  },
});



export default podSlice.reducer;
export const {
  startDeletePodLoading,
  deletePodSuccess,
  deletePodError,
  startUpdatePodLoading,
  updatePodSuccess,
  updatePodError,
  startGetPodByIdLoading,
  getPodByIdSuccess,
  getPodByIdError,
  startGetPodsByCompanyIdLoading,
  getPodsByCompanyIdSuccess,
  getPodsByCompanyIdError,
  startGetAllPodsLoading,
  getAllPodsSuccess,
  getAllPodsError,
  startCreatePodLoading,
  createPodSuccess,
  createPodError,
  startSelectCreatePodLoading,
  selectCreatePodSuccess,
  selectCreatePodError
} = podSlice.actions;
