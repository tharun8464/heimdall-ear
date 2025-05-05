import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Existing state properties
  candidateData: null,
  isAddCandidateLoading: false,
  addCandidateError: null,

  // New state properties for getBestProfiles
  bestProfiles: null,
  isGetBestProfilesLoading: false,
  getBestProfilesError: null,

  // add tags
  isAddTagsLoading: false,
  addTagsError: null,

  isDeleteTagLoading: false,
  deleteTagError: null,

  // State properties for deleteCandidate
  isDeleteCandidateLoading: false,
  deleteCandidateError: null,

  // New state properties for getMainViewProfiles
  mainViewProfiles: null,
  isGetMainViewProfilesLoading: false,
  getMainViewProfilesError: null,

  mainViewProf: null,
  isGetMainViewProfLoading: false,
  getMainViewProfError: null,

  // New state properties for updateMainViewProfile
  isUpdateMainViewProfileLoading: false,
  updateMainViewProfileError: null,

  isGetCognitiveMatchLoading: false,
  getCognitiveMatchError: null,
  cognitiveMatch: null,

  technicalRating: null,
  isGetTechnicalRatingLoading: false,
  getTechnicalRatingError: null,

  isCreateTeamCompatibilityLoading: false,
  createTeamCompatibilityError: null,
  teamCompatibilityData: null,

  // New state properties for getCompanyNameById
  companyName: null,
  isGetCompanyNameLoading: false,
  getCompanyNameError: null,

  // New state properties for updateMainViewCandidate
  isUpdateMainViewCandidateLoading: false,
  updateMainViewCandidateError: null,

  // add candidate info bulk
  isAddBulkCandidateLoading: false,
  addBulkCandidateError: null,

  isTeamDynamicsConfLoading: false,
  teamDynamicsConfError: null,
  teamDynamicsConfData: null,

  isFilterMainViewProfilesLoading: false,
  filterMainViewProfilesError: null,
  filterMainViewProfilesData: null,

  interviewStatuses: null,
  isGetInterviewStatusesLoading: false,
  getInterviewStatusesError: null,

  hasPlayedAllGames: false,

  isSetVmLiteReportFlagLoading: false,
  setVmLiteReportFlagError: null,

  isTeamDynamicReportFlagLoading:false,
  teamDynamicReportFlagError:null
};

