import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getInterviewApplication,
  updateEvaluation,
  updateEvaluationSkills,
  updateHasFeedback,
  getUser,
  getSkills,
  updateSkills,
  getUserFromId,
} from "../../service/api";
import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { AiTwotoneStar, AiOutlineStar, AiOutlineSave } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";

import Switch from 'react-switch';

import { HiOutlineLocationMarker } from "react-icons/hi";
import swal from "sweetalert";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { Disclosure } from "@headlessui/react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { getProfileImage } from "../../service/api";
import Avatar from "../../assets/images/UserAvatar.png";
import ls from "localstorage-slim";
import { getStorage, removeStorage } from "../../service/storageService";
import { getSessionStorage, removeSessionStorage } from "../../service/storageService";
import SkillsRating from "./SkillsRating";
import { updateSkillsFeedbackAPI } from "../../service/feedbackService";
const UpdateInterviewApplication = () => {
  const { id } = useParams();
  const [interview, setInterview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState(null);
  const [currStatus, setCurrStatus] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null);
  const [positives, setPositives] = React.useState(null);
  const [lowlights, setLowlights] = React.useState(null);
  const [evaluation, setEvaluation] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [initialRating, setInitialRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [clickedUpdateSkill, setClickedUpdateSkill] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const [jobId, setJobId] = useState(null)

  const [XIEvaluations, setXIEvaluations] = React.useState([]);
  const [showEvalForm, setShowEvalForm] = React.useState(false);
  const [initialQuestion, setInitialQuestion] = React.useState({
    question: "",
    answer: "",
  });
  const [editIndex, setEditIndex] = React.useState(null);

  // skills
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState({});

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [skillSet, setSkillSet] = React.useState([]);
  const [candidate, setCandidate] = React.useState([]);
  const [jdSkills, setJDSkills] = React.useState([]);

  // for toggle buttons
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(false);
  const [checked4, setChecked4] = React.useState(false);
  const [checked5, setChecked5] = React.useState(false);
  const [demeanorOfCandidate, setDemeanorOfCandidate] = useState("Calm");
  const [userImage, setUserImage] = useState("");
  const [groupedSkillsData, setGroupedSkillsData] = useState(null);
  const [skillsFeedback, setSkillsFeedback] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [anotherPerson, setAnotherPerson] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const [allSkillsEvaluated, setAllSkillsEvaluated] = useState(false);


  const hasProficiencyGreaterThanZero = () => {
    // Iterate through the roles in skillsFeedback
    for (const role in skillsFeedback) {
      if (skillsFeedback.hasOwnProperty(role)) {
        // Iterate through the skills in the role
        for (const skillObj of skillsFeedback[role]) {
          // Check if the proficiency is greater than 0
          if (skillObj.proficiency > 0) {
            return true; // At least one skill has proficiency greater than 0
          }
        }
      }
    }
    return false; // No skill has proficiency greater than 0
  };

  const updateSkill = () => {
    setUpdateLoading(true);
    const skillsFeebackOk = hasProficiencyGreaterThanZero();
    if (skillsFeebackOk) {
      let resp = updateSkillsFeedbackAPI(id, user._id, skillsFeedback);
      if (resp) {
        // set it true only if the update skill response is valid
        setClickedUpdateSkill(true);
        swal({
          icon: "success",
          title: "Skills rating",
          text: "Your rating for the candidates skills has been saved successfully",
          button: "Ok",
        });

      }
    } else {
      swal({
        icon: "error",
        title: "Skills rating",
        text: "Please rate atleast one skill",
        button: "Ok",
      });

    }
    setUpdateLoading(false);

  }

  const updateSkillsFeedback = async (skillsFeedback) => {
    setSkillsFeedback(skillsFeedback);
  }


  const handleChange = (event) => {
    setChecked(!checked);
  };

  const handleChange2 = (event) => {
    setChecked2(!checked2);
  };

  const handleChange3 = (event) => {
    setChecked3(!checked3);
  };

  const handleChange4 = (event) => {
    setChecked4(!checked4);
  };

  const handleChange5 = (event) => {
    setChecked5(!checked5);
  };

  const placeHolderforPositives = `Example : 
  Strong technical knowledge and expertise in relevant technologies.
  Excellent problem-solving skills and ability to think analytically.
  Good communication and interpersonal skills, demonstrated through clear explanations.
  Quick learner and adaptable to new technologies and challenges.
  Proactive and takes initiative in suggesting innovative solutions.`;

  const placeHolderforLowlights = `Example : 
  Lack of experience in specific technology/framework mentioned in the job description.
  Limited practical exposure to large-scale projects or complex systems.
  Need to improve time management skills to meet project deadlines consistently.
  Could benefit from more hands-on experience in collaborating within a team.
  Could enhance coding practices to improve code quality and maintainability.
  `;

  const placeHolderforFeedback = `Example : 
  The candidate displays a solid foundation in technical knowledge, problem-solving, and communication skills. While they may lack certain specific experiences or skills, their adaptability and willingness to learn make them a promising candidate. With some improvements in time management, collaborative work, and coding practices, they can become a valuable asset to the team.
  `;

  React.useEffect(() => {
    let initial = async () => {
      let user = await JSON.parse(getSessionStorage("user"));
      setUser(user);
      let res = await getInterviewApplication({ id: id }, user.access_token);
      setJobId(res?.data?.data?.application?.job)
      if (res?.data?.data) {
        let candidate = await getUserFromId(
          { id: res?.data?.data?.application?.applicant },
          user?.access_token
        );

        setCandidate(candidate?.data?.user);
        setDbSkills(res?.data?.data?.job?.skills);
        let uniqueRoles = [
          // ...new Set(res?.data?.data?.job?.skills?.map((item) => item.role)),
          [...new Set(res?.data?.data?.job?.skills?.map((item) => Object.keys(item)[0])),]
        ];
        setJDSkills(uniqueRoles);
        let data = res?.data?.data?.job?.skills;
        if (data) {
          // Group the data by the "role" attribute
          const groupedSkillsData = data.reduce((result, item) => {
            // const role = item.role;
            const role = Object.keys(item);
            if (!result[role]) {
              result[role] = [];
            }
            // Check if the primarySkill is not already in the result[role]
            // const existingSkill = result[role].find((skill) => skill.skill === item.primarySkill);
            const existingSkill = result[role].find((skill) => skill.skill === item.primarySkill);
            // if (!existingSkill) {
            //   let pSkill
            //     let primarySkill = item[role][0]?.skill
            //     let obj = {
            //         // skill: item.primarySkill,
            //         // skill: result[role].find((skill) => skill.skill === result[role][0].skill),
            //         // skill: Object.keys(item),
            //         skill: primarySkill,
            //         // skill: pSkill,
            //         proficiency: 0,
            //         rating: 0,
            //         reason: "",
            //     };
            //     result[role].push(obj);
            // }
            // Iterate through each skill in the given role
            if (!existingSkill) {
              item[role].forEach((skillObj) => {
                let primarySkill = skillObj.skill;

                let obj = {
                  skill: primarySkill,
                  proficiency: 0,
                  rating: 0,
                  reason: "",
                };
                // Push the created object to the result array
                result[role].push(obj);
              });
            }
            return result;
          }, {});
          setGroupedSkillsData(groupedSkillsData);
        }
        if (res?.data?.data?.application?.evaluations) {
          setSkillSet(
            res?.data?.data?.application?.evaluations[user._id]?.skills
          );
        } else {
          setSkillSet([]);
        }
        let image = await getProfileImage(
          { id: res?.data?.data?.application?.applicant },
          user.access_token
        );
        if (image?.status === 200) {
          let base64string = "";
          base64string = btoa(
            new Uint8Array(image?.data?.Image?.data).reduce(function (
              data,
              byte
            ) {
              return data + String.fromCharCode(byte);
            },
              "")
          );
          if (base64string !== "") {
            setProfileImage(`data:image/png;base64,${base64string}`);
          }
        }
        let primarySkills = {};
        let roles = new Set([]);
        let tempArray = [];

        if (res?.data?.data?.application?.evaluations) {
          res?.data?.data?.application?.evaluations[user._id]?.skills?.forEach(
            (skill) => {
              roles.add(skill?.role);
              if (primarySkills[skill?.role]) {
                primarySkills[skill?.role].add(skill?.primarySkill);
              } else {
                primarySkills[skill?.role] = new Set([skill?.primarySkill]);
              }
            }
          );
        } else {
          primarySkills = {};
        }
        if (Array.from(roles)) {
          setCRoles(Array.from(roles));
        } else {
          setCRoles({});
        }
        Array.from(roles).length > 0 &&
          Array.from(roles).map((el) => {
            primarySkills[el] = Array.from(primarySkills[el]);
          });
        if (primarySkills) setSkillsPrimary(primarySkills);
        else {
          setSkillsPrimary([]);
        }
        if (res?.data?.data?.job?.questions) {
          let answers = new Array(res.data.data.job.questions.length).fill("");
          setEvaluation(answers);
        }
        if (
          res?.data?.data?.application?.evaluations &&
          res?.data?.data?.application?.evaluations[user?._id]
        ) {
          if (res?.data?.data?.application?.evaluations[user?._id]?.status) {
            setCurrStatus(
              res?.data?.data?.application?.evaluations[user?._id]?.status
            );
            setStatus(
              res?.data?.data?.application?.evaluations[user?._id]?.status
            );
          }
          if (
            res?.data?.data?.application?.evaluations[user?._id]
              ?.candidate_rating
          ) {
            setInitialRating(
              res?.data?.data?.application?.evaluations[user?._id]
                ?.candidate_rating
            );
            setRating(
              res?.data?.data?.application?.evaluations[user?._id]
                ?.candidate_rating
            );
          }
        } else if (res?.data?.data?.application) {
          if (res?.data?.data?.application?.status) {
            setCurrStatus(res?.data?.data?.application?.status);
            setStatus(res?.data?.data?.application?.status);
          }
        } else {
          setInitialRating(0);
          setRating(0);
          setCurrStatus("Pending");
          setStatus("Pending");
        }
        setInterview(res?.data?.data);
      }
      setLoading(false);
    };
    initial();
  }, []);

  useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      let p = JSON.parse(await getSessionStorage("prof"));
      let pr1 = JSON.parse(await getSessionStorage("RolesProf"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        await res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr = new Array(res.data.length).fill(0);
        if (!pr1) pr1 = new Array(roles.size).fill(0);

        if (user.tools.length > 0) {
          await user.tools.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            pr[index] = skill.proficiency;
          });
          await setProf([...pr]);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }

        await setRolesProf(pr1);
        await setShowRoles(Array.from(roles));
        await setRoles(Array.from(roles));
        //await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
      }
    };
    initial();
  }, []);

  const updateEvaluationReport = async () => {

    let res = await updateEvaluation({
      updates: {
        status: status,
        feedback: feedback,
        positives: positives,
        lowlights: lowlights,
        imageMatched: checked,
        hasHeadPhone: checked2,
        facedCamera: checked3,
        othersExistsInroom: checked4,
        demeanorOfCandidate: demeanorOfCandidate,
        anotherPerson: anotherPerson,
        skillsFeedback: skillsFeedback,
      },
      user_id: user._id,
      application_id: interview.application._id,
    });
    let res2 = await updateHasFeedback(jobId, { email: candidate?.email })
    if (res && res.status === 200 && res2?.status === 200) {
      swal("Success", "Evaluation Updated", "success").then((result) => {
        removeSessionStorage("leavecall");
        window.location.href = "/XI";
      });
    } else {
      swal("Error", "Something went wrong", "error");
    }

  };

  const updateSkill1 = async () => {
    let skills = [];

    dbSkills.forEach((el, index) => {
      if (prof[index] > 0) {
        el.proficiency = prof[index];
        skills.push(el);
      }
    });

    let res = await updateEvaluationSkills({
      updates: { skills: skills },
      user_id: user._id,
      application_id: interview.application._id,
    });
    setSkillSet(skills);
    let primarySkills = {};
    let roles = new Set([]);
    skills.forEach((skill) => {
      roles.add(skill.role);
      if (primarySkills[skill.role]) {
        primarySkills[skill.role].add(skill.primarySkill);
      } else {
        primarySkills[skill.role] = new Set([skill.primarySkill]);
      }
    });
    setCRoles(Array.from(roles));
    Array.from(roles).map((el) => {
      primarySkills[el] = Array.from(primarySkills[el]);
    });
    setSkillsPrimary(primarySkills);

    if (res.status !== 200) {
      swal({
        icon: "error",
        title: "Evaluation",
        text: "Something went wrong",
        button: "Continue",
      });
    } else {
      removeSessionStorage("prof");
      removeSessionStorage("RolesProf");
      swal({
        icon: "success",
        title: "Evaluation",
        text: "Skills Evaluated Succesfully",
        button: "Continue",
      });
      setClickedUpdateSkill(true);
    }
  };

  return (
    <div className="flex bg-slate-50 w-full h-full oflowx-scroll">
      <div className="container mx-auto bg-slate-50 p-4 customMobileCss">
        <div className="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
          <div className="bg-slate-100">
            <div className="mx-5 mt-3 p-5">
              {loading && (
                <p className="text-center font-semibold text-lg">Loading Data...</p>
              )}
              {!loading && (
                <div>
                  {/* {interview && (
              <p className="my-2 text-sm">
                <span className="font-semibold">Interview Id : </span>{" "}
                {interview.application._id}
              </p>
            )} */}
                  {interview && interview.job && (
                    <div className="my-5">
                      <div className="flex items-start space-x-3 	">
                        <div className="py-2 w-full flex" style={{ backgroundColor: "#228276" }}>
                          <p className="text-lg mx-5 text-center text-white font-semibold">
                            Job details
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        {/*<Link
                    to={`/XI/jobDetails/${interview.job._id}`}
                    target="_blank"
                  >
                    View Job Details
                  </Link>*/}
                      </div>
                      <div className="w-full  bg-white border border-b">
                        <div className="grid px-9 grid-cols-1 gap-4 lg:grid-cols-7 py-6 relative">
                          <div className="col-span-2 flex align-middle">
                            <div className="">
                              <img
                                src={""}
                                className="h-20 w-20 text-center rounded-full mx-3 bg-white border border-gray-700 object-contain"
                                alt="Company_Logo"
                              />
                            </div>
                            <div className="pt-3">
                              <h5 className="text-black-900 text-lg font-bold mb-1 ">
                                {interview.job.jobTitle}
                              </h5>
                              <p className="text-sm font-bold  text-gray-400 font-semibold">
                                {interview.job.hiringOrganization}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-2">
                          </div>
                          <div className="col-span-2">
                            {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
                            <div className="flex py-1">
                              <div className="text-lg py-1 text-gray-400 font-semibold ">
                                <CgWorkAlt />
                              </div>

                              <p className="px-4 text-md text-gray-400 font-semibold">
                                {interview.job.jobType}
                              </p>
                            </div>
                            <div className="flex py-1">
                              <div className="text-lg py-1 text-gray-400 font-semibold ">
                                <HiOutlineLocationMarker />
                              </div>

                              <p className="px-4 text-md text-gray-400 font-semibold">
                                {interview.job.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {interview && interview.applicant && (
                    <div className="my-5 mt-8">
                      <div className="flex items-start space-x-3 	">
                        <div className="py-2 w-full flex" style={{ backgroundColor: "#228276" }}>
                          <p className="text-lg mx-5 text-center text-white font-semibold">
                            Candidate details
                          </p>
                        </div>
                      </div>
                      <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                        <p>
                          <span className="font-semibold">Candidate ID :</span>{" "}
                          {interview.application.applicant}{" "}
                          {
                            //interview.applicant.lastname
                          }
                          <div className="my-3">
                            <div>
                              {profileImage !== "" ? (
                                <img
                                  className="rounded-lg"
                                  src={profileImage}
                                  width="10%"
                                  alt=""
                                />
                              ) : (
                                <img
                                  className="rounded-lg"
                                  src={Avatar}
                                  width="10%"
                                  alt=""
                                />
                              )}
                            </div>
                          </div>
                        </p>
                        <div className="w-1/2 flex flex-wrap justify-between">
                          {/*interview.applicant.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {interview.applicant.email}
                      </p>
                    )*/}
                          {/*interview.applicant.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {interview.applicant.contact}
                      </p>
                    )*/}
                        </div>
                      </div>
                    </div>
                  )}
                  {interview && (
                    <>
                      <div className="my-5">
                        <div className="flex items-start space-x-3 	">
                          <div className="py-2 w-full flex" style={{ backgroundColor: "#228276" }}>
                            <p className="text-lg mx-5 text-center text-white font-semibold">
                              Post interview check
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap bg-white border border-b px-9 py-6 space-y-2">
                            <div className="w-full md:w-2/2">
                              <div className="bg-gray-100 p-3">
                                <p className="font-semibold">
                                  Was the candidate the same as in the picture?
                                </p>
                              </div>
                              <div className="bg-gray-200 p-3">
                                <Switch
                                  checked={checked}
                                  onChange={handleChange}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </div>
                            </div>
                            <div className="w-full md:w-2/2">
                              <div className="bg-gray-100 p-3">
                                <p className="font-semibold">
                                  Did the candidate use headphones or an earpiece while being interviewed?
                                </p>
                              </div>
                              <div className="bg-gray-200 p-3">
                                <Switch
                                  checked={checked2}
                                  onChange={handleChange2}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </div>
                            </div>
                            <div className="w-full md:w-2/2">
                              <div className="bg-gray-100 p-3">
                                <p className="font-semibold">
                                  Was the candidate looking at the monitor or camera during the course
                                  of the interview?
                                </p>
                              </div>
                              <div className="bg-gray-200 p-3">
                                <Switch
                                  checked={checked3}
                                  onChange={handleChange3}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </div>
                            </div>
                            <div className="w-full md:w-2/2">
                              <div className="bg-gray-100 p-3">
                                <p className="font-semibold">
                                  Was there any person other than the candidate in the room during the
                                  course of the interview?
                                </p>
                              </div>
                              <div className="bg-gray-200 p-3">
                                <Switch
                                  checked={checked4}
                                  onChange={handleChange4}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                                {checked4 && (
                                  <textarea
                                    className="px-4 py-1 my-3 w-full block"
                                    rows="5"
                                    style={{ borderRadius: "5px" }}
                                    placeholder="Please ellaborate"
                                    onChange={(e) => {
                                      setAnotherPerson(e.target.value);
                                    }}
                                  ></textarea>
                                )}
                              </div>
                            </div>
                            <div className="w-full md:w-2/2">
                              <div className="bg-gray-100 p-3">
                                <p className="font-semibold">
                                  What was the demeanor of the candidate during the course of the
                                  interview?
                                </p>
                              </div>
                              <div className="bg-gray-200 p-3">
                                <select
                                  className="border border-gray-400 rounded-md px-4 py-1 ml-2"
                                  onChange={(e) => setDemeanorOfCandidate(e.target.value)}
                                  name="status"
                                  id="status"
                                >
                                  <option value="Calm">Calm</option>
                                  <option value="Tensed">Tensed</option>
                                  <option value="Somewhere in between">Somewhere in between</option>
                                </select>
                              </div>
                            </div>
                            <div className="w-full md:w-2/2">
                              <div className="bg-gray-100 p-3">
                                <p className="font-semibold">
                                  Would you recommend the candidate for this job?
                                </p>
                              </div>
                              <div className="bg-gray-200 p-3">
                                <select className="border border-gray-400 rounded-md px-4 py-1 ml-2 " onChange={(e) => setStatus(e.target.value)} name="status" id="status">
                                  <option value="Pending" selected={status === "Pending"}>Please select </option>
                                  <option value="Recommended" selected={status === "Recommended"} >Yes</option>
                                  <option value=" Not Recommended" selected={status === " Not Recommended"} >No</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="my-5">
                        <div className="flex items-start space-x-3">
                          <div className="py-2 w-full flex justify-between" style={{ backgroundColor: "#228276" }}>
                            <p className="text-lg mx-5 text-left text-white font-semibold">
                              Skills rating
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-200 p-3">
                          {groupedSkillsData ?
                            <SkillsRating groupedSkillsData={groupedSkillsData} updateSkillsFeedback={updateSkillsFeedback} setAllSkillsEvaluated={setAllSkillsEvaluated} />
                            : null
                          }
                        </div>
                        {
                          !allSkillsEvaluated && (
                            <p className="text-red-600 text-sm w-full text-left mr-auto">
                              Please Evaluate All The Skills
                            </p>
                          )
                        }
                        <div>
                          <div className="my-5">
                            <div className="py-2 w-full flex justify-between" style={{ backgroundColor: "#228276" }}>
                              <p className="text-lg mx-5 text-left text-white font-semibold">
                                Positives
                              </p>
                            </div>
                            <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                              <textarea
                                className="px-4 py-1 my-3 w-3/4 block"
                                rows="5"
                                placeholder={placeHolderforPositives}
                                style={{ borderRadius: "5px" }}
                                onChange={(e) => {
                                  setPositives(e.target.value);
                                }}
                              />
                              {positives?.length < 150 && (
                                <p style={{ color: "red" }}>
                                  Please input 150 characters minimum in Positives.{" "}
                                </p>
                              )}
                              {!positives && (
                                <p className="text-red-600 text-sm w-full text-left mr-auto">
                                  Required !
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="my-5">
                            <div className="py-2 w-full flex justify-between" style={{ backgroundColor: "#228276" }}>
                              <p className="text-lg mx-5 text-left text-white font-semibold">
                                Lowlights
                              </p>
                            </div>
                            <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                              <textarea
                                className="px-4 py-1 my-3 w-3/4 block"
                                rows="5"
                                style={{ borderRadius: "5px" }}
                                placeholder={placeHolderforLowlights}
                                onChange={(e) => {
                                  setLowlights(e.target.value);
                                }}
                              />
                              {lowlights?.length < 150 && (
                                <p style={{ color: "red" }}>
                                  Please input 150 characters minimum in Lowlights.{" "}
                                </p>
                              )}
                              {!lowlights && (
                                <p className="text-red-600 text-sm w-full text-left mr-auto">
                                  Required !
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="my-5">
                            <div className="py-2 w-full flex justify-between" style={{ backgroundColor: "#228276" }}>
                              <p className="text-lg mx-5 text-left text-white font-semibold">
                                Feedback
                              </p>
                            </div>
                            <div className="w-full  bg-white border border-b bg-white px-9 py-6 border space-y-2">
                              <textarea
                                className="px-4 py-1 my-3 w-3/4 block"
                                rows="5"
                                style={{ borderRadius: "5px" }}
                                placeholder={placeHolderforFeedback}
                                onChange={(e) => {
                                  setFeedback(e.target.value);
                                }}
                              />
                              {feedback?.length < 150 && (
                                <p style={{ color: "red" }}>
                                  Please input 150 characters minimum in Feedback.{" "}
                                </p>
                              )}
                              {!feedback && (
                                <p className="text-red-600 text-sm w-full text-left mr-auto">
                                  Required !
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    </>
                  )}
                  <div className="flex justify-center">
                    {(allSkillsEvaluated && positives && feedback && lowlights && feedback?.length > 150 &&
                      lowlights?.length > 150 && positives?.length > 150 && hasProficiencyGreaterThanZero()) ?
                      <button
                        className="text-white px-4 py-2 rounded"
                        style={{ backgroundColor: "#228276" }}
                        onClick={updateEvaluationReport}
                      >
                        Complete evaluation
                      </button>
                      : null
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInterviewApplication;
