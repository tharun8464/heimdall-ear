import React, { useEffect, useState } from 'react';
import { AiOutlineBook, AiOutlinePullRequest, AiOutlineRedo, AiOutlineRollback } from 'react-icons/ai';
import swal from 'sweetalert';
import { Tooltip } from 'react-tooltip';

const ViewTechnicalSkills = (props) => {
    useEffect(() => {
    }, [props.skillsFeedback]);

    if (!props.skillsFeedback) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="w-full" style={{ backgroundColor: "#F4F4F4", border: "1px solid #CCCCCC" }}>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {props.skillsFeedback && Object.keys(props.skillsFeedback).length > 0 && (
                        <table className="w-full">
                            <thead className="text-white" style={{ backgroundColor: "#0a4f46" }}>
                                <tr>
                                    <th className="py-3 px-6 text-left">Skill</th>
                                    <th className="py-3 px-6 text-left">Proficiency</th>
                                    <th className="py-3 px-6 text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <React.Fragment>
                                    {Object.keys(props.skillsFeedback).map((role) => {
                                        return (
                                            <React.Fragment key={role}>
                                                <tr style={{ backgroundColor: "#adb3b1" }}>
                                                    <td colSpan="3" className="py-2 px-6 text-md font-bold text-center">
                                                        {role}
                                                    </td>
                                                </tr>
                                                {props.skillsFeedback[role].map((skillObj, index) => {
                                                    // Filter based on role and skill search
                                                        return (
                                                            <tr key={index} style={{ maxHeight: '100px', overflowY: 'auto', borderBottom: '1px solid #CCCCCC' }}>
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
                    ) }
                </div>
            </div>
        </>
    );
};

export default ViewTechnicalSkills;
