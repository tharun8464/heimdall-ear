import { useDispatch } from "react-redux";
import { handleUpdateUserDetails, updateUserDetails } from "../service/api";
import {
  getUserFromIdFailure,
  getUserFromIdLoading,
  getUserFromIdSuccess,
  updateUserDetailsFailure,
  updateUserDetailsLoading,
  updateUserDetailsSuccess,
  addUserEducationFailure,
  addUserEducationLoading,
  addUserEducationSuccess,
  addUserExperienceSuccess,
  addUserExperienceLoading,
  addUserExperienceFailure,
  deleteUserEducationFailure,
  deleteUserEducationLoading,
  deleteUserEducationSuccess,
  updateUserEducationFailure,
  updateUserEducationLoading,
  updateUserEducationSuccess,
  deleteUserExperienceFailure,
  deleteUserExperienceLoading,
  deleteUserExperienceSuccess,
  updateUserExperienceFailure,
  updateUserExperienceLoading,
  updateUserExperienceSuccess,
  getPrimarySkillsLoading,
  getPrimarySkillsFailure,
  getPrimarySkillsSuccess,
  addSkillLoading,
  addSkillSuccess,
  addSkillFailure,
  deleteSkillLoading,
  deleteSkillSuccess,
  deleteSkillFailure,
  updateSkillLoading,
  updateSkillSuccess,
  updateSkillFailure,
  updateLanguageLoading,
  updateLanguageSuccess,
  updateLanguageFailure,
  deleteUserResumeLoading,
  deleteUserResumeFailure,
  deleteUserResumeSuccess,
  getAllLanguagesSuccess,
  getAllLanguagesFailure,
  getAllLanguagesLoading,
  userDetailsWithoutLinkedinLoading,
  userDetailsWithoutLinkedinSuccess,
  userDetailsWithoutLinkedinFailure,
} from "../Store/slices/userDetailsSlice";
import { getUserFromId } from "../service/user/getUserFromId";
import { notify } from "../utils/notify";
import { addUserEducation } from "../service/user/addUserEducation";
import { deleteUserEducation } from "../service/user/deleteUserEducation";
import { updateUserEducationById } from "../service/user/updateUserEducation";
import { downloadResumeFromId } from "../service/user/downloadResume";
import {
  addUserExperience,
  updateUserExperienceById,
  deleteUserExperience,
} from "../service/user/experienceService";
import { getRoles } from "../service/user/getRoles";
import { addSkills } from "../service/user/addSkills";
import { deleteSkill } from "../service/user/deleteSkill";
import { updateSkill } from "../service/user/updateSkill";
import { updateLanguage } from "../service/user/updateLanguage";
import { deleteResume } from "../service/user/deleteResume";
import { getAllLanguages } from "../service/user/getAllLanguages";
import { useSelector } from "react-redux";

import { getUserProfileImage } from "../service/getUserProfileImage";
import {
  getUserProfileImageFailure,
  getUserProfileImageLoading,
  getUserProfileImageSuccess,
} from "../Store/slices/profileSlice";

import { getUserFromIdWithoutLinkedin } from "../service/user/getUserFromIdWithoutLinkedin";
import { getSessionStorage } from "../service/storageService";