const preEvaluationSlice = createSlice({
  name: "preEvaluationSlice",
  initialState,
  reducers: {
    // Existing reducers
    startAddCandidateLoading: (state) => {
      state.isAddCandidateLoading = true;
    },
    addCandidateSuccess: (state, { payload }) => {
      state.isAddCandidateLoading = false;
      state.candidateData = payload;
    },
    addCandidateError: (state, { payload }) => {
      state.isAddCandidateLoading = false;
      state.addCandidateError = payload;
    },

    // New reducers for getBestProfiles
    startGetBestProfilesLoading: (state) => {
      state.isGetBestProfilesLoading = true;
    },
    getBestProfilesSuccess: (state, { payload }) => {
      state.isGetBestProfilesLoading = false;
      state.bestProfiles = payload;
    },
    getBestProfilesError: (state, { payload }) => {
      state.isGetBestProfilesLoading = false;
      state.getBestProfilesError = payload;
    },

    // addTags
    startAddTagsLoading: (state) => {
      state.isAddTagsLoading = true;
      state.addTagsError = null; // Clear any previous errors
    },
    addTagsSuccess: (state, { payload }) => {
      state.isAddTagsLoading = false;
      state.addTagsError = null; // Clear any previous errors
    },
    addTagsError: (state, { payload }) => {
      state.isAddTagsLoading = false;
      state.addTagsError = payload;
    },

    // deleteTags
    startDeleteTagLoading: (state) => {
      state.isDeleteTagLoading = true;
      state.deleteTagError = null; // Clear any previous errors
    },
    deleteTagSuccess: (state) => {
      state.isDeleteTagLoading = false;
      state.deleteTagError = null; // Clear any previous errors
    },
    deleteTagError: (state, { payload }) => {
      state.isDeleteTagLoading = false;
      state.deleteTagError = payload;
    },

    // delete candidate
    startDeleteCandidateLoading: (state) => {
      state.isDeleteCandidateLoading = true;
      state.deleteCandidateError = null; // Clear any previous errors
    },
    deleteCandidateSuccess: (state, { payload }) => {
      state.isDeleteCandidateLoading = false;
      state.deleteCandidateError = null; // Clear any previous errors
    },
    deleteCandidateError: (state, { payload }) => {
      state.isDeleteCandidateLoading = false;
      state.deleteCandidateError = payload;
    },

    // New reducers for getMainViewProfiles
    startGetMainViewProfilesLoading: (state) => {
      state.isGetMainViewProfilesLoading = true;
      state.getMainViewProfilesError = null; // Clear any previous errors
    },
    getMainViewProfilesSuccess: (state, { payload }) => {
      state.isGetMainViewProfilesLoading = false;
      state.mainViewProfiles = payload;
      state.getMainViewProfilesError = null; // Clear any previous errors
    },
    getMainViewProfilesError: (state, { payload }) => {
      state.isGetMainViewProfilesLoading = false;
      state.getMainViewProfilesError = payload;
    },

        // New reducers for getMainViewProfilesbyid
        startGetMainViewProfLoading: (state) => {
          state.isGetMainViewProfLoading = true;
          state.getMainViewProfError = null; // Clear any previous errors
        },
        getMainViewProfSuccess: (state, { payload }) => {
          state.isGetMainViewProfLoading = false;
          state.mainViewProf = payload;
          state.getMainViewProfError = null; // Clear any previous errors
        },
        getMainViewProfError: (state, { payload }) => {
          state.isGetMainViewProfLoading = false;
          state.getMainViewProfError = payload;
        },

    // New reducers for updateMainViewProfile
    startUpdateMainViewProfileLoading: (state) => {
      state.isUpdateMainViewProfileLoading = true;
      state.updateMainViewProfileError = null; // Clear any previous errors
    },
    updateMainViewProfileSuccess: (state, { payload }) => {
      state.isUpdateMainViewProfileLoading = false;
      state.updateMainViewProfileError = null; // Clear any previous errors
    },
    updateMainViewProfileError: (state, { payload }) => {
      state.isUpdateMainViewProfileLoading = false;
      state.updateMainViewProfileError = payload;
    },

    // New reducers for postCognitiveMatch
    startGetCognitiveMatchLoading: (state) => {
      state.isGetCognitiveMatchLoading = true;
      state.getCognitiveMatchError = null; // Clear any previous errors
    },
    getCognitiveMatchSuccess: (state, { payload }) => {
      state.isGetCognitiveMatchLoading = false;
      state.cognitiveMatch = payload;
      state.getCognitiveMatchError = null; // Clear any previous errors
    },
    getCognitiveMatchError: (state, { payload }) => {
      state.isGetCognitiveMatchLoading = false;
      state.getCognitiveMatchError = payload;
    },

    // New reducers for getTechnicalRating
    startGetTechnicalRatingLoading: (state) => {
      state.isGetTechnicalRatingLoading = true;
      state.getTechnicalRatingError = null; // Clear any previous errors
    },
    getTechnicalRatingSuccess: (state, { payload }) => {
      state.isGetTechnicalRatingLoading = false;
      state.technicalRating = payload;
      state.getTechnicalRatingError = null; // Clear any previous errors
    },
    getTechnicalRatingError: (state, { payload }) => {
      state.isGetTechnicalRatingLoading = false;
      state.getTechnicalRatingError = payload;
    },

    // New reducers for culturematch
    startGetCultureMatchLoading: (state) => {
      state.isGetCultureMatchLoading = true;
      state.getCultureMatchError = null; // Clear any previous errors
    },
    getCultureMatchSuccess: (state, { payload }) => {
      state.isGetCultureMatchLoading = false;
      state.cultureMatchData = payload;
      state.getCultureMatchError = null; // Clear any previous errors
    },
    getCultureMatchError: (state, { payload }) => {
      state.isGetCultureMatchLoading = false;
      state.getCultureMatchError = payload;
    },

    // New reducers for createTeamCompatibility
    startCreateTeamCompatibilityLoading: (state) => {
      state.isCreateTeamCompatibilityLoading = true;
      state.createTeamCompatibilityError = null; // Clear any previous errors
    },
    createTeamCompatibilitySuccess: (state, { payload }) => {
      state.isCreateTeamCompatibilityLoading = false;
      state.teamCompatibilityData = payload;
      state.createTeamCompatibilityError = null; // Clear any previous errors
    },
    createTeamCompatibilityError: (state, { payload }) => {
      state.isCreateTeamCompatibilityLoading = false;
      state.createTeamCompatibilityError = payload;
    },

    // New reducers for getCompanyNameById
    startGetCompanyNameLoading: (state) => {
      state.isGetCompanyNameLoading = true;
    },
    getCompanyNameSuccess: (state, { payload }) => {
      state.isGetCompanyNameLoading = false;
      state.companyName = payload;
    },
    getCompanyNameError: (state, { payload }) => {
      state.isGetCompanyNameLoading = false;
      state.getCompanyNameError = payload;
    },

    // New reducers for updateMainViewCandidate
    startUpdateMainViewCandidateLoading: (state) => {
      state.isUpdateMainViewCandidateLoading = true;
      state.updateMainViewCandidateError = null; // Clear any previous errors
    },
    updateMainViewCandidateSuccess: (state, { payload }) => {
      state.isUpdateMainViewCandidateLoading = false;
      state.updateMainViewCandidateError = null; // Clear any previous errors
    },
    updateMainViewCandidateError: (state, { payload }) => {
      state.isUpdateMainViewCandidateLoading = false;
      state.updateMainViewCandidateError = payload;
    },

    // add candidate info bulk in tag view
    startAddBulkCandidateLoading: (state) => {
      state.isAddBulkCandidateLoading = true;
      state.addBulkCandidateError = null; // Clear any previous errors
    },
    addBulkCandidateSuccess: (state, { payload }) => {
      state.isAddBulkCandidateLoading = false;
      state.addBulkCandidateError = null; // Clear any previous errors
    },
    addBulkCandidateError: (state, { payload }) => {
      state.isAddBulkCandidateLoading = false;
      state.addBulkCandidateError = payload;
    },

    //
    startTeamDynamicsConfLoading: (state) => {
      state.isTeamDynamicsConfLoading = true;
      state.teamDynamicsConfError = null; // Clear any previous errors
    },
    teamDynamicsConfSuccess: (state, { payload }) => {
      state.isTeamDynamicsConfLoading = false;
      state.teamDynamicsConfData = payload;
    },
    teamDynamicsConfError: (state, { payload }) => {
      state.isTeamDynamicsConfLoading = false;
      state.teamDynamicsConfError = payload;
    },

    startFilterMainViewProfilesLoading: (state) => {
      state.isFilterMainViewProfilesLoading = true;
      state.filterMainViewProfilesError = null; // Clear any previous errors
    },
    filterMainViewProfilesSuccess: (state, { payload }) => {
      state.isFilterMainViewProfilesLoading = false;
      state.filterMainViewProfilesData = payload;
    },
    filterMainViewProfilesError: (state, { payload }) => {
      state.isFilterMainViewProfilesLoading = false;
      state.filterMainViewProfilesError = payload;
    },

    // New reducers for getInterviewStatusesFromJobId
    startGetInterviewStatusesLoading: (state) => {
      state.isGetInterviewStatusesLoading = true;
      state.getInterviewStatusesError = null; // Clear any previous errors
    },
    getInterviewStatusesSuccess: (state, { payload }) => {
      state.isGetInterviewStatusesLoading = false;
      state.interviewStatuses = payload;
      state.getInterviewStatusesError = null; // Clear any previous errors
    },
    getInterviewStatusesError: (state, { payload }) => {
      state.isGetInterviewStatusesLoading = false;
      state.getInterviewStatusesError = payload;
    },

    startSetVmLiteReportFlagLoading: (state) => {
      state.isSetVmLiteReportFlagLoading = true;
      state.setVmLiteReportFlagError = null; // Clear any previous errors
    },
    setVmLiteReportFlagSuccess: (state) => {
      state.isSetVmLiteReportFlagLoading = false;
      state.setVmLiteReportFlagError = null; // Clear any previous errors
    },
    setVmLiteReportFlagError: (state, { payload }) => {
      state.isSetVmLiteReportFlagLoading = false;
      state.setVmLiteReportFlagError = payload;
    },

    // games
    hasPlayedAllGames: (state) => {
      state.hasPlayedAllGames = true;
    },

    //update team dynamic report
    startTeamDynamicReportFlagLoading:(state)=>{
      state.isTeamDynamicReportFlagLoading=false;
      state.teamDynamicReportFlagError=null;
    },

    teamDynamicReportFlagSuccess:(state)=>{
      state.isTeamDynamicReportFlagLoading=false;
      state.teamDynamicReportFlagError=null;
    },

    teamDynamicReportFlagError:(state,{payload})=>{
      state.isTeamDynamicReportFlagLoading=false;
      state.teamDynamicReportFlagError=payload;
    }
  },
});

