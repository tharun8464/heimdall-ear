import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parse } from 'date-fns';
import './CalenderView.css';
import EditIcon from '@mui/icons-material/BorderColor';
import RightIcon from '@mui/icons-material/KeyboardArrowRight';
import LeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import useXiSlots from '../../../Hooks/useXiSlots';
import { useSelector } from 'react-redux';
import { CreateSlots } from './CreateSlots';
const CalenderView = () => {
  const { monthlySlotsData } = useSelector(state => state.xiSlots);
  const { getSlotsByMonth } = useXiSlots();
  const [slots, setSlots] = useState({});
  const [isOpenEditSlotsModal, setIsOpenEditSlotsModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const month = useSelector((state) => state?.xiSlots?.currentMonth);
  const year = useSelector((state) => state?.xiSlots?.currentYear);
  const cMonth = useSelector((state) => state?.xiSlots?.month);
  
  useEffect(()=>{
    setCurrentMonth(cMonth)
  } , [cMonth])


  useEffect(() => {
    const initial = async () => {
      // const month = currentMonth.getMonth() + 1;
      // const year = currentMonth.getFullYear();
      await getSlotsByMonth(month, year);
    }
    initial();
  }, [month, year]);

  useEffect(() => {
    const initial = () => {
      //grouped slots based on date    
      let groupedData = monthlySlotsData?.reduce((acc, item) => {
        const date = item.startDate.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

      setSlots(groupedData);
    }
    if (monthlySlotsData) initial();
  }, [monthlySlotsData]);

  const convertToISTAMPM = (date) => {
    const startDate = new Date(date);
    // IST is 5 hours and 30 minutes ahead of UTC
    const ISTOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
    const istDate = new Date(startDate.getTime() + ISTOffset);

    // Extract hours, minutes, and determine AM/PM
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Format hours to always have two digits
    const hoursFormatted = hours < 10 ? '0' + hours : hours;
    // Format minutes to always have two digits
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

    // Construct the time string in AM/PM format
    const timeString = `${hoursFormatted}:${minutesFormatted} ${ampm}`;

    return timeString;
  }
  const handleEditSlotsModal = (date, slot) => {
    // if (!slot) return;
    const data = {
      currentDate: date,
      slots: slot
    }
    setSelectedSlots(data);
    setIsOpenEditSlotsModal(true)
  }

  // const renderHeader = () => {
  //   return (
  //     <div className='flex mb-1'>
  //       <span className='font-bold text-lg'>
  //         {format(currentMonth, 'MMMM yyyy')}
  //       </span>
  //       <span className='pt-0.5'>
  //         <LeftIcon className='cursor-pointer' onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} />
  //         <RightIcon className='cursor-pointer' onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} />
  //       </span>
  //     </div>
  //   );
  // };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEE";

    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const dateKey = format(day, 'yyyy-MM-dd');
        days.push(
          <div
            className={`col cell ${!isSameMonth(day, monthStart) ? "disabled" : ""}`}
            key={day}
          >
            {isSameMonth(day, monthStart) && (
              <>
                <span className="number font-semibold">{formattedDate}</span>
                <EditIcon onClick={e => handleEditSlotsModal(dateKey, slots[dateKey])} sx={{ fontSize: 18 }} className='cursor-pointer bg-[#22827633] rounded text-[#228276] absolute top-2 right-2 text-sm' />
                <div className='mt-3'>
                  {slots[dateKey] && slots[dateKey]?.map((item, indx) =>
                    indx < 2 && <div key={indx} className='flex flex-row align-middle px-1'>
                      <div className='text-gray-400'>{new Date(item?.startDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</div>
                      <div className='px-1 font-medium'> - </div>
                      <div className='text-gray-400'>{new Date(item?.endDate)?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</div>
                    </div>
                  )}
                  {slots[dateKey] && slots[dateKey]?.length - 2 > 0 && <div className='text-gray-400'>{slots[dateKey]?.length - 2} more slot is booked</div>}
                </div>
              </>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <>
      {isOpenEditSlotsModal && <CreateSlots
        setIsOpenCreateSlotsModal={setIsOpenEditSlotsModal}
        isOpenCreateSlotsModal={isOpenEditSlotsModal}
        slotDetails={selectedSlots} />}
      <div className="body">{rows}</div>
    </>
  };

  return (
    <div className="calendar">
      {/* {renderHeader()} */}
      <div>{renderDays()}</div>
      <div className="flex flex-col">{renderCells()}</div>
    </div>
  );
};

export default CalenderView;
