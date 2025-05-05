import React, { useEffect, useState } from "react";
import {
  AiOutlineBook,
  AiOutlinePullRequest,
  AiOutlineRedo,
  AiOutlineRollback,
} from "react-icons/ai";
import swal from "sweetalert";
import { Tooltip } from "react-tooltip";
import { getSkills, getUserFromId } from "../service/api";
import getStorage, { getSessionStorage } from "../service/storageService";

const NewSkillsView = () => {
  // changes for skilledFeedback
  const [skillsFeedback, setSkillsFeedback] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initial = async () => {
      let user = await JSON.parse(await getSessionStorage("user"));
      await setUser(user);
      let access_token = getStorage("access_token");
      let res = await getUserFromId({ id: user._id }, access_token);
      setUser(res?.data?.user);

      if (
        res?.data?.user?.skillsFeedback &&
        res?.data?.user?.skillsFeedback?.length > 0
      ) {
        // direct add skillsFeedback to the groupedSkills
        let data = res?.data?.user?.skillsFeedback;
        setSkillsFeedback(data);

      } else if (res?.data?.user?.tools && res?.data?.user?.tools?.length > 0) {
        let data = res?.data?.user?.tools;
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
                proficiency: item.proficiency ? parseInt(item.proficiency) : 0,
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
    };
    initial();
  }, []);

  return (
    <>
      <label className="font-semibold text-lg w-2/5 mx-2 ">
        Technical skills
      </label>
      <br />
      {user?.skillsFeedback?.length > 0 ? (
        <div
          className="w-full"
          style={{ backgroundColor: "#F4F4F4", border: "1px solid #CCCCCC" }}
        >
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {skillsFeedback && Object.keys(skillsFeedback).length > 0 && (
              <table className="w-full">
                <thead
                  className="text-white"
                  style={{ backgroundColor: "#0a4f46" }}
                >
                  <tr>
                    <th className="py-3 px-6 text-left">Skill</th>
                    <th className="py-3 px-6 text-left">Proficiency</th>
                    <th className="py-3 px-6 text-left">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <React.Fragment>
                    {/* {(skillsFeedback).map((entry , index) => {
                                        const role = Object.keys(entry)[0]; // Get the role
                                        const skillsFeedback = entry[role]; // Get the associated skills feedback
                                      
                                        return (
                                            <React.Fragment key={index}>
                                                <tr style={{ backgroundColor: "#adb3b1" }}>
                                                    <td colSpan="3" className="py-2 px-6 text-md font-bold text-center">
                                                        {role}
                                                    </td>
                                                </tr>
                                                 {skillsFeedback.map((skillObj, skillIndex) => {
                                                    return (
                                                  <tr key={skillIndex} style={{ maxHeight: '100px', overflowY: 'auto', borderBottom: '1px solid #CCCCCC' }}>
                                                    <td className="py-2 px-6 text-md font-bold text-left" style={{ borderRight: '1px solid #CCCCCC' }}>
                                                      {skillObj.skill}
                                                    </td>
                                                    <td className="py-2 px-6 text-left">
                                                      {(() => {
                                                        switch (skillObj.proficiency) {
                                                          case 1:
                                                            return "Beginner";
                                                          case 2:
                                                            return "Intermediate";
                                                          case 3:
                                                            return "Advanced";
                                                          case 4:
                                                            return "Expert";
                                                          case 5:
                                                            return "Expert Pro";
                                                          default:
                                                            return "";
                                                        }
                                                      })()}
                                                    </td>
                                                    <td className="py-2 px-6 text-md font-bold text-left" style={{ borderRight: '1px solid #CCCCCC' }}>
                                                      {skillObj.rating}
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </React.Fragment>
                                        );
                                    })} */}

                    {skillsFeedback.map((entry, index) => {
                      const keys = Object.keys(entry); // Get all the keys in the entry object

                      return (
                        <React.Fragment key={index}>
                          {keys.map((role, roleIndex) => {
                            const skillsFeedbackForRole = entry[role]; // Get the associated skills feedback for the role

                            return (
                              <React.Fragment key={roleIndex}>
                                <tr style={{ backgroundColor: "#adb3b1" }}>
                                  <td
                                    colSpan="3"
                                    className="py-2 px-6 text-md font-bold text-center"
                                  >
                                    {role}
                                  </td>
                                </tr>
                                {skillsFeedbackForRole.map(
                                  (skillObj, skillIndex) => {
                                    return (
                                      <tr
                                        key={skillIndex}
                                        style={{
                                          maxHeight: "100px",
                                          overflowY: "auto",
                                          borderBottom: "1px solid #CCCCCC",
                                        }}
                                      >
                                        <td
                                          className="py-2 px-6 text-md font-bold text-left"
                                          style={{
                                            borderRight: "1px solid #CCCCCC",
                                          }}
                                        >
                                          {skillObj.skill}
                                        </td>
                                        <td className="py-2 px-6 text-left">
                                          {(() => {
                                            switch (skillObj.proficiency) {
                                              case 1:
                                                return "Beginner";
                                              case 2:
                                                return "Intermediate";
                                              case 3:
                                                return "Advanced";
                                              case 4:
                                                return "Expert";
                                              case 5:
                                                return "Expert Pro";
                                              default:
                                                return "";
                                            }
                                          })()}
                                        </td>
                                        <td
                                          className="py-2 px-6 text-md font-bold text-left"
                                          style={{
                                            borderRight: "1px solid #CCCCCC",
                                          }}
                                        >
                                          {skillObj.rating}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div
          className="w-full"
          style={{ backgroundColor: "#F4F4F4", border: "1px solid #CCCCCC" }}
        >
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {skillsFeedback && Object.keys(skillsFeedback).length > 0 && (
              <table className="w-full">
                <thead
                  className="text-white"
                  style={{ backgroundColor: "#0a4f46" }}
                >
                  <tr>
                    <th className="py-3 px-6 text-left">Skill</th>
                    <th className="py-3 px-6 text-left">Proficiency</th>
                    <th className="py-3 px-6 text-left">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  <React.Fragment>
                    {Object.keys(skillsFeedback).map((role) => {
                      return (
                        <React.Fragment key={role}>
                          <tr style={{ backgroundColor: "#adb3b1" }}>
                            <td
                              colSpan="3"
                              className="py-2 px-6 text-md font-bold text-center"
                            >
                              {role}
                            </td>
                          </tr>
                          {skillsFeedback[role].map((skillObj, index) => {
                            // Filter based on role and skill search
                            return (
                              <tr
                                key={index}
                                style={{
                                  maxHeight: "100px",
                                  overflowY: "auto",
                                  borderBottom: "1px solid #CCCCCC",
                                }}
                              >
                                <td
                                  className="py-2 px-6 text-md font-bold text-left"
                                  style={{ borderRight: "1px solid #CCCCCC" }}
                                >
                                  {skillObj.skill}
                                </td>
                                <td className="py-2 px-6 text-left">
                                  {(() => {
                                    switch (skillObj.proficiency) {
                                      case 1:
                                        return "Beginner";
                                      case 2:
                                        return "Intermediate";
                                      case 3:
                                        return "Advanced";
                                      case 4:
                                        return "Expert";
                                      case 5:
                                        return "Expert Pro";
                                      default:
                                        return "";
                                    }
                                  })()}
                                </td>
                                <td
                                  className="py-2 px-6 text-md font-bold text-left"
                                  style={{ borderRight: "1px solid #CCCCCC" }}
                                >
                                  {skillObj.rating}
                                </td>
                              </tr>
                            );
                            return null; // Return null for items that don't match the filter criteria
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewSkillsView;
