import React, { useState, Fragment, useEffect } from 'react'
import { WeekDays } from './WeekDays';
import RightIcon from '@mui/icons-material/KeyboardArrowRight';
import LeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import EditIcon from '@mui/icons-material/BorderColor';
import { BookedSlotCard } from "./BookedSlotCard";
import { Dialog, Transition } from "@headlessui/react";
import { ImCross } from "react-icons/im";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { getSessionStorage } from '../../../service/storageService';
import useXiSlots from "../../../Hooks/useXiSlots.js"
import { useSelector } from 'react-redux';
import { addMinutes, addMonths, format, subMonths, getDay, parseISO } from 'date-fns';
import Calendar from './Calendar/Calendar.jsx';


const WeeklyView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const blockedXiDates = useSelector((state) => state?.xiSlots?.blockedDates)

  const { getBlockedDatesOfXi, getTodaySlotsOfXi, getWeeklySlotsOfXi, updateBlockedDatesOfXi, updateSlotsOfXi } = useXiSlots()

  const getBookedSlotsToday = useSelector((state) => state?.xiSlots?.getTodaySlotsData)
  const getWeekSlotsXi = useSelector((state) => state?.xiSlots?.getWeeklySlotsData)

  // //console.log("getWeekSlotsXi" , getWeekSlotsXi);

  const [bdmodal, setBDModal] = useState(false);
  const [selectedBlockDate, setSelectedBlockDate] = useState(new Date());
  const [value, setValue] = React.useState(dayjs(new Date()));
  const [slots, setSlots] = useState();
  const [updateSlots, setUpdateSlots] = useState();
  const [selectedDates, setSelectedDates] = useState([]);
  //console.log(updateSlots)
  // For weekly view
  const [currentMonthSlots, setCurrentMonthSlots] = useState(new Date());

  // const [currentWeek, setCurrentWeek] = useState(1);
  const currentWeek = useSelector((state) => state?.xiSlots?.currentWeek);
  const month = useSelector((state) => state?.xiSlots?.currentMonth);
  const year = useSelector((state) => state?.xiSlots?.currentYear);
  const mon = useSelector((state) => state?.xiSlots?.month);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getWeekDates = (year, month, weekNumber) => {
    let startDate = new Date(year, month - 1, 1);
    let dayOffset = (weekNumber - 1) * 7;
    startDate.setDate(startDate.getDate() + dayOffset);
    if (startDate.getMonth() + 1 !== month) {
      startDate = new Date(year, month - 1, 1);
    }

    // Collect all days for the requested week
    const dates = [];
    for (let i = 0; i < 7; i++) {
      if (startDate.getMonth() + 1 !== month) break;
      //console.log(startDate.toISOString())
      dates.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
    //console.log(dates);
    return dates;
  };

  useEffect(() => {
    const initial = () => {
      let groupedData = {};
      groupedData = getWeekSlotsXi?.reduce((acc, item) => {
        const date = item.startDate.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
      const weekDate = getWeekDates(year, month, currentWeek);
      const modifideData = weekDate.map((item, index) => {
        if (groupedData[item]) {
          return {
            isBooked: true,
            date: item,
            slots: groupedData[item]
          }
        } else {
          return {
            isBooked: false,
            date: item,
            slots: []
          }
        }
      })
      setSlots(modifideData);
    }

    if (getWeekSlotsXi) {
      initial();
    }
  }, [getWeekSlotsXi]);


  const handleUpdateSlots = async () => {
    let selectedSlots = [];
    let slotIds = [];
    let slotDate = updateSlots?.date;
    let slotName = updateSlots[0]?.slots[0]?.slotName;
    updateSlots?.slots?.forEach(item => {
      if (item?._id) {
        slotIds.push(item?._id);
        item?.startDate?.length > 10 ?
          selectedSlots.push(`${new Date(item?.startDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })} - ${new Date(item?.endDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}`)
          : selectedSlots.push(`${item?.startDate?.trim()} - ${item?.endDate?.trim()}`);
      } else {
        selectedSlots.push(`${item?.startDate?.trim()} - ${item?.endDate?.trim()}`)
      }
    });
    await updateSlotsOfXi({ slotName, selectedSlots, slotDate, slotIds });
    await getWeeklySlotsOfXi(currentWeek, month, year);
  }

  useEffect(() => {
    const initial = async () => {
      await getTodaySlotsOfXi()
    }
    initial()
  }, []);

  useEffect(() => {
    const initial = async () => {
      await getBlockedDatesOfXi()
      await getWeeklySlotsOfXi(currentWeek, month, year)
      getWeekDates(year, month, currentWeek);
    }
    initial()

  }, [currentWeek, month, year])

  // useEffect(() => {
  //   setCurrentWeek(1);
  // }, [month]);



  const saveBlockDate = async () => {

    await updateBlockedDatesOfXi(selectedDates)
    setSelectedDates([])

    setBDModal(false)
  }

  const handleDateChange = (newValue) => {
    const date = new Date(newValue);
    const formattedDate = format(date, 'yyyy-MM-dd');

    if (selectedDates?.includes(formattedDate)) {
      setSelectedDates(selectedDates?.filter(date => date !== formattedDate))
    } else {
      setSelectedDates([...selectedDates, formattedDate])
    }
  };

  return (
    <div className='flex flex-row justify-between gap-28'>
      <div className='ml-4 w-[50%]'>
        <div className='flex flex-row justify-between w-full'>
          {/* <div className='font-bold text-lg my-2'>{format(currentMonthSlots, 'MMMM yyyy')}<RightIcon onClick={() => setCurrentMonthSlots(addMonths(currentMonthSlots, 1))} className='cursor-pointer' sx={{ fontSize: 28 }} /></div> */}
          {/* <div className='font-medium'>
              <LeftIcon
                onClick={() => setCurrentWeek(prevWeek => Math.max(prevWeek - 1, 1))}
                className='cursor-pointer' sx={{ fontSize: 28 }} />Week {currentWeek}
              <RightIcon onClick={() => setCurrentWeek(prevWeek => Math.min(prevWeek + 1, 5))} className='cursor-pointer' sx={{ fontSize: 28 }} /></div> */}
        </div>
        <div className='bg-white shadow-md rounded-lg h-[70vh] overflow-y-auto'>
          {/* <div className='font-medium text-gray-400 mb-2 px-2'>Slot Timing</div> */}
          <div>{slots?.map((item, indx) => <WeekDays item={item} setUpdateSlots={setUpdateSlots} key={indx} />)}</div>
          {/* <div>{days?.map((item, indx) => <WeekDays item={item} key={indx} />)}</div> */}
          {/* <div className="flex w-full justify-end my-2 pb-3">
              <button
                onClick={e => handleUpdateSlots()}
                className="bg-[#228276] text-white rounded-sm py-1 mr-3 px-4 focus:outline-none rounded-2xl rounded text-white font-bold"
                type="button"
              >
                Save
              </button>
            </div> */}
        </div>
        <div className="flex w-full justify-end my-2 pb-3">
          <button
            onClick={e => handleUpdateSlots()}
            className="bg-[#228276] text-white rounded-sm py-1 mr-3 px-4 focus:outline-none rounded-2xl rounded text-white font-bold"
            type="button"
          >
            Save
          </button>
        </div>
      </div>
      {bdmodal && (
        <Transition
          appear
          show={bdmodal}
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
              <div className="flex min-h-fit justify-center p-4 text-center max-w-fit mx-auto items-center my-[10%]">
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
                    <div className={`${!bdmodal ? "hidden" : "block"} h-fit`}>
                      <div className="w-full h-fit">
                        <div className="border-b-2">
                          <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                            <div>
                              <p className="font-semibold">Blocked Dates</p>
                            </div>
                            <button className="focus:outline-none" onClick={() => {
                              setBDModal(false);
                              setSelectedBlockDate(new Date());
                            }}>
                              <ImCross className='font-medium' />
                            </button>
                          </div>
                        </div>

                        <div className="w-full py-3">
                          <div className="flex flex-column h-fit justify-between">
                            <div className='w-full border-b-2'>
                              <div className="flex w-full justify-around">
                                <Calendar handleDateChange={handleDateChange} selectedDates={selectedDates} blockedXiDates={blockedXiDates} />

                              </div>

                            </div>
                            <div className="flex w-full justify-end mt-3">
                              <button
                                className="bg-[#228276] text-white rounded-sm py-1 mr-3 px-4 focus:outline-none rounded-2xl rounded text-white font-bold"
                                type="button"
                                onClick={() => { saveBlockDate(); setSelectedBlockDate(new Date()) }}
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
      <div className='mr-8 w-[50%] mt-2'>
        <div className='flex flex-row w-full mb-2'>
          <div className='font-bold'>Blocked Dates</div>
          <div className='cursor-pointer ml-10 text-[#228276] font-semibold' onClick={() => {
            setBDModal(true);
          }}><EditIcon sx={{ fontSize: 18 }} />Edit</div>
        </div>
        {blockedXiDates && blockedXiDates.length > 0 ? (
          blockedXiDates
            .filter(
              (item) =>
                new Date(item).getMonth() + 1 === mon.getMonth() + 1 &&
                new Date(item).getFullYear() === mon.getFullYear()
            )
            .length > 0 ? (
            // Flexbox container for displaying dates in a row
            <div className="flex flex-wrap gap-4 px-4 py-3 bg-white shadow-md rounded-lg min-h-30 mt-3">
              {blockedXiDates
                .filter(
                  (item) =>
                    new Date(item).getMonth() + 1 === mon.getMonth() + 1 &&
                    new Date(item).getFullYear() === mon.getFullYear()
                )
                .map((item, index) => (
                  <span
                    key={index}
                    className="bg-[#D6615A1A] rounded-full font-semibold mx-2 my-2 p-2.5 text-[#D6615A]"
                  >
                    {new Date(item).getDate()}
                  </span>
                ))}
            </div>
          ) : (
            // If no blocked dates for the selected month
            <span className="text-gray-400 font-semibold mt-8">You haven't blocked any dates</span>
          )
        ) : (
          // If no blocked dates at all
          <span className="text-gray-400 font-semibold py-3 flex flex-wrap">No Blocked Dates</span>
        )}

        <div className='mt-32 font-bold'>Booked Slots Today</div>
        <div>
          {getBookedSlotsToday && getBookedSlotsToday?.length > 0 ? (
            getBookedSlotsToday?.map((item, indx) => <BookedSlotCard item={item} key={indx} />)
          ) : (
            <>
              <div className='font-semibold mt-4 text-gray-400'>
                You haven't booked any slots today!.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeeklyView;