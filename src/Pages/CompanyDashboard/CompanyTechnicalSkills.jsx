import React, { useEffect, useState } from 'react';
import { AiOutlineBook, AiOutlinePullRequest, AiOutlineRedo, AiOutlineRollback } from 'react-icons/ai';
import swal from 'sweetalert';
import { Tooltip } from 'react-tooltip';

const CompanyTechnicalSkills = (props) => {
    const [skillsFeedback, setSkillsFeedback] = useState();
    const [roles, setRoles] = useState();
    const [ratings, setRatings] = useState(new Array(5).fill(0));
    const [showReason, setShowReason] = useState(false);
    const [currentSkill, setCurrentSkill] = useState();
    const [currentRole, setCurrentRole] = useState();
    const [currentRat, setCurrentRat] = useState(0);
    const [roleFilter, setRoleFilter] = useState('All');
    const [skillSearch, setSkillSearch] = useState('');

    const handleRoleFilterChange = (selectedRole) => {
        setRoleFilter(selectedRole);
    };

    useEffect(() => {
        if (props.groupedSkillsData) {
            setSkillsFeedback(props.groupedSkillsData);
            setRoles(Object.keys(props.groupedSkillsData));
        }
    }, [props.groupedSkillsData]);

    // This useEffect is to just update the parent with skillsFeedback
    useEffect(() => {
        props.updateSkillsFeedback(skillsFeedback);
    }, [skillsFeedback]);

    if (!skillsFeedback) {
        return <div>Loading...</div>;
    }

    const handleProficiencyChange = async (role, skill, proficiency) => {
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
            <div className="w-full" style={{ backgroundColor: "#F4F4F4", border: "1px solid #CCCCCC" }}>
                <div className="overflow-x-auto">
                    <div className="flex justify-between px-6 py-4 text-white text-sm" style={{ backgroundColor: "#228276" }}>
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
                    </div>
                </div>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {skillsFeedback ? (
                        <table className="w-full">
                            <thead className="text-white" style={{ backgroundColor: "#081f08" }}>
                                <tr>
                                    <th className="py-3 px-6 text-left">Skill</th>
                                    <th className="py-3 px-6 text-left">Proficiency</th>
                                    <th className="py-3 px-6 text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <React.Fragment>
                                    {Object.keys(skillsFeedback).map((role) => (
                                        <React.Fragment key={role}>
                                            {((roleFilter === "All" || roleFilter === role) &&
                                                skillsFeedback[role].some(
                                                    (skillObj) =>
                                                        skillObj.skill.toLowerCase().includes(skillSearch.toLowerCase())
                                                )) ? (
                                                <tr style={{ backgroundColor: "#adb3b1" }}>
                                                    <td colSpan="3" className="py-2 px-6 text-md font-bold text-center">
                                                        {role}
                                                    </td>
                                                </tr>
                                            ) : null}
                                            {skillsFeedback[role].map((skillObj, index) => {
                                                // Filter based on role and skill search
                                                if (
                                                    (roleFilter === "All" || roleFilter === role) &&
                                                    skillObj.skill.toLowerCase().includes(skillSearch.toLowerCase())
                                                ) {
                                                    return (
                                                        <tr key={index} style={{ maxHeight: '100px', overflowY: 'auto', borderBottom: '1px solid #CCCCCC' }}>
                                                            <td className="py-2 px-6 text-md font-bold text-left" style={{ borderRight: '1px solid #CCCCCC' }}>
                                                                {skillObj.skill}
                                                            </td>
                                                            <td className="py-2 px-6 text-left">
                                                                <select
                                                                    onChange={(e) => handleProficiencyChange(role, skillObj.skill, e.target.value)}
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
                                                            {skillObj.proficiency > 0 ? (
                                                                <td onClick={() => handleRollback(role, skillObj.skill)}><AiOutlineRollback/></td>
                                                            ) : null}
                                                        </tr>
                                                    );
                                                }
                                                return null; // Return null for items that don't match the filter criteria
                                            })}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            </tbody>
                        </table>
                    ) : (
                        <div>
                            <p className="font-semibold">
                                No skills available.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CompanyTechnicalSkills;
