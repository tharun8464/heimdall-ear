import { Close } from "@material-ui/icons";
import styles from "./SkillsComponent.module.css";
import CustomInput, { CustomSelectInput } from "../../../CustomInput/CustomInput";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "../../../Button/Button";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SkillDetailComponent from "./SkillDetailComponent/SkillDetailComponent";
import NewEdit from "../../../../assets/images/NewEdit.svg";
import TagsInput from "../../../TagsInputComponent/TagsInputComponent";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import useUser from "../../../../Hooks/useUser";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ReactComponent as ExpandIcon } from "../../../../assets/images/Profile/ExpandIcon.svg";
import ErrorIcon from "@mui/icons-material/Error";



const SkillsComponent = ({ isMobile }) => {
  const levels = [
    { text: "Beginner", value: "Beginner" },
    { text: "Intermediate", value: "Intermediate" },
    { text: "Advanced", value: "Advanced" },
    { text: "Expert", value: "Expert" },
    { text: "Expert Pro", value: "Expert Pro" },
  ];
  const { handleGetPrimarySkills, handleAddSkill, handleDeleteSkill, handleUpdateSkill } =
    useUser();
  const [newSkill, setNewSkill] = useState(null);
  // console.log("newSkill:", newSkill);
  const { primarySkills, userDetailsWithoutLinkedin:userDetails } = useSelector(state => state.user);
  const { user } = userDetails ?? {};

  const [skillInfo, setSkillInfo] = useState([]);
  // console.log("skillInfo:", skillInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [skillEditId, setSkillEditId] = useState(null);
  const [selectedTagInputItem, setSelectedTagInputItem] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event, _id) => {  
    const { name, value } = event.target;

    if ((value >= 0 && value < 100) || (value === "Beginner" || value === "Intermediate" || value === "Expert Pro" || value === "Advanced" || value === "Expert")) {
      if (value.match(/\./g)) {
        const [, decimal] = value.split('.');
        // restrict value to only 2 decimal places
        if (decimal?.length > 2) {
          // do nothing
          return;
        }
      }
      setSkillInfo(prevState =>
        prevState.map(skill =>
          skill._id === _id
            ? { ...skill, skillDetails: { ...skill.skillDetails, [name]: value } }
            : skill,
        ),
      );
    } else {
      return;
    }
    // setSkillInfo(prevState =>
    //   prevState.map(skill =>
    //     skill._id === _id
    //       ? { ...skill, skillDetails: { ...skill.skillDetails, [name]: value } }
    //       : skill,
    //   ),
    // );

  };

  const handleEdit = _id => {
    setIsEditing(true);
    if (_id) {
      // setSkillEditId(_id);
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSelecetedTags = items => {
    // if (skillEditId) {
    setSkillInfo(prevState =>
      prevState.map(skill => {
        // console.log("skill:", skill);
        return skill._id === skillEditId ? { ...skill, subSkills: items } : skill;
      }),
    );
    // } else {
    setNewSkill(prevState => ({
      ...prevState,
      subSkills: items,
    }));
    // }
  };

  useEffect(() => {
    handleGetPrimarySkills();
  }, []);

  useEffect(() => {
    setSkillInfo(Array.isArray(user?.skills) ? user?.skills : []);
  }, [user]);

  const handleSkillSelection = (event, value) => {
    const id = v4();
    setNewSkill(prevState => ({
      ...prevState,
      skillName: value,
      _id: id,
    }));
    setSkillEditId(id);
  };


  const validateSkill = (skill) => {
    const newErrors = {};
    if (!skill.skillDetails?.experience) {
      newErrors.experience = "Experience is required.";
    }
    if (skill?.skillDetails?.experience < 0) {
      newErrors.experience = "Experience cannot be negative."
    }
    if (skill?.skillDetails?.experience > 100) {
      newErrors.experience = "Please enter a valid number of years of experience (0-100)"
    }
    if (!skill.skillDetails?.level || skill.skillDetails?.level === "Select") {
      newErrors.level = "Level is required.";
    }
    if (skill?.skillDetails?.experience.match(/\./g)) {
      const [, decimal] = skill?.skillDetails?.experience.split('.');
      if (decimal?.length > 2) {
        newErrors.experience = "Please enter decimal value of 2 digits";

      }
    }
    return newErrors;
  };

  const handleSaveSkill = () => {
    let allErrors = {};
    let isValid = true;

    // Validate new skill if it exists
    if (newSkill?.skillName) {
      const skillErrors = validateSkill(newSkill);
      if (Object.keys(skillErrors).length > 0) {
        allErrors.newSkill = skillErrors;
        isValid = false;
      }
    }

    // Validate each skill in skillInfo
    const updatedSkills = skillInfo.map(skill => {
      const skillErrors = validateSkill(skill);
      if (Object.keys(skillErrors).length > 0) {
        allErrors[skill._id] = skillErrors; // Store errors by skill ID
        isValid = false;
      }
      return skill;
    });

    if (!isValid) {
      setErrors(allErrors);
      return; // Stop the save if there are errors
    }

    // Proceed with updating skills
    if (newSkill?.skillName) {
      handleUpdateSkill({
        userId: userDetails?.user?._id,
        skills: [...updatedSkills, newSkill],
      });
    } else {
      handleUpdateSkill({
        userId: userDetails?.user?._id,
        skills: updatedSkills,
      });
    }
    handleCloseEdit();
    setNewSkill(null);
    setErrors({})
  };

  const handleDeleteClick = skillId => {
    handleDeleteSkill({ userId: userDetails?.user?._id, skillId: skillId });
  };

  // const handleNewSkillInput = event => {
  //   const { name, value } = event.target;
  //   setNewSkill(prevState => ({
  //     ...prevState,
  //     skillDetails: {
  //       ...prevState.skillDetails,
  //       [name]: value,
  //     },
  //   }));
  // };
  const handleNewSkillInput = event => {
    const { name, value } = event.target;
    if ((value >= 0 && value < 100) || (value === "Beginner" || value === "Intermediate" || value === "Expert Pro" || value === "Advanced" || value === "Expert")) {
      if (value.match(/\./g)) {
        const [, decimal] = value.split('.');
        // restrict value to only 2 decimal places
        if (decimal?.length > 2) {
          // do nothing
          return;
        }
      }
      setNewSkill(prevState => ({
        ...prevState,
        skillDetails: {
          ...prevState.skillDetails,
          [name]: value,
        },
      }));
    } else {
      return;
    }
  };

  const handleEditSkill = _id => {
    setSkillEditId(_id);
  };

  const handleDeleteNewSkill = () => {
    setNewSkill(null);
  };

  useEffect(() => {
    if (skillEditId) {
      setSelectedTagInputItem(
        skillInfo.find(skill => skill._id === skillEditId)?.subSkills || [],
      );
    } else {
      setSelectedTagInputItem(newSkill?.subSkills || []);
    }
  }, [skillEditId]);

  const calculateStars = level => {
    switch (level) {
      case "Beginner":
        return 1;
      case "Intermediate":
        return 2;
      case "Advanced":
        return 3;
      case "Expert":
        return 4;
      case "Expert Pro":
        return 5;
      default:
        return 0; // or any default value you see fit
    }
  };

  return isMobile ? <>
    <Accordion sx={{ borderRadius: "12px", "&::before": { display: "none" } }}>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        {userDetails?.user?.sectionCompletion?.skills ? null : (
          <ErrorIcon className={styles.ErrorIcon} sx={{ color: "rgba(217, 148, 66, 1)", marginRight: "1rem" }} />
        )}
        <span className="font-bold">Skills</span>
      </AccordionSummary>
      <AccordionDetails>
        {isEditing || user?.skills?.length === 0 ? (
          <div className={styles.Wrapper}>
            <div className={styles.Header}>
              <span className={styles.Heading}>Add Skill</span>
              <Close onClick={handleCloseEdit} style={{ cursor: "pointer" }} />
            </div>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={primarySkills?.[0]?.roles}
              sx={{
                width: "100%",
                boxShadow: "none",
                "& .MuiAutocomplete-input": {
                  boxShadow: "none",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "inherit", // Adjust this as needed
                    outline: "none",
                  },
                },
              }}
              renderInput={params => <TextField {...params} />}
              onChange={handleSkillSelection}
            />
            {newSkill?.skillName ? (
              <>
                <div className={styles.SkillsWrapper}>
                  <div className={styles.SkillHeading}>
                    <h2 className={styles.SubHeading}>{newSkill.skillName}</h2>
                    <img
                      src={NewEdit}
                      style={{ cursor: "pointer" }}
                      alt="edit"
                      onClick={() => handleEditSkill(newSkill?._id)}
                    />
                  </div>

                  <DeleteIcon
                    sx={{ cursor: "pointer", color: "var(--primary-green)" }}
                    onClick={() => handleDeleteNewSkill()}
                  />
                </div>
                <CustomInput
                  showLabel
                  labelClassName={styles.Label}
                  label={"Experience (In Years)"}
                  value={newSkill.skillDetails?.experience || ""}
                  type="number"
                  name="experience"
                  onChange={event => handleNewSkillInput(event)}
                  isErrorState={!!errors.newSkill?.experience}
                  errorMessage={errors.newSkill?.experience}
                />

                <div className={styles.SelectWrapper}>
                  <h2 className={styles.SubHeading}>Level</h2>
                  <CustomSelectInput
                    className={styles.Select}
                    label={"Level"}
                    selectOptions={levels}
                    name="level"
                    defaultValue={newSkill.skillDetails?.level || "Select"}
                    value={newSkill.skillDetails?.level || ""}
                    onChange={event => handleNewSkillInput(event)}
                    isErrorState={!!errors.newSkill?.level}
                    errorMessage={errors.newSkill?.level}
                  />
                </div>
              </>

            ) : null}
            {user?.skills?.map(({ _id, skillName, skillDetails }) => {
              return (
                <>
                  <div key={_id} className={styles.SkillsWrapper}>
                    <div className={styles.SkillHeading}>
                      <h2 className={styles.SubHeading}>{skillName}</h2>
                      <img
                        src={NewEdit}
                        style={{ cursor: "pointer" }}
                        alt="edit"
                        onClick={e => handleEditSkill(_id)}
                      />
                    </div>

                    <DeleteIcon
                      sx={{ cursor: "pointer", color: "var(--primary-green)" }}
                      onClick={() => handleDeleteClick(_id)}
                    />

                  </div>
                  <CustomInput
                    showLabel
                    labelClassName={styles.Label}
                    label={"Experience (In Years)"}
                    value={
                      skillInfo.find(skill => skill?._id === _id)?.skillDetails?.experience ||
                      ""
                    }
                    isDisabled={skillEditId !== _id ? true : false}
                    type="number"
                    name="experience"
                    onChange={event => handleInputChange(event, _id)}
                    isErrorState={!!errors[_id]?.experience}
                    errorMessage={errors[_id]?.experience}
                    className={styles.ExperienceInput}
                  />
                  <div className={styles.SelectWrapper}>
                    <h2 className={styles.SubHeading}>Level</h2>
                    <CustomSelectInput
                      className={styles.Select}
                      label={"Level"}
                      selectOptions={levels}
                      value={
                        skillInfo.find(skill => skill?._id === _id)?.skillDetails?.level || ""
                      }
                      isDisabled={skillEditId !== _id ? true : false}
                      name="level"
                      onChange={event => handleInputChange(event, _id)}
                      defaultValue={
                        skillInfo.find(skill => skill?._id === _id)?.skillDetails?.level ||
                        "Select"
                      }
                      isErrorState={!!errors[_id]?.level}
                      errorMessage={errors[_id]?.level}

                    />
                  </div>
                </>

              );
            })}

            {skillEditId ? (
              <TagsInput
                selectedTags={items => handleSelecetedTags(items)}
                fullWidth
                variant="outlined"
                id="tags"
                name="tags"
                placeholder="Add Skills"
                label="Enter Skills"
                wrapperClassName={styles.TagsInputWrapper}
                selectedItem={selectedTagInputItem}
                setSelectedItem={setSelectedTagInputItem}
              />
            ) : null}

            <Button
              text={"Save"}
              btnType={"primary"}
              onClick={handleSaveSkill}
              className={styles.SaveBtn}
            />
          </div>
        ) : (
          <div className={styles.Wrapper}>
            <div className={styles.AddIconWrapper}>
              {/* <AddIcon onClick={handleEdit} /> */}
              <img
                style={{ cursor: "pointer" }}
                src={NewEdit}
                alt="edit"
                onClick={handleEdit}
              />
            </div>
            {user?.skills?.length > 0 ? (
              user?.skills?.map(skill => {
                const stars = calculateStars(skill?.skillDetails?.level);
                return (
                  <SkillDetailComponent
                    key={skill?._id}
                    chips={skill?.subSkills}
                    stars={stars}
                    heading={skill?.skillName}
                  />
                );
              })
            ) : (
              <h2 style={{ margin: "auto" }}>Please add your skills...</h2>
            )}
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  </> : isEditing || user?.skills?.length === 0 ? (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <span className={styles.Heading}>Add Skill</span>
        <Close onClick={handleCloseEdit} style={{ cursor: "pointer" }} />
      </div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={primarySkills?.[0]?.roles}
        sx={{
          width: "100%",
          boxShadow: "none",
          "& .MuiAutocomplete-input": {
            boxShadow: "none",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "inherit", // Adjust this as needed
              outline: "none",
            },
          },
        }}
        renderInput={params => <TextField {...params} />}
        onChange={handleSkillSelection}
      />
      {newSkill?.skillName ? (
        <div className={styles.SkillsWrapper}>
          <div className={styles.SkillHeading}>
            <h2 className={styles.SubHeading}>{newSkill.skillName}</h2>
            <img
              src={NewEdit}
              style={{ cursor: "pointer" }}
              alt="edit"
              onClick={() => handleEditSkill(newSkill?._id)}
            />
          </div>
          <CustomInput
            showLabel
            labelClassName={styles.Label}
            label={"Experience (In Years)"}
            value={newSkill.skillDetails?.experience || ""}
            type="number"
            name="experience"
            onChange={event => handleNewSkillInput(event)}
            isErrorState={!!errors.newSkill?.experience}
            errorMessage={errors.newSkill?.experience}
          />
          <div className={styles.SelectWrapper}>
            <h2 className={styles.SubHeading}>Level</h2>
            <CustomSelectInput
              className={styles.Select}
              label={"Level"}
              selectOptions={levels}
              name="level"
              defaultValue={newSkill.skillDetails?.level || "Select"}
              value={newSkill.skillDetails?.level || ""}
              onChange={event => handleNewSkillInput(event)}
              isErrorState={!!errors.newSkill?.level}
              errorMessage={errors.newSkill?.level}
            />
          </div>
          <DeleteIcon
            sx={{ cursor: "pointer", color: "var(--primary-green)" }}
            onClick={() => handleDeleteNewSkill()}
          />
        </div>
      ) : null}

      {user?.skills?.map(({ _id, skillName, skillDetails }) => {
        return (
          <div key={_id} className={styles.SkillsWrapper}>
            <div className={styles.SkillHeading}>
              <h2 className={styles.SubHeading}>{skillName}</h2>
              <img
                src={NewEdit}
                style={{ cursor: "pointer" }}
                alt="edit"
                onClick={e => handleEditSkill(_id)}
              />
            </div>
            <CustomInput
              showLabel
              labelClassName={styles.Label}
              label={"Experience (In Years)"}
              value={
                skillInfo.find(skill => skill?._id === _id)?.skillDetails?.experience ||
                ""
              }
              isDisabled={skillEditId !== _id ? true : false}
              type="number"
              name="experience"
              onChange={event => handleInputChange(event, _id)}
              isErrorState={!!errors[_id]?.experience}
              errorMessage={errors[_id]?.experience}

            />
            <div className={styles.SelectWrapper}>
              <h2 className={styles.SubHeading}>Level</h2>
              <CustomSelectInput
                className={styles.Select}
                label={"Level"}
                selectOptions={levels}
                value={
                  skillInfo.find(skill => skill?._id === _id)?.skillDetails?.level || ""
                }
                isDisabled={skillEditId !== _id ? true : false}
                name="level"
                onChange={event => handleInputChange(event, _id)}
                defaultValue={
                  skillInfo.find(skill => skill?._id === _id)?.skillDetails?.level ||
                  "Select"
                }
                isErrorState={!!errors[_id]?.level}
                errorMessage={errors[_id]?.level}
              />
            </div>
            <DeleteIcon
              sx={{ cursor: "pointer", color: "var(--primary-green)", marginTop: "1rem" }}
              onClick={() => handleDeleteClick(_id)}
            />
          </div>
        );
      })}

      {skillEditId ? (
        <TagsInput
          selectedTags={items => handleSelecetedTags(items)}
          fullWidth
          variant="outlined"
          id="tags"
          name="tags"
          placeholder="Add Sub Skills"
          label="Enter Sub Skills"
          wrapperClassName={styles.TagsInputWrapper}
          selectedItem={selectedTagInputItem}
          setSelectedItem={setSelectedTagInputItem}
        />
      ) : null}

      <Button
        text={"Save"}
        btnType={"primary"}
        onClick={handleSaveSkill}
        className={styles.SaveBtn}
      />
    </div>
  ) : (
    <div className={styles.Wrapper}>
      <div className={styles.AddIconWrapper}>
        {/* <AddIcon onClick={handleEdit} /> */}
        <img
          style={{ cursor: "pointer" }}
          src={NewEdit}
          alt="edit"
          onClick={handleEdit}
        />
      </div>
      {user?.skills?.length > 0 && (
        user?.skills?.map(skill => {
          const stars = calculateStars(skill?.skillDetails?.level);
          return (
            <SkillDetailComponent
              key={skill?._id}
              chips={skill?.subSkills}
              stars={stars}
              heading={skill?.skillName}
            />
          );
        })
      )
      }
    </div>
  );
};

export default SkillsComponent;
