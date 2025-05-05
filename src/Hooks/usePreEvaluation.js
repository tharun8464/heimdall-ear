import { useDispatch, useSelector } from "react-redux";
import { getBestProfiles } from "../service/preEvaluation/getBestProfiles";
import { addCandidate } from "../service/preEvaluation/addCandidate";
import { addTags } from "../service/preEvaluation/addTags";
import {
  getBestProfilesError,
  getBestProfilesSuccess,
  startGetBestProfilesLoading,
  addCandidateError,
  addCandidateSuccess,
  startAddCandidateLoading,
  addTagsError,
  addTagsSuccess,
  startAddTagsLoading,
  startDeleteCandidateLoading,
  deleteCandidateSuccess,
  deleteCandidateError,
  startGetMainViewProfilesLoading,
  getMainViewProfilesSuccess,
  getMainViewProfilesError,
  startGetMainViewProfLoading,
  getMainViewProfSuccess,
  getMainViewProfError,
  updateMainViewProfileError,
  updateMainViewProfileSuccess,
  startUpdateMainViewProfileLoading,
  startGetCognitiveMatchLoading,
  getCognitiveMatchSuccess,
  getCognitiveMatchError,
  startGetTechnicalRatingLoading,
  getTechnicalRatingSuccess,
  getTechnicalRatingError,
  startDeleteTagLoading,
  deleteTagSuccess,
  deleteTagError,
  startGetCultureMatchLoading,
  getCultureMatchSuccess,
  getCultureMatchError,
  startCreateTeamCompatibilityLoading,
  createTeamCompatibilitySuccess,
  createTeamCompatibilityError,
  startGetCompanyNameLoading,
  getCompanyNameSuccess,
  getCompanyNameError,
  startUpdateMainViewCandidateLoading,
  updateMainViewCandidateSuccess,
  updateMainViewCandidateError,
  startAddBulkCandidateLoading,
  addBulkCandidateError,
  addBulkCandidateSuccess,
  startTeamDynamicsConfLoading,
  teamDynamicsConfSuccess,
  teamDynamicsConfError,
  startFilterMainViewProfilesLoading,
  filterMainViewProfilesSuccess,
  filterMainViewProfilesError,
  startGetInterviewStatusesLoading,
  getInterviewStatusesSuccess,
  getInterviewStatusesError,
  startSetVmLiteReportFlagLoading,
  setVmLiteReportFlagSuccess,
  setVmLiteReportFlagError,
  teamDynamicReportFlagError,
  startTeamDynamicReportFlagLoading,
  teamDynamicReportFlagSuccess,
} from "../Store/slices/preEvaluationSlice.js";
import { deleteCandidate } from "../service/preEvaluation/deleteCandidate";
import { getMainViewProfileById, getMainViewProfiles } from "../service/preEvaluation/getMainViewProfiles";
import { updateMainViewProfile } from "../service/preEvaluation/updateMainViewProfile";
import { notify } from "../utils/notify";
import { getCognitiveMatch } from "../service/preEvaluation/getCognitiveMatch";
import { getTechnicalRating } from "../service/preEvaluation/getTechnicalRating";
import { deleteTag } from "../service/preEvaluation/deleteTag.js";
import { getCultureMatch } from "../service/preEvaluation/getCultureMatch.js";
import { createTeamCompatibility } from "../service/preEvaluation/createTeamCompatibility.js";
import { getCompanyNameById } from "../service/preEvaluation/getCompanyNameById.js";
import { updateMainViewCandidate } from "../service/preEvaluation/updateMainViewCandidate.js";
import {
  addBulkCandidate,
  addCandidateToJob,
} from "../service/preEvaluation/addBulkCandidate";
import { teamDynamicsConfidence } from "../service/preEvaluation/teamDynamicsConfidence.js";
import { filterMainViewProfiles } from "../service/preEvaluation/filterMainviewProfiles.js";
import { getInterviewStatus } from "../service/preEvaluation/getInterviewStatus.js";
import { setVmLiteReportFlag } from "../service/preEvaluation/setVmLiteReportFlag.js";
import { updateTeamDynamicReport } from "../service/preEvaluation/updateTeamDynamicReport";
import { decreaseCredit } from "../service/creditMapService.js";