const useUser = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);

  const handleGetUserProfileImage = async (userId) => {
    try {
      dispatch(getUserProfileImageLoading());
      const response = await getUserProfileImage({ 'id': userId });
      dispatch(getUserProfileImageSuccess(response?.data));
    } catch (error) {
      //console.log("error:", error);
      dispatch(getUserProfileImageFailure(error));
    }
  };

  const handleUpdateUserDetails = async data => {
    try {
      dispatch(updateUserDetailsLoading());
      const response = await updateUserDetails(data);
      dispatch(updateUserDetailsSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      dispatch(updateUserDetailsFailure(error));
      notify("Some Server error occured", "error");
    }
  };

  const handleGetUserFromId = async id => {
    try {
      let user = getSessionStorage("user");
      user = JSON.parse(user);
      dispatch(getUserFromIdLoading());
      const response = await getUserFromId(id);
      dispatch(getUserFromIdSuccess(response.data));
      handleGetUserWithoutLinkedinFromId(user?._id);
    } catch (error) {
      dispatch(getUserFromIdFailure(error));
      //console.log(error);
    }
  };

  const handleGetUserWithoutLinkedinFromId = async id => {
    try {
      dispatch(userDetailsWithoutLinkedinLoading());
      const response = await getUserFromIdWithoutLinkedin(id);
      dispatch(userDetailsWithoutLinkedinSuccess(response.data));
    } catch (error) {
      dispatch(userDetailsWithoutLinkedinFailure(error));
      //console.log(error);
    }
  }

  const handleUpdateLanguage = async (userId, languageDetails) => {
    try {
      dispatch(updateLanguageLoading());
      const response = await updateLanguage(userId, languageDetails);
      dispatch(updateLanguageSuccess(response.data));
      notify("Language updated successfully", "success");
      handleGetUserFromId(userId);
    } catch (error) {
      //console.log("error:", error);
      dispatch(updateLanguageFailure(error));
      notify("Error updating language", "error");
    }
  };

  const handleAddUserEducation = async data => {
    try {
      dispatch(addUserEducationLoading());
      const response = await addUserEducation(data);
      dispatch(addUserEducationSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      //console.log("error:", error);
      dispatch(addUserEducationFailure(error));
      notify("Error adding user education", "error");
    }
  };

  const handleAddUserExperience = async data => {
    try {
      dispatch(addUserExperienceLoading());
      const response = await addUserExperience(data);
      dispatch(addUserExperienceSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      dispatch(addUserExperienceFailure(error));
      notify("Error adding user experience", "error");
    }
  };

  const handleDeleteUserEducation = async data => {
    try {
      dispatch(deleteUserEducationLoading());
      const response = await deleteUserEducation(data);
      dispatch(deleteUserEducationSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      dispatch(deleteUserEducationFailure(error));
      notify("Error deleting user education", "error");
    }
  };

  const handleUpdateUserEducationById = async data => {
    try {
      dispatch(updateUserEducationLoading());
      const response = await updateUserEducationById(data);
      dispatch(updateUserEducationSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      //console.log("error:", error);
      dispatch(updateUserEducationFailure(error));
      notify("Error updating user education", "error");
    }
  };

  const handleUpdateUserExperienceById = async data => {
    try {
      dispatch(updateUserExperienceLoading());
      const response = await updateUserExperienceById(data);
      dispatch(updateUserExperienceSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      //console.log("error:", error);
      dispatch(updateUserExperienceFailure(error));
      notify("Error updating user experience", "error");
    }
  };

  const handleDeleteUserExperience = async data => {
    //console.log("data:", data);
    try {
      dispatch(deleteUserExperienceLoading());
      const response = await deleteUserExperience(data);
      //console.log("response:", response);
      dispatch(deleteUserExperienceSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      dispatch(deleteUserExperienceFailure(error));
      notify("Error deleting user experience", "error");
    }
  };

  const handleGetPrimarySkills = async () => {
    try {
      dispatch(getPrimarySkillsLoading());
      const response = await getRoles();
      dispatch(getPrimarySkillsSuccess(response.data));
    } catch (error) {
      dispatch(getPrimarySkillsFailure(error));
      notify("Error getting primary skills", "error");
    }
  };

  const handleAddSkill = async data => {
    try {
      //console.log("addSkill:", data);
      dispatch(addSkillLoading());
      const response = await addSkills(data);
      //console.log("response:", response);
      dispatch(addSkillSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      //console.log("error:", error);
      dispatch(addSkillFailure(error));
      notify("Error adding skill", "error");
    }
  };

  const handleDeleteSkill = async data => {
    try {
      dispatch(deleteSkillLoading());
      const response = await deleteSkill(data);
      dispatch(deleteSkillSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      dispatch(deleteSkillFailure(error));
      notify("Error deleting skill", "error");
    }
  };

  const handleUpdateSkill = async data => {
    try {
      dispatch(updateSkillLoading());
      const response = await updateSkill(data);
      dispatch(updateSkillSuccess(response.data));
      handleGetUserFromId(userDetails?.user?._id);
    } catch (error) {
      dispatch(updateSkillFailure(error));
      notify("Error updating skill", "error");
    }
  };

  const handleDeleteUserResume = async data => {
    try {
      dispatch(deleteUserResumeLoading());
      const response = await deleteResume(data);
      dispatch(deleteUserResumeSuccess(response?.data));
      handleGetUserFromId(userDetails?.user?._id);
      return response?.data;
    } catch (error) {
      dispatch(deleteUserResumeFailure(error));
    }
  };
  const handleGetAllLanguages = async () => {
    try {
      dispatch(getAllLanguagesLoading());
      const response = await getAllLanguages();
      dispatch(getAllLanguagesSuccess(response.data));
    } catch (error) {
      dispatch(getAllLanguagesFailure(error));
      notify("Error getting languages", "error");
    }
  };

  // Download Resume

  const handleDownloadResume = async (userId) => {
    try {
      const response = await downloadResumeFromId(userId);
      return response?.data?.Body?.data || response?.data?.buffer?.data
    } catch (error) {
      notify("Error downloading resume", "error");
    }
  }

  return {
    handleGetPrimarySkills,
    handleUpdateUserDetails,
    handleGetUserFromId,
    handleAddUserEducation,
    handleAddUserExperience,
    handleDeleteUserEducation,
    handleUpdateUserEducationById,
    handleUpdateUserExperienceById,
    handleDeleteUserExperience,
    handleAddSkill,
    handleDeleteSkill,
    handleUpdateSkill,
    handleUpdateLanguage,
    handleDeleteUserResume,
    handleGetAllLanguages,
    handleGetUserProfileImage,
    handleGetUserWithoutLinkedinFromId,
    handleDownloadResume
  };
};

export default useUser;
