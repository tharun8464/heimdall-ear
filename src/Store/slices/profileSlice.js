import { ContactlessOutlined } from "@material-ui/icons";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userProfileImageLoading: false,
  userProfileImage: null,
  userProfileImageError: null,
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    //update user profile image
    getUserProfileImageLoading: state => {
      state.userProfileImageLoading = true;
    },
    getUserProfileImageSuccess: (state, action) => {
      state.userProfileImageLoading = false;
      state.userProfileImage = action.payload;
    },
    getUserProfileImageFailure: (state, action) => {
      state.userProfileImageLoading = false;
      state.userProfileImageError = action.payload;
    },
  },
});

export const {
  getUserProfileImageLoading,
  getUserProfileImageSuccess,
  getUserProfileImageFailure,
} = profileSlice.actions;

export default profileSlice.reducer;
