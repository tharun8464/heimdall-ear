import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  // User details state
  userDetails: null,
  error: null,
  allLanguages: null,

  // Get user details states
  getUserDetailsLoading: false,
  getUserFromIdLoading: false,

  // User Details Without Linkedin
  userDetailsWithoutLinkedinLoading: false,
  userDetailsWithoutLinkedin: null,
  userDetailsWithoutLinkedinError: null,

  // Update user details states
  updateUserDetailsLoading: false,
  updateUserEducationLoading: false,
  updateUserEducationSuccess: null,
  updateUserEducationFailure: null,

  // Add user details states
  addUserEducationLoading: false,
  addUserExperienceLoading: false,
  addUserExperienceSuccess: null,
  addUserExperienceFailure: null,

  // Delete user details states
  deleteUserEducationLoading: false,
  deleteUserEducationSuccess: null,
  deleteUserEducationFailure: null,

  // Add user experience states
  addUserExperienceLoading: false,
  addUserExperienceSuccess: null,
  addUserExperienceFailure: null,

  // Delete user experience states
  deleteUserExperienceLoading: false,
  deleteUserExperienceSuccess: null,
  deleteUserExperienceFailure: null,
  updateUserExperienceLoading: false,

  // Get primary skills states
  getPrimarySkillsLoading: false,
  primarySkills: null,

  // Delete User Resume States
  deleteUserResumeLoading: false,
  deleteUserResumeSuccess: null,
  deleteUserResumeFailure: null,

  userProfileImage: null,
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    // get
    getUserDetailsLoading: state => {
      state.getUserDetailsLoading = true;
      state.error = null;
    },
    getUserDetailsSuccess: (state, action) => {
      state.getUserDetailsLoading = false;
      state.userDetails = action.payload;
    },
    getUserDetailsFailure: (state, action) => {
      state.getUserDetailsLoading = false;
      state.error = action.payload;
    },
    // update
    updateUserDetailsLoading: state => {
      state.updateUserDetailsLoading = true;
      state.error = null;
    },
    updateUserDetailsSuccess: (state, action) => {
      state.updateUserDetailsLoading = false;
      state.userDetails = action.payload;
    },
    updateUserDetailsFailure: (state, action) => {
      state.updateUserDetailsLoading = false;
      state.error = action.payload;
    },
    // get id
    getUserFromIdLoading: state => {
      state.getUserFromIdLoading = true;
      state.error = null;
    },
    getUserFromIdSuccess: (state, action) => {
      state.getUserFromIdLoading = false;
      state.userDetails = action.payload;
    },
    getUserFromIdFailure: (state, action) => {
      state.getUserFromIdLoading = false;
      state.error = action.payload;
    },

    // User Details Without Linkedin
    userDetailsWithoutLinkedinLoading: state => {
      state.userDetailsWithoutLinkedinLoading = true;
    },
    userDetailsWithoutLinkedinSuccess: (state, action) => {
      state.userDetailsWithoutLinkedinLoading = false;
      state.userDetailsWithoutLinkedin = action.payload;
    },
    userDetailsWithoutLinkedinFailure: (state, action) => {
      state.userDetailsWithoutLinkedinLoading = false;
      state.userDetailsWithoutLinkedinError = action.payload;
    },
    // addusereducation
    addUserEducationLoading: (state, action) => {
      state.addUserEducationLoading = true;
    },
    addUserEducationSuccess: (state, action) => {
      state.addUserEducationLoading = false;
    },
    addUserEducationFailure: (state, action) => {
      state.addUserEducationLoading = false;
      state.error = action.payload;
    },
    // adduserexperience
    addUserExperienceLoading: (state, action) => {
      state.addUserExperienceLoading = true;
    },
    addUserExperienceSuccess: (state, action) => {
      state.addUserExperienceLoading = false;
    },
    addUserExperienceFailure: (state, action) => {
      state.addUserExperienceLoading = false;
      state.error = action.payload;
    },
    // delete
    deleteUserEducationLoading: state => {
      state.deleteUserEducationLoading = true;
    },
    deleteUserEducationSuccess: (state, action) => {
      state.deleteUserEducationLoading = false;
      state.userDetails = action.payload;
    },
    deleteUserEducationFailure: (state, action) => {
      state.deleteUserEducationLoading = false;
      state.error = action.payload;
    },
    // update
    updateUserEducationLoading: state => {
      state.updateUserEducationLoading = true;
    },
    updateUserEducationSuccess: (state, action) => {
      state.updateUserEducationLoading = false;
      state.userDetails = action.payload;
    },
    updateUserEducationFailure: (state, action) => {
      state.updateUserEducationLoading = false;
      state.error = action.payload;
    },
    // add
    addUserExperienceLoading: state => {
      state.addUserExperienceLoading = true;
    },
    addUserExperienceSuccess: (state, action) => {
      state.addUserExperienceLoading = false;
      state.userDetails = action.payload;
    },
    addUserExperienceFailure: (state, action) => {
      state.addUserExperienceLoading = false;
      state.error = action.payload;
    },
    // delete
    deleteUserExperienceLoading: state => {
      state.deleteUserExperienceLoading = true;
    },
    deleteUserExperienceSuccess: (state, action) => {
      state.deleteUserExperienceLoading = false;
      state.userDetails = action.payload;
    },
    deleteUserExperienceFailure: (state, action) => {
      state.deleteUserExperienceLoading = false;
      state.error = action.payload;
    },
    // update
    updateUserExperienceLoading: state => {
      state.updateUserExperienceLoading = true;
    },
    updateUserExperienceSuccess: (state, action) => {
      state.updateUserExperienceLoading = false;
      state.userDetails = action.payload;
    },
    updateUserExperienceFailure: (state, action) => {
      state.updateUserExperienceLoading = false;
      state.error = action.payload;
    },
    getPrimarySkillsLoading: state => {
      state.getPrimarySkillsLoading = true;
    },
    getPrimarySkillsSuccess: (state, action) => {
      state.getPrimarySkillsLoading = false;
      state.primarySkills = action.payload;
    },
    getPrimarySkillsFailure: (state, action) => {
      state.getPrimarySkillsLoading = false;
      state.error = action.payload;
    },
    addSkillLoading: state => {
      state.addSkillLoading = true;
    },
    addSkillSuccess: (state, action) => {
      state.addSkillLoading = false;
      state.userDetails = action.payload;
    },
    addSkillFailure: (state, action) => {
      state.addSkillLoading = false;
      state.error = action.payload;
    },
    deleteSkillLoading: state => {
      state.deleteSkillLoading = true;
    },
    deleteSkillSuccess: (state, action) => {
      state.deleteSkillLoading = false;
      state.userDetails = action.payload;
    },
    deleteSkillFailure: (state, action) => {
      state.deleteSkillLoading = false;
      state.error = action.payload;
    },
    updateSkillLoading: state => {
      state.updateSkillLoading = true;
    },
    updateSkillSuccess: (state, action) => {
      state.updateSkillLoading = false;
      state.userDetails = action.payload;
    },
    updateSkillFailure: (state, action) => {
      state.updateSkillLoading = false;
      state.error = action.payload;
    },
    // lang
    updateLanguageLoading: state => {
      state.updateLanguageLoading = true;
    },
    updateLanguageSuccess: (state, action) => {
      state.updateLanguageLoading = false;
      state.userDetails = action.payload;
    },
    updateLanguageFailure: (state, action) => {
      state.updateLanguageLoading = false;
      state.error = action.payload;
    },
    // Delete User Resume
    deleteUserResumeLoading: state => {
      state.deleteUserResumeLoading = true;
    },
    deleteUserResumeSuccess: (state, action) => {
      state.deleteUserResumeLoading = false;
      state.userDetails = action.payload;
    },
    deleteUserResumeFailure: (state, action) => {
      state.deleteUserResumeLoading = false;
      state.error = action.payload;
    },
    getAllLanguagesLoading: state => {
      state.getAllLanguagesLoading = true;
    },
    getAllLanguagesSuccess: (state, action) => {
      state.getAllLanguagesLoading = false;
      state.allLanguages = action.payload;
    },
    getAllLanguagesFailure: (state, action) => {
      state.getAllLanguagesLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateLanguageLoading,
  updateLanguageSuccess,
  updateLanguageFailure,

  // User Details Actions
  getUserDetailsLoading,
  getUserDetailsSuccess,
  getUserDetailsFailure,

  // Update User Details Actions
  updateUserDetailsLoading,
  updateUserDetailsSuccess,
  updateUserDetailsFailure,

  // Get User From ID Actions
  getUserFromIdLoading,
  getUserFromIdSuccess,
  getUserFromIdFailure,

  // User Details Without Linkedin Actions
  userDetailsWithoutLinkedinLoading,
  userDetailsWithoutLinkedinSuccess,
  userDetailsWithoutLinkedinFailure,

  // Add User Education Actions
  addUserEducationLoading,
  addUserEducationSuccess,
  addUserEducationFailure,

  // Add User Experience Actions
  addUserExperienceLoading,
  addUserExperienceSuccess,
  addUserExperienceFailure,

  // Delete User Education Actions
  deleteUserEducationLoading,
  deleteUserEducationSuccess,
  deleteUserEducationFailure,

  // Update User Education Actions
  updateUserEducationLoading,
  updateUserEducationSuccess,
  updateUserEducationFailure,

  // Delete User Experience Actions
  deleteUserExperienceLoading,
  deleteUserExperienceSuccess,
  deleteUserExperienceFailure,

  updateUserExperienceLoading,
  updateUserExperienceSuccess,
  updateUserExperienceFailure,

  getPrimarySkillsLoading,
  getPrimarySkillsSuccess,
  getPrimarySkillsFailure,

  addSkillLoading,
  addSkillSuccess,
  addSkillFailure,

  deleteSkillLoading,
  deleteSkillSuccess,
  deleteSkillFailure,

  updateSkillLoading,
  updateSkillSuccess,
  updateSkillFailure,

  // Delete User Resume Actions
  deleteUserResumeLoading,
  deleteUserResumeSuccess,
  deleteUserResumeFailure,
  getAllLanguagesLoading,
  getAllLanguagesSuccess,
  getAllLanguagesFailure,
} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
