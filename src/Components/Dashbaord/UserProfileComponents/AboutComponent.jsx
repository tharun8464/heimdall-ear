import { useState } from "react";
import NewEdit from "../../../assets/images/NewEdit.svg";
import styles from "./AboutComponent.module.css";
import CustomInput from "../../CustomInput/CustomInput";
import Button from "../../Button/Button";
import { useSelector } from "react-redux";
import useUser from "../../../Hooks/useUser";
import { notify } from "../../../utils/notify";
import Accordion from '@mui/material/Accordion';
import { AccordionDetails, AccordionSummary } from "@mui/material";
import { ReactComponent as ExpandIcon } from "../../../assets/images/Profile/ExpandIcon.svg";
import ErrorIcon from "@mui/icons-material/Error";
// test

const AboutComponent = ({ isMobile }) => {
  const [isEditView, setIsEditView] = useState(false);
  const [aboutDetails, setAboutDetails] = useState({
    profileSummary: "",
    websiteURL: "",
    portfolioURL: "",
    xProfileURL: "",
    githubURL: "",
  });
  const [errors, setErrors] = useState({});
  // console.log('errors:', errors)

  const { userDetails } = useSelector(state => state.user);
  const { handleUpdateUserDetails } = useUser();

  const { user } = userDetails ?? {};

  const handleEditAbout = () => {
    if (userDetails?.user?.profileSummary) {
      setAboutDetails((prevDetails) => ({
        ...prevDetails,
        profileSummary: userDetails.user.profileSummary,
      }));
    }
    if (userDetails?.user?.websiteURL) {
      setAboutDetails((prevDetails) => ({
        ...prevDetails,
        websiteURL: userDetails.user.websiteURL,
      }));
    }
    if (userDetails?.user?.portfolioURL) {
      setAboutDetails((prevDetails) => ({
        ...prevDetails,
        portfolioURL: userDetails.user.portfolioURL,
      }));
    }
    if (userDetails?.user?.xProfileURL) {
      setAboutDetails((prevDetails) => ({
        ...prevDetails,
        xProfileURL: userDetails.user.xProfileURL,
      }));
    }
    if (userDetails?.user?.githubURL) {
      setAboutDetails((prevDetails) => ({
        ...prevDetails,
        githubURL: userDetails.user.githubURL,
      }));
    }
    setIsEditView(true);
  };

  const handleHideEdit = () => {
    setIsEditView(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setAboutDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
    // Clear errors on change
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const summaryLength = aboutDetails.profileSummary.trim().length;

    if (summaryLength < 100) {
      newErrors.profileSummary = "Profile summary must be at least 100 characters.";
    } else if (summaryLength > 300) {
      newErrors.profileSummary = "Profile summary must not exceed 300 characters.";
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    ['websiteURL', 'portfolioURL', 'xProfileURL', 'githubURL'].forEach(field => {
      if (aboutDetails[field] && !urlPattern.test(aboutDetails[field])) {
        newErrors[field] = "Please enter a valid URL.";
      }
      if (aboutDetails[field] && aboutDetails[field].length > 100) {
        newErrors[field] = `${field} must not exceed 100 characters.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      handleUpdateUserDetails({
        user_id: user?._id,
        updates: { data: aboutDetails },
      });
      setIsEditView(false);
    } else {
      // Optionally, alert the user that there are errors that need to be resolved
      // notify("Please correct the errors before saving.");
    }
  };

  return (
    isMobile ? <Accordion className={styles.Accordion} sx={{ borderRadius: "12px", "&::before": { display: "none" } }}>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        {userDetails?.user?.sectionCompletion?.about ? null : (
          <ErrorIcon className={styles.ErrorIcon} sx={{ color: "rgba(217, 148, 66, 1)", marginRight: "1rem" }} />
        )}
        <span className="font-bold">About</span>
      </AccordionSummary>
      <AccordionDetails className={styles.AccordionDetails}>

        {isEditView ? (
          <>
            <h1 className={styles.AboutHeading}>Profile Summary</h1>
            <div className={styles.InputWrapper}>
              <h1 className={styles.Heading}>About*</h1>
              <textarea
                placeholder="Brief description about yourself"
                onChange={handleChange}
                name="profileSummary"
                value={aboutDetails.profileSummary}
                className={styles.ProfileSummary}
                rows="4"
              />
              {errors.profileSummary && (
                <div className={styles.ErrorMessage}>{errors.profileSummary}</div>
              )}
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>Website URL</h2>
              <CustomInput
                placeholder={"e.g., www.valuematrix.ai"}
                onChange={handleChange}
                name="websiteURL"
                value={aboutDetails.websiteURL}
                isErrorState={!!errors.websiteURL}
                errorMessage={errors.websiteURL}
              />
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>Portfolio URL</h2>
              <CustomInput
                placeholder={"e.g., behance/johndoe.net"}
                onChange={handleChange}
                name="portfolioURL"
                value={aboutDetails.portfolioURL}
                isErrorState={!!errors.portfolioURL}
                errorMessage={errors.portfolioURL}
              />
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>X (Formerly, Twitter) URL</h2>
              <CustomInput
                placeholder={"https://x.com/johndoe"}
                onChange={handleChange}
                name="xProfileURL"
                value={aboutDetails.xProfileURL}
                isErrorState={!!errors.xProfileURL}
                errorMessage={errors.xProfileURL}
              />
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>GitHub URL</h2>
              <CustomInput
                placeholder={"https://github.com/johndoe"}
                onChange={handleChange}
                name="githubURL"
                value={aboutDetails.githubURL}
                isErrorState={!!errors.githubURL}
                errorMessage={errors.githubURL}
              />
            </div>
            <div className={styles.ActionBtns}>
              <Button text={"Cancel"} btnType={"secondary"} onClick={handleHideEdit} />
              <Button text={"Save"} btnType={"primary"} onClick={handleSave} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.ItemWrapper}>
              <p className={styles.AboutHeading}>Profile Summary</p>
              <img
                src={NewEdit}
                alt="edit"
                onClick={handleEditAbout}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div>{user?.profileSummary}</div>

            {user?.websiteURL ?
              <div>
                <h1 className={styles.Heading}>Website</h1>
                <span>{user?.websiteURL}</span>
              </div>
              : null}

            {user?.portfolioURL ?
              <div>
                <h1 className={styles.Heading}>Portfolio URL</h1>
                <span>{user?.portfolioURL}</span>
              </div>
              : null}

            {user?.xProfileURL ?
              <div>
                <h1 className={styles.Heading}>X (Formerly, Twitter) URL</h1>
                <span>{user?.xProfileURL}</span>
              </div>
              : null}

            {user?.githubURL ?
              <div>
                <h1 className={styles.Heading}>GitHub URL</h1>
                <span>{user?.githubURL}</span>
              </div>
              :
              null}


          </>
        )}
      </AccordionDetails>

    </Accordion> :
      <div className={styles.Wrapper}>

        {isEditView ? (
          <>
            <h1 className={styles.AboutHeading}>Profile Summary</h1>
            <div className={styles.InputWrapper}>
              <h1 className={styles.Heading}>About*</h1>
              <textarea
                placeholder="Brief description about yourself"
                onChange={handleChange}
                name="profileSummary"
                value={aboutDetails.profileSummary}
                className={styles.ProfileSummary}
                rows="4"
              />
              {errors.profileSummary && (
                <div className={styles.ErrorMessage}>{errors.profileSummary}</div>
              )}
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>Website URL</h2>
              <CustomInput
                placeholder={"e.g., www.shivammonga.com"}
                onChange={handleChange}
                name="websiteURL"
                value={aboutDetails.websiteURL}
                isErrorState={!!errors.websiteURL}
                errorMessage={errors.websiteURL}
              />
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>Portfolio URL</h2>
              <CustomInput
                placeholder={"e.g., behance/shivammonga.org"}
                onChange={handleChange}
                name="portfolioURL"
                value={aboutDetails.portfolioURL}
                isErrorState={!!errors.portfolioURL}
                errorMessage={errors.portfolioURL}
              />
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>X (Formerly, Twitter) URL</h2>
              <CustomInput
                placeholder={"https://x.com/PRIYANSH2702"}
                onChange={handleChange}
                name="xProfileURL"
                value={aboutDetails.xProfileURL}
                isErrorState={!!errors.xProfileURL}
                errorMessage={errors.xProfileURL}
              />
            </div>
            <div className={styles.InputWrapper}>
              <h2 className={styles.Heading}>GitHub URL</h2>
              <CustomInput
                placeholder={"https://github.com/SamirPaulb"}
                onChange={handleChange}
                name="githubURL"
                value={aboutDetails.githubURL}
                isErrorState={!!errors.githubURL}
                errorMessage={errors.githubURL}
              />
            </div>
            <div className={styles.ActionBtns}>
              <Button text={"Cancel"} btnType={"secondary"} onClick={handleHideEdit} />
              <Button text={"Save"} btnType={"primary"} onClick={handleSave} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.ItemWrapper}>
              <p className={styles.AboutHeading}>Profile Summary</p>
              <img
                src={NewEdit}
                alt="edit"
                onClick={handleEditAbout}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={{ wordBreak: "break-all" }}>{user?.profileSummary}</div>
            {user?.websiteURL ?
              <div>
                <h1 className={styles.Heading}>Website</h1>
                <span>{user?.websiteURL}</span>
              </div>
              : null}
            {user?.portfolioURL ?
              <div>
                <h1 className={styles.Heading}>Portfolio URL</h1>
                <span>{user?.portfolioURL}</span>
              </div>
              : null}
            {user?.xProfileURL ?
              <div>
                <h1 className={styles.Heading}>X (Formerly, Twitter) URL</h1>
                <span>{user?.xProfileURL}</span>
              </div>
              : null}
            {user?.githubURL ?
              <div>
                <h1 className={styles.Heading}>GitHub URL</h1>
                <span>{user?.githubURL}</span>
              </div>
              : null}
          </>
        )}
      </div>
  );
};

export default AboutComponent;
