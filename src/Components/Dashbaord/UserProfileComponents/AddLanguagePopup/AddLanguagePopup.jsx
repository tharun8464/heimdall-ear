import { Close } from "@material-ui/icons";
import styles from "./AddLanguagePopup.module.css";
import usePopup from "../../../../Hooks/usePopup";
import Button from "../../../Button/Button";
import React, { useEffect, useState } from "react"; // Ensure React and useState are imported
import useUser from "../../../../Hooks/useUser";
import { useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { notify } from "../../../../utils/notify";
import { v4 } from "uuid";

const AddLanguagePopup = ({ isMobile }) => {
  const { handlePopupCenterOpen } = usePopup();
  const [languageDetails, setLanguageDetails] = useState([]);
  const [isAddLanguage, setIsAddLanguage] = useState(false);

  const [deletedId, setDeletedId] = useState([])

  const { handleUpdateLanguage, handleGetAllLanguages } = useUser();
  const { userDetails, allLanguages } = useSelector(state => state.user);

  const handleClosePopup = () => {
    handlePopupCenterOpen(false);
  };
  const handleSave = () => {
    // if (languageDetails?.length === 0) {
    //   if (deletedId?.length === 0 || deletedId[0] === undefined) {
    //     notify("Error : No language to delete", "error")
    //     return
    //   }
    // }
    // Check if every entry in languageDetails has at least one proficiency set to true
    const isEveryProficiencyTrue = languageDetails.every(detail =>
      detail.proficiency.read || detail.proficiency.write || detail.proficiency.speak
    );

    // Check if any language name is empty
    const isAnyLanguageEmpty = languageDetails.some(detail => !detail.language.name.trim());

    if (!isEveryProficiencyTrue) {
      notify("Error: Each language must have at least one proficiency selected", "error");
      return; // Stop the function if any entry does not have a proficiency set
    }

    if (isAnyLanguageEmpty) {
      notify("Error: Language name cannot be empty", "error");
      return; // Stop the function if any language name is empty
    }

    handleUpdateLanguage({ userId: userDetails?.user?._id, languageDetails });
    setIsAddLanguage(false);
    setDeletedId([])

    handleClosePopup()
  };

  const handleInputChange = (value, languageId) => {
    // Update language based on _id
    setLanguageDetails(currentDetails =>
      currentDetails.map(detail =>
        detail?.languageUniqueId === languageId ? { ...detail, language: value } : detail,
      ),
    );
  };

  const handleProficiencyChange = (event, languageId) => {
    const { name, checked } = event.target;
    // Update proficiency based on _id
    setLanguageDetails(prevState =>
      prevState.map(item =>
        item.languageUniqueId === languageId
          ? { ...item, proficiency: { ...item.proficiency, [name]: checked } }
          : item,
      ),
    );
  };

  const handleAddLanguage = () => {
    setLanguageDetails(prevState => [
      ...prevState,
      {
        languageUniqueId: v4(), // unique identifier for the new entry
        language: { name: "" },
        proficiency: { read: false, write: false, speak: false },
      },
    ]);
  };

  useEffect(() => {
    handleGetAllLanguages();
  }, []);

  useEffect(() => {
    setLanguageDetails(userDetails?.user?.languageProficiency?.length > 0 ? userDetails?.user?.languageProficiency : [{
      language: { name: "" },
      proficiency: { read: false, write: false, speak: false },
    },
    ],
    );
  }, [userDetails]);

  const selectedValues = _id => {
    const detail = languageDetails.find(detail => detail?.languageUniqueId === _id);
    return detail && detail.language ? detail.language : "";
  };

  const handleDeleteLanguage = _id => {
    setDeletedId([...deletedId, _id])
    setLanguageDetails(prevState => prevState.filter(item => item?.languageUniqueId !== _id));
  };

  return (isMobile ?
    <div className={` ${styles.MobileWrapper}`}>
      <div className={styles.Header}>
        <h2 className={styles.Heading}>Language proficiency </h2>
        <Close onClick={handleClosePopup} style={{ cursor: "pointer" }} />
      </div>
      {languageDetails.map(({ _id, languageUniqueId, language, proficiency }) => {
        const isLanguageSaved = userDetails?.user?.languageProficiency?.some(
          savedLang => savedLang._id === _id || savedLang.languageUniqueId === languageUniqueId
        );
        return (
          <div className={styles.InputWrapper} key={_id}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={allLanguages ?? []}
              getOptionLabel={option => option.name}
              value={selectedValues(languageUniqueId)}
              sx={{
                width: "100%",
                boxShadow: "none",
                "& .MuiAutocomplete-input": {
                  boxShadow: "none",
                },
              }}
              renderInput={params => <TextField label="Language" {...params} />}
              onChange={(event, newValue) => handleInputChange(newValue, languageUniqueId)}
              clearIcon={false}
            />
            <div className={styles.SelectWrapper}>
              <h2 className={styles.SubHeading}>Proficiency</h2>
              <div className={styles.RadioWrapper}>
                <div className={styles.RadioInputWrapper}>
                  <input
                    type="checkbox"
                    style={{ color: "var(--primary-green)" }}
                    name="read" // Use the same name as in the proficiency object
                    onChange={e => handleProficiencyChange(e, languageUniqueId)}
                    checked={
                      languageDetails.find(detail => detail?.languageUniqueId === languageUniqueId)?.proficiency.read
                    } // Use the object's boolean value for checked
                  />
                  <label htmlFor="read">Read</label>
                </div>
                <div className={styles.RadioInputWrapper}>
                  <input
                    type="checkbox"
                    style={{ color: "var(--primary-green)" }}
                    name="write" // Use the same name as in the proficiency object
                    onChange={e => handleProficiencyChange(e, languageUniqueId)}
                    checked={
                      languageDetails.find(detail => detail?.languageUniqueId === languageUniqueId)?.proficiency
                        .write
                    } // Use the object's boolean value for checked
                  />
                  <label htmlFor="write">Write</label>
                </div>
                <div className={styles.RadioInputWrapper}>
                  <input
                    type="checkbox"
                    name="speak"
                    onChange={e => handleProficiencyChange(e, languageUniqueId)}
                    checked={
                      languageDetails.find(detail => detail?.languageUniqueId === languageUniqueId)?.proficiency
                        .speak
                    }
                    style={{ color: "var(--primary-green)" }}
                  />
                  <label htmlFor="speak">Speak</label>
                </div>
                <DeleteIcon
                  sx={{
                    cursor: "pointer",
                    color: "var(--primary-green)",
                    alignSelf: "flex-end",
                    justifySelf: "flex-end",
                  }}

                  onClick={() => handleDeleteLanguage(languageUniqueId)}
                />
              </div>
            </div>

          </div>
        );
      })}
      <div className={styles.BtnWrapper}>
        <Button text={"Add Language"} btnType={"primary"} onClick={handleAddLanguage} />
        <Button text={"Save"} btnType={"secondary"} onClick={handleSave} />
      </div>
    </div> :
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <h2 className={styles.Heading}>Language proficiency </h2>
        <Close onClick={handleClosePopup} style={{ cursor: "pointer" }} />
      </div>
      {languageDetails.map(({ _id, languageUniqueId, language, proficiency }) => {
        const isLanguageSaved = userDetails?.user?.languageProficiency?.some(
          savedLang => savedLang._id === _id || savedLang.languageUniqueId === languageUniqueId
        );
        return (
          <div className={styles.InputWrapper} key={_id}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={allLanguages ?? []}
              getOptionLabel={option => option.name}
              value={(selectedValues(languageUniqueId).name != "" &&
                selectedValues(languageUniqueId).name != undefined &&
                selectedValues(languageUniqueId).name != null)
                ? selectedValues(languageUniqueId) : null}
              sx={{
                width: "100%",
                boxShadow: "none",
                "& .MuiAutocomplete-input": {
                  boxShadow: "none",
                },
              }}
              renderInput={params => <TextField label="Language" {...params} />}
              onChange={(event, newValue) => handleInputChange(newValue, languageUniqueId)}
              clearIcon={false}
            />
            <div className={styles.SelectWrapper}>
              <h2 className={styles.SubHeading}>Proficiency</h2>
              <div className={styles.RadioWrapper}>
                <div className={styles.RadioInputWrapper}>
                  <input
                    type="checkbox"
                    style={{ color: "var(--primary-green)" }}
                    name="read" // Use the same name as in the proficiency object
                    onChange={e => handleProficiencyChange(e, languageUniqueId)}
                    checked={
                      languageDetails.find(detail => detail?.languageUniqueId === languageUniqueId)?.proficiency.read
                    } // Use the object's boolean value for checked
                  />
                  <label htmlFor="read">Read</label>
                </div>
                <div className={styles.RadioInputWrapper}>
                  <input
                    type="checkbox"
                    style={{ color: "var(--primary-green)" }}
                    name="write" // Use the same name as in the proficiency object
                    onChange={e => handleProficiencyChange(e, languageUniqueId)}
                    checked={
                      languageDetails.find(detail => detail?.languageUniqueId === languageUniqueId)?.proficiency
                        .write
                    } // Use the object's boolean value for checked
                  />
                  <label htmlFor="write">Write</label>
                </div>
                <div className={styles.RadioInputWrapper}>
                  <input
                    type="checkbox"
                    name="speak"
                    onChange={e => handleProficiencyChange(e, languageUniqueId)}
                    checked={
                      languageDetails.find(detail => detail?.languageUniqueId === languageUniqueId)?.proficiency
                        .speak
                    }
                    style={{ color: "var(--primary-green)" }}
                  />
                  <label htmlFor="speak">Speak</label>
                </div>
              </div>
            </div>
            <DeleteIcon
              sx={{
                cursor: "pointer",
                color: "var(--primary-green)",
                alignSelf: "flex-end",
                justifySelf: "flex-end",
                marginBottom: "1rem",
              }}
              onClick={() => handleDeleteLanguage(languageUniqueId)}
            />
          </div>
        );
      })}
      <div className={styles.BtnWrapper}>
        <Button text={"Add Language"} btnType={"primary"} onClick={handleAddLanguage} />
        <Button text={"Save"} btnType={"secondary"} onClick={handleSave} />
      </div>
    </div>
  );
};

export default AddLanguagePopup;
