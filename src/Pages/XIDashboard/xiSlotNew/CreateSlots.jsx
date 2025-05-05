import React, { useState, Fragment, useEffect } from 'react'
import RightIcon from '@mui/icons-material/KeyboardArrowRight';
import LeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/BorderColor';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { Dialog, Transition } from "@headlessui/react";
import { ImCross } from "react-icons/im";
import DeleteIcon from '@mui/icons-material/Delete';
import Styles from './CreateSlots.module.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RepeatIcon from '@mui/icons-material/Repeat';
import useXiSlots from '../../../Hooks/useXiSlots';
import { useSelector } from 'react-redux';
import Calendar from './Calendar/Calendar';

export const CreateSlots = ({ setIsOpenCreateSlotsModal, isOpenCreateSlotsModal, slotDetails }) => {

    const slotIds = []

    slotDetails?.slots?.forEach((slot) => {
        slotIds.push(slot._id)
    })
    const { createSlotOfXi, getSlotsByMonth, deleteSlot, markUnavailable, updateSlotsOfXi, getTodaySlotsOfXi, getWeeklySlotsOfXi, createWeeklySlotsOfXi, handleGetDateSlots, handleWeekSlots } = useXiSlots()
    const monthlySlotsData = useSelector(state => state?.xiSlots?.monthlySlotsData);
    const [value, setValue] = React.useState(dayjs(new Date()));
    const [view, setView] = useState('Today');
    const [addSlotDropdown, setaddSlotDropdown] = useState('Does not repeat');
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
    const [deleteSlots, setDeleteSlots] = useState();
    const [isOpenDropdown, setIsOpenDropDown] = useState(false);
    const [isOpenWeekdaysDropdown, setIsOpenWeekdaysDropdown] = useState(false);
    const [isOpenDropdownAddSlot, setIsOpenDropdownAddSlot] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [slotName, setSlotName] = useState('');
    const [slots, setSlots] = useState();
    const [selectedCustomDate, setSelectedCustomDate] = useState([value]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const formattedDate = dayjs(value)?.format('ddd MMM D');
    const [unavailableDate, setUnavailableDate] = useState();
    const dateSlot = useSelector((state) => state?.xiSlots?.dateSlot)

    const weekSlot = useSelector((state) => state?.xiSlots?.weekSlot)

    const [week, setWeek] = useState();
    const [firstWeekDay, setFirstWeekDay] = useState();
    const [lastWeekDay, setLastWeekDay] = useState();

    const year = value.$y;
    const month = value.$M + 1;

    const [weekOptions, setWeekOptions] = useState([]);

    // If slots are already there, show the date and timings of that slot already created

    useEffect(() => {
        const initial = () => {
            if (slotDetails && slotDetails.slots?.length > 0) {
                const date = dayjs(new Date(slotDetails?.currentDate))
                setValue(date)
                setSlotName(slotDetails?.slots[0]?.slotName || "")

                // Array(15).fill(null).forEach((_, index) => {
                //     const hour = 6 + index;
                // });
                isSlotPresent(slotDetails?.slots)
            }
            if (slotDetails?.currentDate) {
                const date = dayjs(new Date(slotDetails?.currentDate))
                setValue(date)
            }
        }
        initial()
    }, [])

    useEffect(() => {
        const initial = async () => {
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            await getSlotsByMonth(month, year);
        }
        initial();
    }, []);

    useEffect(() => {
        const initial = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Calculate the date 7 days from today
            const sevenDaysFromNow = new Date(today);
            sevenDaysFromNow.setDate(today.getDate() + 30);

            //filter slots based on date
            const filteredData = monthlySlotsData?.filter(item => {
                const startDate = new Date(item.startDate);
                return startDate >= today && startDate < sevenDaysFromNow;
            });

            //grouped slots based on date
            let groupedData = {};
            groupedData = filteredData?.reduce((acc, item) => {
                const date = item.startDate.split('T')[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(item);
                return acc;
            }, {});

            // Convert grouped data into an array of objects        
            const groupedArray = Object.keys(groupedData)?.map(date => ({
                startDate: date,
                items: groupedData[date]
            }));
            setSlots(groupedArray);
        }

        if (monthlySlotsData) initial();
    }, [monthlySlotsData]);

    // For a single date

    useEffect(() => {
        const initial = async () => {
            await handleGetDateSlots(value);
        }
        initial()
    }, [value])

    useEffect(() => {
        const { week } = getWeekRange(value.toDate());
        setWeek(week);
    }, [value])

    // For a week
    useEffect(() => {
        const initial = async () => {
            const data = {
                firstWeekDay: firstWeekDay,
                lastWeekDay: lastWeekDay
            }
            await handleWeekSlots(data);
        }
        initial()
    }, [firstWeekDay, lastWeekDay])

    const handleViewChange = (val) => {
        setIsOpenDropDown(false);
        setView(val);
        setSelectedSlots([]);
    }

    const handleDropdownSlotChange = (val) => {
        setIsOpenDropdownAddSlot(false);
        setaddSlotDropdown(val);
    }

    const handleDeleteSlotsPopup = (value) => {
        setDeleteSlots(value);
        setIsOpenDeleteModal(true);
    }

    const handleDeleteSlot = async (slotId) => {
        await deleteSlot(slotId);
        setIsOpenDeleteModal(false);
    }

    const handleMarkUnavailable = async () => {
        await markUnavailable(unavailableDate);
        //console.log(unavailableDate)
    }

    const handleDropDown = () => {
        setIsOpenDropDown(!isOpenDropdown)
    }

    const handleDropdownAddSlot = () => {
        setIsOpenDropdownAddSlot(!isOpenDropdownAddSlot)
    }

    const handleWeekDropDown = () => {
        setIsOpenWeekdaysDropdown(!isOpenWeekdaysDropdown)
    }


    const handleCheckbox = (e) => {
        if (e.target.checked === true) {
            setUnavailableDate(e.target.value)
        }
        else {
            setUnavailableDate(null)
        }
        setIsChecked(!isChecked)
    }

    const handleSlotClick = (hour, halfHour) => {
        const formatTime = (hour, minutes) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${formattedHour}:${minutes} ${period}`;
        };

        const startTime = halfHour ? formatTime(hour, '30') : formatTime(hour, '00');
        const endTime = halfHour ? formatTime(hour + 1, '00') : formatTime(hour, '30');

        const timeSlot = `${startTime}-${endTime}`;

        const existingSlot = selectedSlots.find(slot => slot === timeSlot);

        if (existingSlot) {
            setSelectedSlots(selectedSlots.filter(slot => slot !== timeSlot));
        } else {
            setSelectedSlots([...selectedSlots, timeSlot]);
        }
    };

    // Function to check if a slot is already present in the data

    // const isSlotPresent = (hour, halfHour) => {
    //     const startTime = halfHour ? formatTime(hour, '30') : formatTime(hour, '00');
    //     const endTime = halfHour ? formatTime(hour + 1, '00') : formatTime(hour, '30');

    //     const timeSlot = `${startTime}-${endTime}`;

    //     return slotDetails?.slots.some(slot => {
    //         //console.log("slot" , slot);
    //         const slotStartTime = convertUTCToIST(slot.startDate);
    //         const slotEndTime = convertUTCToIST(slot.endDate);

    //         const slotFormattedStartTime = `${formatTime(slotStartTime.getHours(), slotStartTime.getMinutes() === 0 ? '00' : '30')}-${formatTime(slotEndTime.getHours(), slotEndTime.getMinutes() === 0 ? '00' : '30')}`;

    //         if (timeSlot === slotFormattedStartTime) {
    //             // If the slot matches, add it to selectedSlots (to avoid duplicates)
    //             if (!selectedSlots.includes(timeSlot)) {
    //                 setSelectedSlots(prevSlots => [...prevSlots, timeSlot]);
    //             }
    //             return true;
    //         }
    //         return false;
    //     });
    // };

    const formatToLocalTime = (date) => {
        // Generate the time string using toLocaleTimeString
        const timeString = new Date(date)?.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC',
        });


        let [hour, minute, period] = timeString.split(/[: ]/);


        if (hour.startsWith('0')) {
            hour = hour.substring(1); // Remove leading zero
        }


        return `${hour}:${minute} ${period}`;
    };

    const isSlotPresent = (slots) => {
        slots?.forEach((slot) => {
            const startTime = formatToLocalTime(slot?.startDate)


            const endTime = formatToLocalTime(slot?.endDate)

            const timeSlot = `${startTime}-${endTime}`;


            if (!selectedSlots.includes(timeSlot)) {

                setSelectedSlots(prevSlots => [...prevSlots, timeSlot]);

            }


        })
    }


    const convertUTCToIST = (dateStr) => {
        const date = new Date(dateStr);
        // IST is UTC + 5:30
        date.setHours(date.getUTCHours() + 5);
        date.setMinutes(date.getUTCMinutes() + 30);
        return date;
    };

    // Helper function to format the time with AM/PM
    const formatTime = (hour, minutes) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minutes} ${period}`;
    };




    const handleCreateSlot = async () => {
        if (addSlotDropdown !== "Custom") {
            await createSlotOfXi({ slotName, selectedSlots, slotDate: value, addSlotDropdown })
        }
        else {
            await createSlotOfXi({ slotName, selectedSlots, slotDate: selectedCustomDate, addSlotDropdown })
        }

        await getSlotsByMonth(month, year);
        await getTodaySlotsOfXi()
        await getWeeklySlotsOfXi(1, month, year)
        setIsOpenCreateSlotsModal(false);
    }

    const handleUpdateSlot = async () => {
        updateSlotsOfXi({ slotName, selectedSlots, slotDate: value, slotIds })

        await getSlotsByMonth(month, year);
        await getTodaySlotsOfXi()
        await getWeeklySlotsOfXi(1, month, year)
        setIsOpenCreateSlotsModal(false);
    }

    const handleCustomDayClick = (dayIndex) => {
        const customDayDate = getCustomDayDate(dayIndex);

        setSelectedCustomDate((prevSelectedDates) => {
            const isSelected = prevSelectedDates.some(date => date.isSame(customDayDate, 'day'));

            if (isSelected) {
                // Remove the date if it's already selected
                return prevSelectedDates.filter(date => !date.isSame(customDayDate, 'day'));
            } else {
                // Add the new date
                return [...prevSelectedDates, customDayDate];
            }
        });
    };

    const getCustomDayDate = (dayIndex) => {
        const selectedDateDayIndex = value.day(); // 0: Sunday, 1: Monday, ..., 6: Saturday
        const diff = dayIndex - selectedDateDayIndex;
        const customDayDate = value.add(diff, 'day');
        return customDayDate;
    };

    const isDaySelected = (dayIndex) => {
        return selectedCustomDate.some(date => date.day() === dayIndex);
    };

    const handleDateChange = (newValue) => {
        const date = dayjs(new Date(newValue)).endOf('day');
        const { firstDay } = getWeekRange(date?.toDate())
        setFirstWeekDay(firstDay)
        const { lastDay } = getWeekRange(date?.toDate())
        setLastWeekDay(lastDay)
        setValue(date)
        setSelectedCustomDate([date])

    }
    const convertToISTAMPM = (date) => {
        const startDate = new Date(date);
        // const timestamp = startDate.getTime();
        // const date = new Date(timestamp);

        // IST is 5 hours and 30 minutes ahead of UTC
        const ISTOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
        const istDate = new Date(startDate.getTime() + ISTOffset);

        // Extract hours, minutes, and determine AM/PM
        let hours = istDate.getUTCHours();
        const minutes = istDate.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'

        // Format minutes to always have two digits
        const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

        // Construct the time string in AM/PM format
        const timeString = `${hours}:${minutesFormatted} ${ampm}`;

        return timeString;
    }

    const formatDateToMonthDay = (dateString) => {
        const date = new Date(dateString);

        // Get the month name and day
        const options = { month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleString('en-US', options);

        return formattedDate;
    }

    const formatDateToLongFormat = (dateString) => {
        const date = new Date(dateString);

        // Define options for full month name, day, and year
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Format the date
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate;
    }

    const getWeekRange = (weekDate) => {
        const today = new Date(weekDate);

        // Find the first day of the week (Sunday)
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));

        // Find the last day of the week (Saturday)
        const lastDay = new Date(today.setDate(today.getDate() + 6));

        // Formatting options
        const options = { month: 'short', day: 'numeric' };

        // Format the dates
        const formattedFirstDay = firstDay.toLocaleDateString('en-US', options);
        const formattedLastDay = lastDay.toLocaleDateString('en-US', options);

        return {
            firstDay,
            lastDay,
            week: `${formattedFirstDay} - ${formattedLastDay}`
        };
    };

    const getWeeksInMonth = () => {
        const currentMonth = value.month();
        const startOfMonth = dayjs(new Date(value.year(), currentMonth, 1));
        const endOfMonth = startOfMonth.endOf('month');

        let weeks = [];
        let startOfWeek = startOfMonth;

        while (startOfWeek.isBefore(endOfMonth)) {
            const { week } = getWeekRange(startOfWeek.toDate());
            weeks.push(week);

            // Move to the next week
            startOfWeek = startOfWeek.add(7, 'day');
        }

        return weeks;
    };

    // Get whole week based on the date ( value )

    // const getWeek = () => {
    //     const weekRange = getWeekRange(value);
    //     return weekRange;
    // };

    // const getWeekDays = (weekDate) => {
    //     //console.log("weekDate", weekDate);
    //     const startDate = dayjs(new Date(weekDate));
    //     //console.log("startDate", startDate);
    //     const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    //     let weekDays = [];

    //     for (let i = 0; i < 7; i++) {
    //         const dayDate = new Date(startDate);
    //         dayDate.setDate(dayDate.getDate() + i);
    //         weekDays.push({
    //             day: daysOfWeek[i],
    //             date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    //         });
    //     }

    //     return weekDays;
    // };

    const getWeekDays = (weekDate) => {
        const startDate = dayjs(new Date(weekDate));
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let weekDays = [];

        // Get the day of the week for the provided date (0 = Sun, 1 = Mon, ..., 6 = Sat)
        const dayOfWeek = startDate.day();

        // Calculate the start of the week by subtracting the day index
        const startOfWeek = startDate.subtract(dayOfWeek, 'day');

        for (let i = 0; i < 7; i++) {
            const dayDate = startOfWeek.add(i, 'day');
            weekDays.push({
                day: daysOfWeek[dayDate.day()],
                date: dayDate.format('YYYY MMM D'),
            });
        }

        return weekDays;
    };

    // Weekly view slot clicks

    const handleWeekdaySlotClick = (slot, halfHour, date) => {

        const [hourString, period] = slot.split(' ');
        let hour = parseInt(hourString, 10);

        // Adjust for PM times
        if (period === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period === 'AM' && hour === 12) {
            hour = 0;
        }
        const formatTime = (hour, minutes) => {
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${formattedHour}:${minutes} ${period}`;
        };

        const startTime = halfHour ? formatTime(hour, '30') : formatTime(hour, '00');
        const endTime = halfHour ? formatTime(hour + 1, '00') : formatTime(hour, '30');

        const timeSlot = `${startTime}-${endTime}`;
        const slotWithDate = {
            date: date,
            time: timeSlot,
        };

        const existingSlot = selectedSlots.find(
            slot => slot.time === timeSlot && slot.date === date
        );

        if (existingSlot) {
            setSelectedSlots(
                selectedSlots.filter(
                    slot => !(slot.time === timeSlot && slot.date === date)
                )
            );
        } else {
            setSelectedSlots([...selectedSlots, slotWithDate]);
        }
    };


    const getSlots = () => {
        const slots = [];
        for (let hour = 6; hour <= 20; hour++) {
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            slots.push(`${displayHour}:00 ${ampm}`);
        }
        return slots;
    };

    const weekDays = getWeekDays(value);
    const weekSlots = getSlots();



    useEffect(() => {
        // Update week options whenever the value (date) changes
        const updatedWeeks = getWeeksInMonth(value);
        setWeekOptions(updatedWeeks);
    }, [value]);

    const handleCreateWeekDaySlots = async () => {
        createWeeklySlotsOfXi({ selectedSlots, slotName })
        await getSlotsByMonth(month, year);
        await getTodaySlotsOfXi()
        await getWeeklySlotsOfXi(1, month, year)
        setIsOpenCreateSlotsModal(false);
    }

    function formatTimeSlot(timeSlot) {
        // Split the time and suffix
        let [time, suffix] = timeSlot.split("-");

        // Parse the hour, minutes, and period (AM/PM)
        let [hourMinutes, period] = time.split(" ");
        let [hour, minutes] = hourMinutes.split(":").map(Number);

        // Adjust minutes based on the suffix
        if (suffix === '30') {
            minutes += 30;
            if (minutes >= 60) {
                minutes -= 60;
                hour += 1;
            }
        }

        // Adjust for 12-hour clock
        if (hour > 12) hour = hour - 12;
        if (hour === 12 && period === "AM") period = "PM";
        if (hour === 12 && period === "PM") period = "AM";

        // Ensure minutes are formatted as "00" or "30"
        let formattedMinutes = minutes === 0 ? "00" : "30";

        // Return the formatted time
        return `${hour}:${formattedMinutes} ${period}`;
    }

    const isSlotTaken = (hour, minutes) => {
        return dateSlot.some(slot => {
            const slotStartDate = new Date(slot.startDate);
            return slotStartDate.getUTCHours() === hour && slotStartDate.getUTCMinutes() === minutes;
        });
    };

    //console.log("Wwww" , weekSlot)

    return (
        <>
            {isOpenDeleteModal && (
                <Transition
                    appear
                    show={isOpenDeleteModal}
                    as={Fragment}
                    className="relative z-10 w-full"
                    style={{ zIndex: 1000 }}
                >
                    <Dialog
                        as="div"
                        className="relative z-10 w-5/6 "
                        onClose={() => { }}
                        static={true}
                    >
                        <div
                            className="fixed inset-0 bg-black/30"
                            aria-hidden="true"
                        />
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0">
                            <div className="flex min-h-fit justify-center p-4 text-center w-[35%] mx-auto items-center my-[10%]">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-fit">
                                        <div className={`${!isOpenDeleteModal ? "hidden" : "block"} h-fit`}>
                                            <div className="w-full h-fit">
                                                <div className="border-b-2">
                                                    <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                                                        <div>
                                                            <p className="font-semibold">Delete Slots</p>
                                                        </div>
                                                        <button className="focus:outline-none" onClick={() => {
                                                            setIsOpenDeleteModal(false);
                                                        }}>
                                                            <ImCross className='font-medium' />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="w-full py-3">
                                                    <div className="flex flex-column h-fit justify-between">
                                                        <div className='w-full border-b-2 pb-3'>
                                                            <div className='flex flex-row justify-between w-full px-4 pb-3'>
                                                                <div className='font-semibold'>{formatDateToLongFormat(deleteSlots?.startDate)}</div>
                                                                <div className=''>
                                                                    <input type='checkbox'
                                                                        onChange={e => handleCheckbox(e)}
                                                                        onClick={e => handleCheckbox(e)}
                                                                        value={deleteSlots?.startDate}
                                                                        style={{
                                                                            border: '1px solid gray',
                                                                            borderRadius: '5px',
                                                                            marginBottom: '2px',
                                                                            marginRight: '2px',
                                                                            backgroundColor: `${isChecked ? '#228276' : ''}`
                                                                        }} />Mark Unavailable</div>
                                                            </div>
                                                            <div className='flex flex-row flex-wrap justify-between'>
                                                                {deleteSlots?.items?.map((item, indx) =>
                                                                    <div key={indx} className='flex flex-row mb-2 align-middle px-4'>
                                                                        <div className='border-2 rounded-xl text-gray-400 px-2 pt-0.5'>{new Date(item?.startDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</div>
                                                                        <div className='px-1 py-1 font-medium'> - </div>
                                                                        <div className='border-2 rounded-xl text-gray-400 px-2 pt-0.5'>{new Date(item?.endDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</div>
                                                                        <div className='w-[10%] pb-1 cursor-pointer pl-2' onClick={e => handleDeleteSlot(item?._id)}><DeleteIcon className='text-[#228276]' /></div>
                                                                    </div>)}
                                                            </div>
                                                        </div>
                                                        <div className="flex w-full justify-end mt-3">
                                                            <button
                                                                className="bg-[#228276] text-white rounded-sm py-1 mr-3 px-4 focus:outline-none rounded-2xl rounded text-white font-bold"
                                                                type="button"
                                                                disabled={!isChecked}
                                                                onClick={() => { handleMarkUnavailable(); setIsOpenDeleteModal(false) }}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
            <Transition
                appear
                show={isOpenCreateSlotsModal}
                as={Fragment}
                className="relative z-10 w-full"
                style={{ zIndex: 1000 }}
            >
                <Dialog
                    as="div"
                    className="relative z-10 w-5/6 "
                    onClose={() => { }}
                    static={true}
                >
                    <div
                        className="fixed inset-0 bg-black/30"
                        aria-hidden="true"
                    />
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0">
                        <div className="flex min-h-fit justify-center p-4 text-center w-[90%] mx-auto items-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                    <div className={`${!isOpenCreateSlotsModal ? "hidden" : "block"} h-fit`}>
                                        <div className="w-full h-fit" >
                                            <div className="border-b-2">
                                                <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                                                    <div>
                                                        <p className="font-black">{slotDetails?.currentDate ? 'Edit Slots' : 'Add Slots'}</p>
                                                    </div>
                                                    <button className="focus:outline-none" onClick={() => {
                                                        setIsOpenCreateSlotsModal(false);
                                                    }}>
                                                        <ImCross className='font-medium' />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="w-full py-0 h-[80%]" >
                                                <div className="flex flex-column h-fit justify-between overflow-y-scroll" style={{ height: '600px' }} >
                                                    <div className='flex w-full justify-around' >
                                                        <div className="flex flex-col p-3 w-[30%]">
                                                            <div className='font-semibold'>Select Dates</div>
                                                            <div className="flex justify-center align-middle px-3 py-0 my-0 bg-white drop-shadow-md rounded-lg">
                                                                <Calendar handleDateChange={handleDateChange} value={value} setValue={setValue} />
                                                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DateCalendar
                                                                        value={value}
                                                                        onChange={(newValue) => handleDateChange(newValue)}
                                                                    />
                                                                </LocalizationProvider> */}
                                                            </div>
                                                            <div className='mt-4 font-semibold'>Booked Slots</div>
                                                            <div className="flex flex-col justify-between align-middle pt-3 my-2 bg-white drop-shadow-md rounded-lg">
                                                                <div className='flex flex-row'>
                                                                    <h2 className='w-[15%] text-gray-500 pb-1 pl-2'>Date</h2>
                                                                    <p className='w-[85%] text-gray-500 pb-1 pl-2'>Slots</p>
                                                                </div>
                                                                <div className='pt-2 font-medium'>
                                                                    {slots?.map((value, indx) => (
                                                                        <div key={indx} className='border-t-2 pt-2'>
                                                                            <div className='flex flex-row'>
                                                                                <div className='w-[15%] text-center py-2'>
                                                                                    {formatDateToMonthDay(value?.startDate)}
                                                                                </div>
                                                                                <div className='w-[75%] px-2 py-2'>
                                                                                    <div className='flex flex-wrap gap-2'>
                                                                                        {value?.items?.map((val, index) => (
                                                                                            <div
                                                                                                key={index}
                                                                                                className='rounded w-fit text-[#228276] bg-[#22827633] px-2'
                                                                                            >
                                                                                                {new Date(val?.startDate)?.toLocaleTimeString('en-US', {
                                                                                                    hour: '2-digit',
                                                                                                    minute: '2-digit',
                                                                                                    hour12: true,
                                                                                                    timeZone: 'UTC',
                                                                                                })}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className='w-[10%] pb-1 cursor-pointer'
                                                                                    onClick={(e) => handleDeleteSlotsPopup(value)}
                                                                                >
                                                                                    <DeleteIcon className='text-[#228276]' />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col w-[40%] border-x-2 p-3">
                                                            <div className='flex flex-row justify-between w-full'>
                                                                <div className='font-semibold'>
                                                                    {view === 'Today' ? new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : (
                                                                        (
                                                                            <div className="relative inline-block w-full">
                                                                                <div
                                                                                    className="font-semibold cursor-pointer border-black p-2 bg-white text-black rounded w-full"
                                                                                    onClick={handleWeekDropDown}
                                                                                >
                                                                                    {week} {isOpenWeekdaysDropdown ? <UpIcon /> : <DownIcon />}
                                                                                </div>
                                                                                {isOpenWeekdaysDropdown && (
                                                                                    <div className="absolute bg-white border border-gray-300 rounded mt-1 z-10 w-full">
                                                                                        {weekOptions.map((weekRange, index) => (
                                                                                            <div
                                                                                                key={index}
                                                                                                className="p-2 cursor-pointer hover:bg-[#22827633]"
                                                                                                onClick={() => {
                                                                                                    const weekStart = dayjs(weekRange.split(' - ')[0] + `, ${value.year()}`);
                                                                                                    setValue(weekStart);
                                                                                                    const { week } = getWeekRange(value.toDate());
                                                                                                    setWeek(week);
                                                                                                    const firstDay = new Date(weekStart);
                                                                                                    setFirstWeekDay(firstDay);
                                                                                                    const lastDay = new Date(weekStart.add(6, 'day'));
                                                                                                    setLastWeekDay(lastDay);
                                                                                                    setIsOpenWeekdaysDropdown(false);
                                                                                                }}
                                                                                            >
                                                                                                {weekRange}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="relative inline-block">
                                                                        <div
                                                                            className="font-semibold cursor-pointer border-black p-2 bg-white text-black rounded w-full"
                                                                            onClick={handleDropDown}
                                                                        >
                                                                            {view} {isOpenDropdown ? <UpIcon /> : <DownIcon />}
                                                                        </div>
                                                                        {isOpenDropdown && (
                                                                            <div className="absolute bg-white border border-gray-300 rounded mt-1 z-10 w-full">
                                                                                {['Today', 'Weekdays'].map((value, index) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        value={value}
                                                                                        className="p-2 cursor-pointer hover:bg-[#22827633]"
                                                                                        onClick={() => handleViewChange(value)}
                                                                                    >
                                                                                        {value}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col justify-between align-middle py-3 pb-2 px-3 my-2 bg-white drop-shadow-md rounded-lg">
                                                                {view === 'Today' && (
                                                                    <div className='flex flex-col gap-1'>
                                                                        {Array(15).fill(null).map((value, index) => {
                                                                            const hour = 6 + index;
                                                                            const period = hour >= 12 ? 'PM' : 'AM';
                                                                            const displayHour = hour % 12 === 0 ? 12 : hour % 12;

                                                                            const firstSlot = `${formatTime(hour, '00')}-${formatTime(hour, '30')}`;
                                                                            const secondSlot = `${formatTime(hour, '30')}-${formatTime(hour + 1, '00')}`;

                                                                            // Check if the first slot is taken (e.g., 6:00 AM - 6:30 AM)
                                                                            const isFirstSlotTaken = isSlotTaken(hour, 0);
                                                                            // Check if the second slot is taken (e.g., 6:30 AM - 7:00 AM)
                                                                            const isSecondSlotTaken = isSlotTaken(hour, 30);

                                                                            return (
                                                                                <div className='flex flex-row' key={index}>
                                                                                    <div className='w-[15%]'>{displayHour} {period}</div>
                                                                                    <div className='flex flex-col gap-1 w-[85%]'>
                                                                                        {/* First Slot */}
                                                                                        <div
                                                                                            className={`w-full h-5 ${isFirstSlotTaken ? 'bg-gray-500' : selectedSlots.includes(firstSlot) ? 'bg-[#228276]' : 'bg-[#22827633]'} rounded cursor-pointer`}
                                                                                            onClick={!isFirstSlotTaken ? () => handleSlotClick(hour, false) : null}
                                                                                            style={{ pointerEvents: isFirstSlotTaken ? 'none' : 'auto' }}  // Disable click if slot is taken
                                                                                        ></div>

                                                                                        {/* Second Slot */}
                                                                                        <div
                                                                                            className={`w-full h-5 ${isSecondSlotTaken ? 'bg-gray-500' : selectedSlots.includes(secondSlot) ? 'bg-[#228276]' : 'bg-[#22827633]'} rounded cursor-pointer`}
                                                                                            onClick={!isSecondSlotTaken ? () => handleSlotClick(hour, true) : null}
                                                                                            style={{ pointerEvents: isSecondSlotTaken ? 'none' : 'auto' }}  // Disable click if slot is taken
                                                                                        ></div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                                {view === 'Weekdays' && (
                                                                    <div>
                                                                        <div className="flex flex-row gap-1 mb-1 pl-[15%]">
                                                                            {weekDays.map(({ day, date }, index) => (
                                                                                <div className="h-5 w-full bg-white" key={index}>
                                                                                    {day}, {date?.split(" ")[2]}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            {weekSlots.map((slot, index) => (
                                                                                <div className="flex flex-row" key={index}>
                                                                                    <div className="w-[15%]">{slot}</div>
                                                                                    <div className="flex flex-col gap-1 w-[85%]">
                                                                                        <div className="flex flex-row gap-1 w-full">
                                                                                            {weekDays.map(({ date }, i) => (
                                                                                                <div className="flex flex-col gap-1 w-25" key={i}>
                                                                                                    {/* Full-hour slot */}
                                                                                                    <div
                                                                                                        className={`h-5 w-full ${selectedSlots.some(s => {
                                                                                                            const [startTime, endTime] = s.time.split('-');
                                                                                                            return s.date === date && startTime === formatTimeSlot(`${slot}-00`);
                                                                                                        })
                                                                                                                ? 'bg-[#228276]'
                                                                                                                : 'bg-[#22827633]'
                                                                                                            } rounded cursor-pointer`}
                                                                                                        onClick={() => handleWeekdaySlotClick(slot, false, date)}
                                                                                                    ></div>

                                                                                                    {/* Half-hour slot */}
                                                                                                    <div
                                                                                                        className={`h-5 w-full ${selectedSlots.some(s => {
                                                                                                            const [startTime, endTime] = s.time.split('-');
                                                                                                            return s.date === date && startTime === formatTimeSlot(`${slot}-30`);
                                                                                                        })
                                                                                                                ? 'bg-[#228276]'
                                                                                                                : 'bg-[#22827633]'
                                                                                                            } rounded cursor-pointer`}
                                                                                                        onClick={() => handleWeekdaySlotClick(slot, true, date)}
                                                                                                    ></div>
                                                                                                </div>

                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col w-[30%] p-3">
                                                            <div className='font-semibold'>Add Slot <span className='text-red-600'>*</span></div>
                                                            <div className='pt-3'><input value={slotName} onChange={(e) => setSlotName(e.target.value)} placeholder='Add slot name' className='px-3 w-full font-medium rounded border-2 border-[#228276] focus:border-[#228276] focus:ring-24' type='text' /></div>
                                                            <div>
                                                                {
                                                                    view === "Today" ? (
                                                                        selectedSlots.map((slot, index) => {
                                                                            const [startTime, endTime] = slot.split('-');
                                                                            const slotDuration = 30; // Assuming each slot is 30 minutes
                                                                            return (
                                                                                <div key={index} className='pt-2'>
                                                                                    <div className='flex flex-row justify-between'>
                                                                                        <div>
                                                                                            <AccessTimeIcon className='text-gray-300' />
                                                                                            <span>{startTime}</span>
                                                                                            <ArrowForwardIcon style={{ fontSize: '16px', width: '24px' }} />
                                                                                            <span>{endTime}</span>
                                                                                        </div>
                                                                                        <div>{slotDuration} min</div>
                                                                                    </div>
                                                                                    <div className='pl-4'>{formattedDate}</div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        selectedSlots.map((slot, index) => {
                                                                            const [startTime, endTime] = slot?.time?.split('-');
                                                                            const slotDuration = 30; // Assuming each slot is 30 minutes
                                                                            return (
                                                                                <div key={index} className='pt-2'>
                                                                                    <div className='flex flex-row justify-between'>
                                                                                        <div>
                                                                                            <AccessTimeIcon className='text-gray-300' />
                                                                                            <span>{startTime}</span>
                                                                                            <ArrowForwardIcon style={{ fontSize: '16px', width: '24px' }} />
                                                                                            <span>{endTime}</span>
                                                                                        </div>
                                                                                        <div>{slotDuration} min</div>
                                                                                    </div>
                                                                                    <div className='pl-4'>{slot?.date}</div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    )
                                                                }
                                                            </div>

                                                            {
                                                                view === "Today" ? (
                                                                    !slotDetails?.currentDate && (
                                                                        <div>
                                                                            <RepeatIcon className='text-gray-300' />
                                                                            <div className="relative inline-block">
                                                                                <div
                                                                                    className="font-semibold cursor-pointer border-black p-2 bg-white text-gray-300 rounded w-48"
                                                                                    onClick={handleDropdownAddSlot}
                                                                                >
                                                                                    {addSlotDropdown} {isOpenDropdownAddSlot ? <UpIcon /> : <DownIcon />}
                                                                                </div>
                                                                                {isOpenDropdownAddSlot && (
                                                                                    <div className="absolute bg-white border border-gray-300 rounded mt-1 z-10 w-fit">
                                                                                        {['Does not repeat', 'Repeat for the month', 'Custom'].map((value, index) => (
                                                                                            <div
                                                                                                key={index}
                                                                                                value={value}
                                                                                                className="p-2 cursor-pointer hover:bg-[#22827633]"
                                                                                                onClick={() => handleDropdownSlotChange(value)}
                                                                                            >
                                                                                                {value}
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                ) : (null)
                                                            }
                                                            {addSlotDropdown === 'Custom' && (
                                                                <div className="mx-5 flex flex-row justify-between items-center gap-3 mt-2">
                                                                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, indx) => {
                                                                        const isSelectedDay = indx === value.day(); // Check if it's the selected day
                                                                        const isCustomDaySelected = isDaySelected(indx); // Check if the custom day is selected

                                                                        return (
                                                                            <div
                                                                                key={indx}
                                                                                className={`rounded-full cursor-pointer font-medium text-center w-8 h-8 pb-2 pt-1 ${isCustomDaySelected ? 'bg-[#228276] text-white' : isSelectedDay ? 'bg-[#228276] text-white' : 'bg-[#22827633] text-[#228276]'}`}
                                                                                onClick={() => handleCustomDayClick(indx)}
                                                                            >
                                                                                {day[0]}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="flex w-full justify-end mb-3 border-t-2">
                                                    <button
                                                        className="bg-[#228276] text-white rounded-sm py-1 mt-3 mr-3 px-4 focus:outline-none rounded-2xl rounded text-white font-bold"
                                                        type="button"
                                                        disabled={!slotName}
                                                        onClick={() => view === "Weekdays" ? handleCreateWeekDaySlots() : slotDetails?.slots?.length > 0 ? handleUpdateSlot() : handleCreateSlot()}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}