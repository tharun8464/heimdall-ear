import {getNotificationDataFailure , getNotificationDataLoading , getNotificationDataSuccess} from "../Store/slices/notificationSlice"
import  {useDispatch} from "react-redux"
import {getCompanyNotification} from "../service/notifications/getCompanyNotification"

const useNotification = () => {

    const dispatch = useDispatch();

    // Handle get notification 
    const handleGetNotification = async (data) => {
        try {
            dispatch(getNotificationDataLoading());
            const response = await getCompanyNotification(data);
            // console.log("response", response)
            dispatch(getNotificationDataSuccess(response.data));
        } catch (error) {
            dispatch(getNotificationDataFailure(error));
        }
    }

    return {
        handleGetNotification
    }
}

export default useNotification