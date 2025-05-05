// Components
import JourneyContainer from "../../Components/SignInAndSignUp/JourneyContainer";
import logogreen from "../../assets/images/Login/VMLogo.png";
import ExpiredForm from "../../Components/SignInAndSignUp/ExpiredForm";

const ResePassError = () => {
  return (
    <div className="flex flex-row bg-white w-full h-screen overflow-hidden text-left text-sm text-dark-50 font-button">
      <JourneyContainer />
      <div className="h-full lg:w-[63%] md:w-[100%] sm:w-[100%] xs:w-[100%]">
        <div className="absolute top-[50px] left-[50px]">
          <img
            className="left-[40px] w-[70.12px] h-[30px] object-cover lg:hidden md:flex sm:hidden xs:hidden"
            alt=""
            src={logogreen}
          />
        </div>
        <div className="flex h-full m-auto lg:w-[60%] md:w-[60%] sm:w-[90%] xs:w-[90%]">
          <div className="flex flex-col justify-between w-full h-[100%] mt-auto mb-auto lg:overflow-y-[unset] md:overflow-y-[unset] sm:overflow-y-auto xs:overflow-y-auto">
            <ExpiredForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResePassError;