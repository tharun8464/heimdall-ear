import React, { useState, Fragment, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import {
  addCandidateInfo,
  approveCd,
  approveNewCandidates,
  deleteCandidateInfo,
  getCandidateInfo,
  postJobAPI,
  getuserbyEmail,
  eligibleCandidateList,
} from "../../service/api";

import "../../assets/stylesheet/VerticalTabs.scss";
import swal from "sweetalert";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from "draft-convert";
import { Link, useNavigate } from "react-router-dom";
import { getJobById, updateJobAPI, getSkills } from "../../service/api";
import * as xlsx from "xlsx/xlsx.mjs";
import DOMPurify from "dompurify";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import currencies from "currencies.json";
import { Combobox } from "@headlessui/react";
import cities from "cities.json";
import { getStorage, removeStorage, setStorage, setSessionStorage, getSessionStorage, removeSessionStorage } from "../../service/storageService";
import { BarLoader } from "react-spinners";
import { Oval } from "react-loader-spinner";
import { BeatLoader } from "react-spinners";
import htmlToDraft from "html-to-draftjs";
import BulkCandidateUpload from "./BulkCandidateUpload";
import StarRating from "../../Components/StarRating";
import { Chip } from "@mui/material";
import { verifyServiceEnabled } from "../../service/creditMapService";
import ViewTechnicalSkills from "./ViewTechnicalSkills";
export const maxLimitOfCandidate = process.env.CANDIDATE_MAX_LIMIT || 100;
const UpdateJob = () => {
  const [loading, setLoading] = React.useState(false);
  const [Submitstatus, setSubmitStatus] = React.useState(0);
  const [PageIndex, setPageIndex] = useState(1);
  const { id } = useParams();
  // Skills To Be Displayed
  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});
  const [invitedCandidates, setInvitedCandidates] = useState([]);
  const inputSkillRef = React.useRef(null);
  const MAX_ELIGIBILITY_LENGTH = 200;
  // Screeing Questions
  const [questions, setQuestions] = React.useState([]);
  const [questionError, setQuestionError] = React.useState(null);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
  });
  const [showQuestionForm, setShowQuestionForm] = React.useState(true);
  const [questionEditIndex, setQuestionEditIndex] = React.useState(null);
  // Candidate Invitations Xl Sheet Input
  const candidateInputRef = React.useState(null);
  // Candidate Data
  const [candidateData, setCandidateData] = React.useState([]);
  const [candidateDataDup, setCandidateDataDup] = React.useState([]);
  const [rejectedData, setRejectedData] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [showRejected, setShowRejected] = React.useState(false);
  const [showCandidate, setShowCandidate] = React.useState(false);
  const [currency, setCurrency] = React.useState(currencies.currencies[0]);
  const [showBulkComponent, setShowBulkComponent] = useState(false);
  const [candidateInitial, setCandidateInitial] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    Address: "",
  });
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);
  // City Autocomplete
  const [selectedCity, setSelectedCity] = React.useState();
  const [query, setQuery] = React.useState("");
  const [Alert, setAlert] = React.useState(null);
  const [skills, setSkills] = React.useState([]);
  const [job_id, setJobId] = React.useState();
  const inputRef = React.useRef(null);
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);

  // Skills
  const [selected, setSelected] = useState(Array(showRoles.length).fill(false));
  const [skillErr, setSkillErr] = useState(false);
  const [isCheckboxClicked, setIsCheckboxClicked] = useState(false);
  const [eligibleCanList, setEligibleCanList] = React.useState([]);
  const [List, setList] = React.useState([]);
  const [showEligible, setShowEligible] = React.useState(null);

  // changes for skilledFeedback
  const [skillsFeedback, setSkillsFeedback] = useState(null);
  //Changes for cognition
  const [cognitionEnabled, setCognitionEnabled] = useState(false);
  const [traits, setTraits] = useState([]);

  const handleRefresh = React.useCallback(() => {
    if (PageIndex === 6 || Submitstatus === 1) {
      removeSessionStorage("PageIndex");
      setPageIndex(1);
    } else {
      //setStorage("PageIndex", PageIndex);
    }
  }, [PageIndex, Submitstatus]);

  React.useEffect(() => {
    //setStorage("PageIndex", PageIndex);
  }, [PageIndex]);

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleRefresh);
    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, [PageIndex]);

  // Skills Updates
  const handleCheckboxClick = (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
    //   setIsTextboxSelected(!isTextboxSelected);
    // If the checkbox is checked, set isCheckboxClicked to true and setSkillErr to false
    if (newSelected[index]) {
      setIsCheckboxClicked(true);
      setSkillErr(false);
    } else {
      // If the checkbox is unchecked, set isCheckboxClicked to false and setSkillErr to true
      setIsCheckboxClicked(false);
      setSkillErr(true);
    }
  };
  const handleClick = async () => { };
  const getEligibleCandidate = async (eligibleSkills) => {
    var eligibleCan = await eligibleCandidateList(eligibleSkills);
    if (eligibleCan.data && eligibleCan.data.length > 0) {
      setEligibleCanList(eligibleCan.data);
      eligibleCan?.data?.forEach((ele, index) => {
        eligibleCan.data[index].selected = false;
        eligibleCan.data[index].id = index;
      });
      setList(eligibleCan.data);
      setShowEligible(true);
    } else {
      setList([]);
      setShowEligible(true);
    }
  };

  /**
   * Const to update the candidates from bulk upload
   */

  const updateCandidates = async (acceptedCandidates) => {
    if (acceptedCandidates) {
      setCandidateDataDup(acceptedCandidates);
      setShowCandidate(true);
      let mergedCandidates = acceptedCandidates.concat(invitedCandidates);
      setInvitedCandidates(mergedCandidates);
    }
  };

  const filteredCity =
    query === ""
      ? cities?.slice(0, 10)
      : cities
        .filter((city) => {
          return (
            city.country.toLowerCase().includes(query.toLowerCase()) ||
            city.name.toLowerCase().includes(query.toLowerCase())
          );
        })
        .slice(0, 10);

  const handleCandidateFileUpload = async (e) => {
    try {
      e.preventDefault();
      setShowCandidateForm(false);
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          let d = selectedData;
          let r = rejectedData;
          const json = await xlsx.utils.sheet_to_json(worksheet);
          if (json.length > 0) {
            json.forEach(async (item) => {
              const EmailIndex = d.findIndex((el) => {
                return (
                  (el.Email !== null &&
                    el.Email !== undefined &&
                    el.Email !== "undefined" &&
                    item.Email !== undefined &&
                    el.Email.trim().toLowerCase() ===
                    item.Email.trim().toLowerCase()) ||
                  el.Contact === item.Contact
                );
              });
              const RejectIndex = r.findIndex(
                (el) =>
                  (el.Email !== null &&
                    item.Email !== undefined &&
                    (el.Email !== undefined &&
                      el.Email.trim().toLowerCase()) ===
                    item.Email.trim().toLowerCase()) ||
                  el.Contact === item.Contact
              );
              if (EmailIndex !== -1 || RejectIndex !== -1) {
                let vmuser = await getuserbyEmail(item.Email);
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Email/Contact Already Added",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                  Uid: vmuser.data.data._id,
                });
                return;
              }
              if (
                item.Email === null ||
                item.Email === undefined ||
                item.Email.trim() === "" ||
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                  item.Email.trim()
                )
              ) {
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Invalid Email",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
                return;
              }
              if (item.Contact === null || !/^[0-9]{10}$/i.test(item.Contact)) {
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Invalid Contact",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
                return;
              }
              if (
                item.FirstName === null ||
                item.FirstName === undefined ||
                item.FirstName.trim() === ""
              ) {
                r.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Reason: "Invalid First Name",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
                return;
              }
              if (EmailIndex === -1) {
                d.push({
                  FirstName: item.FirstName ? item.FirstName : "",
                  LastName: item.LastName ? item.LastName : "",
                  Email: item.Email ? item.Email : "",
                  Contact: item.Contact ? item.Contact : "",
                  Address: item.Address ? item.Address : "",
                  Status: "Pending",
                });
              }
            });
            await setShowCandidate(true);
            // test code
            let temp = d;

            if (json.length > 0) {
              let user = JSON.parse(getSessionStorage("user"));
              let job = JSON.parse(getSessionStorage("postjob"));

              for (let i = 0; i < json.length; i++) {
                const values = json[i];

                await addCandidateInfo({
                  candidateDataDup: values,
                  jobId: id,
                  companyId: user.company_id,
                  jobTitle: job.jobTitle,
                }).then(async (response) => {
                  if (response.status == 204) {
                    swal({
                      icon: "error",
                      title: "CompanyID Not Found",
                      text: "Please contact your Support !",
                      button: "Continue",
                    });
                  } else if (response.data) {
                    let d = selectedData;
                    let vmuser = await getuserbyEmail(values.Email);
                    if (vmuser.data.data != null) {
                      d.push({
                        FirstName: values.FirstName,
                        LastName: values.LastName,
                        Email: values.Email,
                        Contact: values.Contact,
                        Address: values.Address,
                        Status: values.Status,
                        Uid: vmuser.data.data._id,
                      });
                    } else {
                      d.push(values);
                    }
                    setInvitedCandidates((prevData) => [
                      ...prevData,
                      response["data"],
                    ]);
                    if (selectedData.length > maxLimitOfCandidate) {
                      swal({
                        icon: "error",
                        title: "Add Candidate",
                        text: "You have exceeded maximum Candidate Limit !",
                        button: "Continue",
                      });
                    }
                    await setSelectedData(d);
                    await setCandidateData(d);
                    await setRejectedData(r);
                    await setShowCandidate(true);
                    await setShowCandidateForm(false);
                  } else {
                    swal({
                      icon: "error",
                      title: "Add Candidate",
                      text: "This candidate is waiting for an approval of another job !",
                      button: "Continue",
                    });
                  }
                });
              }
            }

            // if (d && d.length > 0) {
            //   let user = JSON.parse(getSessionStorage("user"));
            //   let job = JSON.parse(getSessionStorage("postjob"));
            //   for (let i = 0; i < d.length; i++) {
            //     const values = d[i];
            //     await addCandidateInfo({
            //       candidateDataDup: values,
            //       jobId: id,
            //       companyId: user.company_id,
            //       jobTitle: job.jobTitle,
            //     }).then(async (response) => {
            //       if (response.status == 204) {
            //         swal({
            //           icon: "error",
            //           title: "CompanyID Not Found",
            //           text: "Please contact your Support !",
            //           button: "Continue",
            //         });
            //       } else if (response.data) {
            //         let vmuser = await getuserbyEmail(values.Email);
            //         if (vmuser.data.data != null) {
            //           d.push({
            //             FirstName: values.FirstName,
            //             LastName: values.LastName,
            //             Email: values.Email,
            //             Contact: values.Contact,
            //             Address: values.Address,
            //             Status: values.Status,
            //             Uid: vmuser.data.data._id,
            //           });
            //         } else {
            //           d.push(values);
            //         }
            //         setInvitedCandidates((prevData) => [
            //           ...prevData,
            //           response["data"],
            //         ]);
            //         if (selectedData.length > maxLimitOfCandidate) {
            //           swal({
            //             icon: "error",
            //             title: "Add Candidate",
            //             text: "You have exceeded maximum Candidate Limit !",
            //             button: "Continue",
            //           });
            //         }
            //         await setSelectedData(d);
            //         await setCandidateData(d);
            //         await setRejectedData(r);
            //         await setShowCandidate(true);
            //         await setShowCandidateForm(false);
            //       } else {
            //         swal({
            //           icon: "error",
            //           title: "Add Candidate",
            //           text: "This candidate is waiting for an approval of another job !",
            //           button: "Continue",
            //         });
            //       }
            //     });
            //   }
            // }
            // end test code
            await setCandidateData(d);
            await setRejectedData(r);
            await setSelectedData(d);
            await setCandidateDataDup(d);
            if (candidateInputRef.current) candidateInputRef.current.value = "";
          } else {
            swal({
              title: "Error",
              message: "Data File Empty",
              icon: "error",
              button: "Ok",
            });
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) { }
  };

  React.useEffect(() => {
    let access_token = getStorage("access_token");
    const getData = async () => {
      let res = await getJobById(id, access_token);
      if (res) {
        removeSessionStorage("postjob");
        res.data.job.validTill = res?.data?.job?.validTill?.split("T")[0];
        setSessionStorage("postjob", JSON.stringify(res.data.job));
        let city = res?.data?.job?.location.split(",")[0];
        if (res?.data?.job?.location?.includes(",")) {
          let country = res?.data?.job?.location?.split(",")[1].trim();
          let c = cities.filter((el) => {
            return el.name === city && el.country === country;
          });
          await setSelectedCity(res?.data?.job?.location);
        } else {
          setSelectedCity({ name: city });
        }
        await setJob(res?.data?.job);
        await setJob({ ...res?.data?.job });
        await setQuestions(res?.data?.job?.questions);
        setState();
      } else {
      }
    };
    getData();
    const setState = async () => {
      let data = JSON.parse(await getSessionStorage("postjob"));
      if (data) {
        setJob(data);
        setSkills(data.skills);

        if (data.eligibility) {
          const blocksFromHtml = htmlToDraft(data.eligibility);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          const editorState = EditorState.createWithContent(contentState);
          setEligibleState(editorState);
        }

        if (data.jobDesc) {
          const blocksFromHtml = htmlToDraft(data.jobDesc);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          const editorState = EditorState.createWithContent(contentState);
          setDescState(editorState);
        }
        if (data.perks) {
          const blocksFromHtml = htmlToDraft(data.perks);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          const editorState = EditorState.createWithContent(contentState);
          setPerksState(editorState);
        }
      }
    };
  }, [job_id]);

  React.useEffect(() => {
    const initial = async () => {
      await setJob(null);
      let access_token = getStorage("access_token");
      let p = JSON.parse(await getSessionStorage("prof"));
      let pr = JSON.parse(await getSessionStorage("RolesProf"));
      let user = await JSON.parse(await getSessionStorage("user"));
      await setUser(user);
      let res1 = await getJobById(id, access_token);
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr;
        if (!pr) pr = new Array(roles.size).fill(0);
        let candData = res1?.data?.job?.invitations;
        let cData = await getCandidateInfo({ jobId: res1?.data?.job?._id });
        candData = cData.data.candidateDetails;
        if (candData) {
          setCandidateDataDup(candData);
          setShowCandidate(true);
        }

        pr = new Array(res?.data?.length).fill(0);
        if (res1?.data?.job?.skills?.length > 0) {
          await res1?.data?.job?.skills?.forEach(async (skill) => {
            let index = res?.data?.findIndex(
              (el) =>
                el.primarySkill === skill?.primarySkill &&
                el.role === skill?.role &&
                el.secondarySkill === skill?.secondarySkill
            );
            res.data[index].proficiency = skill?.proficiency;
            pr[index] = skill?.proficiency;
          });
          await setProf([...pr]);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }
        await setRolesProf(pr);
        await setShowRoles(Array.from(roles));
        await setRoles(Array.from(roles));
        await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
        // changes for skillsFeedback
        if (
          res1?.data?.job?.skillsFeedback &&
          res1?.data?.job?.skillsFeedback?.length > 0
        ) {
          // direct add skillsFeedback to the groupedSkills
          let data = res1?.data?.job?.skillsFeedback[0];
          setSkillsFeedback(data);
        } else if (
          res1?.data?.job?.skills &&
          res1?.data?.job?.skills?.length > 0
        ) {
          let data = res1?.data?.job?.skills;
          if (data) {
            // Group the data by the "role" attribute
            const groupedSkillsData = await data.reduce((result, item) => {
              const role = item.role;
              if (!result[role]) {
                result[role] = [];
              }
              // Check if the primarySkill is not already in the result[role]
              const existingSkill = result[role].find(
                (skill) => skill.skill === item.primarySkill
              );
              if (!existingSkill) {
                let obj = {
                  skill: item.primarySkill,
                  proficiency: item.proficiency
                    ? parseInt(item.proficiency)
                    : 0,
                  rating: 5,
                  reason: "",
                };
                result[role].push(obj);
              }
              return result;
            }, {});
            setSkillsFeedback(groupedSkillsData);
          }
        }
      }
      // cognition flag enabled for this company user
      let verifyResp = await verifyServiceEnabled(user.company_id, 3);
      if (verifyResp && verifyResp?.data) {
        setCognitionEnabled(verifyResp?.data?.enabled);
      }
      if (res1?.data?.job?.traits && res1?.data?.job?.traits?.length > 0) {
        setTraits(res1?.data?.job?.traits);
      }
    };
    initial();
  }, []);

  // const title = require.jobTitle;

  const postJob = async (values, salary, maxSalary) => {
    try {
      let skills = [];
      dbSkills.forEach((el, index) => {
        if (prof[index] > 0) {
          el.proficiency = prof[index];
          skills.push(el);
        }
      });
      let access_token = getStorage("access_token");
      let user = JSON.parse(getSessionStorage("user"));
      if (selectedCity && selectedCity.name) {
        values.location = selectedCity.name;
      } else {
        values.location = selectedCity;
      }
      values.skills = skills;
      values.user_id = user._id;
      values.salary = [currency, salary, maxSalary];
      values.questions = questions;
      // let c = salary;
      delete values.invitations;
      values.invitations = candidateDataDup
        ? candidateDataDup
        : invitedCandidates;
      let combinedData = [];
      combinedData = candidateDataDup.concat(
        invitedCandidates ? invitedCandidates : []
      );
      // console.log("combinedData", combinedData);
      setCandidateDataDup(combinedData);
      setInvitedCandidates(combinedData);
      let jobData = {
        skills: skills,
        user_id: user._id,
        salary: [currency, salary, maxSalary],
        questions: questions,
        draft: false,
        invitations: invitedCandidates,
        ...values,
      };

      const hasNullUndefinedValue = Object.values(jobData).some(
        (value) => value === null || value === undefined
      );
      if (hasNullUndefinedValue) {
        swal({
          icon: "error",
          title: "Add job",
          text: "Please fill all the required data",
          button: "Continue",
        });
      } else {
        delete values.invitations;
        let res = await updateJobAPI(
          {
            skills: skills,
            user_id: user._id,
            salary: [currency, salary, maxSalary],
            questions: questions,
            draft: false,
            invitations: invitedCandidates,
            ...values,
          },
          access_token
        );
        if (res) {
          swal({
            title: "Job Updated Successfully !",
            message: "Success",
            icon: "success",
            button: "Continue",
          }).then((result) => {
            if (res?.data?.Status && res?.data?.Status === "Pending") {
              window.location.href = "/company/pendingJobDetails/" + id;
            } else {
              window.location.href = "/company/jobDetails/" + id;
            }
          });
        } else {
          swal({
            title: "Error While Updating Job !",
            message: "OOPS! Error Occured",
            icon: "Error",
            button: "Ok",
          });
        }
      }
      removeSessionStorage("prof");
      removeSessionStorage("postjob");
      setJob();
      setSkills([]);
    } catch (error) {
      setAlert(false);
    }
  };

  // Scroll to the top of the page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [PageIndex]);

  // case:1 validations
  //validation for case 1
  const [joberror, setJobError] = React.useState("");
  const [JobTitleNumeralsError, setJobTitleNumeralsError] =
    React.useState(false);
  const [HiringOrganizationNumeralsError, setHiringOrganizationNumeralsError] =
    React.useState(false);
  const [jobtypeerror, setJobTypeerr] = React.useState("");
  const [joblocationerror, setJobLocationerr] = React.useState("");
  const [validTillerror, setValidTillerr] = React.useState("");
  const [reqApperror, setReqApperr] = React.useState("");
  const [hiringOrganizationerror, setHiringOrganizationerr] =
    React.useState("");
  const [ederror, setFormError] = React.useState(false);
  const [descError, setDescError] = React.useState(false);
  const [Locationerror, setLocationerror] = React.useState("");
  //Description
  const [desc, setDescState] = React.useState(EditorState.createEmpty());
  const [convertedDesc, setConvertedDesc] = React.useState(null);
  const onDescEditorStateChange = (state) => {
    const descText = state.getCurrentContent().getPlainText("");
    if (descText) {
      setDescError(false);
    }
    setDescState(state);
    convertDescToHTML();
  };
  const convertDescToHTML = async () => {
    let currentContentAsHTML = convertToHTML(desc?.getCurrentContent());
    if (currentContentAsHTML) {
      setConvertedDesc(currentContentAsHTML);
    }
    const job = JSON.parse(await getSessionStorage("postjob"));
    job.jobDesc = currentContentAsHTML;
    setJob(job);
    setSessionStorage("postjob", JSON.stringify(job));
  };
  //validation for case 2
  //eligibility
  const [eligible, setEligibleState] = React.useState(
    EditorState.createEmpty()
  );
  const [convertedEl, setConvertedEl] = React.useState(null);
  const [eligibilityperksError, seteligibilityperksError] = useState(false);
  const [EligibilityPerksError, setEligibilityPerksError] = useState(false);
  const oneligibiltyStateChange = (state) => {
    const eligible = state.getCurrentContent().getPlainText("");
    // if (eligible.length > MAX_ELIGIBILITY_LENGTH) {
    //   setEligibilityPerksError(true);
    // } else {
    //   setEligibilityPerksError(false);
    // }
    if (eligible) {
      seteligibilityperksError(false);
    }
    setEligibleState(state);
    convertElToHTML();
  };
  const convertElToHTML = async () => {
    let currentContentAsHTML = convertToHTML(eligible?.getCurrentContent());
    if (currentContentAsHTML) {
      setConvertedEl(currentContentAsHTML);
    }
    const job = JSON.parse(await getSessionStorage("postjob"));
    job.eligibility = currentContentAsHTML;
    setJob(job);
    setSessionStorage("postjob", JSON.stringify(job));
  };

  // case 6 validations
  const [max, setmax] = useState("");
  const [salary, setSalary] = useState("");
  const [maxvalueerror, setMaxValueError] = useState(false);
  const [perksError, setPerksError] = useState(false);
  const [perks, setPerksState] = React.useState(EditorState.createEmpty());
  const [convertedPerks, setConvertedPerks] = React.useState(null);

  //Perks

  const onPerksEditorStateChange = (state) => {
    const perks = state.getCurrentContent().getPlainText("");
    if (perks) {
      setPerksError(false);
    }
    setPerksState(state);
    convertPerksToHTML();
    //  setRemuneration(state);
  };
  const convertPerksToHTML = async () => {
    let currentContentAsHTML = convertToHTML(perks?.getCurrentContent());
    if (currentContentAsHTML) {
      setConvertedPerks(currentContentAsHTML);
    }
    const job = JSON.parse(await getSessionStorage("postjob"));
    job.perks = currentContentAsHTML;
    setJob(job);
    setSessionStorage("postjob", JSON.stringify(job));
  };

  const renderFormPage = () => {
    switch (PageIndex) {
      case 1:
        return (
          <div>
            <div className="md:w-full bg-white lg:px-3">
              <Formik
                key={PageIndex}
                initialValues={{
                  jobTitle: job ? job.jobTitle : "",
                  location: job ? job.location : "",
                  // location: selectedCity
                  //   ? `${selectedCity.name}, ${selectedCity.country}`
                  //   : "",
                  jobType: job ? job.jobType : "",
                  jobLocation: job ? job.jobLocation : "",
                  isCandidateLinkedinRequired: job?.isCandidateLinkedinRequired === true ? true : false,
                  reqApp: job ? job.reqApp : "",
                  validTill: job ? job.validTill : "",
                  hiringOrganization: job ? job.hiringOrganization : "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (values.jobTitle) {
                    setJobError("");

                    if (/\d/.test(values.jobTitle)) {
                      setJobTitleNumeralsError(true);
                    } else {
                      setJobTitleNumeralsError(false);
                    }
                  } else {
                    setJobTitleNumeralsError(false);
                  }

                  if (values.jobType) {
                    setJobTypeerr("");
                  }
                  if (values.jobLocation) {
                    setJobLocationerr("");
                  }
                  if (values.validTill) {
                    setValidTillerr("");
                  }
                  if (
                    values.validTill &&
                    values.validTill > new Date().toISOString().split("T")[0]
                  ) {
                    setValidTillerr("");
                  }
                  if (values.reqApp) {
                    setReqApperr("");
                  }
                  // if (
                  //   values.hiringOrganization
                  // ) {
                  //   setHiringOrganizationerr("")
                  // }
                  if (values.hiringOrganization) {
                    setHiringOrganizationerr("");
                    setHiringOrganizationNumeralsError(false);
                    if (/\d/.test(values.hiringOrganization)) {
                      setHiringOrganizationNumeralsError(true);
                    } else {
                      setHiringOrganizationNumeralsError(false);
                    }
                  } else {
                    setHiringOrganizationNumeralsError(false);
                  }
                  // if (desc) {
                  //   setDescError(false);
                  // }
                  return errors;
                }}
              >
                {({ values }) => {
                  return (
                    <div className="w-full mt-9">
                      <Form className="w-full m-5 mx-7">
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 block font-semibold">
                            Job Title
                          </label>
                          <Field
                            name="jobTitle"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                            style={{ borderRadius: "5px" }}
                          />
                          <div className="mt-2">
                            {joberror && (
                              <p className="text-red-500">{joberror}</p>
                            )}
                            {JobTitleNumeralsError && (
                              <p className="text-red-500">
                                {" "}
                                Job title cannot contain numerals
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mb-3 block font-semibold">
                            Role :
                          </label>
                          <p>{job.jobRole}</p>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mb-3 block font-semibold">
                            Job Description
                          </label>

                          <Editor
                            editorState={desc}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "75%",
                              border: "1px solid rgb(156 163 175 / 1)",
                              borderRadius: "5px",
                            }}
                            editorStyle={{
                              minHeight: "200px",
                              paddingLeft: "1rem",
                            }}
                            onEditorStateChange={onDescEditorStateChange}
                          />
                          {descError && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Required !
                            </p>
                          )}
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 block font-semibold">
                            Job Location
                          </label>
                          <p>Current Location: {job.location}</p>
                          <p className="text-red-600 text-sm w-full text-left mr-auto">
                            {Locationerror}
                          </p>

                          <Combobox
                            value={selectedCity}
                            onChange={async (value) => {
                              setSelectedCity(value);
                            }}
                          >
                            <Combobox.Input
                              onChange={(event) => {
                                const inputText = event.target.value;
                                if (!inputText) {
                                  setLocationerror(""); // Clear the error message for empty input
                                  setQuery(inputText);
                                } else if (
                                  /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(
                                    inputText
                                  )
                                ) {
                                  setLocationerror(""); // Clear the error message for valid alphabetic input
                                  setQuery(inputText);
                                } else {
                                  setLocationerror(
                                    "Please enter a valid location"
                                  ); // Show error message for invalid input
                                }
                              }}
                              className="border-[0.5px] rounded-lg border-gray-400 md:w-1/2 w-full focus:outline-0 focus:border-0 px-4 py-2"
                              style={{ borderRadius: "12px" }}
                            />
                            <Combobox.Options className="w-1/2 shadow-lg p-3">
                              {query.length > 0 && (
                                <Combobox.Option
                                  className="p-2 text-gray-500"
                                  value={`${query}`}
                                >
                                  Add "{query}" as a new location
                                </Combobox.Option>
                              )}
                              {filteredCity.map((city) => (
                                <Combobox.Option
                                  key={city.name}
                                  value={`${city.name}, ${city.country}`}
                                >
                                  {({ active, selected }) => (
                                    <li
                                      className={`${active
                                        ? "bg-emerald-700 text-white p-3 rounded-lg"
                                        : "bg-white text-black p-3 rounded-lg"
                                        }`}
                                    >
                                      {city.name}, {city.country}
                                    </li>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          </Combobox>

                          {ederror && selectedCity.country == "NULL" ? (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Required !
                            </p>
                          ) : (
                            !/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(
                              selectedCity.country
                            ) && (
                              <p className="text-red-600 text-sm w-full text-left mr-auto">
                                Please enter a valid location
                              </p>
                            )
                          )}
                        </div>
                        <div className="my-7 space-y-3">
                          <label className="text-left w-3/4 block font-semibold">
                            Location Type:
                          </label>
                          <div
                            role="group"
                            aria-labelledby="my-radio-group"
                            className="md:space-x-5 space-x-2 md:flex  w-3/4 md:mr-auto "
                          >
                            <div className="ml-2">
                              <label>
                                <Field
                                  type="radio"
                                  name="jobLocation"
                                  value="Remote"
                                  className="mr-2"
                                />
                                Remote
                              </label>
                            </div>
                            <div>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobLocation"
                                  value="Hybrid"
                                  className="mr-2"
                                />
                                Hybrid
                              </label>
                            </div>
                            <div>
                              <label>
                                <Field
                                  type="radio"
                                  name="jobLocation"
                                  value="On-Site"
                                  className="mr-2"
                                />
                                On-Site
                              </label>
                            </div>
                          </div>
                          <div className="mt-2">
                            {" "}
                            {joblocationerror && (
                              <p className="text-red-500">{joblocationerror}</p>
                            )}
                          </div>
                        </div>
                        <div className="my-7 space-y-3">
                          <label className="text-left w-3/4 block font-semibold">
                            Candidate Linkedin Required:
                            <Field
                              type="checkbox"
                              name="isCandidateLinkedinRequired"
                              value="isCandidateLinkedinRequired"
                              className="ml-2 px-2"
                              checked={values?.isCandidateLinkedinRequired}
                            />
                          </label>
                        </div>
                        <div className="my-7 space-y-3">
                          <label className="text-left w-3/4 block font-semibold">
                            Job Type:
                          </label>
                          <div
                            role="group"
                            aria-labelledby="my-radio-group"
                            className="space-x-5 my-3 w-3/4 mr-auto "
                          >
                            <label>
                              <Field
                                type="radio"
                                name="jobType"
                                value="Full-Time"
                                className="mr-2"
                              />
                              Full-Time
                            </label>
                            <label>
                              <Field
                                type="radio"
                                name="jobType"
                                value="Part-Time"
                                className="mr-2"
                              />
                              Part-Time
                            </label>
                            <label>
                              <Field
                                type="radio"
                                name="jobType"
                                value="Internship"
                                className="mr-2"
                              />
                              Internship
                            </label>
                            <label>
                              <Field
                                type="radio"
                                name="jobType"
                                value="Freelancing"
                                className="mr-2"
                              />
                              Freelancing
                            </label>
                          </div>
                          <div className="mt-2">
                            {" "}
                            {jobtypeerror && (
                              <p className="text-red-500">{jobtypeerror}</p>
                            )}
                          </div>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 font-semibold block">
                            Applications Open Till :{" "}
                          </label>
                          <Field
                            name="validTill"
                            type="date"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                            // min={Date.now()}
                            min={new Date().toISOString().split("T")[0]}
                          />
                          <div className="mt-2">
                            {" "}
                            {validTillerror && (
                              <p className="text-red-500">{validTillerror}</p>
                            )}
                          </div>
                        </div>
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 block font-semibold">
                            Hiring Organization
                          </label>
                          <Field
                            name="hiringOrganization"
                            type="text"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                          />
                          <div className="mt-2">
                            {" "}
                            {hiringOrganizationerror && (
                              <p className="text-red-500">
                                {hiringOrganizationerror}
                              </p>
                            )}
                            {HiringOrganizationNumeralsError && (
                              <p className="text-red-500">
                                {" "}
                                HiringOrganization cannot contain numerals
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 block font-semibold">
                            Candidates Required
                          </label>
                          <Field
                            name="reqApp"
                            type="number"
                            placeholder=""
                            className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 px-4 py-2"
                          />
                          <div className="mt-2">
                            {" "}
                            {reqApperror && (
                              <p className="text-red-500">{reqApperror}</p>
                            )}
                          </div>
                        </div>
                      </Form>
                      <div className="flex space-x-3 mx-auto justify-center">
                        {values.jobTitle &&
                          desc &&
                          selectedCity !== null &&
                          values.jobType &&
                          values.jobLocation &&
                          values.validTill &&
                          values.hiringOrganization &&
                          values.reqApp ? (
                          <>
                            <button
                              className="bg-[#228276] px-4 py-2 text-white my-6 rounded-lg"
                              onClick={async () => {
                                if (selectedCity.country === "NULL") {
                                  setFormError(true);
                                  return;
                                } else {
                                  setFormError(false);
                                }

                                let job = await JSON.parse(
                                  await getSessionStorage("postjob")
                                );
                                if (job === null) job = {};
                                job.jobTitle = values.jobTitle;
                                job.location = values.location || selectedCity;
                                job.jobType = values.jobType;
                                job.isCandidateLinkedinRequired = values.isCandidateLinkedinRequired;
                                job.jobLocation = values.jobLocation;
                                job.validTill = values.validTill;
                                job.hiringOrganization =
                                  values.hiringOrganization;
                                job.reqApp = values.reqApp;
                                const descText = desc
                                  .getCurrentContent()
                                  .getPlainText("");
                                if (!descText) {
                                  setDescError(true);
                                  return;
                                } else {
                                  setDescError(false);
                                }
                                if (!ederror) {
                                  if (
                                    selectedCity.country === "NULL" &&
                                    selectedCity.city === "NULL"
                                  ) {
                                    setFormError(true);
                                    return;
                                  } else {
                                    setFormError(false);
                                  }
                                }
                                if (JobTitleNumeralsError) {
                                  setJobTitleNumeralsError(true);
                                  return;
                                } else if (HiringOrganizationNumeralsError) {
                                  setHiringOrganizationNumeralsError(true);
                                  return;
                                } else {
                                  setJobTitleNumeralsError(false);
                                  setHiringOrganizationNumeralsError(false);
                                }
                                setSessionStorage("postjob", JSON.stringify(job));
                                await setJob(job);
                                setPageIndex(2);
                              }}
                            >
                              Next
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-[#228276] px-4 py-2 text-white my-6 rounded-lg"
                            onClick={() => {
                              // Clear all previous error messages
                              setJobError("");
                              setJobTypeerr("");
                              setJobLocationerr("");
                              setValidTillerr("");
                              setReqApperr("");
                              setHiringOrganizationerr("");
                              setFormError(false);
                              setDescError(false);
                              let hasError = false;
                              // Validate the job title field
                              if (
                                !values.jobTitle ||
                                values.jobTitle.trim() === ""
                              ) {
                                setJobError("Required!");
                                hasError = true;
                              } else if (values.jobTitle.length > 100) {
                                setJobError(
                                  "Job Title should be less than 100 characters"
                                );
                                hasError = true;
                              }
                              // Validate the job type field
                              if (
                                !values.jobType ||
                                values.jobType.trim() === ""
                              ) {
                                setJobTypeerr("Required!");
                                hasError = true;
                              }
                              // Validate the job location field
                              if (
                                !values.jobLocation ||
                                values.jobLocation.trim() === ""
                              ) {
                                setJobLocationerr("Required!");
                                hasError = true;
                              }
                              // Validate the validTill field
                              if (
                                !values.validTill ||
                                values.validTill.trim() === ""
                              ) {
                                setValidTillerr("Required!");
                                hasError = true;
                              } else {
                                const validTillDate = new Date(
                                  values.validTill
                                );
                                if (isNaN(validTillDate.getTime())) {
                                  setValidTillerr("Invalid date format");
                                  hasError = true;
                                } else if (validTillDate < new Date()) {
                                  setValidTillerr(
                                    "Date should be greater than or equal to the current date"
                                  );
                                  hasError = true;
                                }
                              }
                              // Validate the reqApp field
                              if (!values.reqApp) {
                                setReqApperr("Required!");
                                hasError = true;
                              } else if (values.reqApp > maxLimitOfCandidate) {
                                setReqApperr(
                                  `Must be less than ${maxLimitOfCandidate}`
                                );
                                hasError = true;
                              }
                              // Validate the hiring organization field
                              if (
                                !values.hiringOrganization ||
                                values.hiringOrganization.trim() === ""
                              ) {
                                setHiringOrganizationerr("Required!");
                                hasError = true;
                              }
                              if (!ederror) {
                                if (
                                  selectedCity.country === "NULL" &&
                                  selectedCity.city === "NULL"
                                ) {
                                  setFormError(true);
                                  hasError = true;
                                }
                              }
                              if (!desc) {
                                setDescError(true);
                                hasError = true;
                              }
                              if (!desc.getCurrentContent().hasText()) {
                                // Set error states if either condition is true
                                setDescError(
                                  !desc.getCurrentContent().hasText()
                                );
                              }
                              // If there are any errors, return early
                              if (hasError) {
                                return;
                              }
                            }}
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="lg:w-full py-3  mr-3 bg-white">
              <Formik initialValues={{}}>
                {(values) => {
                  return (
                    <div className="w-fit mt-9">
                      <Form className="w-fit m-5">
                        <div className="my-7 space-y-3 w-full">
                          <label className="text-left w-3/4 mb-3 block font-semibold">
                            Candidate Eligibility
                          </label>

                          <Editor
                            editorState={eligible}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            wrapperStyle={{
                              width: "100%",
                              maxWidth: "1000px",
                              border: "1px solid rgb(156 163 175 / 1)",
                              borderRadius: "5px",
                              zIndex: 0,
                              overflowY: "auto",
                              whiteSpace: "normal", // Allow text to wrap
                              wordWrap: "break-word", // Break words to fit within the container
                            }}
                            editorStyle={{
                              minHeight: "100px",
                              paddingLeft: "1rem",
                              maxHeight: "200px",
                              zIndex: 0,
                              whiteSpace: "pre-wrap",
                            }}
                            onEditorStateChange={oneligibiltyStateChange}
                          />
                        </div>
                        <div className="mt-2">
                          {eligibilityperksError && (
                            <p className="text-red-500">Required !</p>
                          )}
                          {EligibilityPerksError && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Eligibility input exceeds the maximum allowed
                              length
                            </p>
                          )}
                        </div>
                        <div className="my-7 space-y-3 w-full block">
                          <label className="text-left w-3/4 font-semibold block">
                            Technical Skills
                          </label>
                          {skillsFeedback ? (
                            <ViewTechnicalSkills
                              skillsFeedback={skillsFeedback}
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-row-reverse space-x-3 mx-auto  my-6">
                          <button
                            className="bg-[#228276] px-4 py-2 rounded-lg text-white mx-2"
                            onClick={() => {
                              if (
                                !eligible.getCurrentContent().hasText() ||
                                EligibilityPerksError
                              ) {
                                // Set error states if either condition is true
                                seteligibilityperksError(
                                  !eligible.getCurrentContent().hasText()
                                );
                              } else {
                                // Both conditions are false, no errors
                                seteligibilityperksError(false);
                                setSkillErr(false);
                                setEligibilityPerksError(false);

                                var searchSkills = new Array();
                                dbSkills.forEach((el, index) => {
                                  if (prof[index] > 0) {
                                    searchSkills.push(el._id);
                                  }
                                });

                                var eligibleSkills = {};
                                const id = user._id;
                                eligibleSkills["skills"] = searchSkills;
                                eligibleSkills["companyid"] = id;
                                getEligibleCandidate(eligibleSkills);
                                setPageIndex(3);
                              }
                            }}
                          >
                            Next
                          </button>
                          <button
                            className=" px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                            onClick={() => {
                              setPageIndex(1);
                              //setStorage("PageIndex", 1);
                            }}
                          >
                            Prev
                          </button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="w-full mr-3 bg-white py-9 px-7">
              <p className="font-semibold">Add Screening Questions</p>
              <p className="text-gray-600">
                We recommend adding 3 or more questions.
              </p>
              <div className="my-5">
                {questions.map((question, index) => {
                  return (
                    <div className="my-5">
                      <div className="flex justify-between">
                        <p className="font-semibold">
                          Question {index + 1} :{" "}
                          <span className="font-normal">
                            {question.question}
                          </span>
                        </p>
                        <div className="flex space-x-3">
                          <RiEditBoxLine
                            className="cursor-pointer text-blue-500"
                            onClick={async () => {
                              await setShowQuestionForm(false);
                              await setInitialQuestion(question);
                              await setQuestionEditIndex(index);
                              setShowQuestionForm(true);
                            }}
                          />
                          <AiOutlineDelete
                            className="cursor-pointer text-red-600"
                            onClick={() => {
                              setQuestions(
                                questions.filter(
                                  (item) => item.question !== question.question
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 font-semibold">
                        Answer :{" "}
                        <span className="font-normal">{question.answer}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
              {showQuestionForm && (
                <Formik
                  initialValues={initialQuestion}
                  validate={(values) => {
                    const errors = {};
                    if (!values.question) {
                      errors.question = "Required";
                    }
                    if (!values.answer) {
                      errors.answer = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={(values) => {
                    if (questionEditIndex !== null) {
                      let temp = [...questions];
                      temp[questionEditIndex] = values;
                      setQuestions(temp);
                      setQuestionEditIndex(null);
                      setShowQuestionForm(false);
                      setInitialQuestion({
                        question: "",
                        answer: "",
                      });
                    } else {
                      setQuestions([
                        ...questions,
                        { question: values.question, answer: values.answer },
                      ]);
                      setShowQuestionForm(false);
                      setInitialQuestion({
                        question: "",
                        answer: "",
                      });
                    }
                  }}
                >
                  {({ values }) => (
                    <Form>
                      <div className="my-6">
                        <label className="font-semibold">Question</label>
                        <Field
                          name="question"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                          type="text"
                        />
                        <ErrorMessage
                          component="div"
                          name="question"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <div className="my-6">
                        <label className="font-semibold">Ideal Answer</label>
                        <Field
                          name="answer"
                          className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#034488]"
                          type="text"
                        />
                        <ErrorMessage
                          component="div"
                          name="answer"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-[#228276] text-white rounded-lg px-3 py-2"
                          style={{ backgroundColor: "#228276" }}
                        >
                          {questionEditIndex === null
                            ? "Add Question"
                            : " Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="rounded-sm px-4 py-1 text-black  rounded-sm "
                          onClick={() => {
                            setShowQuestionForm(false);
                            setInitialQuestion({
                              question: "",
                              answer: "",
                            });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
              {!showQuestionForm && (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-[#228276] text-white rounded-lg px-3 py-2"
                    style={{ backgroundColor: "#228276" }}
                    onClick={() => {
                      setInitialQuestion({
                        question: "",
                        answer: "",
                      });
                      setShowQuestionForm(true);
                    }}
                  >
                    Add Questions
                  </button>
                </div>
              )}
              <div className="flex flex-row-reverse space-x-3 mx-auto  my-6">
                <button
                  className="bg-[#228276] px-4 py-2 rounded-lg text-white mx-2"
                  onClick={() => {
                    if (showQuestionForm) {
                      swal({
                        title: "Are you sure?",
                        text: "You have unsaved changes!",
                        icon: "warning",
                        buttons: true,
                      }).then((ok) => {
                        if (ok) setPageIndex(4);
                      });
                    } else {
                      setPageIndex(4);
                    }
                  }}
                >
                  Next
                </button>
                <button
                  className=" px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                  onClick={() => {
                    if (showQuestionForm && questions.length > 0) {
                      swal({
                        title: "Are you sure?",
                        text: "You have unsaved changes!",
                        icon: "warning",
                        buttons: true,
                      }).then((ok) => {
                        if (ok) setPageIndex(2);
                      });
                    } else setPageIndex(2);
                  }}
                >
                  Prev
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className="w-full py-3 shadow-md mr-3 bg-white">
              <div className="w-full mt-9">
                <div className="w-full m-5 mx-7">
                  <Formik
                    initialValues={{
                      salary: job.salary[1] ? job.salary[1] : "",
                      maxSalary: job.salary[2] ? job.salary[2] : "",
                    }}
                    validate={(values) => {
                      const errors = {};

                      if (
                        values.salary &&
                        values.maxSalary &&
                        Number(values.maxSalary) <= Number(values.salary)
                      ) {
                        setmax("Max Salary should be greater than min Salary");
                        setMaxValueError(true);
                      } else {
                        setmax(""); // Clear the error message if maxSalary is valid
                        setMaxValueError(false);
                      }
                      if (
                        values.salary &&
                        values.maxSalary &&
                        values.maxSalary > values.salary
                      ) {
                        setSalary("");
                        setmax("");
                      }
                      if (values.salary) {
                        setSalary("");
                      }
                      return errors;
                    }}
                  // onSubmit={postJob}
                  >
                    {(values) => {
                      return (
                        <div>
                          <Form className="w-full mt-9">
                            <div className="my-5 space-y-3 w-full">
                              <label className="text-left w-3/4 mb-3 font-semibold block">
                                Remunerations
                              </label>

                              <Editor
                                editorState={perks}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                wrapperStyle={{
                                  zIndex: "10",
                                  width: "75%",
                                  border: "1px solid rgb(156 163 175 / 1)",
                                  borderRadius: "5px",
                                }}
                                editorStyle={{
                                  minHeight: "200px",
                                  paddingLeft: "1rem",
                                }}
                                onEditorStateChange={onPerksEditorStateChange}
                              />
                            </div>
                            <div className="mt-2">
                              {perksError && (
                                <p className="text-red-500">Required !</p>
                              )}
                            </div>
                            <div className="my-7 mt-9 space-y-3 w-3/4">
                              <label className="text-left w-3/4 font-semibold block">
                                Pay Range
                              </label>
                              <div className="items-center space-x-3">
                                <label>Currency</label>
                                <Listbox
                                  onChange={setCurrency}
                                  value={currency}
                                >
                                  <div className="relative mt-1 w-1/3 mb-5 z-100">
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border-1 border-">
                                      <span className="block truncate">
                                        {currency.symbol} - {currency.name}
                                      </span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronDownIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Listbox.Button>
                                    <Transition
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-100">
                                        {currencies.currencies.map(
                                          (currency, currencyIdx) => (
                                            <Listbox.Option
                                              key={currencyIdx}
                                              className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                                                  ? "bg-blue-100 text-blue-900"
                                                  : "text-gray-900"
                                                }`
                                              }
                                              value={currency}
                                            >
                                              {({ selected }) => (
                                                <>
                                                  <span
                                                    className={`block truncatez-100 ${selected
                                                      ? "font-medium"
                                                      : "font-normal"
                                                      }`}
                                                  >
                                                    {currency.symbol} -{" "}
                                                    {currency.name}
                                                  </span>
                                                  {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 z-100">
                                                      <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                  ) : null}
                                                </>
                                              )}
                                            </Listbox.Option>
                                          )
                                        )}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </Listbox>
                              </div>
                              <div className="w-fit lg:flex md:flex gap-5">
                                <div className="block w-1/2">
                                  <label className="block">Minimum</label>
                                  <Field
                                    name="salary"
                                    type="number"
                                    onBlur={(e) => {
                                      const value = e.target.value.replace(
                                        /,/g,
                                        ""
                                      );
                                      if (!isNaN(parseFloat(value))) {
                                        e.target.value =
                                          parseFloat(value).toLocaleString();
                                      } else {
                                        e.target.value = "";
                                      }
                                    }}
                                    placeholder=""
                                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 focus:outline-0 focus:border-0 px-4"
                                  />
                                  <div className="mt-3 ">
                                    <p className="text-red-500 text-sm">
                                      {salary}
                                    </p>
                                  </div>
                                </div>
                                <div className="block w-1/2">
                                  <label className="block">Maximum</label>
                                  <Field
                                    name="maxSalary"
                                    type="number"
                                    onBlur={(e) => {
                                      const value = e.target.value.replace(
                                        /,/g,
                                        ""
                                      );
                                      if (!isNaN(parseFloat(value))) {
                                        e.target.value =
                                          parseFloat(value).toLocaleString();
                                      } else {
                                        e.target.value = "";
                                      }
                                    }}
                                    placeholder=""
                                    className="border-[0.5px] shadow-sm rounded-lg my-3 border-gray-400 focus:outline-0 focus:border-0 px-4"
                                  />
                                  <div className="mt-3 ">
                                    <p className="text-red-500 text-sm">
                                      {max}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row space-x-3 mr-20  my-6">
                              <button
                                className="px-4 py-2 outline outline-gray-300 rounded-lg text-black"
                                onClick={() => {
                                  // if (
                                  //   values.values.salary >
                                  //   values.values.maxSalary
                                  // ) {
                                  //   return;
                                  // }
                                  // let job = await JSON.parse(
                                  //   await getSessionStorage("postjob")
                                  // );
                                  // job.salary = [
                                  //   currency,
                                  //   values.values.salary,
                                  //   values.values.maxSalary,
                                  // ];
                                  // await setJob(job);
                                  // setStorage(
                                  //   "postjob",
                                  //   JSON.stringify(job)
                                  // );
                                  setPageIndex(3);
                                }}
                              >
                                Prev
                              </button>

                              <button
                                type="button"
                                className="bg-[#228276] px-4 py-1 hover:bg-[#228276] text-white ml-2 font-bold rounded-lg"
                                onClick={() => {
                                  if (
                                    !values.values.salary ||
                                    !values.values.maxSalary ||
                                    !perks.getCurrentContent().hasText() ||
                                    maxvalueerror
                                    //  || alphavalueerror ||alphavalueerrors
                                  ) {
                                    // Set individual error states
                                    if (maxvalueerror) {
                                      setmax(
                                        maxvalueerror
                                          ? "Max Salary should be greater than min Salary"
                                          : ""
                                      );
                                    } else {
                                      setPerksError(
                                        !perks.getCurrentContent().hasText()
                                      );
                                      setSalary(
                                        !values.values.salary ? "Required!" : ""
                                      );
                                      setmax(
                                        !values.values.maxSalary
                                          ? "Required!"
                                          : ""
                                      );
                                    }
                                  } else {
                                    setLoading(true);
                                    setSubmitStatus(1);
                                    job.invitations = candidateData
                                      ? candidateData
                                      : selectedData;
                                    // const job = JSON.parse(getSessionStorage("postjob"));
                                    // job.invitations = candidateDataDup ? candidateDataDup : selectedData;
                                    // setJob(job);
                                    // setSessionStorage("postjob", JSON.stringify(job));
                                    postJob(
                                      job,
                                      values.values.salary,
                                      values.values.maxSalary
                                    );
                                    setLoading(false);
                                    setSalary("");
                                    setmax("");
                                    setPerksError(false);
                                  }
                                }}
                                style={{ backgroundColor: "#228276" }}
                              >
                                {loading ? <BeatLoader /> : "Submit"}
                              </button>
                            </div>
                          </Form>
                        </div>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        setPageIndex(1);
        return null;
    }
  };
  return (
    <div class="container mx-auto bg-slate-50 p-4 customMobileCss">
      <div class="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
        <div className="flex bg-white rounded-xl w-100">
          <nav className="col pt-5 px-10 flex mb-3 w-1/4">
            <ol class="items-center w-full ">
              <li
                className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 1
                  ? "font-medium  dark:text-gray-500"
                  : "font-normal  dark:text-teal-800"
                  }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 1
                    ? "bg-teal-800 text-white"
                    : PageIndex <= 1
                      ? "bg-white text-dark shadow-xl"
                      : "bg-teal-800 text-white"
                    }`}
                >
                  1
                </span>
                <span>
                  <h3 class="font-medium leading-tight">Job details</h3>
                  <p class="text-sm">Enter the job details</p>
                </span>
              </li>
              <li
                className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 2
                  ? "font-medium  dark:text-gray-500"
                  : "font-normal  dark:text-teal-800"
                  }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 2
                    ? "bg-gray-500 text-white"
                    : PageIndex <= 2
                      ? "bg-white text-dark shadow-xl"
                      : "bg-teal-800 text-white"
                    }`}
                >
                  2
                </span>
                <span>
                  <h3 class="font-medium leading-tight">Eligibility criteria</h3>
                  <p class="text-sm">Define the eligibility criteria</p>
                </span>
              </li>
              {/* <li
            className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 3
              ? "font-medium  dark:text-gray-500"
              : "font-normal  dark:text-teal-800"
              }`}
          >
            <span
              className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 3
                ? "bg-gray-500 text-white"
                : PageIndex <= 3
                  ? "bg-white text-dark shadow-xl"
                  : "bg-teal-800 text-white"
                }`}
            >
              3
            </span>
            <span>
              <h3 class="font-medium leading-tight">Job Invitation</h3>
              <p class="text-sm">Send out the invitations</p>
            </span>
          </li> */}
              <li
                className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 3
                  ? "font-medium  dark:text-gray-500"
                  : "font-normal  dark:text-teal-800"
                  }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 3
                    ? "bg-gray-500 text-white"
                    : PageIndex <= 3
                      ? "bg-white text-dark shadow-xl "
                      : "bg-teal-800 text-white"
                    }`}
                >
                  3
                </span>
                <span>
                  <h3 class="font-medium leading-tight">Screening question</h3>
                  <p class="text-sm">Enter the screening questions</p>
                </span>
              </li>
              <li
                className={`flex items-center space-x-2.5 mb-4 ${PageIndex <= 4
                  ? "font-medium  dark:text-gray-500"
                  : "font-normal  dark:text-teal-800"
                  }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 page-index ${PageIndex === 4
                    ? "bg-gray-500 text-white"
                    : PageIndex <= 4
                      ? "bg-white text-dark shadow-xl"
                      : "bg-teal-800 text-white"
                    }`}
                >
                  4
                </span>
                <span>
                  <h3 class="font-medium leading-tight">
                    Remuneration & pay range
                  </h3>
                  <p class="text-sm">Define remuneration & pay range</p>
                </span>
              </li>
            </ol>
          </nav>
          <div className="my-2">
            {Alert === true && (
              <div
                className="bg-green-100 rounded-lg py-5 px-6 my-3 mb-4 text-base text-green-800"
                role="alert"
              >
                Job Posted Successfully ! Check Here
              </div>
            )}
            {Alert === false && (
              <div
                className="bg-red-100 rounded-lg py-5 px-6 mb-4 text-base text-red-700"
                role="alert"
              >
                Problem Uploading Job ! Try Again Later !
              </div>
            )}
          </div>
          <div class="h-full min-h-[80em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-50 dark:opacity-50"></div>
          <div className="mb-3 w-3/4">
            {job ? (
              <div className=" w-full px-5">{renderFormPage()}</div>
            ) : (
              <div
                className="mt-40"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Oval />
                <Oval />
                <Oval />
                <Oval />
                <Oval />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateJob;
