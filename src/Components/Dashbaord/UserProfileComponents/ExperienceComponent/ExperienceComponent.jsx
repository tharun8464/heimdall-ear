import styles from "./ExperienceComponent.module.css";
import NewEdit from "../../../../assets/images/NewEdit.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import CustomInput, { CustomSelectInput } from "../../../CustomInput/CustomInput";
import useUser from "../../../../Hooks/useUser";
import { useSelector } from "react-redux";
import Button from "../../../Button/Button";
import TagsInput from "../../../TagsInputComponent/TagsInputComponent";
import CustomRadioButton from "../../../CustomRadioButton/CustomRadioButton";
import { notify } from "../../../../utils/notify";
import usePopup from "../../../../Hooks/usePopup";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ReactComponent as ExpandIcon } from "../../../../assets/images/Profile/ExpandIcon.svg";
import ErrorIcon from "@mui/icons-material/Error";



const DeleteConfirmationPopup = ({ id, deleteFunction }) => {

  const { handlePopupCenterOpen } = usePopup()


  const handleCancel = () => {
    handlePopupCenterOpen(false)
  }
  const handleDelete = () => {
    deleteFunction(id)
    handleCancel()
  }


  return (

    <div className={styles.PopupWrapper}>
      <h2>Are you sure you want to delete this experience?</h2>
      <div className="flex gap-4 justify-center">
        <Button text={"Delete"} btnType={"primary"} onClick={handleDelete} />
        <Button text={"Cancel"} btnType={"secondary"} onClick={handleCancel} />
      </div>
    </div>
  )
}

