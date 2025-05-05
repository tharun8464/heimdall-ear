import styles from "./EducationComponent.module.css";
import NewEdit from "../../../../assets/images/NewEdit.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import CustomInput, { CustomSelectInput } from "../../../CustomInput/CustomInput";
import { useSelector } from "react-redux";
import Button from "../../../Button/Button";
import useUser from "../../../../Hooks/useUser";
import { notify } from "../../../../utils/notify";
import usePopup from "../../../../Hooks/usePopup";
import { Accordion } from "@mui/material";
import { AccordionDetails, AccordionSummary } from "@mui/material";
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
      <h2>Are you sure you want to delete this education?</h2>
      <div className="flex gap-4 justify-center">
        <Button text={"Delete"} btnType={"primary"} onClick={handleDelete} />
        <Button text={"Cancel"} btnType={"secondary"} onClick={handleCancel} />
      </div>
    </div>
  )
}

const EducationComponent = ({ isMobile }) => {
  // For Field Errors
  const [fieldErrors, setFieldErrors] = useState(null)
  // console.log('fieldErrors:', fieldErrors)
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editId, setEditId] = useState(null);
  const { userDetailsWithoutLinkedin: userDetails } = useSelector(state => state.user);

  const { handlePopupCenterComponentRender, handlePopupCenterOpen } = usePopup()
  const {
    handleAddUserEducation,
    handleDeleteUserEducation,
    handleUpdateUserEducationById,
  } = useUser();
  const user = userDetails?.user ?? {};
  const [educationDetails, setEducationDetails] = useState({
    school: "",
    degree: "",
    field_of_study: "",
    startMonth: "Month",
    startYear: "Year",
    isCurrentlyPursuing: false,
    endMonth: "Month",
    endYear: "Year",
    grade: "",
    description: "",
  });
  // console.log("educationDetails:", educationDetails);

  const handleShowDeleteConfirmPopup = (id, deleteFunction) => {
    handlePopupCenterComponentRender(<DeleteConfirmationPopup id={id} deleteFunction={deleteFunction} />)
    handlePopupCenterOpen(true)
  }
  const [hasError, setHasError] = useState(false); 
  const handleInputChange = e => {
    const { name, value } = e.target;
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  
    // RegexExpression
    const alphaRegexForSchool = /^[A-Za-z0-9\s-,]+$/;
    const alphaRegexForDegree = /^[A-Za-z\s-'.,]+$/;
    const alphaRegexForFOS= /^[A-Za-z\s-.,]+$/;
    const alphaRegexForGrade= /^[0-9]+(\.[0-9]{1,2})?$/;

    let hasError = false;

    if (name === "grade") {
      const numericValue = parseFloat(value);
      if (numericValue < 1 || numericValue > 10) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: "Grade must be between 1 and 10."
        }));
        hasError = true;
      }else if (!value.match(alphaRegexForGrade)) {  
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: "Grade must not contain special characters or alphabets."
        }));
        hasError = true;
      }else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    }else if (name === "degree") {
      if (!value.match(alphaRegexForDegree)) {  
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: "Education must not contain special characters or numbers."
        }));
        hasError = true;
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    }else if (name === "field_of_study") {
      if (!value.match(alphaRegexForFOS)) {  
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: "Field of Study must not contain special characters or numbers."
        }));
        hasError = true;
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    }else if (name === "school") {
      if (!value.match(alphaRegexForSchool)) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: "School name should not contain special characters."
        }));
        hasError = true;
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    } 
    else if (name === "description") {
      if (value.length > 500) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} must not exceed 500 characters.`
        }));
        hasError = true;
      } else if (value.length < 100) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} must be at least 100 characters.`
        }));
        hasError = true;
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    } 
    else {
      if (value.length > 100) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} must not exceed 100 characters.`
        }));
        hasError = true;
      } else if (value.match(regex)) {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: `${name} contains emojis, please consider removing those.`
        }));
        hasError = true;
      } else {
        setFieldErrors(prevErrors => ({
          ...prevErrors,
          [name]: ""
        }));
      }
    }

    setHasError(hasError);
  
    setEducationDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  

  const handleSelectChange = (name, value) => {

    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));

    setEducationDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
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

  const result = generateYearArray();

  const handleAddQualification = () => {
    setIsEditing(true);
  };

  const handleEditClick = educationId => {
    setIsEditing(true);
    setIsUpdating(true);
    setEditId(educationId);

    const editedEducation = user?.education?.find(edu => edu._id === educationId);
    if (editedEducation) {
      setEducationDetails({
        school: editedEducation?.school || "",
        degree: editedEducation?.degree || "",
        field_of_study: editedEducation.field_of_study || "",
        startMonth: editedEducation.startMonth || "Month",
        startYear: editedEducation.startYear || "Year",
        isCurrentlyPursuing: editedEducation.isCurrentlyPursuing || false,
        endMonth: editedEducation.endMonth || "Month",
        endYear: editedEducation.endYear || "Year",
        grade: editedEducation.grade || "",
        description: editedEducation.description || "",
      });
    }
  };

  const handleCloseEditing = () => {
    setFieldErrors(null)
    setEducationDetails({
      school: "",
      degree: "",
      field_of_study: "",
      startMonth: "Month",
      startYear: "Year",
      isCurrentlyPursuing: false,
      endMonth: "Month",
      endYear: "Year",
      grade: "",
      description: "",
    })
    setIsEditing(false);
  };


  useEffect(() => {
    if (educationDetails.isCurrentlyPursuing) {
      setFieldErrors(prevErrors => ({
        ...prevErrors,
        endMonth: "",
        endYear: ""
      }));
    }
  }, [educationDetails])

  const handleSave = () => {
    if (hasError) {
      alert("Please fix the errors before saving.");
      return;
    }
    let localFieldErrors = {}
    if (!educationDetails?.school || educationDetails?.school.trim() === "") {
      localFieldErrors.school = "School is required!"
    }
    if (!educationDetails?.degree || educationDetails?.degree.trim() === "") {
      localFieldErrors.degree = "Education is required!"
    }
    if (!educationDetails?.field_of_study || educationDetails?.field_of_study.trim() === "") {
      localFieldErrors.field_of_study = "Field of study is required!"
    }
    if (educationDetails?.startMonth === "Month" || educationDetails?.startMonth === "") {
      localFieldErrors.startMonth = "Please choose a valid Month"
    } else {
      localFieldErrors.startMonth = ""
    }
    if (educationDetails?.startYear === "Year" || educationDetails?.startYear === "") {
      localFieldErrors.startYear = "Please choose a valid Year"
    } else {
      localFieldErrors.startYear = ""
    }
    if (educationDetails?.isCurrentlyPursuing === false) {
      if (educationDetails?.endMonth === "Month" || educationDetails?.endMonth === "") {
        localFieldErrors.endMonth = "Please choose a valid Month"
      }
      if (educationDetails?.endYear === "Year" || educationDetails?.endYear === "") {
        localFieldErrors.endYear = "Please choose a valid Year"
      }
    } else {
      localFieldErrors.endMonth = ""
      localFieldErrors.endYear = ""
    }


    // const startDate = new Date(`${educationDetails.startMonth} ${educationDetails.startYear}`);
    // const endDate = new Date(`${educationDetails.endMonth} ${educationDetails.endYear}`);

    const startMonth = educationDetails.startMonth.padStart(2, '0');
    const endMonth = educationDetails.endMonth.padStart(2, '0');

    const startDate = new Date(`${startMonth}/01/${educationDetails.startYear}`);
    const endDate = educationDetails.isCurrentlyPursuing
      ? new Date()
      : new Date(`${endMonth}/01/${educationDetails.endYear}`);

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
      handleUpdateUserEducationById({
        userId: user?._id,
        educationId: editId,
        educationDetails,
      });
    } else {
      handleAddUserEducation({ userId: user?._id, educationDetails });
      setIsEditing(false);
    }
    handleCloseEditing();
  };

  const handleDeleteClick = educationId => {
    handleDeleteUserEducation({ userId: user?._id, educationId: educationId });
  };

  // const handleUpdateUserClick = educationId => {};

  return isMobile ? <>
    <Accordion sx={{ borderRadius: "12px", "&::before": { display: "none" } }}>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        {userDetails?.user?.sectionCompletion?.education ? null : (
          <ErrorIcon className={styles.ErrorIcon} sx={{ color: "rgba(217, 148, 66, 1)", marginRight: "1rem" }} />
        )}
        <span className="font-bold">Education</span>
      </AccordionSummary>
      <AccordionDetails className={styles.AccordionDetails}>
        {isEditing ? (
          <div className={styles.Wrapper}>
            <div className={styles.Header}>
              <h2
                className={styles.Heading}
                style={{ cursor: "pointer", color: "var(--primary-green)", fontWeight: 500 }}
                onClick={handleAddQualification}>
                Add Qualifications
              </h2>
              <CloseIcon onClick={handleCloseEditing} />
            </div>
            <CustomInput
              placeholder={"Ex: Boston University"}
              labelClassName={styles.Label}
              showLabel
              label={"School*"}
              onChange={handleInputChange}
              name="school"
              isErrorState={fieldErrors && fieldErrors?.school ? true : false}
              errorMessage={fieldErrors?.school}
              value={educationDetails?.school}
            />
            <CustomInput
              placeholder={"Ex: Bachelor’s"}
              labelClassName={styles.Label}
              showLabel
              label={"Education*"}
              onChange={handleInputChange}
              name="degree"
              isErrorState={fieldErrors && fieldErrors?.degree ? true : false}
              errorMessage={fieldErrors?.degree}
              value={educationDetails?.degree}
            />
            <CustomInput
              placeholder={"Ex: Business"}
              labelClassName={styles.Label}
              showLabel
              label={"Field of study*"}
              onChange={handleInputChange}
              name="field_of_study"
              value={educationDetails?.field_of_study}
              isErrorState={fieldErrors && fieldErrors?.field_of_study ? true : false}
              errorMessage={fieldErrors?.field_of_study}
            />
            <label>
              <h2 className={styles.SubHeading}>Start Date*</h2>
              <div className={styles.DateWrapper}>
                <CustomSelectInput
                  className={styles.Select}
                  defaultValue={"Month"}
                  value={educationDetails?.startMonth}
                  selectOptions={monthsArray}
                  onChange={e => {
                    handleSelectChange("startMonth", e.target?.value);
                  }}
                  isErrorState={fieldErrors && fieldErrors?.startMonth ? true : false}
                  errorMessage={fieldErrors?.startMonth}
                />
                <CustomSelectInput
                  className={styles.Select}
                  defaultValue={"Year"}
                  value={educationDetails?.startYear}
                  selectOptions={generateYearArray()}
                  onChange={e => handleSelectChange("startYear", e.target?.value)}
                  isErrorState={fieldErrors && fieldErrors?.startYear ? true : false}
                  errorMessage={fieldErrors?.startYear}
                />
              </div>
            </label>
            <div className={styles.CurrentlyPursuing}>
              <input
                type="checkbox"
                style={{ color: "var(--primary-green)" }}
                value={educationDetails?.isCurrentlyPursuing}
                onChange={e => handleSelectChange("isCurrentlyPursuing", e.target?.checked)}
                checked={educationDetails?.isCurrentlyPursuing ? true : false}
              />
              <span className={styles.SubHeading}>I'm currently pursuing</span>
            </div>
            {educationDetails?.isCurrentlyPursuing ? null : (
              <>
                <>
                  <label>
                    <h2 className={styles.SubHeading}>End Date*</h2>
                    <div className={styles.DateWrapper}>
                      <CustomSelectInput
                        className={styles.Select}
                        defaultValue={"Month"}
                        selectOptions={monthsArray}
                        onChange={e => handleSelectChange("endMonth", e.target?.value)}
                        value={educationDetails?.endMonth}
                        isErrorState={fieldErrors && fieldErrors?.endMonth ? true : false}
                        errorMessage={fieldErrors?.endMonth}
                      />
                      <CustomSelectInput
                        className={styles.Select}
                        defaultValue={"Year"}
                        selectOptions={generateYearArray()}
                        onChange={e => handleSelectChange("endYear", e.target?.value)}
                        value={educationDetails?.endYear}
                        isErrorState={fieldErrors && fieldErrors?.endYear ? true : false}
                        errorMessage={fieldErrors?.endYear}
                      />
                    </div>
                  </label>
                  {fieldErrors && fieldErrors?.endDate && (
                    <div style={{ color: "rgba(214, 97, 90, 1)", fontSize: "12px" }}>{fieldErrors?.endDate}</div>
                  )}
                </>
                <CustomInput
                  placeholder={"Ex: 8.8"}
                  labelClassName={styles.Label}
                  showLabel
                  label={"Grade"}
                  onChange={handleInputChange}
                  name="grade"
                  type={"number"}
                  isErrorState={fieldErrors && fieldErrors?.grade ? true : false}
                  errorMessage={fieldErrors?.grade}
                  value={educationDetails?.grade}
                />
              </>
            )}
            {/* <CustomInput
              placeholder={"Ex: 8.8"}
              labelClassName={styles.Label}
              showLabel
              label={"Grade"}
              onChange={handleInputChange}
              name="grade"
              type={"number"}
              isErrorState={fieldErrors && fieldErrors?.grade ? true : false}
              errorMessage={fieldErrors?.grade}
              value={educationDetails?.grade}
            /> */}
            <CustomInput
              placeholder={"Certifications, Awards , Recognitions, and Achievements"}
              labelClassName={styles.Label}
              showLabel
              label={"Description"}
              onChange={handleInputChange}
              name="description"
              value={educationDetails?.description}
              isErrorState={fieldErrors && fieldErrors?.description ? true : false}
              errorMessage={fieldErrors?.description}
            />
            <Button
              text={"Save"}
              btnType={"primary"}
              className={styles.SaveBtn}
              onClick={handleSave}
            />
          </div>
        ) : (
          <>
            <div className={styles.Header}>
              {isMobile ? <div></div> : <h2 className={styles.Heading}>Education</h2>}
              <h2
                onClick={handleAddQualification}
                style={{ cursor: "pointer", color: "var(--primary-green)", fontWeight: 500 }}>
                Add Qualification
              </h2>
            </div>
            {user?.education?.length > 0 ? (
              user?.education?.map(
                (
                  {
                    school,
                    startMonth,
                    startYear,
                    endMonth,
                    endYear,
                    description,
                    degree,
                    field_of_study,
                    isCurrentlyPursuing,
                    _id,
                  },
                  index,
                ) => {
                  return (
                    <div className={styles.Wrapper} key={index}>
                      <div className={styles.Qualification}>
                        <div className={styles.UpperSection}>
                          <div className={styles.SubHeadingWrapper}>
                            <h2 className={styles.SubHeading}>
                              {degree}, {field_of_study}
                            </h2>
                            <span className={styles.University}>{school}</span>
                            <p className={styles.Duration}>
                              {startMonth && startYear ? startMonth + "/" + startYear : "Month/Year"} -{" "}
                              {isCurrentlyPursuing ? "Present" : endMonth && endYear ? endMonth + "/" + endYear : "Month/Year"}
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
                                handleEditClick(_id);
                              }}
                            />
                            <DeleteIcon
                              sx={{
                                color: "var(--red-error)",
                                fontSize: "1.3rem",
                                cursor: "pointer",
                              }}
                              onClick={() => handleShowDeleteConfirmPopup(_id, handleDeleteClick)}
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
              <h2 style={{ margin: "auto" }}>Please add your education details...</h2>
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  </> :
    <>
      {isEditing ? (
        <div className={styles.Wrapper}>
          <div className={styles.Header}>
            <h2
              className={styles.Heading}
              style={{ cursor: "pointer", color: "var(--primary-green)", fontWeight: 500 }}
              onClick={handleAddQualification}>
              Add Qualifications
            </h2>
            <CloseIcon onClick={handleCloseEditing} />
          </div>
          <CustomInput
            placeholder={"Ex: Boston University"}
            labelClassName={styles.Label}
            showLabel
            label={"School*"}
            onChange={handleInputChange}
            name="school"
            isErrorState={fieldErrors && fieldErrors?.school ? true : false}
            errorMessage={fieldErrors?.school}
            value={educationDetails?.school}
          />
          <CustomInput
            placeholder={"Ex: Bachelor’s"}
            labelClassName={styles.Label}
            showLabel
            label={"Education*"}
            onChange={handleInputChange}
            name="degree"
            isErrorState={fieldErrors && fieldErrors?.degree ? true : false}
            errorMessage={fieldErrors?.degree}
            value={educationDetails?.degree}
          />
          <CustomInput
            placeholder={"Ex: Business"}
            labelClassName={styles.Label}
            showLabel
            label={"Field of study*"}
            onChange={handleInputChange}
            name="field_of_study"
            value={educationDetails?.field_of_study}
            isErrorState={fieldErrors && fieldErrors?.field_of_study ? true : false}
            errorMessage={fieldErrors?.field_of_study}
          />
          <label>
            <h2 className={styles.SubHeading}>Start Date*</h2>
            <div className={styles.DateWrapper}>
              <CustomSelectInput
                className={styles.Select}
                defaultValue={"Month"}
                value={educationDetails?.startMonth}
                selectOptions={monthsArray}
                onChange={e => {
                  handleSelectChange("startMonth", e.target?.value);
                }}
                isErrorState={fieldErrors && fieldErrors?.startMonth ? true : false}
                errorMessage={fieldErrors?.startMonth}
              />
              <CustomSelectInput
                className={styles.Select}
                defaultValue={"Year"}
                value={educationDetails?.startYear}
                selectOptions={generateYearArray()}
                onChange={e => handleSelectChange("startYear", e.target?.value)}
                isErrorState={fieldErrors && fieldErrors?.startYear ? true : false}
                errorMessage={fieldErrors?.startYear}
              />
            </div>
          </label>
          <div className={styles.CurrentlyPursuing}>
            <input
              type="checkbox"
              style={{ color: "var(--primary-green)" }}
              value={educationDetails?.isCurrentlyPursuing}
              onChange={e => handleSelectChange("isCurrentlyPursuing", e.target?.checked)}
              checked={educationDetails?.isCurrentlyPursuing ? true : false}
            />
            <span className={styles.SubHeading}>I'm currently pursuing</span>
          </div>
          {educationDetails?.isCurrentlyPursuing ? null : (
            <>
              <>
                <label>
                  <h2 className={styles.SubHeading}>End Date*</h2>
                  <div className={styles.DateWrapper}>
                    <CustomSelectInput
                      className={styles.Select}
                      defaultValue={"Month"}
                      selectOptions={monthsArray}
                      onChange={e => handleSelectChange("endMonth", e.target?.value)}
                      value={educationDetails?.endMonth}
                      isErrorState={fieldErrors && fieldErrors?.endMonth ? true : false}
                      errorMessage={fieldErrors?.endMonth}
                    />
                    <CustomSelectInput
                      className={styles.Select}
                      defaultValue={"Year"}
                      selectOptions={generateYearArray()}
                      onChange={e => handleSelectChange("endYear", e.target?.value)}
                      value={educationDetails?.endYear}
                      isErrorState={fieldErrors && fieldErrors?.endYear ? true : false}
                      errorMessage={fieldErrors?.endYear}
                    />
                  </div>
                </label>
                {fieldErrors && fieldErrors?.endDate && (
                  <div style={{ color: "rgba(214, 97, 90, 1)", fontSize: "12px" }}>{fieldErrors?.endDate}</div>
                )}
              </>
              <CustomInput
                placeholder={"Ex: 8.8"}
                labelClassName={styles.Label}
                showLabel
                label={"Grade"}
                onChange={handleInputChange}
                name="grade"
                type={"number"}
                isErrorState={fieldErrors && fieldErrors?.grade ? true : false}
                errorMessage={fieldErrors?.grade}
                value={educationDetails?.grade}
              />
            </>
          )}
          {/* <CustomInput
            placeholder={"Ex: 8.8"}
            labelClassName={styles.Label}
            showLabel
            label={"Grade"}
            onChange={handleInputChange}
            name="grade"
            type={"number"}
            isErrorState={fieldErrors && fieldErrors?.grade ? true : false}
            errorMessage={fieldErrors?.grade}
            value={educationDetails?.grade}
          /> */}
          <CustomInput
            placeholder={"Certifications, Awards , Recognitions, and Achievements"}
            labelClassName={styles.Label}
            showLabel
            label={"Description"}
            onChange={handleInputChange}
            name="description"
            value={educationDetails?.description}
            isErrorState={fieldErrors && fieldErrors?.description ? true : false}
            errorMessage={fieldErrors?.description}
          />
          <Button
            text={"Save"}
            btnType={"primary"}
            className={styles.SaveBtn}
            onClick={handleSave}
            isDisabled={hasError}
          />
        </div>
      ) : (
        <>
          <div className={styles.Header}>
            <h2 className={styles.Heading}>Education</h2>
            <h2
              onClick={handleAddQualification}
              style={{ cursor: "pointer", color: "var(--primary-green)", fontWeight: 500 }}>
              Add Qualification
            </h2>
          </div>
          {user?.education?.length > 0 ? (
            user?.education?.map(
              (
                {
                  school,
                  startMonth,
                  startYear,
                  endMonth,
                  endYear,
                  description,
                  degree,
                  field_of_study,
                  isCurrentlyPursuing,
                  _id,
                },
                index,
              ) => {
                return (
                  <div className={styles.Wrapper} key={index}>
                    <div className={styles.Qualification}>
                      <div className={styles.UpperSection}>
                        <div className={styles.SubHeadingWrapper}>
                          <h2 className={styles.SubHeading}>
                            {degree}, {field_of_study}
                          </h2>
                          <span className={styles.University}>{school}</span>
                          <p className={styles.Duration}>
                            {startMonth && startYear ? startMonth + "/" + startYear : "Month/Year"} -{" "}
                            {isCurrentlyPursuing ? "Present" : endMonth && endYear ? endMonth + "/" + endYear : "Month/Year"}
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
                              handleEditClick(_id);
                            }}
                          />
                          <DeleteIcon
                            sx={{
                              color: "var(--red-error)",
                              fontSize: "1.3rem",
                              cursor: "pointer",
                            }}
                            onClick={() => handleShowDeleteConfirmPopup(_id, handleDeleteClick)}
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
            <h2 style={{ margin: "auto" }}>Please add your education details...</h2>
          )}
        </>
      )}
    </>

};

export default EducationComponent;
