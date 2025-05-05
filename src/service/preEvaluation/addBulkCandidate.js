import { defaultSecuredAxios } from "../DefaultSecuredAxiosInstance";

export const addBulkCandidate = (data) => {
  const {csvFile, jobId} = data;
  const formData = new FormData();
  formData.append('csvFile', csvFile);
  formData.append("jobId", jobId);

  return defaultSecuredAxios.post(`/addBulkCandidates`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addCandidateToJob = (candidateData,jobId) => {
    return defaultSecuredAxios.post(`/candidate/${jobId}`, candidateData);
};
