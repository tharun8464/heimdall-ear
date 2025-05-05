import React, { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs"; // For date formatting and manipulation
import { getSessionStorage } from "../../service/storageService";
import { getJobsAboutToExpire, updateJobsAboutToExpire } from "../../service/api";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material"; // Import Box for styling

const JobPostingsMain = () => {
    const [aboutExpireJobs, setAboutExpireJobs] = useState([]);
    const [selectedDate, setSelectedDate] = useState({}); // To store dates for each job
    const [openModal, setOpenModal] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let user = JSON.parse(getSessionStorage("user"));
            let jobsCounts = await getJobsAboutToExpire(user._id);
            let jobsCountsData = jobsCounts?.data?.data;

            setAboutExpireJobs(jobsCountsData || []);
        };

        fetchData();
    }, []);

    const handleDateChange = async (newDate, jobId) => {
        setCurrentJobId(jobId);
        setOpenModal(true);
    };

    const handleConfirmUpdate = async (newDate) => {
        setOpenModal(false);
        setSelectedDate((prev) => ({ ...prev, [currentJobId]: newDate }));
        // Call the API to update the date
        try {
            await updateJobsAboutToExpire({ jobId: currentJobId, validTill: newDate });

        } catch (error) {

        }
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="p-6 bg-red-100 rounded-md w-full max-w-sm h-full">
                    <h2 className="text-lg font-semibold mb-4">Update Expiry Date</h2>
                    <p className="text-gray-500 text-sm mb-4">
                        View and update expiry dates for these job postings
                    </p>
                    {aboutExpireJobs.length === 0 ? (
                        <div className="flex flex-col w-full text-center">
                            <div>No Job Expiry Dates to Update</div>
                            <div className="font-bold">Post a new job or select an existing</div>
                            <div className="font-bold">
                                one to start receiving expiry date notifications
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 h-[480px] overflow-y-scroll">
                            {aboutExpireJobs.map((posting, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col justify-between items-center bg-white p-3 rounded-lg shadow-sm gap-2"
                                >
                                    <div className="w-full">
                                        <h3 className="text-teal-600 font-semibold">{posting.jobTitle}</h3>
                                    </div>
                                    <div className="w-full flex items-center justify-between space-x-2">
                                        <p className="text-gray-500 text-sm">{posting.jobRole}</p>
                                        <div className="flex gap-2 items-center">
                                            <DatePicker
                                                value={selectedDate[posting._id] || dayjs(posting.validTill)}
                                                onChange={(newValue) => {
                                                    setSelectedDate((prev) => ({ ...prev, [posting._id]: newValue }));
                                                }}
                                                onAccept={(newValue) => {
                                                    setCurrentJobId(posting._id);
                                                    setOpenModal(true);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        variant="outlined"
                                                        className="w-[120px]"
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                border: "none",
                                                                "& fieldset": {
                                                                    border: "none", // Remove the border of the input box
                                                                },
                                                                "&:hover fieldset": {
                                                                    border: "none", // Remove border on hover
                                                                },
                                                                "&.Mui-focused fieldset": {
                                                                    border: "none", // Remove border when focused
                                                                },
                                                            },
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                border: "none", // Ensures the outline is completely removed
                                                            },
                                                            "& .MuiInputBase-input": {
                                                                padding: 0, // Adjust padding for a cleaner look
                                                            },
                                                            "& .Mui-focused": {
                                                                outline: "none", // Removes focus ring on the input
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                            {/* <FaRegCalendarAlt className="text-teal-500" /> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </LocalizationProvider>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2>Confirm Update</h2>
                    <p>Are you sure you want to update the date?</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleConfirmUpdate(selectedDate[currentJobId])}>Yes</button>
                        <button onClick={() => setOpenModal(false)}>No</button>
                    </div>

                </Box>
            </Modal>
        </>
    );
};

export default JobPostingsMain;
