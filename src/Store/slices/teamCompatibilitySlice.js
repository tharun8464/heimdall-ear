import { createSlice } from "@reduxjs/toolkit"; 

const initialState = {
    allTeamData : null,
    isGetTeamDataLoading : false,
    teamError : null,

    // Candidate evaluation data
    candidateEvaData : null,
    canDataLoading : false,
    candDataError : null
}

const teamSlice = createSlice({
    name : "teamSlice",
    initialState,
    reducers : {
        // Get team Data
        getTeamDataLoading : (state)=>{
            state.isGetTeamDataLoading = true
            state.teamError = null
        },
        getTeamData : (state , actiom)=>{
            state.isGetTeamDataLoading = false
            state.allTeamData = actiom.payload
        },
        getTeamDataSuccess: (state, { payload }) => {
            state.isGetTeamDataLoading = false;
            state.allTeamData = payload;
        },

        // Get Candidate Evaluation Data
        getCandidateLoading : (state)=>{
            state.canDataLoading = true
            state.candDataError = null
        },
        getCanData : (state , action)=>{
            state.canDataLoading = false
            state.candidateEvaData = action.payload
        },
        getCanDataSuccess : (state , {payload})=>{
            state.canDataLoading = false
            state.candDataError = payload
        }

    }
})

export default teamSlice.reducer

export const {getTeamData , getTeamDataLoading , getTeamDataSuccess , getCanData , getCanDataSuccess , getCandidateLoading} = teamSlice.actions