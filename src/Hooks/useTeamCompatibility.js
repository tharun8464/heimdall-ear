import { useDispatch , useSelector } from "react-redux";
import {getTeamData , getTeamDataLoading , getTeamDataSuccess , getCanData , getCanDataSuccess , getCandidateLoading} from "../Store/slices/teamCompatibilitySlice"
import { useParams } from "react-router-dom";
import {getTeamCompatibilityById} from "../service/teamCompatibility/getTeamCompatibility"
import { updateCandBalComp } from "../service/teamCompatibility/updateBalComp";

const useTeamCompatibility = () =>{

    const dispatch = useDispatch()

    // Get team compatibility by id
    const getTeamDynamicsById = async (company_id , data)=>{
        try {
            dispatch(getTeamDataLoading())
            const response = await getTeamCompatibilityById(company_id , data)
            dispatch(getTeamDataSuccess(response.data))
            return response.data
        } catch (error) {
            
        }
    }

    // Get Candidate Data from Evaluation DB

    const getCandidateEval = async (data)=>{
        try {
            dispatch(getCandidateLoading())
            const response = await updateCandBalComp(data)
            dispatch(getCanDataSuccess(response.data))
            return response.data
        } catch (error) {
            
        }
    }


    return {
        getTeamDynamicsById,
        getCandidateEval
    }
}

export default useTeamCompatibility