import { Close } from "@material-ui/icons";
import {
  CloudUploadOutlined,
  CloudDownloadOutlined,
  FileUpload,
} from "@mui/icons-material";
import styles from "../../../../assets/stylesheet/addCandidatesComponent.module.css";
import CustomInput from "../../../CustomInput/CustomInput";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Button from "../../../Button/Button";
import { Checkbox, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import usePreEvaluation from "../../../../Hooks/usePreEvaluation";
import { useParams } from "react-router";
import { notify } from "../../../../utils/notify";

const AddCandidatesComponent = ({ setShowAddCandidate, candidateProfiles, candidateLinkedinRequired }) => {
  const [bulkCandidate, setBulkCandidate] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    // Here you can perform any additional actions you need
  };

  const initialCandidateInfo = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    linkedinUrl: "",
    location: "",
  };
  const [candidateInfo, setCandidateInfo] = useState(initialCandidateInfo);
  // console.log("candidateInfo:", candidateInfo);
  const { id: jobId } = useParams();
  // //console.log"jobId:", jobId);
  const { handleAddCandidate, handleAddBulkCandidate } = usePreEvaluation();
  const [selectedCandidate, setSelectedCandidate] = useState([])




  const handleChange = (event) => {
    const { name, value } = event.target;

    setCandidateInfo((prevCandidateInfo) => ({
      ...prevCandidateInfo,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShowAddCandidate(false);
  };
  const handleSubmitOne = (e) => {
    const { value, checked } = e.target

    if (checked === true) {

      let hasvalue = selectedCandidate.includes(value)
      if (!hasvalue) {
        setSelectedCandidate((prev) => ([...prev, value])
        )
      }
    } else if (checked === false) {
      let hasvalue1 = selectedCandidate.filter((cand) => cand !== value)
      setSelectedCandidate(hasvalue1)

    }

  }


  useEffect(() => {

    //do something here
  }, [selectedCandidate, selectAll]);

  // const handleSubmit = () => {
  //   if (
  //     candidateInfo?.firstName === "" ||
  //     candidateInfo?.lastName === "" ||
  //     candidateInfo?.email === "" ||
  //     candidateInfo?.linkedinUrl === ""
  //   ) {
  //     for (let key in candidateInfo) {
  //       if (
  //         candidateInfo[key] === "" &&
  //         (key === "linkedinUrl" ||
  //           key === "email" ||
  //           key === "firstName" ||
  //           key === "lastName")
  //       ) {
  //         notify(`${key} field is required`, "error");
  //       }
  //     }
  //   } else {
  //     handleAddCandidate(candidateInfo, jobId);
  //   }
  // };

  const handleReset = () => {
    setCandidateInfo(initialCandidateInfo);
  };

  const handleAdd = () => {
    // Regular expression for phone number validation (10 digits)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[a-zA-Z ]*$/;
    const locationRegex = /^[a-zA-Z\s]+$/;
    const linkedinRegex = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/gm;

    if (!candidateInfo.firstName) {
      notify(`First name field is required`, "error");
    } else if (!nameRegex.test(candidateInfo.firstName)) {
      notify(`First name should not contain special characters`, "error");
    }

    if (!candidateInfo.lastName) {
      notify(`Last name field is required`, "error");
    } else if (!nameRegex.test(candidateInfo.lastName)) {
      notify(`Last name should not contain special characters`, "error");
    }
    if (!candidateInfo.email) {
      notify(`Email field is required`, "error");
    } else if (!emailRegex.test(candidateInfo.email)) {
      notify(`Please enter a valid email address`, "error");
    }
    if (!candidateInfo.phoneNo) {
      notify(`Phone number field is required`, "error");
    } else if (!phoneRegex.test(candidateInfo.phoneNo)) {
      notify(`Please enter a valid 10-digit phone number`, "error");
    }
    if (candidateLinkedinRequired === true) {
      if (!candidateInfo.linkedinUrl) {
        notify(`Linkedin URL field is required`, "error");
        return
      } else if (!linkedinRegex.test(candidateInfo.linkedinUrl)) {
        notify(`please enter a valid linkedin url`, "error");
        return
      }
    }
    if (candidateInfo.location && !locationRegex.test(candidateInfo.location)) {
      notify(`Location should not contain special characters`, "error");
    }

    if (
      candidateInfo.firstName &&
      candidateInfo.lastName &&
      candidateInfo.email &&
      emailRegex.test(candidateInfo.email) &&
      candidateInfo.phoneNo &&
      phoneRegex.test(candidateInfo.phoneNo)
    ) {
      if (candidateInfo?.linkedinUrl !== "") {
        // Check if candidateInfo is already present in bulkCandidate
        const isDuplicate = bulkCandidate.some(
          (candidate) =>
            candidate.email === candidateInfo.email ||
            candidate.phoneNo === candidateInfo.phoneNo ||
            candidate.linkedinUrl === candidateInfo.linkedinUrl
        );
        const isDuplicateInProfiles = candidateProfiles.some(
          (profile) =>
            profile.email === candidateInfo.email ||
            profile.phoneNo === candidateInfo.phoneNo ||
            profile.linkedinUrl === candidateInfo.linkedinUrl
        );
        if (isDuplicate || isDuplicateInProfiles) {
          // Handle duplicate case, e.g., show a notification for each duplicate
          notify(
            candidateInfo.firstName +
            " " +
            candidateInfo.lastName +
            " is already added.",
            "error"
          );
        }
        // Create a new array by spreading the existing bulkCandidate and adding candidateInfo
        const newBulkCandidate = [...bulkCandidate, candidateInfo];
        // Update the state with the new array
        setBulkCandidate(newBulkCandidate);
        // Optionally, you can reset the candidateInfo state after adding it to bulkCandidate
        setCandidateInfo(initialCandidateInfo);
      }
      if (candidateInfo?.linkedinUrl === "") {
        const isDuplicate = bulkCandidate.some(
          (candidate) =>
            candidate.email === candidateInfo.email ||
            candidate.phoneNo === candidateInfo.phoneNo
        );
        const isDuplicateInProfiles = candidateProfiles.some(
          (profile) =>
            profile.email === candidateInfo.email ||
            profile.phoneNo === candidateInfo.phoneNo
        );
        if (isDuplicate || isDuplicateInProfiles) {
          // Handle duplicate case, e.g., show a notification for each duplicate
          notify(
            candidateInfo.firstName +
            " " +
            candidateInfo.lastName +
            " is already added.",
            "error"
          );
        }
        // Create a new array by spreading the existing bulkCandidate and adding candidateInfo
        const newBulkCandidate = [...bulkCandidate, candidateInfo];
        // Update the state with the new array
        setBulkCandidate(newBulkCandidate);
        // Optionally, you can reset the candidateInfo state after adding it to bulkCandidate
        setCandidateInfo(initialCandidateInfo);
      }
    }
  };

  const handleUploadClick = (e) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[a-zA-Z ]*$/;
    const locationRegex = /^[a-zA-Z\s]+$/;
    const linkedinRegex = /https:\/\/(?:[a-z]+\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/;



    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];

      if (!file) {
        return;
      }
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        const lines = csvText.split("\n");
        let candidatesArr = [];
        lines.map((line) => {
          const header = line.split(",");
          candidatesArr.push(header);
        });
        candidatesArr.shift();
        if (candidatesArr.length > 0) {
          let candidatesData = [];
          for (let i = 0; i < candidatesArr.length; i++) {
            if (
              candidatesArr[i][0] &&
              candidatesArr[i][1] &&
              candidatesArr[i][5] // Check for the presence of email
            ) {

              const candidate = {
                firstName: candidatesArr[i][0].trim(), // Trim to remove extra spaces
                lastName: candidatesArr[i][1].trim(), // Trim to remove extra spaces
                phoneNo: candidatesArr[i][2].trim(), // Trim to remove extra spaces
                location: candidatesArr[i][3].trim(), // Trim to remove extra spaces
                linkedinUrl: candidatesArr[i][4].trim(), // Trim to remove extra spaces
                email: candidatesArr[i][5].trim(), // Trim to remove extra spaces
              };

              if (!candidate.firstName || !nameRegex.test(candidate.firstName)) {
                notify(`Invalid first name for candidate ${i + 1}. Please check .`, "error");
                continue;
              }

              if (!candidate.lastName || !nameRegex.test(candidate.lastName)) {
                notify(`Invalid last name for candidate ${i + 1}. Please check .`, "error");
                continue;
              }

              if (!candidate.email || !emailRegex.test(candidate.email)) {
                notify(`Invalid email for candidate ${i + 1}: ${candidate.firstName} ${candidate.lastName}. Please check .`, "error");
                continue;
              }

              if (!candidate.phoneNo || !phoneRegex.test(candidate.phoneNo)) {
                notify(`Invalid phone number for candidate ${i + 1}: ${candidate.firstName} ${candidate.lastName}. Please check.`, "error");
                continue;
              }

              if (!candidate.linkedinUrl || !linkedinRegex.test(candidate.linkedinUrl)) {
                notify(`Invalid LinkedIn URL for candidate ${i + 1}: ${candidate.firstName} ${candidate.lastName}. Please check .`, "error");
                continue;
              }

              candidatesData.push(candidate);
            }
          }

          // Spread the elements of candidatesData into the newBulkCandidate array
          const newBulkCandidate = [...bulkCandidate, ...candidatesData];
          // Update the state with the new array
          setBulkCandidate(newBulkCandidate);
        }
      };
      reader.readAsText(file);
    });
    fileInput.click();
  };

  const handleDeleteCandidate = (e, firstName) => {
    if(bulkCandidate?.length === 1){
      setBulkCandidate([]);
      setSelectAll(false);
      return
    }
    if (bulkCandidate) {
      const index = bulkCandidate.findIndex(
        (candidate) => candidate.firstName === firstName
      );
      const newBulkCandidate = [...bulkCandidate];
      newBulkCandidate.splice(index, 1);

      const objectToCsv = function (data) {
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(","));

        for (const row of data) {
          const values = headers.map((header) => {
            const val = row[header];
            return `"${val}"`;
          });

          csvRows.push(values.join(","));
        }
        return csvRows.join("\n");
      };

      const csvText = objectToCsv(newBulkCandidate);

      window.URL = window.webkitURL || window.URL;
      const contentType = "text/csv";
      const blob = new Blob([csvText], { type: contentType });
      const file = new File([blob], "newCsvFile.csv");
      setCsvFile(file);
      setBulkCandidate(newBulkCandidate);
    }
  };

  const handleAddBulkClick = async () => {
    // handleAddBulkCandidate(bulkCandidate, jobId);
    // setBulkCandidate([]);
    let bulkselectedArr = []

    if (selectAll === true) {
      handleAddBulkCandidate(bulkCandidate, jobId);
      setBulkCandidate([]);
      setSelectAll(false)
    } else {
      let addcand = selectedCandidate.map((cand) => {

        let actualadd = bulkCandidate.map((bulkcand) => {
          if (cand === bulkcand.email) {
            bulkselectedArr.push(bulkcand)

          }

        })
      })
      if (bulkselectedArr.length > 0) {
        handleAddBulkCandidate(bulkselectedArr, jobId);
        setBulkCandidate([]);
      }

    }
    //     handleAddBulkCandidate(bulkCandidate, jobId);
    // setBulkCandidate([]);
  };

  // Function to handle the click event for downloading the template
  const handleDownloadTemplate = () => {
    const csvContent =
      "firstName,lastName,phoneNo,location,linkedinUrl,email \n <John>,<Smith>,<xxx-xxx-xxxx>,<New York>,<https://www.linkedin.com/name >, <john.smith@someemail.com>";
    // Create a Blob object containing the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    // Create a temporary anchor element and trigger the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "add_bulk_candidates_template.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAll = () => {
    setBulkCandidate([]);
    setSelectAll(false);
  };

  useEffect(() => { }, [candidateInfo, bulkCandidate]); // useEffect will run whenever candidateInfo changes

  return (
    <div className={styles.Wrapper}>
      <div className={styles.HeadingWrapper}>
        <h2 className={styles.Heading}>Add candidates to shortlist</h2>
        <Close className={styles.Close} onClick={handleClose} />
      </div>
      <div className={styles.Upload}>
        <div style={{ color: "#228276" }}>
          <CloudDownloadOutlined />
        </div>
        <span
          style={{ color: "#228276" }}
          onClick={(e) => handleDownloadTemplate()}
        >
          Template
        </span>
        <div style={{ color: "#228276" }}>
          <CloudUploadOutlined />
        </div>
        <span
          style={{ color: "#228276" }}
          onClick={(e) => handleUploadClick(e)}
        >
          Upload CSV
        </span>
      </div>
      <Divider />
      <form action="" className={styles.Form}>
        <div className={styles.NameWrapper}>
          <CustomInput
            className={styles.Input}
            placeholder={"First Name"}
            name="firstName"
            type="text"
            value={candidateInfo.firstName}
            onChange={handleChange}
            required
            maxLength={25}
          />
          <CustomInput
            className={styles.Input}
            placeholder={"Last Name"}
            name="lastName"
            value={candidateInfo.lastName}
            onChange={handleChange}
            required
            maxLength={25}
          />
        </div>
        <CustomInput
          className={styles.Input}
          placeholder={"Email"}
          name="email"
          type="email"
          value={candidateInfo.email}
          onChange={handleChange}
          required
          maxLength={50}

        />
        <CustomInput
          className={styles.Input}
          placeholder={"Phone no"}
          name="phoneNo"
          value={candidateInfo.phoneNo}
          onChange={handleChange}
          maxLength={10}

        />
        <CustomInput
          className={styles.Input}
          placeholder={"LinkedIn URL"}
          name="linkedinUrl"
          value={candidateInfo.linkedinUrl}
          onChange={handleChange}
          maxLength={100}
        />
        <CustomInput
          className={styles.Input}
          placeholder={"Location"}
          name="location"
          value={candidateInfo.location}
          onChange={handleChange}
          maxLength={50}


        />
      </form>
      <div className={styles.BtnWrapper}>
        {/* for later use */}
        <Button
          text={"Add"}
          btnType={"primary"}
          icon={<PersonAddAlt1Icon sx={{ fontSize: "20px" }} />}
          isReverse={true}
          className={styles.BtnClass}
          onClick={handleAdd}
        />
        <Button
          text={"Reset"}
          className={styles.ResetBtnCLass}
          onClick={handleReset}
        />
      </div>
      {/* to be used for bulk add feature */}
      <div className={styles.Header}>
        <div>
          <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
          <span>Name</span>
        </div>
        {selectAll && (
          <div onClick={handleDeleteAll}>
            <DeleteIcon />
          </div>
        )}
      </div>
      <div className={styles.NameListWrapper}>
        {bulkCandidate &&
          bulkCandidate.map((candidate) => {
            return (
              <div>
                {selectAll ?
                  <div>
                    <div className={styles.CandidateWrapper}>
                      <div>
                        {/* <Checkbox checked={selectAll} disabled="true" /> */}

                        <Checkbox checked={selectAll} disabled="true" />


                        <span>
                          {candidate.firstName} {candidate.lastName}
                        </span>
                      </div>
                      <div
                        className={styles.DeleteIcon}
                        onClick={(e) =>
                          handleDeleteCandidate(e, candidate.firstName)
                        }
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                    <Divider />
                  </div>
                  :
                  <div>
                    <div className={styles.CandidateWrapper}>
                      <div>

                        {" "}<Checkbox value={candidate.email} onChange={handleSubmitOne} />

                        <span>
                          {candidate.firstName} {candidate.lastName}
                        </span>
                      </div>
                      <div
                        className={styles.DeleteIcon}
                        onClick={(e) =>
                          handleDeleteCandidate(e, candidate.firstName)
                        }
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                    <Divider />
                  </div>



                }</div>


            );
          })}
      </div>
      <div className={styles.BottomBtnsWrapper}>
        <Button
          text={"Cancel"}
          btnType={"secondary"}
          className={styles.BtnClass}
          onClick={handleClose}
        />
        <Button
          text={"Submit"}
          btnType={"primary"}
          className={styles.BtnClass}
          onClick={handleAddBulkClick}
        />
      </div>
    </div>
  );
};

export default AddCandidatesComponent;
