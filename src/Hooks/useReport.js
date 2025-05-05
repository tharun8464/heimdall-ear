import { useDispatch, useSelector } from "react-redux";
import {
  getPsychDetailsError,
  getPsychDetailsSuccess,
  startGetPsychDetailsLoading,
  startGetCultDetailsLoading,
  getCultDetailsSuccess,
  getCultDetailsError,
  startGetVmProLoading,
  getVmProSuccess,
  getVmProError,
  startGetCultHireLoading,
  getCultHireSuccess,
  getCultHireError,
  startGetCultExpLoading,
  getCultExpSuccess,
  getCultExpError,
  startGetCultTileLoading,
  getCultTileSuccess,
  getCultTileError,
  startGetFeedbackLoading,
  getFeedbackSuccess,
  getFeedbackError,
  startListDataLoading,
  listDataSuccess,
  listDataError
} from "../Store/slices/reportSlice";
import { getPsychDetails } from "../service/api";
import { getVmLiteReport } from "../service/reports/getPsychDetails";
import { getVmProReport } from "../service/reports/getVmProReport";
import { getCultReport } from "../service/reports/getCultReport";
import { getCultHire } from "../service/reports/cultureTypes/getCultHire";
import { getCultExp } from "../service/reports/cultureTypes/getCultExp";
import { getCultTile } from "../service/reports/cultureTypes/getCultTile";
import { getFeedbackReport } from "../service/reports/getFeedbackReort";
import { getListDataByListId } from "../service/reports/getListDataByListId";

const useReport = () => {
  const dispatch = useDispatch();

  const { heimdallToken } = useSelector((state) => state.baselining);

  // Handler function to fetch psychological details
  const handleGetPsychDetails = async (data) => {
    try {
      dispatch(startGetPsychDetailsLoading());
      const response = await getVmLiteReport(data);
      dispatch(getPsychDetailsSuccess(response.data));
    } catch (error) {
      dispatch(getPsychDetailsError(error));
    }
  };

  const handleGetCultDetails = async (data) => {
    try {
      const headers = {
        "Authorization": `Bearer ${heimdallToken?.token}`,
        "client-id": process.env.REACT_APP_DS_CLIENT_ID,
        "client-secret": process.env.REACT_APP_DS_CLIENT_SECRET,
        "Content-Type": "application/json",
      };
      dispatch(startGetCultDetailsLoading());
      const response = await getCultReport(data, headers);
      dispatch(getCultDetailsSuccess(response.data));
    } catch (error) {
      dispatch(getCultDetailsError(error));

    }
  };

  const handleGetVmPro = async (data) => {
    // try {
    //   dispatch(startGetVmProLoading());
    //   const response = await getVmProReport(data);
    //   dispatch(getVmProSuccess(response.data));
    // } catch (error) {
    //   dispatch(getVmProError(error));
    // }
    try {

      dispatch(startGetVmProLoading());
      const response = await getVmProReport(data);
      dispatch(getVmProSuccess(response.data));
    } catch (error) {
      dispatch(getVmProError(error));

    }
  };

  const handleGetCultHire = async (data) => {
    try {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
        "Content-Type": "application/json",
      };
      dispatch(startGetCultHireLoading());
      const response = await getCultHire(data, headers);
      dispatch(getCultHireSuccess(response.data));
    } catch (error) {
      dispatch(getCultHireError(error));

    }
  };


  const handleGetCultExp = async (data) => {
    try {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
        "Content-Type": "application/json",
      };
      dispatch(startGetCultExpLoading());
      const response = await getCultExp(data, headers);
      dispatch(getCultExpSuccess(response.data));
    } catch (error) {
      dispatch(getCultExpError(error));

    }
  };

  const handleGetCultTile = async (data) => {
    try {
      const headers = {
        authorization: `Bearer ${heimdallToken?.token}`,
        "Content-Type": "application/json",
      };
      dispatch(startGetCultTileLoading());
      const response = await getCultTile(data, headers);
      dispatch(getCultTileSuccess(response.data));
    } catch (error) {
      dispatch(getCultTileError(error));

    }
  };

  const handleGetFeedback = async (data, jobId) => {

    try {
      dispatch(startGetFeedbackLoading());
      const response = await getFeedbackReport(data, jobId);
      dispatch(getFeedbackSuccess(response.data));
    } catch (error) {
      dispatch(getFeedbackError(error));
      // Handle the error or show an error notification here if needed
    }
  };

  // Get List Data
  const handleGetListData = async (data) => {
    try {
      dispatch(startListDataLoading());
      const response = await getListDataByListId(data);
      dispatch(listDataSuccess(response?.data?.listData));
    } catch (error) {
      dispatch(listDataError(error));
    }
  };

  return {
    handleGetPsychDetails,
    handleGetCultDetails,
    handleGetVmPro,
    handleGetCultHire,
    handleGetCultExp,
    handleGetCultTile,
    handleGetFeedback,
    handleGetListData
  };
};

export default useReport;
