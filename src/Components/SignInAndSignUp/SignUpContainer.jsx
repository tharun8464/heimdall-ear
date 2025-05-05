// Assets
import candidate from "../../assets/images/Login/candidate.svg";
import company from "../../assets/images/Login/company.svg";
import { useNavigate } from 'react-router-dom';

const SignUpContainer = () => {

  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const emailParam = params.get('email');

  const handleCandidateAccountSelection = () => {
    if (emailParam) {
      navigate(`/register/candidate?email=${emailParam}`);
    } else {
      navigate('/register/candidate');
    }
  }

  const handleCompanyAccountSelection = () => {
    if (emailParam) {
      navigate(`/register/company?email=${emailParam}`);
    } else {
      navigate('/register/company');
    }
  }

  return (
    <div className=" flex flex-col items-start justify-between h-full text-5xl lg:w-[100%] md:w-[100%] sm:w-[100%] xs:w-[100%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%]">
      <div className="w-full mt-auto mb-auto flex flex-col  lg:gap-[40px] md:gap-[40px] sm:gap-[40px] xs:gap-[40px] justify-between">
        <div className="flex flex-col justify-between  gap-[40px]">
          <div className="md:block lg:block sm:hidden xs:hidden self-stretch flex flex-col items-start justify-start gap-[12px]">
            <div className="lg:self-stretch md:self-center sm:self-center xs:self-center relative font-semibold md:text-2xl">
              Sign up to ValueMatrix
            </div>
            <h5 className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
              Choose your Account Type
            </h5>
          </div>
          <div className="lg:hidden md:hidden sm:block xs:block -mt-[80px]">
            <div className="lg:self-stretch md:self-center  sm:self-center xs:self-center relative font-semibold sm:text-2xl xs:text-2xl">
              Sign up
            </div>
            <h5 className="m-0 lg:self-stretch md:self-center  sm:self-center xs:self-center relative text-sm font-medium font-inherit">
              Choose your Account Type
            </h5>
          </div>

          <div className="self-stretch flex flex-col items-start justify-center gap-[20px]">

            {/* Candidate Account */}

            <div onClick={() => handleCandidateAccountSelection()}
              className="cursor-pointer relative rounded-xl bg-white box-border w-[474px] overflow-hidden flex flex-row p-[15px] items-center justify-start gap-[15px] text-left text-sm text-dark-100 font-button border-[2px] border-solid border-grey-e3e3e3"
              style={{ position: "unset", width: "unset", alignSelf: "stretch" }}
            >
              <div className="relative w-[50px] h-[50px]">
                <div className="absolute top-[calc(50%_-_25px)] left-[0px] w-[50px] h-[50px]">
                  <div className="absolute top-[calc(50%_-_25px)] left-[0px] rounded-3xs bg-white box-border w-[50px] h-[50px] border-[1px] border-solid border-grey-e3e3e3" />
                </div>
                <img
                  className="absolute top-[calc(50%_-_12px)] left-[13px] w-6 h-6 overflow-hidden"
                  alt=""
                  src={candidate}
                />
              </div>
              <div className="flex-1 flex flex-col items-start justify-center gap-[6px]">
                <div className="self-stretch relative font-semibold lg:text-[16px]  sm:text-[14px] ">Candidate Account</div>
                <div className="self-stretch relative text-dark-50 lg:text-[14px]  sm:text-[12px] ">I’m setting up this account for myself.</div>
              </div>
            </div>

            {/* Company Account */}

            <div onClick={() => handleCompanyAccountSelection()}
              className="cursor-pointer relative rounded-xl bg-white box-border w-[474px] overflow-hidden flex flex-row p-[15px] items-center justify-start gap-[15px] text-left text-sm text-dark-100 font-button border-[2px] border-solid border-grey-e3e3e3"
              style={{ position: "unset", width: "unset", alignSelf: "stretch" }}
            >
              <div className="relative w-[50px] h-[50px]">
                <div className="absolute top-[calc(50%_-_25px)] left-[0px] w-[50px] h-[50px]">
                  <div className="absolute top-[calc(50%_-_25px)] left-[0px] rounded-3xs bg-white box-border w-[50px] h-[50px] border-[1px] border-solid border-grey-e3e3e3" />
                </div>
                <img
                  className="absolute top-[calc(50%_-_12px)] left-[13px] w-6 h-6 overflow-hidden"
                  alt=""
                  src={company}
                />
              </div>
              <div className="flex-1 flex flex-col items-start justify-center gap-[6px]">
                <div className="self-stretch relative font-semibold lg:text-[16px]   sm:text-[14px]">Company Account</div>
                <div className="self-stretch relative text-dark-50 lg:text-[14px]   sm:text-[12px]">I’m setting up this account for my company.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpContainer;
