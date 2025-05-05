// Components
import JourneyContainer from "../../Components/SignInAndSignUp/JourneyContainer";
import CandidateSignUpForm from "../../Components/SignInAndSignUp/CandidateSignUpForm";
import { useNavigate } from "react-router-dom";

// Assets
import { IoIosArrowBack } from "react-icons/io";
import logogreen from "../../assets/images/Login/VMLogo.png";

const CandidateSignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row bg-white w-full h-screen overflow-hidden text-left text-sm text-dark-100 font-body-regular">
      <JourneyContainer />
      <div className=" lg:w-[63%] md:w-[100%] sm:w-[100%] xs:w-[100%] ">
        <div className="absolute top-[50px] left-[50px]">
          <img
            className="left-[40px] w-[70.12px] h-[30px] object-cover lg:hidden md:flex sm:hidden xs:hidden"
            alt=""
            src={logogreen}
          />
        </div>
        <div className="flex h-[95%] m-auto lg:w-[60%] md:w-[60%] sm:w-[90%] xs:w-[90%] ">
          <div className="flex flex-col justify-between w-full h-full mt-auto mb-auto">
            <div className="flex flex-col gap-[40px] mt-[5%]">
              <div className="flex flex-row lg:justify-start md:justify-center">
                <div className="flex flex-row lg:w-[218px] md:w-[218px] gap-1 sm:w-[100%] xs:w-[100%]  lg:right-[34.24%] lg:left-[50.63%] md:left-[42.43%] md:right-[42.43%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%] h-1.5">
                  <div className="w-[32.11%] top-[0px] right-[67.89%] left-[0%] rounded-tl-3xs rounded-tr-none rounded-br-none rounded-bl-3xs bg-[#228276] h-1.5" />
                  <div className="w-[32.11%] top-[0px] right-[33.94%] left-[33.94%] bg-[#228276] h-1.5" />
                  <div className="w-[32.11%] top-[0px] right-[0%] left-[67.89%] rounded-tl-none rounded-tr-3xs rounded-br-3xs rounded-bl-none bg-[#EEEEEE] h-1.5" />
                </div>
              </div>

            </div>
            <CandidateSignUpForm />
            <div
              className="[border:none] p-0 bg-[transparent] text-sm text-left inline-block gap-2 z-30"
            >
              <div className="lg:flex lg:justify-start md:flex md:justify-center sm:flex sm:justify-center xs:flex xs:justify-center lg:text-[14px] md:text-[14px] sm:[12px] xs:text-[12px] gap-2">
                <span className="font-medium">
                  <span>Already have an account?</span>
                  <span className="text-dark-100">{` `}</span>
                </span>
                <span className="cursor-pointer font-semibold font-button text-[#228276]" 
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </span>
                <span className="font-medium font-button text-dark-100">{` `}</span>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSignUp;