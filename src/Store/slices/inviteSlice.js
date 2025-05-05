import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // State properties for inviteCandidateForInterview
  isInviteCandidateForInterviewLoading: false,
  inviteCandidateForInterviewError: null,

  isInviteCandidateForCognitiveLoading: false,
  inviteCandidateForCognitiveError: null,

  isInviteCandidateForPsychometryLoading: false,
  inviteCandidateForPsychometryError: null,

  isInviteCandidateForGamifiedPsychometryLoading: false,
  inviteCandidateForGamifiedPsychometryError: null,
};

const inviteSlice = createSlice({
  initialState,
  name: "inviteSlice",
  reducers: {
    // New reducers for inviteCandidateForInterview
    startInviteCandidateForInterviewLoading: state => {
      state.isInviteCandidateForInterviewLoading = true;
      state.inviteCandidateForInterviewError = null; // Clear any previous errors
    },
    inviteCandidateForInterviewSuccess: (state, { payload }) => {
      state.isInviteCandidateForInterviewLoading = false;
      state.inviteCandidateForInterviewError = null; // Clear any previous errors
    },
    inviteCandidateForInterviewError: (state, { payload }) => {
      state.isInviteCandidateForInterviewLoading = false;
      state.inviteCandidateForInterviewError = payload;
    },
    //
    // Reducers for inviteCandidateForCognitive
    startInviteCandidateForCognitiveLoading: state => {
      state.isInviteCandidateForCognitiveLoading = true;
      state.inviteCandidateForCognitiveError = null; // Clear any previous errors
    },
    inviteCandidateForCognitiveSuccess: state => {
      state.isInviteCandidateForCognitiveLoading = false;
      state.inviteCandidateForCognitiveError = null; // Clear any previous errors
    },
    inviteCandidateForCognitiveError: (state, { payload }) => {
      state.isInviteCandidateForCognitiveLoading = false;
      state.inviteCandidateForCognitiveError = payload;
    },

    // Reducers for inviteCandidateForPsychometry
    startInviteCandidateForPsychometryLoading: state => {
      state.isInviteCandidateForPsychometryLoading = true;
      state.inviteCandidateForPsychometryError = null; // Clear any previous errors
    },
    inviteCandidateForPsychometrySuccess: state => {
      state.isInviteCandidateForPsychometryLoading = false;
      state.inviteCandidateForPsychometryError = null; // Clear any previous errors
    },
    inviteCandidateForPsychometryError: (state, { payload }) => {
      state.isInviteCandidateForPsychometryLoading = false;
      state.inviteCandidateForPsychometryError = payload;
    },

    // New reducers for inviteCandidateForGamifiedPsychometry

    startInviteCandidateForGamifiedPsychometryLoading: state => {
      state.isInviteCandidateForGamifiedPsychometryLoading = true;
      state.inviteCandidateForGamifiedPsychometryError = null; // Clear any previous errors
    },

    inviteCandidateForGamifiedPsychometrySuccess: state => {
      state.isInviteCandidateForGamifiedPsychometryLoading = false;
      state.inviteCandidateForGamifiedPsychometryError = null; // Clear any previous errors
    },

    inviteCandidateForGamifiedPsychometryError: (state, { payload }) => {
      state.isInviteCandidateForGamifiedPsychometryLoading = false;
      state.inviteCandidateForGamifiedPsychometryError = payload;
    },
  },
});

export const {
  // Actions for inviteCandidateForCognitive
  startInviteCandidateForCognitiveLoading,
  inviteCandidateForCognitiveSuccess,
  inviteCandidateForCognitiveError,

  // Actions for inviteCandidateForPsychometry
  startInviteCandidateForPsychometryLoading,
  inviteCandidateForPsychometrySuccess,
  inviteCandidateForPsychometryError,
  // New actions for inviteCandidateForInterview
  startInviteCandidateForInterviewLoading,
  inviteCandidateForInterviewSuccess,
  inviteCandidateForInterviewError,

  // New actions for inviteCandidateForGamifiedPsychometry
  startInviteCandidateForGamifiedPsychometryLoading,
  inviteCandidateForGamifiedPsychometrySuccess,
  inviteCandidateForGamifiedPsychometryError,
} = inviteSlice.actions;

export default inviteSlice.reducer;
