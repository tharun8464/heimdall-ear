import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoEllipse } from "react-icons/io5";
import { blueGrey, grey } from "@mui/material/colors";

const Tabs = ({ setTabIndex, setDay, setActiveTab, activeTab, setLoader, setPage }) => {
  // const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(() => index);
    setTabIndex(() => index);
    if (index === 0) {
      setDay("today")
      setPage(1)
      setLoader(true)
    }
    if (index === 1) {
      setDay("upcoming")
      setPage(1)
      setLoader(true)
    }
    if (index === 2) {
      setDay("completed")
      setPage(1)
      setLoader(true)
    }
  };

  const iconColor = "gray";

  return (
    <div>
      <div className="py-2 px-1  flex ml-2">
        <p
          className={`w-auto h-[60px] flex items-center rounded text-gray-900 ml-3 cursor-pointer ${activeTab === 0
            ? "border-b-[3px] border-green-400 font-bold"
            : "hover:bg-gray-100 hover:font-bold"
            }`}
          onClick={() => handleTabClick(0)}
        >
          <span className="ml-3">Today</span>
        </p>

        <p
          className={`w-auto h-[60px] flex items-center rounded text-gray-900 ml-3  cursor-pointer ${activeTab === 1
            ? "border-b-[3px] border-green-400 font-bold"
            : "hover:bg-gray-100 hover:font-bold"
            }`}
          onClick={() => handleTabClick(1)}
        >
          <span className="ml-3">Upcoming</span>
        </p>
        <p
          className={`w-auto h-[60px] flex items-center rounded text-gray-900 ml-3  cursor-pointer ${activeTab === 2
            ? "border-b-[3px] border-green-400 font-bold"
            : "hover:bg-gray-100 hover:font-bold"
            }`}
          onClick={() => handleTabClick(2)}
        >
          <span className="ml-3">Completed</span>
        </p>
      </div>
    </div>
  );
};

export default Tabs;
