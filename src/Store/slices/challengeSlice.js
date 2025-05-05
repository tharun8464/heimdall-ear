import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userChallengeData: null,
  isGetChallengeByIdLoading: false,
  allChallengesData: null,
  isGetAllChallengesLoading: false,
  isCreateChallengeLoading: false,
  isUpdateChallengeLoading: false,
  isDeleteChallengeLoading: false,
  gameData: null,
  isAddGameDataLoading: false,
  isUpdateGameDataLoading: false, // New state for updating game data
  isDeleteGameDataLoading: false, // New state for deleting game data
  error: null,
};

const challengeSlice = createSlice({
  name: "challengeSlice",
  initialState,
  reducers: {
    // get challenge by id
    startGetChallengeByIdLoading: (state) => {
      state.isGetChallengeByIdLoading = true;
    },
    getChallengeByIdSuccess: (state, { payload }) => {
      state.isGetChallengeByIdLoading = false;
      state.userChallengeData = payload;
    },
    getChallengeByIdError: (state, { payload }) => {
      state.isGetChallengeByIdLoading = false;
      state.error = payload;
    },
    // all challenge
    startGetAllChallengesLoading: (state) => {
      state.isGetAllChallengesLoading = true;
    },
    getAllChallengesSuccess: (state, { payload }) => {
      state.isGetAllChallengesLoading = false;
      state.allChallengesData = payload;
    },
    getAllChallengesError: (state, { payload }) => {
      state.isGetAllChallengesLoading = false;
      state.error = payload;
    },
    // create challenge
    startCreateChallengeLoading: (state) => {
      state.isCreateChallengeLoading = true;
    },
    createChallengeSuccess: (state) => {
      state.isCreateChallengeLoading = false;
    },
    createChallengeError: (state, { payload }) => {
      state.isCreateChallengeLoading = false;
      state.error = payload;
    },
    // update challenge by id
    startUpdateChallengeLoading: (state) => {
      state.isUpdateChallengeLoading = true;
    },
    updateChallengeSuccess: (state) => {
      state.isUpdateChallengeLoading = false;
      // Optionally update state if needed
    },
    updateChallengeError: (state, { payload }) => {
      state.isUpdateChallengeLoading = false;
      state.error = payload;
    },
    // delete challenge by id
    startDeleteChallengeLoading: (state) => {
      state.isDeleteChallengeLoading = true;
    },
    deleteChallengeSuccess: (state) => {
      state.isDeleteChallengeLoading = false;
      // Optionally update state if needed
    },
    deleteChallengeError: (state, { payload }) => {
      state.isDeleteChallengeLoading = false;
      state.error = payload;
    },
    // add game data
    startAddGameDataLoading: (state) => {
      state.isAddGameDataLoading = true;
    },
    addGameDataSuccess: (state, { payload }) => {
      state.isAddGameDataLoading = false;
      state.gameData = payload;
    },
    addGameDataError: (state, { payload }) => {
      state.isAddGameDataLoading = false;
      state.error = payload;
    },

    // update game data
    startUpdateGameDataLoading: (state) => {
      state.isUpdateGameDataLoading = true;
    },
    updateGameDataSuccess: (state, { payload }) => {
      state.isUpdateGameDataLoading = false;
      state.gameData = payload; // Update game data
    },
    updateGameDataError: (state, { payload }) => {
      state.isUpdateGameDataLoading = false;
      state.error = payload;
    },

    // delete game data
    startDeleteGameDataLoading: (state) => {
      state.isDeleteGameDataLoading = true;
    },
    deleteGameDataSuccess: (state) => {
      state.isDeleteGameDataLoading = false;
      state.gameData = null; // Clear game data when deleted
    },
    deleteGameDataError: (state, { payload }) => {
      state.isDeleteGameDataLoading = false;
      state.error = payload;
    },
  },
});

export default challengeSlice.reducer;
export const {
  startGetChallengeByIdLoading,
  getChallengeByIdError,
  getChallengeByIdSuccess,
  startGetAllChallengesLoading,
  getAllChallengesError,
  getAllChallengesSuccess,
  startCreateChallengeLoading,
  createChallengeError,
  createChallengeSuccess,
  startUpdateChallengeLoading,
  updateChallengeError,
  updateChallengeSuccess,
  startDeleteChallengeLoading,
  deleteChallengeError,
  deleteChallengeSuccess,
  startAddGameDataLoading,
  addGameDataError,
  addGameDataSuccess,
  startUpdateGameDataLoading,
  updateGameDataError,
  updateGameDataSuccess,
  startDeleteGameDataLoading,
  deleteGameDataError,
  deleteGameDataSuccess,
} = challengeSlice.actions;
