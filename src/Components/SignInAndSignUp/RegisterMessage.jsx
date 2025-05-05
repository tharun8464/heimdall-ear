// Assets
import candidate from "../../assets/images/Login/candidate.svg";
import company from "../../assets/images/Login/company.svg";
import { useLocation, useNavigate } from 'react-router-dom';

const RegisterMessage = () => {
  const location = useLocation();

  // Extract email from the URL query parameter
  const params = new URLSearchParams(location.search);
  const email = params.get('email');
  const navigate = useNavigate();



  return (
    <div className=" flex flex-col items-start justify-between h-full text-5xl lg:w-[100%] md:w-[100%] sm:w-[100%] xs:w-[100%] lg:left-[50.63%] md:left-[20%] sm:left-[5%] sm:right-[5%] xs:left-[5%] xs:right-[5%]">
      <div className="w-full mt-auto mb-auto flex flex-col  lg:gap-[40px] md:gap-[40px] sm:gap-[40px] xs:gap-[40px] justify-between">
        <div className="w-full flex flex-col self-center">
          <h2 className="text-xl font-bold mb-4">Hello, {email} </h2>
          <h3 className="text-xl font mb-4">We encountered an problem while trying to sign you in. </h3>

          <h4 className="text-xl font mb-4"> Ensure you are a registered user. If not, kindly use the "Sign Up" link below to create a new account.</h4>


          <h3 className="text-xl font mb-4">For any further assistance please reach out to support@valuematrix.ai</h3>

          <p className="pb-5 text-center mt-4 text-sm block">
            <b>Don't have an account ?</b>{" "}
            <span
              className="text-blue-700 font-semibold cursor-pointer"
              onClick={() => {
                navigate("/register");
              }}
            >
              {" "}
              Sign Up{" "}
            </span>

          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMessage;