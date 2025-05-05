import { configureStore } from "@reduxjs/toolkit";
import baseliningSlice from "./slices/baseliningSlice";
import preEvaluationSlice from "./slices/preEvaluationSlice";
import podSlice from "./slices/podSlice";
import popupSlice from "./slices/popupSlice";
import podMemberSlice from "./slices/podMemberSlice";
import weightageSlice from "./slices/weightageSlice";
import reportSlice from "./slices/reportSlice";
import inviteSlice from "./slices/inviteSlice";
import userDetailsSlice from "./slices/userDetailsSlice";
import profileSlice from "./slices/profileSlice";
import gamifiedPsychoSlice from "./slices/gamifiedPsychoSlice";
import xiSlotsSlice from "./slices/xiSlotsSlice";
import listSlice from "./slices/listSlice";
import notificationSlice from "./slices/notificationSlice";
export const store = configureStore({
  reducer: {
    baselining: baseliningSlice,
    preEvaluation: preEvaluationSlice,
    report: reportSlice,
    weightage: weightageSlice,
    pod: podSlice,
    popup: popupSlice,
    invite: inviteSlice,
    podMember: podMemberSlice,
    user: userDetailsSlice,
    profile: profileSlice,
    gamifiedPsychoSlice: gamifiedPsychoSlice,
    xiSlots: xiSlotsSlice,
    list: listSlice,
    notification: notificationSlice
  },
});
