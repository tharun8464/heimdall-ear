import React, { useEffect, useState, useRef } from "react";
import CustomInput, { CustomSelectInput } from "../../CustomInput/CustomInput";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styles from "./section.module.css";
import usePodMember from "../../../Hooks/usePodMember";
import getStorage, { getSessionStorage, setSessionStorage, removeSessionStorage } from "../../../service/storageService";
import { Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router";
import { notify } from "../../../utils/notify";
function LeftSection({ inputRef }) {
  const [inputValues, setInputValues] = useState({
    name: "",
    linkedInUrl: "",
    email: "",
    tag: "",
  });

  const [user, setUser] = useState();
  const { id: jobId } = useParams();

  const { handleCreatePodMember } = usePodMember();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleResetInputValues = () => {
    setInputValues({
      name: "",
      linkedInUrl: "",
      email: "",
      tag: "",
    });
  };

  const addMemberValidation = () => {
    let isValid = true;
    if (!inputValues.name) {
      isValid = false;
      notify(`Name is required!`, "error");
    } else if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(inputValues.name)) {
      isValid = false;
      notify(`Special characters, numbers and spaces are not allowed!`, "error");
    }

    if (!inputValues.linkedInUrl) {
      isValid = false;
      notify(`LinkedIn is required!`, "error");
    } else if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(inputValues.linkedInUrl)) {
      isValid = false;
      notify(`LinkedIn Url is not valid!`, "error");
    }

    if (!inputValues.email) {
      isValid = false;
      notify(`Email is required!`, "error");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputValues.email)) {
      isValid = false;
      notify(`Email id is not valid!`, "error");
    }
    if (!inputValues.tag) {
      isValid = false;
      notify(`Role tag is required!`, "error");
    }
    return isValid;
  }

  const handleAddMember = async () => {
    if (inputValues.tag === "Reporting Manager") {
      inputValues.weightage = "50";
    }
    if (inputValues.tag === "Team Lead") {
      inputValues.weightage = "30";
    }
    if (inputValues.tag === "Critical") {
      inputValues.weightage = "20";
    }
    if (inputValues.tag === "Non-critical") {
      inputValues.weightage = "10";
    }
    if (inputValues.tag === "Reportee") {
      inputValues.weightage = "10";
    }
    if (addMemberValidation()) {
      const res = await handleCreatePodMember(user?.company_id, { jobId, ...inputValues });
      if (res?.status === 400) {
        notify(`${res?.data?.error}`, 'error');
      }
      handleResetInputValues();
    }

  };

  const getUserInfo = async () => {
    let user = JSON.parse(await getSessionStorage("user"));
    setUser(user);
  };

  useEffect(() => {
    getUserInfo();

  }, []);
  const designation = [
    { designation: "Reporting Manager", value: 50 },
    { designation: "Team Lead", value: 30 },
    { designation: "Critical Peer", value: 20 },
    { designation: "Non-Critical Peer", value: 10 },
    { designation: "Critical Reportee", value: 20 },
    { designation: "Non-Critical Reportee", value: 10 },

  ];

  return (
    <div className={styles.LeftSectionWrapper}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <div>
            <h1 className={styles.AddMemberHeading}>Add Colleague</h1>
          </div>
          {/* <div>
            <i className="fa fa-caret-down"></i>
          </div> */}
        </div>
        <div className={`${styles.common} ${styles.container}`}>
          <CustomInput
            placeholder="Colleague Name"
            className={styles.CustomInputClass}
            onChange={handleChange}
            name="name"
            value={inputValues.name}
            inputRef={inputRef}
          ></CustomInput>
        </div>
        {/* <div className={styles.LinkedInOrEmailWrapper}> */}
        <div
          className={`${styles.common} ${styles.container} ${styles.inputCont}`}
        >
          <CustomInput
            placeholder="LinkedIn URL"
            className={styles.CustomInputClass}
            onChange={handleChange}
            name="linkedInUrl"
            value={inputValues.linkedInUrl}
          ></CustomInput>
          {/* <div className={styles.recommendedText}>Recommended</div> */}
        </div>
        {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "8px",
              zIndex: "1",
            }}
          > */}
        {/* <div
              style={{
                width: "40%",
                borderTop: "1px solid var(--border-grey)",
                zIndex: "2",
              }}
            ></div> */}
        {/* <span>Or</span> */}
        {/* <div
              style={{
                width: "40%",
                borderTop: "1px solid var(--border-grey)",
                zIndex: "2",
              }}
            ></div> */}
        {/* </div> */}
        <div className={`${styles.common} ${styles.container}`}>
          <CustomInput
            placeholder="Email"
            className={styles.CustomInputClass}
            onChange={handleChange}
            name="email"
            value={inputValues.email}
          ></CustomInput>
        </div>
        {/* </div> */}
        <div className={`${styles.common} ${styles.container}`}>
          {/* <CustomSelectInput
            className={styles.CustomInputClass}
            onChange={handleChange}
            name="tag"
            value={inputValues.tag}
          ></CustomSelectInput> */}
          <select id="tag" style={{ fontSize: "14px" }} onChange={handleChange} value={inputValues.tag} name="tag"
            className="border-[0.5px] rounded-lg  border-gray-200 w-full focus:outline-0 focus:border-0 py-2 max-height-20 text-gray-400">
            <option value="">Select Role Tag</option>
            {designation.map((item) => (
              <option value={item.designation}>{item.designation}</option>
            ))}
          </select>
        </div>
        <button
          className="hover:bg-blue-700 flex text-white font-bold py-2 w-full text-sm mt-4 text-center align-center rounded-lg"
          style={{ backgroundColor: "var(--primary-green)" }}
          onClick={handleAddMember}
        >
          <p className="mx-auto flex">
            <p className="py-1 px-2 text-md">
              {" "}
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z"></path>
                <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z"></path>
              </svg>
            </p>{" "}
            Add Colleague
          </p>
        </button>
      </div>
      <Droppable droppableId="droppable3">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.RemoveMembers}
          >
            <DeleteOutlineIcon sx={{ color: "var(--font-grey-75)" }} />
            <p className={styles.RemoveMemberText}>
              Drag and drop members remove
            </p>
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default LeftSection;
