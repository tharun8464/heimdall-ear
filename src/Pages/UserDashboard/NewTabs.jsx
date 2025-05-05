import React, { useState } from "react";


const NewTabs = ({ setIndex, setDay, setActiveTab, activeTab, setLoader, setPage, tabs }) => {
    const handleTabClick = (index) => {
        setActiveTab(() => index);
        setIndex(() => index);
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

    return (
        <div className="py-2 px-1  flex ml-2" style={{ marginBottom: "-8px" }}>
            {tabs?.length > 0 && tabs?.map((item, index) => <p
                className={`w-auto h-[60px] flex items-center font-bold rounded-t-lg text-gray-600 ml-3 cursor-pointer border-x-[1px] border-t-[1px] border-gray-300 ${activeTab === index
                    ? "bg-white-100"
                    : "bg-[rgba(34,130,118,0.04)]"
                    }`}
                onClick={() => handleTabClick(index)}
            >
                <span className="px-3 py-1">{item}</span>
            </p>)}
        </div>
    );
};

export default NewTabs;
