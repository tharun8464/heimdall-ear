import React, { useState, Fragment, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import "../../assets/stylesheet/layout.scss";

import SlotTabs from "./SlotTabs.jsx";
import WeeklyView from "./xiSlotNew/WeeklyView.jsx";
import CalenderView from "./xiSlotNew/CalenderView.jsx"
import { CreateSlots } from "./xiSlotNew/CreateSlots.jsx";

import RightIcon from '@mui/icons-material/KeyboardArrowRight';
import LeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { addMonths, format, set, subMonths } from "date-fns";

import useXiSlots from "../../Hooks/useXiSlots.js";


const Slotsv2 = () => {
    const {handleMonth , handleSetCurrentMonth, handleSetCurrentWeek , handleSetCurrentYear} = useXiSlots();
    const [loader, setLoader] = useState(false);
    const [user, setUser] = useState(null);
    const [page, setPage] = React.useState(1);
   
    const [isOpenCreateSlotsModal, setIsOpenCreateSlotsModal] = useState(false);
    //Tabs
    const [tabIndex, setTabIndex] = useState(0);
    const [activeTab, setActiveTab] = React.useState(0);
    const [view, setView] = React.useState("weekly");

    const [currentMonthSlots, setCurrentMonthSlots] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(1);

    const handleAddSlotsModal = () => {
        setIsOpenCreateSlotsModal(true)
    }

    const year = new Date(currentMonthSlots).getFullYear();
    const month = new Date(currentMonthSlots).getMonth() + 1;

    useEffect(()=>{
        const initial = async () => {
            await handleMonth(currentMonthSlots) 
            await handleSetCurrentYear(year)
            await handleSetCurrentMonth(month)
            await handleSetCurrentWeek(currentWeek)          
        }
        initial() 
    } , [currentWeek , currentMonthSlots , year , month])

    const handleSubMonth = () => {
        setCurrentMonthSlots(subMonths(currentMonthSlots, 1))
        setCurrentWeek(1)
    }

    const handleAddMonth = ()=>{
        setCurrentMonthSlots(addMonths(currentMonthSlots, 1))
        setCurrentWeek(1)
    }

    const handleAddWeek = ()=>{
        if(currentWeek < 5){
            setCurrentWeek(currentWeek + 1)
        }
        if(currentWeek === 5){
            setCurrentWeek(1)
            setCurrentMonthSlots(addMonths(currentMonthSlots, 1))
        }
    }

    const handleSubWeek = ()=>{
        if(currentWeek > 1){
            setCurrentWeek(currentWeek - 1)
        }
        if(currentWeek === 1){
            setCurrentWeek(5)
            setCurrentMonthSlots(subMonths(currentMonthSlots, 1))
        }
    }

    return (<>
        {isOpenCreateSlotsModal && <CreateSlots
            setIsOpenCreateSlotsModal={setIsOpenCreateSlotsModal}
            isOpenCreateSlotsModal={isOpenCreateSlotsModal} />}
        <div className=" bg-white drop-shadow-md rounded-lg ml-4 mr-4 flex">
            <div
                className="flex mx-3"
                style={{ justifyContent: "start" }}
            >
                <p className="text-sm flex my-3 mx-1 font-semibold">
                    Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
                    <p className="text-gray-400 px-2"> Check your slots today!</p>
                </p>
                <button className="focus:outline-none bg-[#228276] rounded-xl max-h-10 px-4 mt-1.5 mb-1 text-white font-semibold" onClick={e => handleAddSlotsModal()}>
                    <AddIcon className="bg-[#FFFFFF] my-2 text-[#228276] font-sm rounded mr-2" />Create slots
                </button>
            </div>
            <div className='font-bold text-lg my-2 ml-60'>
                <LeftIcon onClick={() => handleSubMonth()} className='cursor-pointer hover:text-green-500' sx={{ fontSize: 28 }} />
                {format(currentMonthSlots, 'MMMM yyyy')}
                <RightIcon onClick={() => handleAddMonth()} className='cursor-pointer hover:text-green-500' sx={{ fontSize: 28 }} />
            </div>
            <div className='font-medium text-lg my-2 ml-32 font-bold'>
                  <LeftIcon
                    onClick={() => handleSubWeek()}
                    className='cursor-pointer hover:text-green-500' sx={{ fontSize: 28 }} />Week {currentWeek}
                  <RightIcon onClick={() => handleAddWeek()} className='cursor-pointer hover:text-green-500' sx={{ fontSize: 28 }} />
            </div>
        </div>
        <div style={{ margin: "0" }}>
            <SlotTabs
                setTabIndex={setTabIndex}
                setView={setView}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                setLoader={setLoader}
                setPage={setPage}
            />
        </div>
        {view === "weekly" ? (
            <WeeklyView />
        ) : (
            <CalenderView />
        )}
    </>
    );
};

export default Slotsv2;