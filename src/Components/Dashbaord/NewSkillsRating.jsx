import React from 'react'
import getStorage, { removeStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { getSkills, updateUserLanguageDetails, updateUserSkill, updateUserSkillDetails } from "../../service/api"
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { AiOutlineBook, AiOutlinePullRequest, AiOutlineRedo, AiOutlineRollback } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import SkillRatingReason from './SkillRatingReason';



const NewSkillsRating = () => {

  const [user, setUser] = React.useState(null);
  // Set access-token
  const [access_token, setAccessToken] = useState(null)

  const [skillsFeedback, setSkillsFeedback] = useState(null);
  const [ratings, setRatings] = useState(new Array(5).fill(0));
  const [showReason, setShowReason] = useState(false);
  const [currentSkill, setCurrentSkill] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [currentRat, setCurrentRat] = useState(0);
  const [dbSkills, setDbSkills] = useState(null);

  const [groupedSkillsData, setGroupedSkillsData] = useState(null);

  const [roleFilter, setRoleFilter] = useState('All');
  const [skillSearch, setSkillSearch] = useState('');

  const handleRoleFilterChange = (selectedRole) => {
    setRoleFilter(selectedRole);
  };




  const navigate = useNavigate();

  useEffect(() => {
    let inital = async () => {
      let user = JSON.parse(getSessionStorage("user"));
      setUser(user)
      let access_token = getStorage("access_token");
      let res = await getSkills({ user_id: user._id }, access_token);
      if (res?.data) {
        setDbSkills(res?.data);
      }
      // We get all the unique roles 
      let uniqueRoles = [
        ...new Set(res?.data?.map((item) => item.role)),
      ];

      let data = res?.data
      if (data) {
        // Group the data by the "role" attribute
        const groupedSkillsData = data.reduce((result, item) => {
          const role = item.role;
          if (!result[role]) {
            result[role] = [];
          }
          // Check if the primarySkill is not already in the result[role]
          const existingSkill = result[role].find((skill) => skill.skill === item.primarySkill);
          if (!existingSkill) {
            let obj = {
              skill: item.primarySkill,
              proficiency: 0,
              rating: 0,
              reason: "",
            };
            result[role].push(obj);
          }
          return result;
        }, {});
        setGroupedSkillsData(groupedSkillsData);
        // console.log("111" , groupedSkillsData)
        setSkillsFeedback(groupedSkillsData)
      }

    }
    inital()
  }, [])

  // function to remove empty array of roles
  function removeSkillsWithZeroProficiency(skillsFeedback, skillCategory) {
    if (skillsFeedback.hasOwnProperty(skillCategory)) {
      skillsFeedback[skillCategory] = skillsFeedback[skillCategory].filter(
        (child) => child.proficiency !== 0
      );

      if (skillsFeedback[skillCategory].length === 0) {
        // Remove the category if it's empty
        delete skillsFeedback[skillCategory];
      }
    }
    return skillsFeedback;
  }

  {/* Code changes for new skill rating form*/ }
  //  const [skillsFeedback, setSkillsFeedback] = useState(null);
  const updateSkillsFeedback = async (skillsFeedback) => {
    setSkillsFeedback(skillsFeedback);
  }

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


  const handleProfieciencyChange = async (role, skill, proficiency) => {
    // Clone the skillsFeedback to avoid directly mutating state
    const updatedSkillsFeedback = { ...skillsFeedback };
    if (updatedSkillsFeedback[role]) {
      const skillToUpdate = updatedSkillsFeedback[role].find(
        (skillObj) => skillObj.skill === skill
      );
      if (skillToUpdate) {
        // Update the proficiency
        skillToUpdate.proficiency = parseInt(proficiency);
        // Update the state with the modified data
        setSkillsFeedback(updatedSkillsFeedback);
      }
    }
  };

  const handleYesClick = (role, skill) => {
    // Clone the skillsFeedback to avoid directly mutating state
    const updatedSkillsFeedback = { ...skillsFeedback };
    if (updatedSkillsFeedback[role]) {
      const skillToUpdate = updatedSkillsFeedback[role].find(
        (skillObj) => skillObj.skill === skill
      );
      if (skillToUpdate) {
        let prof = parseInt(skillToUpdate.proficiency);
        // check if the proficiency is not at 5 already 
        if (prof !== 5) {
          // update proficiency
          skillToUpdate.proficiency = prof + 1;
          // Update the rating
          skillToUpdate.rating = 2;
        }
        // Update the state with the modified data
        setSkillsFeedback(updatedSkillsFeedback);
      }
    }
  }

  const handleRatingChange = async (role, skill, rat) => {
    // if (rat >= 4) {
    //     swal("Do you think this candidate can be rated with an additional ranking basis subjectivity in the next category?", {
    //       icon: "info",
    //       buttons: {
    //         cancel: "Cancel",
    //         Yes: true,
    //         No: true,
    //       },
    //     }).then((swalValue) => {
    //       if (swalValue === "No") {
    //         setCurrentRole(role);
    //         setCurrentSkill(skill);
    //         setCurrentRat(rat);
    //         setShowReason(true);
    //       }else if(swalValue === "Yes"){
    //           rat = 2 ;
    //           handleYesClick(role,skill);
    //       }
    //     });
    // }else{
    //     // Clone the skillsFeedback to avoid directly mutating state
    //     const updatedSkillsFeedback = { ...skillsFeedback };
    //     if (updatedSkillsFeedback[role]) {
    //         const skillToUpdate = updatedSkillsFeedback[role].find(
    //             (skillObj) => skillObj.skill === skill
    //         );
    //         if (skillToUpdate) {
    //             // Update the rating
    //             skillToUpdate.rating = rat;
    //             // keep the reason empty
    //             skillToUpdate.reason = "";
    //             // Update the state with the modified data
    //             setSkillsFeedback(updatedSkillsFeedback);
    //         }
    //     }
    // }

    const updatedSkillsFeedback = { ...skillsFeedback };
    if (updatedSkillsFeedback[role]) {
      const skillToUpdate = updatedSkillsFeedback[role].find(
        (skillObj) => skillObj.skill === skill
      );
      if (skillToUpdate) {
        // Update the rating
        skillToUpdate.rating = rat;
        // keep the reason empty
        skillToUpdate.reason = "";
        // Update the state with the modified data
        setSkillsFeedback(updatedSkillsFeedback);
      }
    }
  };

  const handleRollback = async (role, skill) => {
    // Clone the skillsFeedback to avoid directly mutating state
    const updatedSkillsFeedback = { ...skillsFeedback };
    if (updatedSkillsFeedback[role]) {
      const skillToUpdate = updatedSkillsFeedback[role].find(
        (skillObj) => skillObj.skill === skill
      );
      if (skillToUpdate) {
        // Update the proficiency
        skillToUpdate.proficiency = 0;
        // Update the rating
        skillToUpdate.rating = 0;
        // Update the reason
        skillToUpdate.reason = "";
        // Update the state with the modified data
        setSkillsFeedback(updatedSkillsFeedback);
      }
    }
  };

  const reasonCancel = () => {
    setShowReason(false);
  }

  const reasonSubmit = (role, skill, rat, reason) => {
    // Clone the skillsFeedback to avoid directly mutating state
    const updatedSkillsFeedback = { ...skillsFeedback };
    if (updatedSkillsFeedback[role]) {
      const skillToUpdate = updatedSkillsFeedback[role].find(
        (skillObj) => skillObj.skill === skill
      );
      if (skillToUpdate) {
        // Update the reason
        skillToUpdate.reason = reason;
        skillToUpdate.rating = rat;
        // Update the state with the modified data
        setSkillsFeedback(updatedSkillsFeedback);
      }
    }
    setShowReason(false);
  }

  const updateSkill = async () => {
    let access_token = getStorage("access_token");
    // let updates : {
    //     tools : skillsFeedback
    // }
    if (skillsFeedback) {
      Object.keys(skillsFeedback).forEach((role) => {
        removeSkillsWithZeroProficiency(skillsFeedback, role);
      });
    }
    // console.log("22222" , skillsFeedback)
    let res = await updateUserSkillDetails(
      { user_id: user._id, updates: { data: { skillsFeedback } } },
      { access_token: access_token }
    ).then((res) => {
      // console.log("2222222" , res)
      // if(res && res?.data?.user){
      if (res) {
        // console.log("22222" , res)
        removeSessionStorage("user");
        setSessionStorage("user", JSON.stringify(res?.data?.user));
        swal({
          title: "Skills update",
          text: "Technical Skills updated successfully",
          icon: "success",
          button: "Ok",
        }).then(() => {
          // console.log("@22" , user)
          if (user.user_type === 'XI') {
            navigate("/XI/profile");
          } else if (user.user_type === 'User') {
            navigate("/user/profile");
          }
        })
      }
      // }
    });
  }

  return (
    <>
      <button
        className="bg-blue-500  py-3 px-7 flex justify-end text-white rounded-lg my-5"
        style={{ backgroundColor: "#034488" }}
        onClick={() => {
          updateSkill();
        }}
      >
        Save skill
      </button>
      <div className="px-4 ml-5">
        {showReason ?
          <SkillRatingReason currentRole={currentRole} currentSkill={currentSkill}
            showReason={showReason} reasonCancel={reasonCancel} reasonSubmit={reasonSubmit} currentRat={currentRat} />
          : null}

        <div style={{ maxHeight: "600px", overflowY: "auto", border: "1px solid #CCCCCC", backgroundColor: "#F4F4F4" }}>
          {skillsFeedback ? (
            <table className="w-full">
              <thead className="text-white" style={{ backgroundColor: "#081f08" }}>
                <tr>
                  <th className="py-3 px-6 text-left"></th>
                  <th className="py-3 px-6 text-left">Proficiency</th>
                  <th className="py-3 px-6 text-left">Rating</th>
                  <th className="py-3 px-6 text-left"></th>
                  <th className="py-3 px-6 text-left"></th>
                </tr>
              </thead>
              <div className="w-4/6">
                <input
                  type="text"
                  placeholder="Search skill..."
                  className="block w-full mt-1 px-2 py-1 border border-gray-300 rounded-md text-black"
                  onChange={(e) => setSkillSearch(e.target.value)}
                  value={skillSearch}
                />
              </div>
              <div className="w-4/6 flex justify-end items-center">
                <label className="mr-2 text-white-200"><b>Role:</b></label>
                <select
                  onChange={(e) => handleRoleFilterChange(e.target.value)}
                  value={roleFilter}
                  className="block w-32 mt-1 px-2 py-1 border border-gray-300 rounded-md text-black"
                >
                  <option value="All">All</option>
                  {Object.keys(skillsFeedback).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <tbody>
                <React.Fragment>
                  {Object.keys(skillsFeedback).map((role) => {
                    return (
                      <React.Fragment>
                        <tr style={{ backgroundColor: "#adb3b1" }}>
                          <td colSpan="5" className="py-2 px-6 text-md font-bold text-center">
                            {role}
                          </td>
                        </tr>
                        {
                          skillsFeedback[role].map((skillObj, index) => {
                            if (
                              (roleFilter === "All" || roleFilter === role) &&
                              skillObj.skill.toLowerCase().includes(skillSearch.toLowerCase())
                            ) {
                              return (
                                <tr style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                  <td className="py-2 px-6 text-md font-bold text-left">
                                    {skillObj.skill}
                                  </td>
                                  <td className="py-2 px-6 text-left">
                                    <select
                                      onChange={(e) => handleProfieciencyChange(role, skillObj.skill, e.target.value)}
                                      value={skillObj.proficiency}
                                      className="border border-gray-400 rounded-md px-4 py-1 ml-2"
                                    >
                                      <option value={0}>Select</option>
                                      <option value={1}>Basic</option>
                                      <option value={2}>Intermediate</option>
                                      <option value={3}>Advanced</option>
                                      <option value={4}>Expert</option>
                                      <option value={5}>Expert Pro</option>
                                    </select>
                                  </td>

                                  {skillObj.proficiency > 0 ?
                                    <td>
                                      <div className="star-rating">
                                        {Array(5)
                                          .fill(0)
                                          .map((_, i) => (
                                            <span
                                              key={i}
                                              onClick={() => handleRatingChange(role, skillObj.skill, i + 1)}
                                              style={{
                                                color: i < skillObj.rating ? '#228276' : 'grey',
                                                fontSize: '24px',
                                                cursor: 'pointer',
                                                // Add border style here
                                                padding: '5px', // Add padding for spacing if needed
                                              }}
                                            >
                                              &#9733;
                                            </span>
                                          ))}
                                      </div>
                                    </td>
                                    : null
                                  }
                                  <td>
                                    {skillObj.proficiency > 0 && skillObj.reason ?
                                      <>
                                        <Tooltip id={`reason-tooltip-${index}`} place="top" type="light" effect="solid">
                                          {skillObj.reason}
                                        </Tooltip>
                                        <AiOutlineBook data-tooltip-id={`reason-tooltip-${index}`} />
                                      </>
                                      : null}
                                  </td>
                                  {skillObj.proficiency > 0 ?
                                    <td onClick={() => handleRollback(role, skillObj.skill)} ><AiOutlineRollback /></td>
                                    : null}
                                </tr>
                              )
                            }
                            return null
                          })
                        }
                      </React.Fragment>
                    )

                  })}
                </React.Fragment>
              </tbody>
            </table>
          ) : (
            <div>
              <p className="font-semibold">
                No skills mapped.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NewSkillsRating