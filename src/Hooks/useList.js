import { useDispatch, useSelector } from "react-redux";
import {
    startCreateListDataLoading,
    getCreateListDataSuccess,
    getCreateListDataError,
    startListDataByJobIdLoading,
    getListDataByJobIdSuccess,
    getListDataByJobIdError
} from "../Store/slices/listSlice";
import { createCandidatesList } from "../service/list/createList";
import { getListByJobId } from "../service/list/getListByJobId";
import { removeList } from "../service/list/removeList";
import { renameList } from "../service/list/renameList";
import { setConfiguration } from "../service/list/setConfiguration";
import { toast } from "react-toastify";
const useList = () => {
    const dispatch = useDispatch();

    //Handle create list
    const handleCreateList = async (data) => {
        try {
            dispatch(startCreateListDataLoading());
            const res = await createCandidatesList(data);
            dispatch(getCreateListDataSuccess(res.data));
            await handleGetListByJobId(data?.jobId);
        } catch (error) {
            //console.log(error)
            dispatch(getCreateListDataError(error));
        }
    }

    // Handle get lists by job id
    const handleGetListByJobId = async (jobId) => {
        try {
            dispatch(startListDataByJobIdLoading());
            const res = await getListByJobId(jobId);
            dispatch(getListDataByJobIdSuccess(res.data));
        } catch (error) {
            dispatch(getListDataByJobIdError(error));
        }
    };
    //handle remove list
    const handleRemoveList = async (data) => {
        try {
            const res = await removeList(data);
            if (res?.status === 200) {
                await handleGetListByJobId(data?.jobId);
                toast('List removed successfully!');
            }
        } catch (error) {
            //console.log(error);
        }
    }

    // handle rename list
    const handleRenameList = async (data, jobId) => {
        try {
            const res = await renameList(data);
            if (res?.status === 200) {
                await handleGetListByJobId(jobId);
            }
        } catch (error) {
            //console.log(error);
        }
    }

    // handle set list configuration
    const handleSetConfiguration = async (listId, data) => {
        try {
            const res = await setConfiguration(listId, data);
            if (res?.status === 200) {
                //console.log(res);
                toast('Email successfully sent to the recipient!')
                //await handleGetListByJobId(jobId);
            }
        } catch (error) {
            //console.log(error);
        }
    }

    return {
        handleCreateList,
        handleGetListByJobId,
        handleRemoveList,
        handleRenameList,
        handleSetConfiguration
    };
};

export default useList;
