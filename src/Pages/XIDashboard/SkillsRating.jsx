import React, { useEffect, useState } from 'react';
import { AiOutlineBook, AiOutlinePullRequest, AiOutlineRedo, AiOutlineRollback } from 'react-icons/ai';
import swal from 'sweetalert';
import { Tooltip } from 'react-tooltip'; 
import SkillRatingReason from './SkillRatingReason';

const SkillsRating = (props) => {

    const[skillsFeedback,setSkillsFeedback] = useState();
    const [ratings, setRatings] = useState(new Array(5).fill(0));
    const [showReason, setShowReason] = useState(false);
    const [currentSkill,setCurrentSkill] = useState();
    const [currentRole,setCurrentRole] = useState();
    const [currentRat,setCurrentRat] = useState(0);
  
    useEffect(() => {
        if (props.groupedSkillsData) {
            setSkillsFeedback(props.groupedSkillsData);
        }
    }, [props.groupedSkillsData]);

    useEffect(() => {
    }, [showReason,setSkillsFeedback]);
    
    // This useEffect is to just update the parent with skillsFeedback
    useEffect(() => {
        props.updateSkillsFeedback(skillsFeedback);
    }, [skillsFeedback]);

    if (!skillsFeedback) {
        return <div>Loading...</div>;
    }

    const reasonCancel = () =>{
        setShowReason(false);
      }
    
    const reasonSubmit = (role,skill,rat,reason) =>{
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
    
    const handleYesClick = (role,skill , rating) =>{
        // Clone the skillsFeedback to avoid directly mutating state
        const updatedSkillsFeedback = { ...skillsFeedback };
        if (updatedSkillsFeedback[role]) {
            const skillToUpdate = updatedSkillsFeedback[role].find(
                (skillObj) => skillObj.skill === skill
            );
            if (skillToUpdate) {
                let prof = parseInt(skillToUpdate.proficiency);
                // check if the proficiency is not at 5 already
                if(prof!==5){
                    if(prof === 1){
                        skillToUpdate.proficiency = prof+2;
                    }
                    else {
                        // update proficiency
                        skillToUpdate.proficiency = prof+1;
                    }
                    // Update the rating
                    skillToUpdate.rating = rating;
                }
                // Update the state with the modified data
                setSkillsFeedback(updatedSkillsFeedback);
            }
        }
      }
    

    const handleRatingChange = async (role, skill, rat) => {
        if (rat >= 4) {
            swal("Do you think this candidate can be rated with an additional ranking basis subjectivity in the next category?", {
              icon: "info",
              buttons: {
                cancel: "Cancel",
                Yes: true,
                No: true,
              },
            }).then((swalValue) => {
              if (swalValue === "No") {
                setCurrentRole(role);
                setCurrentSkill(skill);
                setCurrentRat(rat);
                setShowReason(true);
              }else if(swalValue === "Yes"){
                //   rat = 2 ;
                  handleYesClick(role,skill , rat);
              }
            });
        }else{
            // Clone the skillsFeedback to avoid directly mutating state
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
        }
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
            // Check if all skills are evaluated
            const isAllSkillsEvaluated = Object.values(updatedSkillsFeedback).every((roleSkills) =>
            roleSkills.every((skillObj) => skillObj.proficiency > 0)
            );

            // Send the evaluation status back to the parent component
            props.setAllSkillsEvaluated(isAllSkillsEvaluated);
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

  return (
    <>
    <div className="px-4 ml-5">
        {showReason?
            <SkillRatingReason currentRole={currentRole} currentSkill={currentSkill} 
                showReason={showReason} reasonCancel={reasonCancel} reasonSubmit={reasonSubmit} currentRat={currentRat}/>
        :null}

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
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
          <tbody>
                <React.Fragment>
                    {Object.keys(skillsFeedback).map((role)=> {
                        return(
                            <React.Fragment>
                                <tr style={{ backgroundColor: "#adb3b1" }}>
                                    <td colSpan="5" className="py-2 px-6 text-md font-bold text-center">
                                        {role}
                                    </td>
                                </tr>
                                {
                                    skillsFeedback[role].map((skillObj,index)=>{
                                        return(
                                        <tr style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                            <td className="py-2 px-6 text-md font-bold text-left">
                                                {skillObj.skill}
                                            </td>
                                            <td className="py-2 px-6 text-left">
                                                <select
                                                    onChange={(e) => handleProfieciencyChange(role,skillObj.skill,e.target.value)}
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

                                            {skillObj.proficiency >0 ? 
                                                <td>
                                                    <div className="star-rating">
                                                        {Array(5)
                                                        .fill(0)
                                                        .map((_, i) => (
                                                            <span
                                                            key={i}
                                                            onClick={() => handleRatingChange(role,skillObj.skill,i+1)}
                                                            style={{
                                                                color: i < skillObj.rating? '#228276' : 'grey',
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
                                                :null
                                            }
                                            <td>
                                                {skillObj.proficiency>0 && skillObj.reason? 
                                                <>
                                                    <Tooltip id={`reason-tooltip-${index}`} place="top" type="light" effect="solid">
                                                        {skillObj.reason}
                                                    </Tooltip>
                                                    <AiOutlineBook data-tooltip-id={`reason-tooltip-${index}`} />
                                                </>
                                                :null}
                                            </td>
                                             {skillObj.proficiency>0 ? 
                                                <td onClick={() => handleRollback(role,skillObj.skill)} ><AiOutlineRollback/></td>
                                            :null}
                                        </tr>
                                        )
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
                No skills mapped for this interview.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SkillsRating;
