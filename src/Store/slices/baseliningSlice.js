import { createSlice } from "@reduxjs/toolkit";
import { move } from "formik";

const initialState = {
  loading: false,
  heimdallToken: null,

  faceDetectionData: null,
  gazeDetectionData: null,
  earpieceDetectionData: null,
  error: null,

  faceDetectionLoading: false,
  gazeDetectionLoading: false,
  earpieceDetectionLoading: false,
  personDetectionLoading: false,

  movementDetectionLoading: false,
  movementDetectionData: null,

  personDetectionData: null,
  liveStatus: null,
  interviewMeetingId: null,
};

const baseliningSlice = createSlice({
  name: "baseliningSlice",
  initialState,
  reducers: {
    startBaseliningLoading: state => {
      state.loading = true;
    },
    // token
    getHeimdallTokenSuccess: (state, { payload }) => {
      state.loading = false;
      state.heimdallToken = payload;
    },
    getHeimdallTokenError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // face detection
    startFaceDetectionLoading: state => {
      state.faceDetectionLoading = true;
    },
    faceDetectionSuccess: (state, { payload }) => {
      state.faceDetectionLoading = false;
      state.faceDetectionData = payload;
    },
    faceDetectionError: (state, { payload }) => {
      state.faceDetectionLoading = false;
      state.error = payload;
    },
    // gaze detection
    startGazeDetectionLoading: state => {
      state.gazeDetectionLoading = true;
    },
    gazeDetectionSuccess: (state, { payload }) => {
      //console.log("payload:", payload);
      state.gazeDetectionLoading = false;
      state.gazeDetectionData = payload;
    },
    gazeDetectionError: (state, { payload }) => {
      state.gazeDetectionLoading = false;
      state.error = payload;
    },
    // earpiece detection
    startEarpieceDetectionLoading: state => {
      state.earpieceDetectionLoading = true;
    },
    earpieceDetectionSuccess: (state, { payload }) => {
      //console.log("payload:", payload);
      state.earpieceDetectionLoading = false;
      state.earpieceDetectionData = payload;
    },
    earpieceDetectionError: (state, { payload }) => {
      state.earpieceDetectionLoading = false;
      state.error = payload;
    },
    // person detection
    startPersonDetectionLoading: state => {
      state.personDetectionLoading = true;
    },
    personDetectionSuccess: (state, { payload }) => {
      state.personDetectionLoading = false;
      state.personDetectionData = payload;
    },
    personDetectionError: (state, { payload }) => {
      state.personDetectionLoading = false;
      state.error = payload;
    },
    // update baselining
    startUpdateBaseliningLoading: state => {
      state.updateBaseliningLoading = true;
    },
    updateBaseliningSuccess: (state, { payload }) => {
      state.updateBaseliningLoading = false;
    },
    updateBaseliningError: (state, { payload }) => {
      state.updateBaseliningLoading = false;
    },
    // interview live status
    startGetLiveStatusLoading: state => {
      state.isGetLiveStatusLoading = true;
      state.getLiveStatusError = null; // Clear any previous errors
    },
    getLiveStatusSuccess: (state, { payload }) => {
      state.isGetLiveStatusLoading = false;
      state.liveStatus = payload;
      state.getLiveStatusError = null; // Clear any previous errors
    },
    getLiveStatusError: (state, { payload }) => {
      state.isGetLiveStatusLoading = false;
      state.getLiveStatusError = payload;
    },
    setInterviewMeetingId: (state, { payload }) => {
      state.interviewMeetingId = payload;
    },
    setMovementDetectionSuccess: (state, { payload }) => {
      state.earpieceDetectionLoading = false;
      state.movementDetectionData = payload;
    },
    setMovementDetectionError: (state, { payload }) => {
      state.earpieceDetectionLoading = false;
      state.error = payload;
    },
    setMovementDetectionLoading: (state, { payload }) => {
      state.movementDetectionLoading = payload;
    }
  },
});

export const {
  startBaseliningLoading,
  getHeimdallTokenError,
  getHeimdallTokenSuccess,
  startFaceDetectionLoading,
  faceDetectionSuccess,
  faceDetectionError,
  gazeDetectionSuccess,
  gazeDetectionError,
  startGazeDetectionLoading,
  startEarpieceDetectionLoading,
  earpieceDetectionSuccess,
  earpieceDetectionError,
  startPersonDetectionLoading,
  personDetectionError,
  personDetectionSuccess,
  startUpdateBaseliningLoading,
  updateBaseliningSuccess,
  updateBaseliningError,
  startGetLiveStatusLoading,
  getLiveStatusSuccess,
  getLiveStatusError,
  setInterviewMeetingId,
  setMovementDetectionLoading,
  setMovementDetectionSuccess,
  setMovementDetectionError,
} = baseliningSlice.actions;
export default baseliningSlice.reducer;
