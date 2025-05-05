// import React from "react";
// import { FaBuilding } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { HiOutlineLocationMarker,HiOutlineCurrencyDollar,HiOutlineCalendar,HiOutlinePlay} from "react-icons/hi";
//import ls from 'localstorage-slim';
// const JobCard = (props) => {

//   const [job, setJob] = React.useState(props.job);
//   setStorage("jobs", JSON.stringify(job))

//   setSessionStorage("ids", JSON.stringify(job._id))
//   return (
//     <div className="flex my-2 w-full">
//       <div className="block rounded-sm p-4 shadow-lg border-[0.5px] border-gray-300 bg-white w-full">

//         <div className="md:p-6 p-3">
//           <h5 className="text-black-900 text-2xl font-bold mb-2">{job.jobTitle}</h5>
//           <p className="text-xl  text-blue-500">{job.hiringOrganization}</p>
//           <div className="md:flex mt-5 px-3">
//             {job.salary && (
//               <div className="flex px-3 my-2">
//               <p className="">
//                 <div className="shadow-lg p-3 rounded-full"><p className="text-2xl text-blue-500"><HiOutlineCalendar/></p></div>

//                 </p>
//                 <div>
//                 <p className="px-4 text-gray-400 text-lg text-gray-400">Job Type</p>
//                 <p className="px-4 text-md">{job.jobType}</p>
//                 </div>
//                 </div> 

//             )}

//             {/* <p className="text-sm text-gray-700 mx-auto">
//               {job.jobType}
//             </p> */}
//             <div className="flex px-3 my-2">
//             <p className="text-sm  ">
//                 <div className="shadow-lg p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineCurrencyDollar/></div></div>

//                 </p>
//                 <div>
//                 <p className="px-4 text-lg text-gray-400 ">Pay Range</p>
//                 <p className="px-4 text-md">{job.salary}</p>
//                 </div>
//             </div>

//             <div className="flex px-3 my-2">
//             <p className="text-sm  ">
//                 <div className="shadow-lg p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineLocationMarker/></div></div>

//                 </p>
//                 <div>
//                 <p className="px-4 text-lg text-gray-400 ">Location</p>
//                 <p className="px-4 text-md">{job.location}</p>
//                 </div>
//             </div>

//             <div className="flex px-3 my-2">
//             <p className="text-sm  ">
//                 <div className="shadow-lg p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlinePlay/></div></div>

//                 </p>
//                 <div>
//                 <p className="px-4 text-lg text-gray-400 ">Apply Till</p>
//                 <p className="px-4 text-md">{new Date(job.validTill).getDate() +
//                 "-" +
//                ( new Date(job.validTill).getMonth()+1) +
//                 "-" +
//                 new Date(job.validTill).getFullYear()}</p>
//                 </div>
//             </div>

//           </div>
//           {/* <p className="text-gray-700 text-base">{job.jobDesc}</p> */}
//         </div>
//         <div className="py-3 border-t border-gray-300 items-center flex ">
//           {/* <FaBuilding className="text-gray-500 mr-2" /> */}



//           <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/user/jobDetails/${job._id}`}>View Details &#12297;</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobCard;

