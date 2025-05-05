import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { PiCopySimpleFill } from "react-icons/pi";
import { useSelector } from 'react-redux';

export const WeekDays = ({ item, setUpdateSlots }) => {
    const [slotsDetails, setSlotsDetails] = useState(item);

    // Get blocked dates from redux store
    const blockedXiDates = useSelector((state) => state?.xiSlots?.blockedDates);

    useEffect(() => {
        setSlotsDetails(item);
    }, [item]);

    const handleSlots = (data) => {
        const slots = [{ startDate: '2024-09-06T11:00:00.000Z', endDate: '2024-09-06T11:30:00.000Z', isEditable: true }];
        const updatedSlots = [...data, ...slots];
        setSlotsDetails({ ...slotsDetails, isBooked: true, slots: updatedSlots });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const handleEditSlot = (slot) => {
        const slotDate = slot.startDate.split('T')[0];
        const slotData = [slotsDetails].map((item) => {
            if (item?.date === slotDate) {
                return item?.slots?.map((value) => {
                    return value?._id === slot?._id ? { ...slot, isEditable: true } : value;
                });
            } else {
                return item;
            }
        });
        const data = {
            isBooked: slotsDetails?.isBooked,
            date: slotsDetails?.date,
            slots: slotData.flat(Infinity),
        };
        setSlotsDetails(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [time, currentIndex] = name.split('_');
        let data = { ...slotsDetails };
        data.slots[currentIndex][time] = value;
        setUpdateSlots(data);
    };

    // Helper function to check if the slot date is before today's date
    const isPastDate = (dateString) => {
        const slotDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return slotDate < today; // Change to strictly less than to allow today to be editable
    };

    // Helper function to check if the slot date is blocked
    const isBlockedDate = (dateString) => {
        return blockedXiDates?.includes(dateString.split('T')[0]);
    };

    return (
        slotsDetails?.isBooked ? (
            <div className='grid grid-cols-4 mb-2 items-center px-2 gap-1 mt-10 ml-3 px-4 mb-5'>
                <div className='font-semibold'>{formatDate(slotsDetails?.date)}</div>
                <div className='flex flex-col'>
                    {slotsDetails?.slots?.map((item, indx) => (
                        <div key={indx} className='flex flex-col align-middle'>
                            {item?.isEditable ? (
                                <div className='flex flex-row align-middle'>
                                    <div className='text-gray-400 pt-0.5'>
                                        <input
                                            className='w-24 h-5 rounded outline-none'
                                            type='text'
                                            name={'startDate' + '_' + indx}
                                            onChange={(e) => handleChange(e)}
                                            value={item?.startTime}
                                            placeholder={new Date(item?.startDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}
                                        />
                                    </div>
                                    <div className='px-1 py-1 font-medium'>-</div>
                                    <div className='text-gray-400 w-4 pt-0.5'>
                                        <input
                                            className='w-24 h-5 rounded'
                                            type='text'
                                            name={'endDate' + '_' + indx}
                                            onChange={(e) => handleChange(e)}
                                            value={item?.endTime}
                                            placeholder={new Date(item?.endDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-row align-middle' onClick={(e) => handleEditSlot(item)}>
                                    <div className='text-gray-400 pt-0.5'>{new Date(item?.startDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</div>
                                    <div className='px-1 py-1 font-medium'>-</div>
                                    <div className='text-gray-400 pt-0.5'>{new Date(item?.endDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className='flex justify-end'>
                    {/* Hide AddIcon if the slot date is in the past or blocked */}
                    {!isPastDate(slotsDetails?.date) && !isBlockedDate(slotsDetails?.date) && (
                        <AddIcon onClick={(e) => handleSlots(slotsDetails?.slots)} className='text-green-500 cursor-pointer' />
                    )}
                </div>
                {/* <div className='flex justify-end'>
                    <PiCopySimpleFill className='text-gray-400 cursor-pointer' />
                </div> */}
            </div>
        ) : (
            <div className='grid grid-cols-4 mb-2 items-center px-2 gap-1 mt-10 ml-3 px-4 mb-5'>
                <div className='font-semibold'>{formatDate(slotsDetails?.date)}</div>
                <div className='text-gray-400 pt-0.5'> {isBlockedDate(slotsDetails?.date) ? 'Unavailable' : 'No Booked Slots'} </div>
                <div className='flex justify-end'>
                    {/* Hide AddIcon if the slot date is in the past or blocked */}
                    {!isPastDate(slotsDetails?.date) && !isBlockedDate(slotsDetails?.date) && (
                        <AddIcon onClick={(e) => handleSlots(slotsDetails?.slots)} className='text-green-500 cursor-pointer' />
                    )}
                </div>
                {/* <div className='flex justify-end'>
                    <PiCopySimpleFill className='text-gray-400 cursor-pointer' />
                </div> */}
            </div>
        )
    );
};