const usePreEvaluation = () => {
  const dispatch = useDispatch();
  const { heimdallToken } = useSelector((state) => state.baselining);

  const handleAddCandidate = async (candidateData, jobId) => {
    try {
      const data = {
        candidateData,
        jobId,
      };
      dispatch(startAddCandidateLoading());
      const response = await addCandidate(data);
      handleGetBestProfiles(jobId);
      handleGetMainViewProfiles(jobId);
      dispatch(addCandidateSuccess(response.data));
    } catch (error) {
      dispatch(addCandidateError(error));
      notify("Could not add candidate something went wrong", "error");
    }
  };

  const handleDeleteCandidate = async (candidateId, jobId) => {
    const data = {
      candidateId,
      jobId,
    };
    try {
      dispatch(startDeleteCandidateLoading());
      const response = await deleteCandidate(data);
      handleGetBestProfiles(jobId);
      handleGetMainViewProfiles(jobId);
      dispatch(deleteCandidateSuccess(response.data));
    } catch (error) {
      notify("Could not delete candidate", "error");
      dispatch(deleteCandidateError(error));
    }
  };

  const handleGetBestProfiles = async (jobId) => {
    try {
      dispatch(startGetBestProfilesLoading());
      const response = await getBestProfiles(jobId);

      dispatch(getBestProfilesSuccess(response.data));
    } catch (error) {
      dispatch(getBestProfilesError(error));
    }
  };

  const handleAddTags = async (candidateId, tag, jobId) => {
    const data = {
      candidateId,
      tag,
    };
    try {
      dispatch(startAddTagsLoading());
      const response = await addTags(data);
      dispatch(addTagsSuccess(response.data));
      handleGetMainViewProfiles(jobId);
      handleGetBestProfiles(jobId);
    } catch (error) {
      dispatch(addTagsError(error));
      notify(`${error?.response?.data?.error ?? "Could not add tag"}`, "error");
    }
  };
  const handleAddBulkCandidate = async (candidateData, jobId) => {
    try {
      dispatch(startAddBulkCandidateLoading());
  
      // Initial API call to add candidates
      const response = await addCandidateToJob(candidateData, jobId);
      dispatch(addBulkCandidateSuccess(response.data));
      notify("Candidates added successfully", "success");
  
      let attempt = 0;
      const maxAttempts = 100; // Maximum attempts (100 times)
      const interval = 10 * 1000; // Fixed interval of 10 seconds
  
      const fetchProfiles = async () => {
        if (attempt >= maxAttempts) {
          // console.log("Max polling attempts reached, stopping further API calls.");
          return;
        }
  
        attempt++;
  
        // Fetch main view profiles
        const mainViewProfile = await handleGetMainViewProfiles(jobId);
  
        // If data is present, stop polling
        if (mainViewProfile && mainViewProfile.length > 0) {
          // console.log("Data retrieved, stopping polling.");
          return;
        }
  
        // console.log(`Polling attempt ${attempt}/100: Data not available yet. Retrying in ${interval / 1000} seconds.`);
  
        // Schedule next check
        setTimeout(fetchProfiles, interval);
      };
  
      // Start polling
      fetchProfiles();
  
    } catch (error) {
      notify("Could not add candidates", "error");
      dispatch(addBulkCandidateError(error));
    }
  };
  

  const handleGetMainViewProfiles = async (jobId) => {
    try {
      dispatch(startGetMainViewProfilesLoading());
      const response = await getMainViewProfiles(jobId);
      // //////console.log(response);
      // //////console.log("==========================201===============")
      dispatch(getMainViewProfilesSuccess(response.data));
      return response?.data
    } catch (error) {
      dispatch(getMainViewProfilesError(error));
      notify("Some server error occuered", "error");
    }
  };

  const handleGetMainViewProf = async (evaluationId) => {
    try {
      dispatch(startGetMainViewProfLoading());
      const response = await getMainViewProfileById(evaluationId);
      dispatch(getMainViewProfSuccess(response.data));
    } catch (error) {
      dispatch(getMainViewProfError(error));

    }
  };

  // Handler function to get interview statuses for a job
  const handleGetInterviewStatuses = async (jobId) => {
    try {
      dispatch(startGetInterviewStatusesLoading());
      const response = await getInterviewStatus(jobId);
      dispatch(getInterviewStatusesSuccess(response.data));
    } catch (error) {
      dispatch(getInterviewStatusesError(error));
    }
  };

  // const handleUpdateMainViewProfile = async (
  //   evaluationId,
  //   candidateId,
  //   data,
  //   jobId
  // ) => {
  //   try {
  //     const updateData = { talentMatch: data };
  //     dispatch(startUpdateMainViewProfileLoading());
  //     const response = await updateMainViewProfile(
  //       evaluationId,
  //       candidateId,
  //       updateData
  //     );
  //     dispatch(updateMainViewProfileSuccess(response.data));
  //     handleGetMainViewProfiles(jobId);
  //     notify("test");
  //   } catch (error) {
  //     dispatch(updateMainViewProfileError(error));
  //   }
  // };

  const handleGetCognitiveMatch = async (
    data,
    evaluationId,
    jobId,
    errorData
  ) => {
    try {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
        "client-id": process.env.REACT_APP_DS_CLIENT_ID,
        "client-secret": process.env.REACT_APP_DS_CLIENT_SECRET,
      };
      dispatch(startGetCognitiveMatchLoading());
      const response = await getCognitiveMatch(data, headers); // Update with the actual service function

      handleUpdateMainViewCandidate(evaluationId, {
        cognitiveMatch: {
          percentageClass: response?.data.PercentageClass,
          percentageMatch: response?.data.PercentageMatch,
          Confidence: response?.data?.Confidence,
        },
      });
      // handleGetMainViewProfiles(jobId);
      dispatch(getCognitiveMatchSuccess(response.data));
    } catch (error) {
      notify(
        `Cognitive match invite sent for ${errorData?.firstName ?? ""} ${errorData?.lastName ?? ""
        }`,
        "error"
      );
      dispatch(getCognitiveMatchError(error));
    }
  };

  const handleGetTechnicalRating = async (jobId, email) => {
    try {
      const data = { email };
      dispatch(startGetTechnicalRatingLoading());
      const response = await getTechnicalRating(jobId, data);
      dispatch(getTechnicalRatingSuccess(response.data));
    } catch (error) {
      notify("Could not get technical rating, some error occured", "error");
      dispatch(getTechnicalRatingError(error));
    }
  };

  const handleDeleteTag = async (candidateId, tagId) => {
    //////console.log("mint", tagId, candidateId);
    try {
      const data = {
        candidateId,
        tagId,
      };
      dispatch(startDeleteTagLoading());
      const response = await deleteTag(data);
      dispatch(deleteTagSuccess(response.data));
    } catch (error) {
      dispatch(deleteTagError(error));
      notify("Could not delete tag", "error");
    }
  };

  const handleSetVmLiteReportFlag = async (evaluationId) => {
    try {
      dispatch(startSetVmLiteReportFlagLoading());
      await setVmLiteReportFlag({ evaluationId }); // Assuming the service accepts an object with evaluationId
      dispatch(setVmLiteReportFlagSuccess());
    } catch (error) {
      dispatch(setVmLiteReportFlagError(error));
    }
  };

  const handleGetCultureMatch = async (data, evaluationId, jobId, company, action, maxCredit) => {
    try {
      const headers = {
        "Authorization": `Bearer ${heimdallToken?.token}`,
        "Content-Type": "application/json",
        "client-id": process.env.REACT_APP_DS_CLIENT_ID,
        "client-secret": process.env.REACT_APP_DS_CLIENT_SECRET,
      };
      dispatch(startGetCultureMatchLoading());
      const response = await getCultureMatch(data, headers);
      //////console.log(">>>>>>>>>>>>>", response.data.res)
      await handleUpdateMainViewCandidate(evaluationId, {
        culturalMatch: {
          ConfidenceScoreCandidate:
            response?.data.res?.Confidence,
          FlippedMatch: response?.data?.res?.Match,
          ConfidenceScoreCandidateCategory:
            response?.data?.res?.Match,
        },
      });

      await handleSetVmLiteReportFlag(evaluationId);
      if (response.status === 200) {
        await decreaseCredit(company, action, maxCredit);
      }

      handleGetMainViewProfiles(jobId);
      handleGetBestProfiles(jobId);
      handleGetMainViewProf(evaluationId)
      dispatch(getCultureMatchSuccess(response.data));
    } catch (error) {
      dispatch(getCultureMatchError(error));
      notify(error?.response?.data?.Message, "error");
    }
  };

  const handleTeamDynamicReportFlag = async (jobId, data) => {
    try {
      dispatch(startTeamDynamicReportFlagLoading());
      const res = await updateTeamDynamicReport(jobId, data);
      dispatch(teamDynamicReportFlagSuccess(res.data))
      return res.data;
    } catch (error) {
      dispatch(teamDynamicReportFlagError(error))
    }
  }

  const handleCreateTeamCompatibility = async (company_id, data, evaluationId, company, action, maxCredit) => {

    try {
      let res;
      dispatch(startCreateTeamCompatibilityLoading());
      //////console.log("aaaaahandleCreateTeamCompatibility", company_id, data, company)
      const response = await createTeamCompatibility(company_id, data);
      if (response.data) {
        res = await handleTeamDynamicReportFlag(data?.jobId, data);

      }
      if (response.status === 200) {

        await decreaseCredit(company, action, maxCredit);
      }
      handleGetMainViewProfiles(data?.jobId);
      handleGetBestProfiles(data?.jobId);
      handleGetMainViewProf(evaluationId)
      dispatch(createTeamCompatibilitySuccess(response.data));
      return res.data;
    } catch (error) {
      dispatch(createTeamCompatibilityError(error));
      notify(
        `${error.response.data.message ?? "Could not get team dynamics"}`,
        "error"
      );
    }
  };

  const handleGetCompanyNameById = async (companyId) => {
    try {
      dispatch(startGetCompanyNameLoading());
      const response = await getCompanyNameById(companyId);
      dispatch(getCompanyNameSuccess(response.data));
    } catch (error) {
      dispatch(getCompanyNameError(error));
    }
  };

  const handleUpdateMainViewCandidate = async (id, data) => {
    try {
      dispatch(startUpdateMainViewCandidateLoading());
      const response = await updateMainViewCandidate(id, data);
      dispatch(updateMainViewCandidateSuccess(response.data));
    } catch (error) {
      dispatch(updateMainViewCandidateError(error));
    }
  };

  const handleTeamDynamicsConfidence = async (
    CompanyId,
    evaluationId,
    jobId
  ) => {

    try {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
      };
      const data = {
        CompanyId,
      };
      dispatch(startTeamDynamicsConfLoading());
      //////console.log("aaaaaaaaaahandleTeamDynamicsConfidence", CompanyId)
      const response = await teamDynamicsConfidence(data, headers);
      handleUpdateMainViewCandidate(evaluationId, {
        teamDynamicsConfidence: response?.data?.WeightedAverageConfidence,
      });
      handleGetMainViewProfiles(jobId);
      handleGetMainViewProf(evaluationId);
      dispatch(teamDynamicsConfSuccess(response.data));
    } catch (error) {
      dispatch(teamDynamicsConfError(error));
      notify("Could not get team dynamics confidence", "error");

    }
  };

  const handleFilterMainViewProfiles = async (data, headers) => {
    try {
      dispatch(startFilterMainViewProfilesLoading());
      const response = await filterMainViewProfiles(data, headers);
      // //////console.log("response:", response);
      dispatch(filterMainViewProfilesSuccess(response.data.data));
      return response.data;
    } catch (error) {
      ////console.log("error:", error);
      dispatch(filterMainViewProfilesError(error));
      notify("Could not filter some error occured", "error");
    }
  };

  return {
    handleAddCandidate,
    handleTeamDynamicsConfidence,
    handleGetBestProfiles,
    handleAddTags,
    handleDeleteCandidate,
    handleGetMainViewProfiles,
    handleGetMainViewProf,
    // handleUpdateMainViewProfile,
    handleGetCognitiveMatch,
    handleGetTechnicalRating,
    handleDeleteTag,
    handleCreateTeamCompatibility,
    handleGetCultureMatch,
    handleGetCompanyNameById,
    handleUpdateMainViewCandidate,
    handleAddBulkCandidate,
    handleFilterMainViewProfiles,
    handleGetInterviewStatuses,
    handleSetVmLiteReportFlag,
    handleTeamDynamicReportFlag,
  };
};

export default usePreEvaluation;
