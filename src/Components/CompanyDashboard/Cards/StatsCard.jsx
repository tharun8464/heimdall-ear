import Calendar from "../../../assets/images/CompanyDashboard/Calendar2.svg"
import CloseSquareXInotrecommended from "../../../assets/images/CompanyDashboard/CloseSquareXInotrecommended.svg"
import LockScheduled from "../../../assets/images/CompanyDashboard/LockScheduled.svg"
import LoginInvited from "../../../assets/images/CompanyDashboard/LoginInvited.svg"
import TickSquareCompleted from "../../../assets/images/CompanyDashboard/TickSquareCompleted.svg"
import TimeCirclePending from "../../../assets/images/CompanyDashboard/TimeCirclePending.svg"
import WorkXIRecommended from "../../../assets/images/CompanyDashboard/WorkXIRecommended.svg"
// import asd from "../../../../public/logo.png"
// import fggf from "../../../../public/images/Calendar2.svg"
export const StatisticsCard = ({ title, count, color, colorElement, borderLeft, icon, isLastCard, onViewDetails }) => (
    // <div className={`p-6 ${color} rounded-md shadow-md flex flex-auto min-w-[250px] items-center justify-between h-[132px]`}>
    <div className={`relative p-6 ${color} rounded-md shadow-md flex flex-auto w-[250px] items-center justify-between h-[132px] border-l-[3px] ${borderLeft}`}>

        <div className="  flex flex-col justify-between content-between h-[100px]">

            <h3 className={`text-xl font-semibold ${colorElement}`}>{title}</h3>
            <p className={`text-4xl font-bold ${colorElement}`}>{count}</p>
        </div>
        <div className="">
            <div className="  grid  absolute bottom-0 right-0 h-[100%]">
                {/* {isLastCard && (
                    // <div className="mt-4">
                    <div className="mt-3 mr-3">
                        <button className="font-semibold text-[#228276]  "
                        onClick={onViewDetails}
                    >
                        View Details
                    </button>
                </div>
            )} */}
                <div className="grid w-20 h-20 justify-self-end self-end  ">
                    {/* <img src={"../../../assets/images/Calendar@2x.svg"} alt={title} className="w-full h-full object-contain" /> */}
                    {icon == "Calendar" ?
                        <img src={Calendar} alt={title} className="w-full h-full object-contain " />
                        : icon == "LoginInvited" ? <img src={LoginInvited} alt={title} className="w-full h-full object-contain" /> :
                            icon == "LockScheduled" ? <img src={LockScheduled} alt={title} className="w-full h-full object-contain" /> :
                                icon == "TickSquareCompleted" ? <img src={TickSquareCompleted} alt={title} className="w-full h-full object-contain" /> :
                                    icon == "WorkXIRecommended" ? <img src={WorkXIRecommended} alt={title} className="w-full h-full object-contain" /> :
                                        icon == "CloseSquareXInotrecommended" ? <img src={CloseSquareXInotrecommended} alt={title} className="w-full h-full object-contain" /> :
                                            icon == "TimeCirclePending" ? <img src={TimeCirclePending} alt={title} className="w-full h-full object-contain" /> :
                                                null

                    }

                </div>

            </div>
        </div>

    </div>
);