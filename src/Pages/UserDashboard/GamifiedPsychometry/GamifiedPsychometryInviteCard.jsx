import moment from 'moment';
import React, { useState, useEffect } from 'react'
import { CgWorkAlt } from 'react-icons/cg';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoTimerOutline, IoCalendarOutline } from "react-icons/io5";
import { timeLeftFrom } from "../../../utils/util";

function GamifiedPsychometryInviteCard({ invite, profileStatus = true }) {

    const validTill = moment(invite.expiry).format('DD-MM-YYYY');
    //console.log("validTill", validTill, invite.expiry);
    const [timeLeft, setTimeLeft] = useState(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(timeLeftFrom(moment(invite.expiry)));
        }, 1000);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="flex flex-row items-end p-3">
            <div className='flex flex-row justify-evenly flex-grow items-stretch'>
                <div className="flex flex-col justify-evenly items-start flex-grow gap-2">
                    <div className="text-black/70 text-md font-bold">
                        {invite.job.jobTitle}
                    </div>
                    <div className="text-sm text-gray-400 font-semibold">
                        {invite.job.hiringOrganization}
                    </div>
                </div>
                <div className="flex flex-col justify-evenly items-start flex-grow gap-2">
                    <div className="flex flex-row items-center">
                        <div className="text-md text-gray-500 font-semibold ">
                            <CgWorkAlt />
                        </div>
                        <div className="px-1 text-xs text-gray-500 font-normal">
                            {invite.job.jobType}
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="text-md text-gray-500 font-semibold ">
                            <HiOutlineLocationMarker />
                        </div>
                        <div className="px-1 text-xs text-gray-500 font-normal">
                            {invite.job.location}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-evenly items-start flex-grow gap-2">
                    <div className='flex flex-row items-center'>
                        <div className="text-md text-red-500 font-semibold ">
                            <IoCalendarOutline />
                        </div>
                        <div className="px-1 text-xs text-red-500 font-normal">
                            {validTill}
                        </div>
                    </div>

                    <div className='flex flex-row items-center'>
                        <div className="text-md text-gray-500 font-semibold ">
                            <IoTimerOutline />
                        </div>
                        <div className="px-1 text-xs text-gray-500 font-normal">
                            {timeLeft} left
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex flex-col items-end mr-2">
                {/* button here */}
                <a
                    href={`/user/guidelines/${invite._id}`}
                    dissabled={!profileStatus}
                    className={`bg-[#228276] rounded-lg px-4 py-2 text-sm font-bold flex items-center cursor-pointer ${profileStatus ? "bg-[#228276] text-white" : "bg-gray-300 text-gray-500 font-medium pointer-events-none"}`}
                >
                    Start
                </a>
                <div className={`text-red-400 text-sm font-thin ${profileStatus ? "hidden" : "block"}`}>
                    Profile incomplete
                </div>
            </div>
        </div>
    )
}

export default GamifiedPsychometryInviteCard