export default preEvaluationSlice.reducer;
export const {
  // Existing actions
  startAddCandidateLoading,
  addCandidateSuccess,
  addCandidateError,

  startTeamDynamicsConfLoading,
  teamDynamicsConfSuccess,
  teamDynamicsConfError,

  // New actions for getBestProfiles
  startGetBestProfilesLoading,
  getBestProfilesSuccess,
  getBestProfilesError,

  startAddTagsLoading,
  addTagsSuccess,
  addTagsError,

  startDeleteCandidateLoading,
  deleteCandidateSuccess,
  deleteCandidateError,

  startGetMainViewProfilesLoading,
  getMainViewProfilesSuccess,
  getMainViewProfilesError,

  startGetMainViewProfLoading,
  getMainViewProfSuccess,
  getMainViewProfError,
  // New actions for updateMainViewProfile
  startUpdateMainViewProfileLoading,
  updateMainViewProfileSuccess,
  updateMainViewProfileError,

  getCognitiveMatchError,
  getCognitiveMatchSuccess,
  startGetCognitiveMatchLoading,

  startGetTechnicalRatingLoading,
  getTechnicalRatingSuccess,
  getTechnicalRatingError,

  // New actions for deleteTag
  startDeleteTagLoading,
  deleteTagSuccess,
  deleteTagError,

  // New actions for culturematch
  startGetCultureMatchLoading,
  getCultureMatchSuccess,
  getCultureMatchError,

  startCreateTeamCompatibilityLoading,
  createTeamCompatibilitySuccess,
  createTeamCompatibilityError,

  // New actions for getCompanyNameById
  startGetCompanyNameLoading,
  getCompanyNameSuccess,
  getCompanyNameError,

  // New actions for updateMainViewCandidate
  startUpdateMainViewCandidateLoading,
  updateMainViewCandidateSuccess,
  updateMainViewCandidateError,

  startAddBulkCandidateLoading,
  addBulkCandidateSuccess,
  addBulkCandidateError,

  startFilterMainViewProfilesLoading,
  filterMainViewProfilesSuccess,
  filterMainViewProfilesError,

  // New actions for getInterviewStatusesFromJobId
  startGetInterviewStatusesLoading,
  getInterviewStatusesSuccess,
  getInterviewStatusesError,

  hasPlayedAllGames,

  startSetVmLiteReportFlagLoading,
  setVmLiteReportFlagSuccess,
  setVmLiteReportFlagError,

  startTeamDynamicReportFlagLoading,
  teamDynamicReportFlagSuccess,
  teamDynamicReportFlagError,
} = preEvaluationSlice.actions;
