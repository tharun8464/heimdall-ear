import React from "react";

// Assets
import { IoIosArrowForward } from "react-icons/io";
import {AiFillCalendar, AiFillClockCircle} from 'react-icons/ai';
import {RiTimerFill} from "react-icons/ri";

const Card = () => {
  return (

    <>
    <div className="bg-slate-100 rounded-lg my-3 p-4 space-y-5 ">
      {/*card Header  */}
      <div className="flex text-sm space-x-3 items-center">
        <p className="rounded-full bg-blue-600 p-4 text-xs  text-white">
          
        </p>
        <p className="font-semibold pr-9 block">
          Interview scheduled with{" "}
          <span className="text-blue-600">Rahul Pandey</span>
        </p>
        <div className="flex items-center cursor-pointer">
          <p className="ml-auto text-xs text-gray-700">Details </p>
          <IoIosArrowForward className="text-xs" />
        </div>
      </div>
      {/* Details */}
      <div className="flex md:space-x-5 md:space-y-0 space-y-2 md:items-center  items-start flex-col md:flex-row">
          <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
            <AiFillCalendar className="text-gray-400"/>
            <p>Tue, 19 May</p>
            </div>
          <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
            <AiFillClockCircle className="text-gray-400"/>
            <p>9:30 - 10:30 A.M.</p>
            </div>
          {/* <div className="flex space-x-1 text-sm text-red-700 items-center font-semibold">
            <RiTimerFill className="text-red-700"/>
            <p>Expire in 2 hours</p>
            </div> */}
      </div>
      {/* Actions */}
      <div className="flex items-center space-x-3">
          <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">Join</button>
                    <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">View Details</button>

          {/* <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Send Message</button>
          <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Reschedule</button> */}
      </div>
    </div>

<div className="bg-slate-100 rounded-lg my-3 p-4 space-y-5 ">
{/*card Header  */}
<div className="flex text-sm space-x-3 items-center">
  <p className="rounded-full bg-blue-600 p-4 text-xs  text-white">
    
  </p>
  <p className="font-semibold pr-9 block">
    Interview scheduled with{" "}
    <span className="text-blue-600">Vijay Singh</span>
  </p>
  <div className="flex items-center cursor-pointer">
    <p className="ml-auto text-xs text-gray-700">Details </p>
    <IoIosArrowForward className="text-xs" />
  </div>
</div>
{/* Details */}
<div className="flex md:space-x-5 md:space-y-0 space-y-2 md:items-center  items-start flex-col md:flex-row">
    <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
      <AiFillCalendar className="text-gray-400"/>
      <p>Sat, 21 March</p>
      </div>
    <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
      <AiFillClockCircle className="text-gray-400"/>
      <p>9:30 - 10:30 A.M.</p>
      </div>
    {/* <div className="flex space-x-1 text-sm text-red-700 items-center font-semibold">
      <RiTimerFill className="text-red-700"/>
      <p>Expire in 1 hours</p>
      </div> */}
</div>
{/* Actions */}
<div className="flex items-center space-x-3">
    <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">Join</button>
              <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">View Details</button>

    {/* <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Send Message</button>
    <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Reschedule</button> */}
</div>
</div>


<div className="bg-slate-100 rounded-lg my-3 p-4 space-y-5 ">
{/*card Header  */}
<div className="flex text-sm space-x-3 items-center">
  <p className="rounded-full bg-blue-600 p-4 text-xs  text-white">
    
  </p>
  <p className="font-semibold pr-9 block">
    Interview scheduled with{" "}
    <span className="text-blue-600">Abhinav Mishra</span>
  </p>
  <div className="flex items-center cursor-pointer">
    <p className="ml-auto text-xs text-gray-700">Details </p>
    <IoIosArrowForward className="text-xs" />
  </div>
</div>
{/* Details */}
<div className="flex md:space-x-5 md:space-y-0 space-y-2 md:items-center  items-start flex-col md:flex-row">
    <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
      <AiFillCalendar className="text-gray-400"/>
      <p>Thu,21 Dec</p>
      </div>
    <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
      <AiFillClockCircle className="text-gray-400"/>
      <p>9:30 - 10:30 A.M.</p>
      </div>
    {/* <div className="flex space-x-1 text-sm text-red-700 items-center font-semibold">
      <RiTimerFill className="text-red-700"/>
      <p>Expire in 2 hours</p>
      </div> */}
</div>
{/* Actions */}
<div className="flex items-center space-x-3">
    <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">Join</button>
              <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">View Details</button>

    {/* <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Send Message</button>
    <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Reschedule</button> */}
</div>
</div>


<div className="bg-slate-100 rounded-lg my-3 p-4 space-y-5 ">
{/*card Header  */}
<div className="flex text-sm space-x-3 items-center">
  <p className="rounded-full bg-blue-600 p-4 text-xs  text-white">
    
  </p>
  <p className="font-semibold pr-9 block">
    Interview scheduled with{" "}
    <span className="text-blue-600">Abhiraj Singh</span>
  </p>
  <div className="flex items-center cursor-pointer">
    <p className="ml-auto text-xs text-gray-700">Details </p>
    <IoIosArrowForward className="text-xs" />
  </div>
</div>
{/* Details */}
<div className="flex md:space-x-5 md:space-y-0 space-y-2 md:items-center  items-start flex-col md:flex-row">
    <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
      <AiFillCalendar className="text-gray-400"/>
      <p>Mon, 14 Feb</p>
      </div>
    <div className="flex space-x-1 text-sm text-gray-700 items-center font-semibold">
      <AiFillClockCircle className="text-gray-400"/>
      <p>9:30 - 10:30 A.M.</p>
      </div>
    {/* <div className="flex space-x-1 text-sm text-red-700 items-center font-semibold">
      <RiTimerFill className="text-red-700"/>
      <p>Expire in 2 hours</p>
      </div> */}
</div>
{/* Actions */}
<div className="flex items-center space-x-3">
    <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">Join</button>
              <button className="bg-blue-600 rounded-lg px-3 py-2 text-xs text-white">View Details</button>

    {/* <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Send Message</button>
    <button className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-gray-500 border-[0.5px] border-gray-500">Reschedule</button> */}
</div>
</div>


</>
  );
};

export default Card;
