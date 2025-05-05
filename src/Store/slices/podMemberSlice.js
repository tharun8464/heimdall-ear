import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCreatePodMemberLoading: false,
  podMemberError: null,

  isGetAllPodMembersLoading: false, // New loading state for getAllPodMembers
  allPodMembersData: null, // New state to store data from getAllPodMembers

  isUpdatePodMemberTagLoading: false, // New loading state
  updatePodMemberTagError: null,

  isUpdatePodMemberWeightageLoading: false, // New loading state
  updatePodMemberWeightageError: null, // New error state

  isFilterPodMembersLoading: false,
  filterPodMembersError: null,
  filteredPodMemberByNameData: null,

  isDeletePodMemberLoading: false,
  deletePodMemberError: null,

  isUpdatePodMemeberLoading:false,
  updatePodMemberError:null,
};

const podMemberSlice = createSlice({
  name: "podMemberSlice",
  initialState,
  reducers: {
    startCreatePodMemberLoading: (state) => {
      state.isCreatePodMemberLoading = true;
      state.podMemberError = null;
    },
    createPodMemberSuccess: (state, { payload }) => {
      state.isCreatePodMemberLoading = false;
    },
    createPodMemberError: (state, { payload }) => {
      state.isCreatePodMemberLoading = false;
      state.podMemberError = payload;
    },

    // New reducers for getAllPodMembers
    startGetAllPodMembersLoading: (state) => {
      state.isGetAllPodMembersLoading = true;
      state.podMemberError = null; // Reset error state
    },
    getAllPodMembersSuccess: (state, { payload }) => {
      state.isGetAllPodMembersLoading = false;
      state.allPodMembersData = payload;
    },
    getAllPodMembersError: (state, { payload }) => {
      state.isGetAllPodMembersLoading = false;
      state.podMemberError = payload;
    },

    //
    startUpdatePodMemberTagLoading: (state) => {
      state.isUpdatePodMemberTagLoading = true;
      state.updatePodMemberTagError = null; // Clear any previous errors
    },
    updatePodMemberTagSuccess: (state, { payload }) => {
      state.isUpdatePodMemberTagLoading = false;
      state.podMemberData = payload;
    },
    updatePodMemberTagError: (state, { payload }) => {
      state.isUpdatePodMemberTagLoading = false;
      state.updatePodMemberTagError = payload;
    },

    // New reducer for updating pod member weightage
    startUpdatePodMemberWeightageLoading: (state) => {
      state.isUpdatePodMemberWeightageLoading = true;
      state.updatePodMemberWeightageError = null; // Clear any previous errors
    },
    updatePodMemberWeightageSuccess: (state, { payload }) => {
      state.isUpdatePodMemberWeightageLoading = false;
    },
    updatePodMemberWeightageError: (state, { payload }) => {
      state.isUpdatePodMemberWeightageLoading = false;
      state.updatePodMemberWeightageError = payload;
    },

    //
    startFilterPodMembersLoading: (state) => {
      state.isFilterPodMembersLoading = true;
      state.filterPodMembersError = null;
    },
    filterPodMembersSuccess: (state, { payload }) => {
      state.isFilterPodMembersLoading = false;
      state.filteredPodMemberByNameData = payload;
    },
    filterPodMembersError: (state, { payload }) => {
      state.isFilterPodMembersLoading = false;
      state.filterPodMembersError = payload;
    },

    // New reducer for deleting a pod member
    startDeletePodMemberLoading: (state) => {
      state.isDeletePodMemberLoading = true;
      state.deletePodMemberError = null;
    },
    deletePodMemberSuccess: (state) => {
      state.isDeletePodMemberLoading = false;
      // Optionally update state if needed
    },
    deletePodMemberError: (state, { payload }) => {
      state.isDeletePodMemberLoading = false;
      state.deletePodMemberError = payload;
    },

    // New reducer for update the pod member
    startUpdatePodMemberLoading: (state) => {
      state.isUpdatePodMemeberLoading = true;
      state.updatePodMemberError = null;
    },
    updatePodMemberSuccess: (state) => {
      state.isUpdatePodMemeberLoading = false;
      // Optionally update state if needed
    },
    updatePodMemberError: (state, { payload }) => {
      state.isUpdatePodMemeberLoading = false;
      state.updatePodMemberError = payload;
    },
  },
});

export default podMemberSlice.reducer;

export const {
  startCreatePodMemberLoading,
  createPodMemberSuccess,
  createPodMemberError,
  startGetAllPodMembersLoading,
  getAllPodMembersSuccess,
  getAllPodMembersError,
  startUpdatePodMemberTagLoading,
  updatePodMemberTagSuccess,
  updatePodMemberTagError,
  startUpdatePodMemberWeightageLoading,
  updatePodMemberWeightageSuccess,
  updatePodMemberWeightageError,
  startFilterPodMembersLoading,
  filterPodMembersSuccess,
  filterPodMembersError,
  startDeletePodMemberLoading,
  deletePodMemberSuccess,
  deletePodMemberError,
  startUpdatePodMemberLoading,
  updatePodMemberSuccess,
  updatePodMemberError
} = podMemberSlice.actions;
