import React, { useState } from "react";
const SlotTabs = ({ setTabIndex, setView, setActiveTab, activeTab, setLoader, setPage }) => {


  const handleTabClick = (index) => {
    setActiveTab(() => index);
    setTabIndex(() => index);
    if (index === 0) {
      setView("weekly")
      setPage(1)
      setLoader(false)
    }
    if (index === 1) {
      setView("calendar")
      setPage(1)
      setLoader(false)
    }
  };

  return (
    <div>
      <div className="py-2 px-1  flex ml-2 mt-2">
        <p
          className={`w-32 h-[35px] flex items-center text-gray-400 ml-3 cursor-pointer ${activeTab === 0
            && "border-b-2 border-[#228276] font-bold"
            }`}
          onClick={() => handleTabClick(0)}
        >
          <span className="ml-3">Weekly View</span>
        </p>

        <p
          className={`w-36 h-[35px] flex items-center text-gray-400 ml-3  cursor-pointer ${activeTab === 1
            && "border-b-2 border-[#228276] font-bold"
            }`}
          onClick={() => handleTabClick(1)}
        >
          <span className="ml-3">Calendar View</span>
        </p>
      </div>
    </div>
  );
};

export default SlotTabs;