const ExperienceComponent = ({ isMobile }) => {
  // For Field Errors
  const [fieldErrors, setFieldErrors] = useState(null)
  const [isEditing, setIsEditing] = useState(false);
  const [experienceId, setExperienceId] = useState(null);
  const [selectedTagInputItem, setSelectedTagInputItem] = useState([]);
  const [isFresher, setIsFresher] = useState(false);

  const [experienceDetails, setExperienceDetails] = useState({
    company_name: "",
    education: "",
    title: "",
    location: "",
    startMonth: "Month",
    startYear: "Year",
    endMonth: "Month",
    endYear: "Year",
    relatedSkills: "",
    description: "",
    isCurrentlyWorking: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);


  const {
    handleUpdateUserDetails,
    handleAddUserExperience,
    handleDeleteUserExperience,
    handleUpdateUserExperienceById,
  } = useUser();
  const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup()
  // const { userDetails } = useSelector(state => state.user);
  const { userDetailsWithoutLinkedin: userDetails } = useSelector(state => state.user);

  const { user } = userDetails ?? {};
  //console.log("experienceDetails:", user);
  const handleCloseEditing = () => {
    setFieldErrors(null)
    setExperienceDetails({
      company_name: "",
      education: "",
      title: "",
      location: "",
      startMonth: "Month",
      startYear: "Year",
      endMonth: "Month",
      endYear: "Year",
      relatedSkills: "",
      description: "",
      isCurrentlyWorking: false,
    })
    setIsEditing(false);
  };

  const monthsArray = [
    { text: "January", value: "1" },
    { text: "February", value: "2" },
    { text: "March", value: "3" },
    { text: "April", value: "4" },
    { text: "May", value: "5" },
    { text: "June", value: "6" },
    { text: "July", value: "7" },
    { text: "August", value: "8" },
    { text: "September", value: "9" },
    { text: "October", value: "10" },
    { text: "November", value: "11" },
    { text: "December", value: "12" },
  ];

  function generateYearArray() {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];

    for (let i = 0; i < 50; i++) {
      yearsArray.push({ text: currentYear - i, value: currentYear - i });
    }

    return yearsArray;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    if (name === "description") {
      if (value.length > 500) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} must not exceed 500 characters.`
        }));
      } else if (value.length < 100) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} must be at least 100 characters.`
        }));
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    } else {
      if (value.length > 100) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} must not exceed 100 characters.`
        }));
      } else if (value.match(regex)) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} contains emojis, please consider removing those.`
        }))
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    }


    setExperienceDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));

    setExperienceDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddExperience = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (experienceDetails.isCurrentlyWorking) {
      setFieldErrors(prevErrors => ({
        ...prevErrors,
        endMonth: "",
        endYear: ""
      }));
    }
  }, [experienceDetails])

  const handleSave = () => {
    let localFieldErrors = {};
    if (!experienceDetails?.company_name || experienceDetails?.company_name.trim() === "") {
      localFieldErrors.company_name = "Company Name is required!";
    }
    if (!experienceDetails?.title || experienceDetails?.title.trim() === "") {
      localFieldErrors.title = "Title is required!";
    }
    if (experienceDetails?.startMonth === "Month" || experienceDetails?.startMonth === "") {
      localFieldErrors.startMonth = "Please choose a valid Month!";
    } else {
      localFieldErrors.startMonth = ""
    }
    if (experienceDetails?.startYear === "Year" || experienceDetails?.startYear === "") {
      localFieldErrors.startYear = "Please choose a valid Year!";
    } else {
      localFieldErrors.startYear = ""
    }
    if (experienceDetails?.isCurrentlyWorking === false) {
      if (experienceDetails?.endMonth === "Month" || experienceDetails?.endMonth === "") {
        localFieldErrors.endMonth = "Please choose a valid Month!";
      }
      if (experienceDetails?.endYear === "Year" || experienceDetails?.endYear === "") {
        localFieldErrors.endYear = "Please choose a valid Year!";
      }
    } else {
      localFieldErrors.endMonth = ""
      localFieldErrors.endYear = ""
    }

    // const startDate = new Date(`${experienceDetails.startMonth} ${experienceDetails.startYear}`);
    // const endDate = new Date(`${experienceDetails.endMonth} ${experienceDetails.endYear}`);

    const startMonth = experienceDetails.startMonth.padStart(2, '0');
    const endMonth = experienceDetails.endMonth.padStart(2, '0');

    const startDate = new Date(`${startMonth}/01/${experienceDetails.startYear}`);
    const endDate = experienceDetails.isCurrentlyWorking
      ? new Date()
      : new Date(`${endMonth}/01/${experienceDetails.endYear}`);

    if (startDate >= endDate) {
      localFieldErrors.endDate = "End date must be after start date!";
    }

    if (Object.keys(localFieldErrors).length > 0) {
      setFieldErrors(prevState => ({ ...prevState, ...localFieldErrors })); // Set field-specific errors object
      for (const key in localFieldErrors) {
        if (localFieldErrors[key] !== "") {
          return;
        }
      }
    }

    if (Object.keys(localFieldErrors).length > 0) {
      for (const key in localFieldErrors) {
        if (localFieldErrors[key] !== "") {
          notify("Please fix the errors and try again", 'error')
          return;
        }
      }
    }
    if (isUpdating) {
      handleUpdateUserExperienceById({
        userId: user?._id,
        experienceId,
        experienceDetails,
      });
    } else {
      handleAddUserExperience({ userId: user?._id, experienceDetails });
      setIsEditing(false);
    }
    handleCloseEditing();
    handleUpdateUserDetails({ user_id: user?._id, updates: { data: { isFresher: isFresher } } })
  };

  const handleSaveFresher = () => {
    handleUpdateUserDetails({ user_id: user?._id, updates: { data: { isFresher: isFresher } } })
    handleCloseEditing()

  }

  const handleDelete = experienceId => {
    handleDeleteUserExperience({ userId: user?._id, experienceId });
  };

  const handleEdit = experienceId => {
    setIsEditing(true);
    setIsUpdating(true);
    setExperienceId(experienceId);

    const editedExperience = user?.experience?.find(exp => exp._id === experienceId);
    if (editedExperience) {
      setExperienceDetails({
        company_name: editedExperience?.company_name || "",
        education: editedExperience?.education || "",
        title: editedExperience?.title || "",
        location: editedExperience?.location || "",
        startMonth: editedExperience?.startMonth || "Month",
        startYear: editedExperience?.startYear || "Year",
        endMonth: editedExperience?.endMonth || "Month",
        endYear: editedExperience?.endYear || "Year",
        relatedSkills: editedExperience?.relatedSkills || "",
        description: editedExperience?.description || "",
        isCurrentlyWorking: editedExperience?.isCurrentlyWorking || false,
      })
    }
  };

  const handleRadioChange = e => {
    const { name, value } = e.target;
    setExperienceDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCheckFresher = (e) => {
    setIsFresher(e.target.checked)
  }

  const handleSelecetedTags = items => { };

  const handleShowDeleteConfirmPopup = (id, deleteFunction) => {
    handlePopupCenterComponentRender(<DeleteConfirmationPopup id={id} deleteFunction={deleteFunction} />)
    handlePopupCenterOpen(true)
  }

  useEffect(() => {
    setIsFresher(user?.isFresher)
  }, [user])

  return isMobile ?

    <>
      <Accordion sx={{ borderRadius: "12px", "&::before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          {userDetails?.user?.sectionCompletion?.experience ? null : (
            <ErrorIcon className={styles.ErrorIcon} sx={{ color: "rgba(217, 148, 66, 1)", marginRight: "1rem" }} />
          )}
          <span className="font-bold">Experience</span>
        </AccordionSummary>
        <AccordionDetails className={styles.AccordionDetails}>

          {isEditing ? (
            <div className={styles.Wrapper}>
              <div className={styles.Header}>
                <h2 className={styles.Heading}>Edit experience</h2>
                <CloseIcon onClick={handleCloseEditing} />
              </div>
              <div className={styles.FresherWrapper}>
                <label htmlFor="isFresher"> I have no prior work experience </label>
                <input type="checkbox" id="isFresher" style={{ color: "var(--primary-green)" }} checked={isFresher} onChange={handleCheckFresher} />
              </div>
              {isFresher ? null : <>
                <CustomInput
                  name="company_name"
                  placeholder={"Valuematrix.ai"}
                  labelClassName={styles.Label}
                  showLabel
                  label={"Company name*"}
                  onChange={handleChange}
                  value={experienceDetails.company_name}
                  isErrorState={fieldErrors && fieldErrors?.company_name ? true : false}
                  errorMessage={fieldErrors?.company_name}
                />
                <CustomInput
                  name="title"
                  placeholder={"Product Designer"}
                  labelClassName={styles.Label}
                  showLabel
                  onChange={handleChange}
                  label={"Job title*"}
                  value={experienceDetails.title}
                  isErrorState={fieldErrors && fieldErrors?.title ? true : false}
                  errorMessage={fieldErrors?.title}
                />
                <div className={styles.EmploymentTypeWrapper}>
                  <div className={styles.EmploymentTypeWrapper}>
                    <CustomRadioButton
                      onChange={handleRadioChange}
                      name="employmentType"
                      value="Full Time"
                      id="full-time"
                    />
                    <label htmlFor="full-time">Full Time</label>
                  </div>
                  <div className={styles.EmploymentTypeWrapper}>
                    <CustomRadioButton
                      onChange={handleRadioChange}
                      name="employmentType"
                      value="Part Time"
                      id="part-time"
                    />
                    <label htmlFor="part-time">Part Time</label> {"\n"}
                  </div>
                  <div className={styles.EmploymentTypeWrapper}>
                    <CustomRadioButton
                      onChange={handleRadioChange}
                      name="employmentType"
                      value="Contractual"
                      id="contractual"
                    />
                    <label htmlFor="contractual">Contractual</label>
                  </div>
                  <div className={styles.EmploymentTypeWrapper}>
                    <CustomRadioButton
                      onChange={handleRadioChange}
                      name="employmentType"
                      value="Internship"
                      id="intern"
                    />
                    <label htmlFor="intern" >Internship</label>
                  </div>
                  <div className={styles.EmploymentTypeWrapper}>
                    <CustomRadioButton
                      onChange={handleRadioChange}
                      name="employmentType"
                      value="Other"
                      id="other"
                    />
                    <label htmlFor="other">Other</label>
                  </div>
                </div>
                <CustomInput
                  name="location"
                  placeholder={"Bangalore, Karnataka, India"}
                  labelClassName={styles.Label}
                  showLabel
                  onChange={handleChange}
                  label={"Location"}
                  value={experienceDetails.location}
                  isErrorState={fieldErrors && fieldErrors?.location ? true : false}
                  errorMessage={fieldErrors?.location}
                />
                <label>
                  <h2 className={styles.SubHeading}>Start Date*</h2>
                  <div className={styles.DateWrapper}>
                    <CustomSelectInput
                      name="startMonth"
                      onChange={e => handleSelectChange("startMonth", e.target.value)}
                      className={styles.Select}
                      defaultValue={experienceDetails.startMonth}
                      selectOptions={monthsArray}
                      value={experienceDetails.startMonth}
                      isErrorState={fieldErrors && fieldErrors?.startMonth ? true : false}
                      errorMessage={fieldErrors?.startMonth}
                    />
                    <CustomSelectInput
                      name="startYear"
                      onChange={e => handleSelectChange("startYear", e.target.value)}
                      className={styles.Select}
                      defaultValue={experienceDetails.startYear}
                      selectOptions={generateYearArray()}
                      value={experienceDetails.startYear}
                      isErrorState={fieldErrors && fieldErrors?.startYear ? true : false}
                      errorMessage={fieldErrors?.startYear}
                    />
                  </div>
                </label>
                <div className={styles.CurrentlyWorking}>
                  <input
                    type="checkbox"
                    style={{ color: "var(--primary-green)" }}
                    value={experienceDetails?.isCurrentlyWorking}
                    onChange={e => handleSelectChange("isCurrentlyWorking", e.target?.checked)}
                    checked={experienceDetails?.isCurrentlyWorking ? true : false}
                  />
                  <span className={styles.SubHeading}>I'm currently working in this role</span>
                </div>
                {!experienceDetails?.isCurrentlyWorking ? (
                  <>
                    <label>
                      <h2 className={styles.SubHeading}>End Date*</h2>
                      <div className={styles.DateWrapper}>
                        <CustomSelectInput
                          name="endMonth"
                          onChange={e => handleSelectChange("endMonth", e.target.value)}
                          className={styles.Select}
                          defaultValue={experienceDetails.endMonth}
                          selectOptions={monthsArray}
                          value={experienceDetails.endMonth}
                          isErrorState={fieldErrors && fieldErrors?.endMonth ? true : false}
                          errorMessage={fieldErrors?.endMonth}
                        />
                        <CustomSelectInput
                          name="endYear"
                          onChange={e => handleSelectChange("endYear", e.target.value)}
                          className={styles.Select}
                          defaultValue={experienceDetails.endYear}
                          selectOptions={generateYearArray()}
                          value={experienceDetails.endYear}
                          isErrorState={fieldErrors && fieldErrors?.endYear ? true : false}
                          errorMessage={fieldErrors?.endYear}
                        />
                      </div>
                    </label>
                    {fieldErrors && fieldErrors?.endDate && (
                      <div style={{ color: "rgba(214, 97, 90, 1)", fontSize: "12px" }}>{fieldErrors?.endDate}</div>
                    )}
                  </>
                ) : null}
                <span className={styles.Label}>Related Skills</span>
                {/* <textarea
        name="relatedSkills"
        className={styles.TextArea}
        onChange={handleChange}
        value={experienceDetails.relatedSkills}
        rows="10"></textarea> */}

                <TagsInput
                  selectedTags={items => handleSelecetedTags(items)}
                  fullWidth
                  variant="outlined"
                  id="tags"
                  name="tags"
                  // placeholder="add Tags"
                  // label="Enter Skills"
                  wrapperClassName={styles.TagsInputWrapper}
                  selectedItem={selectedTagInputItem}
                  setSelectedItem={setSelectedTagInputItem}
                />
                <span className={styles.Label}>Description</span>
                <CustomInput
                  name="description"
                  className={styles.TextArea}
                  onChange={handleChange}
                  value={experienceDetails.description}
                  isErrorState={fieldErrors && fieldErrors?.description ? true : false}
                  errorMessage={fieldErrors?.description}
                  placeholder={"Roles and Responsibilities, Awards and Recognitions, Achievements"}
                />
              </>}
              {isFresher ? <Button text={"Save"} onClick={handleSaveFresher} btnType={"primary"} /> : <Button text={"Save"} onClick={handleSave} btnType={"primary"} />}
            </div>
          ) : (
            <>
              <div className={styles.Header}>
                {isMobile ? <div></div> : <h2 className={styles.Heading}>Experience</h2>}
                <h2 onClick={handleAddExperience} className={styles.HeadingGreen}>
                  Add Experience
                </h2>
              </div>

              {user?.isFresher ? <h2 style={{ margin: "auto" }}>You have no prior experience...</h2> : user?.experience?.length > 0 ? (
                user?.experience?.map(
                  (
                    {
                      title,
                      company_name,
                      location,
                      startMonth,
                      endMonth,
                      startYear,
                      endYear,
                      description,
                      isCurrentlyWorking,
                      employmentType,
                      _id,
                    },
                    index,
                  ) => {
                    return (//start_date ? new Date(start_date).getMonth() + 1 + "/" + new Date(start_date).getFullYear() : 
                      <div className={styles.Wrapper} key={index}>
                        <div className={styles.Qualification}>
                          <div className={styles.UpperSection}>
                            <div className={styles.SubHeadingWrapper}>
                              <h2 className={styles.SubHeading}>{title}</h2>
                              <span className={styles.University}>{company_name}</span>
                              <p className={styles.Location}>{location}</p>
                              <p className={styles.Duration}>
                                <span >{employmentType}</span> {"| "}
                                {startMonth && startYear ? startMonth + "/" + startYear : "Month/Year"} -{" "}
                                {isCurrentlyWorking ? "Present" : endMonth && endYear ? endMonth + "/" + endYear : "Month/Year"}
                              </p>
                            </div>
                            <div className={styles.ActionIcons}>
                              <img
                                src={NewEdit}
                                alt="edit"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  handleEdit(_id);
                                }}
                              />
                              <DeleteIcon
                                sx={{
                                  color: "var(--red-error)",
                                  fontSize: "1.3rem",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleShowDeleteConfirmPopup(_id, handleDelete)}
                              />
                            </div>
                          </div>
                          <div className={styles.LowerSection}>{description}</div>
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <h2 style={{ margin: "auto" }}>Please add your experience details...</h2>
              )}
            </>
          )}
        </AccordionDetails>

      </Accordion>

    </> : isEditing ? (
      <div className={styles.Wrapper}>
        <div className={styles.Header}>
          <h2 className={styles.Heading}>Edit experience</h2>
          <CloseIcon onClick={handleCloseEditing} />
        </div>
        <div className={styles.FresherWrapper}>
          <label htmlFor="isFresher"> I have no prior work experience </label>
          <input type="checkbox" id="isFresher" style={{ color: "var(--primary-green)" }} checked={isFresher} onChange={handleCheckFresher} />
        </div>
        {isFresher ? null : <>
          <CustomInput
            name="company_name"
            placeholder={"Valuematrix.ai"}
            labelClassName={styles.Label}
            showLabel
            label={"Company name*"}
            onChange={handleChange}
            value={experienceDetails.company_name}
            isErrorState={fieldErrors && fieldErrors?.company_name ? true : false}
            errorMessage={fieldErrors?.company_name}
          />
          <CustomInput
            name="title"
            placeholder={"Product Designer"}
            labelClassName={styles.Label}
            showLabel
            onChange={handleChange}
            label={"Job title*"}
            value={experienceDetails.title}
            isErrorState={fieldErrors && fieldErrors?.title ? true : false}
            errorMessage={fieldErrors?.title}
          />
          <div className={styles.EmploymentTypeWrapper}>
            <div className={styles.EmploymentTypeWrapper}>
              <CustomRadioButton
                onChange={handleRadioChange}
                name="employmentType"
                value="Full Time"
                id="full-time"
              />
              <label htmlFor="full-time">Full Time</label>
            </div>
            <div className={styles.EmploymentTypeWrapper}>
              <CustomRadioButton
                onChange={handleRadioChange}
                name="employmentType"
                value="Part Time"
                id="part-time"
              />
              <label htmlFor="part-time">Part Time</label>
            </div>
            <div className={styles.EmploymentTypeWrapper}>
              <CustomRadioButton
                onChange={handleRadioChange}
                name="employmentType"
                value="Contractual"
                id="contractual"
              />
              <label htmlFor="contractual">Contractual</label>
            </div>
            <div className={styles.EmploymentTypeWrapper}>
              <CustomRadioButton
                onChange={handleRadioChange}
                name="employmentType"
                value="Internship"
                id="intern"
              />
              <label htmlFor="intern">Internship</label>
            </div>
            <div className={styles.EmploymentTypeWrapper}>
              <CustomRadioButton
                onChange={handleRadioChange}
                name="employmentType"
                value="Other"
                id="other"
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>
          <CustomInput
            name="location"
            placeholder={"Bangalore, Karnataka, India"}
            labelClassName={styles.Label}
            showLabel
            onChange={handleChange}
            label={"Location"}
            value={experienceDetails.location}
            isErrorState={fieldErrors && fieldErrors?.location ? true : false}
            errorMessage={fieldErrors?.location}
          />
          <label>
            <h2 className={styles.SubHeading}>Start Date*</h2>
            <div className={styles.DateWrapper}>
              <CustomSelectInput
                name="startMonth"
                onChange={e => handleSelectChange("startMonth", e.target.value)}
                className={styles.Select}
                defaultValue={experienceDetails.startMonth}
                selectOptions={monthsArray}
                value={experienceDetails.startMonth}
                isErrorState={fieldErrors && fieldErrors?.startMonth ? true : false}
                errorMessage={fieldErrors?.startMonth}
              />
              <CustomSelectInput
                name="startYear"
                onChange={e => handleSelectChange("startYear", e.target.value)}
                className={styles.Select}
                defaultValue={experienceDetails.startYear}
                selectOptions={generateYearArray()}
                value={experienceDetails.startYear}
                isErrorState={fieldErrors && fieldErrors?.startYear ? true : false}
                errorMessage={fieldErrors?.startYear}
              />
            </div>
          </label>
          <div className={styles.CurrentlyWorking}>
            <input
              type="checkbox"
              style={{ color: "var(--primary-green)" }}
              value={experienceDetails?.isCurrentlyWorking}
              onChange={e => handleSelectChange("isCurrentlyWorking", e.target?.checked)}
              checked={experienceDetails?.isCurrentlyWorking ? true : false}
            />
            <span className={styles.SubHeading}>I'm currently working in this role</span>
          </div>
          {!experienceDetails?.isCurrentlyWorking ? (
            <>
              <label>
                <h2 className={styles.SubHeading}>End Date*</h2>
                <div className={styles.DateWrapper}>
                  <CustomSelectInput
                    name="endMonth"
                    onChange={e => handleSelectChange("endMonth", e.target.value)}
                    className={styles.Select}
                    defaultValue={experienceDetails.endMonth}
                    selectOptions={monthsArray}
                    value={experienceDetails.endMonth}
                    isErrorState={fieldErrors && fieldErrors?.endMonth ? true : false}
                    errorMessage={fieldErrors?.endMonth}
                  />
                  <CustomSelectInput
                    name="endYear"
                    onChange={e => handleSelectChange("endYear", e.target.value)}
                    className={styles.Select}
                    defaultValue={experienceDetails.endYear}
                    selectOptions={generateYearArray()}
                    value={experienceDetails.endYear}
                    isErrorState={fieldErrors && fieldErrors?.endYear ? true : false}
                    errorMessage={fieldErrors?.endYear}
                  />
                </div>
              </label>
              {fieldErrors && fieldErrors?.endDate && (
                <div style={{ color: "rgba(214, 97, 90, 1)", fontSize: "12px" }}>{fieldErrors?.endDate}</div>
              )}
            </>
          ) : null}
          <span className={styles.Label}>Related Skills</span>
          {/* <textarea
        name="relatedSkills"
        className={styles.TextArea}
        onChange={handleChange}
        value={experienceDetails.relatedSkills}
        rows="10"></textarea> */}

          <TagsInput
            selectedTags={items => handleSelecetedTags(items)}
            fullWidth
            variant="outlined"
            id="tags"
            name="tags"
            // placeholder="add Tags"
            // label="Enter Skills"
            wrapperClassName={styles.TagsInputWrapper}
            selectedItem={selectedTagInputItem}
            setSelectedItem={setSelectedTagInputItem}
          />
          <span className={styles.Label}>Description</span>
          <CustomInput
            name="description"
            className={styles.TextArea}
            onChange={handleChange}
            value={experienceDetails.description}
            isErrorState={fieldErrors && fieldErrors?.description ? true : false}
            errorMessage={fieldErrors?.description}
            placeholder={"Roles and Responsibilities, Awards and Recognitions, Achievements"}
          />
        </>}
        {isFresher ? <Button text={"Save"} onClick={handleSaveFresher} btnType={"primary"} /> : <Button text={"Save"} onClick={handleSave} btnType={"primary"} />}
      </div>
    ) : (
      <>
        <div className={styles.Header}>
          <h2 className={styles.Heading}>Experience</h2>
          <h2 onClick={handleAddExperience} className={styles.HeadingGreen}>
            Add Experience
          </h2>
        </div>

        {user?.isFresher ? <h2 style={{ margin: "auto" }}>You have no prior experience...</h2> : user?.experience?.length > 0 ? (
          user?.experience?.map(
            (
              {
                title,
                company_name,
                location,
                startMonth,
                endMonth,
                startYear,
                endYear,
                description,
                isCurrentlyWorking,
                employmentType,
                _id,
              },
              index,
            ) => {
              return (//start_date ? new Date(start_date).getMonth() + 1 + "/" + new Date(start_date).getFullYear() : 
                <div className={styles.Wrapper} key={index}>
                  <div className={styles.Qualification}>
                    <div className={styles.UpperSection}>
                      <div className={styles.SubHeadingWrapper}>
                        <h2 className={styles.SubHeading}>{title}</h2>
                        <span className={styles.University}>{company_name}</span>
                        <p className={styles.Location}>{location}</p>
                        <p className={styles.Duration}>
                          <span >{employmentType}</span> {"| "}
                          {startMonth && startYear ? startMonth + "/" + startYear : "Month/Year"} -{" "}
                          {isCurrentlyWorking ? "Present" : endMonth && endYear ? endMonth + "/" + endYear : "Month/Year"}
                        </p>
                      </div>
                      <div className={styles.ActionIcons}>
                        <img
                          src={NewEdit}
                          alt="edit"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleEdit(_id);
                          }}
                        />
                        <DeleteIcon
                          sx={{
                            color: "var(--red-error)",
                            fontSize: "1.3rem",
                            cursor: "pointer",
                          }}
                          onClick={() => handleShowDeleteConfirmPopup(_id, handleDelete)}
                        />
                      </div>
                    </div>
                    <div className={styles.LowerSection}>{description}</div>
                  </div>
                </div>
              );
            },
          )
        ) : (
          <h2 style={{ margin: "auto" }}>Please add your experience details...</h2>
        )}
      </>
    );
};

export default ExperienceComponent;