import React from "react";
import { FaBuilding } from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
import ls from 'localstorage-slim';
import { getStorage, setStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import { Popover, Transition } from "@headlessui/react";

const JobCard = (props) => {
  const [job, setJob] = React.useState(props.job);
  const [user, setUser] = React.useState(null);
  //console.log(props.job);
  // setStorage("jobs", JSON.stringify(job))

  React.useState(() => {
    setUser(JSON.parse(getSessionStorage("user")));
  }, []);

  setSessionStorage("ids", JSON.stringify(job._id));
  return (
    // <div className="flex my-2 w-full">
    //   <div className="block rounded-md p-3 my-2 shadow-md border-[0.5px] border-gray-300 bg-white w-full">

    //     <div className="p-6">
    //       <h5 className="text-black-900 text-2xl font-bold mb-2">{job.jobTitle}</h5>
    //       <p className="text-xl font-bold  text-blue-500">{job.hiringOrganization}</p>
    //       <div className="md:flex mt-5 px-3">
    //         {job.salary && (
    //           <div className="flex px-3">
    //           <p className="">
    //             <div className="shadow-md p-3 rounded-full"><p className="text-2xl text-blue-500"><HiOutlineCalendar/></p></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-gray-400 text-md text-gray-400">Job Type</p>
    //             <p className="px-4 text-md">{job.jobType}</p>
    //             </div>
    //             </div>

    //         )}

    //         {/* <p className="text-sm text-gray-700 mx-auto">
    //           {job.jobType}
    //         </p> */}
    //         <div className="flex flex-wrap px-3">
    //         <p className="text-sm">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineCurrencyDollar/></div></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-md text-gray-400 ">Pay Range</p>
    //             <p className="px-4 text-md">{job.salary}</p>
    //             </div>
    //         </div>

    //         <div className="flex px-3">
    //         <p className="text-sm  ">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineLocationMarker/></div></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-md text-gray-400 ">Location</p>
    //             <p className="px-4 text-md">{job.location}</p>
    //             </div>
    //         </div>

    //         <div className="flex px-3">
    //         <p className="text-sm  ">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlinePlay/></div></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-md text-gray-400 ">Apply Till</p>
    //             <p className="px-4 text-md">{new Date(job.validTill).getDate() +
    //             "-" +
    //            ( new Date(job.validTill).getMonth()+1) +
    //             "-" +
    //             new Date(job.validTill).getFullYear()}</p>
    //             </div>
    //         </div>

    //       </div>
    //       {/* <p className="text-gray-700 text-base">{job.jobDesc}</p> */}
    //     </div>
    //     <div className="py-3 border-t border-gray-300 items-center flex ">
    //       {/* <FaBuilding className="text-gray-500 mr-2" /> */}

    //       <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/company/jobDetails/${job._id}`}>View Details &#12297;</Link></p>
    //     </div>
    //   </div>
    // </div>


    <div className="w-full px-5 bg-white py-1 border border-b">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 my-3">
        <div className="col-span-2">
          <h5 className="text-black-900 text-md font-bold mb-1 ">{job.jobTitle}</h5>
          <p className="text-sm font-bold  text-gray-400 font-semibold">
            {job.hiringOrganization}
          </p>
        </div>
        <div className="col-span-2">
          {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <CgWorkAlt />
            </div>

            <p className="px-4 text-sm text-gray-400 font-semibold">
              {job.jobType}
            </p>
          </div>
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <HiOutlineLocationMarker />
            </div>

            <p className="px-4 text-sm text-gray-400 font-semibold">
              {job.location}
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <HiOutlineCalendar />
            </div>

            <p className="px-2 text-md text-gray-400 font-semibold">
              {new Date(job.validTill).getDate() +
                "-" +
                (new Date(job.validTill).getMonth() + 1) +
                "-" +
                new Date(job.validTill).getFullYear()}
            </p>
          </div>
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <BsCashStack />
            </div>

            <p className="px-4 text-sm text-gray-400 font-semibold">
              {job.salary}
            </p>
          </div>
        </div>
        <div className="flex col-span-2">



          <button
            style={{ background: "#3ED3C5" }}
            className="  rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
          >Active </button>




          <div className="px-4 mx-2 py-4 align-middle">
            {/* <p className="text-right text-md py-3"><BsThreeDots/></p> */}
            <Popover className="relative mt-1">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
                  >


                    <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                      <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative gap-8 bg-white p-3 lg:grid-cols-4  justify-between">
                          <div className="flex items-center border-b text-gray-800 space-x-2">
                            {/* <BsThreeDots className="text-md" /> */}
                            <p className="text-sm font-semibold py-2"><Link to={`/company/jobDetails/${job._id}`}>View Details </Link></p>{" "}

                          </div>
                          <div className="flex items-center text-gray-800 space-x-2">
                            {/* <BsThreeDots className="text-md" /> */}
                            <p className="text-sm font-semibold py-1"><Link to={`/company/jobDetails/${job._id}`}>Edit </Link></p>{" "}

                          </div>

                        </div>

                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>


          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
