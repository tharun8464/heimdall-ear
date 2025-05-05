import React, { useState } from 'react';
import Cuate from "../../../../src/assets/images/cuate-1.svg";


const JobTable = ({ data, type, height }) => {

    const rowsPerPage = 3; // Set the number of rows per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total pages
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Slice the data to get only the current page's rows
    const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Function to handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        false ?
            <div className="gap-10 flex justify-around align-middle min-w-[95%] h-80 border-collapse  ">
                <div className='grid w-[40%] h-[90%] my-2 justify-items-end '>
                    <img
                        src={Cuate}
                        alt="cuate-1"
                        className=" w-[60%] h-[100%]"
                    />
                </div>
                <div className="flex flex-col w-[50%] justify-center content-start flex-wrap  " >
                    <div className=" align-self-center">No interview statistics available</div>
                    <div className=" align-self-center">Schedule and conduct interviews to monitor progress</div>
                </div>
            </div>
            :
            type === "candidate" ?
                <div className="my-6 w-full">
                    <div className="border rounded-lg mx-6">
                        <table className="min-w-full">
                            <thead className="bg-gray-200 rounded-t-lg">
                                <tr>
                                    <th className="p-3 relative rounded-tl-lg">Job Id</th>
                                    <th className="px-2 py-4 relative">Job Role</th>
                                    <th className="p-3 relative">Invited</th>
                                    <th className="p-3 relative">Scheduled</th>
                                    <th className="p-3 relative">Completed</th>
                                    <th className="p-3 relative">Xi Recommended</th>
                                    <th className="p-3 relative">Xi Not Recommended</th>
                                    <th className="p-3 relative">Pending</th>
                                    <th className="p-3 relative">Feedback pending</th>
                                    <th className="p-3 relative rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((row, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="w-[85px] break-all truncate" title={row._id}>
                                                {row._id}
                                            </div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="w-[100px] truncate" title={row.jobTitle}>
                                                {row.jobTitle}
                                            </div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="truncate" title={row.inviteInterviews}>
                                                {row.inviteInterviews}
                                            </div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="truncate" title={row.scheduleInterviews}>
                                                {row.scheduleInterviews}
                                            </div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="truncate" title={row.completedInterviews}>
                                                {row.completedInterviews}
                                            </div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="truncate" title={row.xirecomInterviews}>
                                                {row.xirecomInterviews}
                                            </div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="truncate">N/A</div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="truncate">N/A</div>
                                        </td>
                                        <td className="p-4 relative border-b-gray-100 border-b-2">
                                            <div className="truncate" title={row.feedbackpendingInterviews}>
                                                {row.feedbackpendingInterviews}
                                            </div>
                                        </td>
                                        <td className="p-4 space-x-2 border-b-gray-100 border-b-2">
                                            <a
                                                className="bg-[#228276] rounded-lg text-white px-4 py-2"
                                                href={`/company/preevaluation/${row._id}`}
                                            >
                                                Analyze
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {height === "full" && (
                            <div className="flex justify-end my-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-300 rounded-l-lg"
                                >
                                    Prev
                                </button>
                                <span className="px-4 py-2">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-300 rounded-r-lg"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>




                :
                // second table
                <div className="mb-6">
                    <div className="border rounded-lg overflow-hidden mx-6">
                        <table className="min-w-full ">
                            {/* <table className="min-w-[95%] border-collapse mx-6 "> */}
                            {/* <table className="min-w-[95%] border-collapse "> */}
                            {/* <table className="min-w-[95%] border-collapse mx-6 border-red-500 border-solid border-8 border-t-rounded"> */}
                            {/* <table className="min-w-[95%]  mx-6 table-auto  border rounded-lg  border-slate-400"> */}
                            {/* <table className="border-red-500 border-solid border-8 border-collapse "> */}
                            {/* <thead className="bg-gray-200 rounded-t-lg"> */}
                            <thead className="bg-gray-200 rounded-t-lg ">
                                <tr>
                                    <th className="p-4 relative rounded-tl-lg">
                                        Job Id
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300  -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="px-2 py-4 relative">
                                        Job Role
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative">
                                        Total Candidates
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative">
                                        POD
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative">
                                        High+
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative">
                                        High
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative">
                                        Medium
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative">
                                        Low
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative">
                                        Data not pulled
                                        {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                    </th>
                                    <th className="p-4 relative rounded-tr-lg">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    // <tr key={index} className="bg-white border-b-orange-400 border-b-8">
                                    <tr key={index} className="bg-white ">
                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                {/* {row.col1} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                                <div className='w-[85px] break-all'>  {row._id} </div>

                                            </td>
                                            :
                                            <td className="p-4 relative border-b-gray-100 border-b-2">
                                                {/* {row.col1} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                                <div className='w-[85px] break-all'>  {row._id} </div>

                                            </td>

                                        }


                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                {/* {row.col2} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                                <div className='w-[110px] break-all'> {row.jobTitle}</div>

                                            </td>
                                            :
                                            <>
                                                <td className="p-4 relative border-b-gray-100 border-b-2">
                                                    <div className='flex flex-col'>
                                                        {/* <div>{row.col2}</div> */}
                                                        <div className='w-[110px] break-all'> {row.jobTitle}</div>


                                                    </div>

                                                    {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                                </td>

                                            </>
                                        }

                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                {/* {row.col3} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                                <div > {row.totalCandidates}</div>

                                            </td>
                                            :
                                            <td className="p-4 relative border-b-gray-100 border-b-2 ">
                                                {/* {row.col3} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                                <div > {row.totalCandidates}</div>

                                            </td>}

                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                <div className='w-[85px] break-all'>{row.podName}</div>

                                                {/* {row.col4[0]} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                                {/* <div className='w-[85px] break-all'> {row.pods}</div> */}

                                            </td>
                                            :
                                            <td className="p-4 mt-16 ml-5  relative border-b-gray-100 border-b-2">
                                                {/* <div className='w-[85px] break-all'> {row.pods}</div> */}
                                                {/* <div className='w-[85px] break-all'> {row.pods}</div> */}

                                                <div className='flex flex-col  gap-3'>
                                                    {row.pods.map((col, index) => (
                                                        <div className='w-[85px] break-all'>{col.podName}</div>

                                                    ))}
                                                </div>
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>}

                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                <div className='text-blue-500' >03</div>

                                                {/* {row.col5[0]} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>
                                            :
                                            <td className="p-4 relative border-b-gray-100 border-b-2">
                                                {/* {row.col5} */}
                                                <div className='flex flex-col gap-3'>
                                                    {/* {row.col5.map((col, index) => (
                                                        <div>{col}</div>

                                                    ))} */}
                                                    {row.pods.map((col, index) => (
                                                        <div className='text-blue-500' >03</div>

                                                    ))}
                                                </div>

                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>}

                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                {/* {row.col6[0]} */}
                                                <div className='text-green-500'>03</div>

                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>
                                            :
                                            <td className="p-4 relative border-b-gray-100 border-b-2 ">
                                                {/* {row.col6} */}
                                                {/* <div className='flex flex-col gap-3'> */}
                                                {/* {row.col6.map((col, index) => (
                                                        <div>{col}</div>

                                                    ))}
                                                </div> */}
                                                <div className='flex flex-col gap-3'>

                                                    {row.pods.map((col, index) => (
                                                        <div className='text-green-500'>02</div>

                                                    ))}
                                                </div>
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>}

                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                <div className='text-yellow-500' >03</div>

                                                {/* {row.col7[0]} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>
                                            :
                                            <td className="p-4 relative border-b-gray-100 border-b-2 ">
                                                {/* {row.col7} */}
                                                <div className='flex flex-col gap-3'>
                                                    {/* {row.col7.map((col, index) => (
                                                        <div>{col}</div>

                                                    ))} */}
                                                    {row.pods.map((col, index) => (
                                                        <div className='text-yellow-500'>02</div>

                                                    ))}
                                                </div>
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>}

                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                <div className='text-red-500' >03</div>

                                                {/* {row.col8[0]} */}
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>
                                            :
                                            <td className="p-4 relative border-b-gray-100 border-b-2 ">
                                                {/* {row.col8} */}
                                                <div className='flex flex-col gap-3'>
                                                    {/* {row.col8.map((col, index) => (
                                                        <div>{col}</div>

                                                    ))} */}
                                                    {row.pods.map((col, index) => (
                                                        <div className='text-red-500'>02</div>

                                                    ))}
                                                </div>
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>}

                                        {data.length - 1 === index ?
                                            <td className="p-4 relative">
                                                {/* {row.col9[0]} */}
                                                <div className='text-neutral-500'>03</div>

                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>
                                            :
                                            <td className="p-4 relative border-b-gray-100 border-b-2 ">
                                                {/* {row.col9} */}
                                                <div className='flex flex-col gap-3'>
                                                    {/* {row.col9.map((col, index) => (
                                                        <div>{col}</div>

                                                    ))} */}
                                                    {row.pods.map((col, index) => (
                                                        <div className='text-neutral-500' >02</div>

                                                    ))}
                                                </div>
                                                {/* <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div> */}
                                            </td>}

                                        {data.length - 1 === index ?
                                            <td className="p-4  space-x-2 ">
                                                <button className="bg-[#228276] rounded-lg text-white px-4 py-2 ">Analyse</button>

                                            </td>
                                            :
                                            <td className="p-4 space-x-2 border-b-gray-100 border-b-2">
                                                <div className='flex flex-col gap-3'>
                                                    <button className="bg-[#228276] rounded-lg text-white px-4 py-2 ">Analyse</button>
                                                    {/* {row.col9.map((col, index) => (
                                                        <div className=' w-[10px] h-[10px]'></div>

                                                    ))} */}
                                                    {row.pods.map((col, index) => (
                                                        <div className=' w-[10px] h-[10px]'></div>

                                                    ))}
                                                </div>
                                            </td>
                                        }



                                        {/* <td className="p-4 relative border-b-gray-100 border-b-2">
                        {row.col2}
                        <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div>
                    </td>
                    <td className="p-4 relative border-b-gray-100 border-b-2">
                        {row.col3}
                        <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div>
                    </td>
                    <td className="p-4 relative border-b-gray-100 border-b-2">
                        {row.col4}
                        <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div>
                    </td>
                    <td className="p-4 relative border-b-gray-100 border-b-2">
                        {row.col5}
                        <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div>
                    </td>
                    <td className="p-4 relative border-b-gray-100 border-b-2">
                        {row.col6}
                        <div className="absolute right-0 top-1/2 h-1/2 w-px bg-gray-300 transform -translate-y-1/2"></div>
                    </td>
                    <td className="p-4 flex space-x-2 border-b-gray-100 border-b-2">
                        <button className="bg-[#228276] rounded-lg text-white px-4 py-2 ">Analyse</button>

                    </td> */}

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

    );
};


const handleEdit = (row) => {

};

const handleDelete = (row) => {

};

export default JobTable;
