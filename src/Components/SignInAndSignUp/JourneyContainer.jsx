// Assets
import logowhite from "../../assets/images/logo-white.png";
import testiPictureSid from "../../assets/images/sid-review.jpg";
import testiPicturePrabhir from "../../assets/images/prabhir-review.jpg";

import { Carousel } from 'react-responsive-carousel';

import "../../assets/stylesheet/layout.scss"

const JourneyContainer = () => {
  return (
    <div className=" w-[36.94%] h-full lg:flex md:hidden sm:hidden xs:hidden">
      <div className="h-[95%] w-[95%] mt-auto mb-auto ml-auto">
        <div className=" right-[61.67%] left-[1.39%] rounded-2xl bg-primary-100 h-full overflow-hidden flex-col p-[50px] box-border items-start flex justify-between text-left text-21xl text-white font-button"
          style={{ background: "#228276" }}
        >
          <img
            className="relative w-[70.12px] h-[30px] object-cover"
            alt=""
            src={logowhite}
          />
          <div className="self-stretch flex flex-col mt-4 items-start justify-start gap-[40px]">
            <b className="self-stretch relative flex flex-col gap-[20px]">
              <p className="m-0 text-[35px]">{`Start your `}</p>
              <p className="m-0 text-[35px]">journey with us.</p>
            </b>
            <div className="self-stretch relative text-[18px] font-light text-gray-100 leading-normal">
              Advancing the tech-hiring process by optimizing human interventions.
            </div>
          </div>
          <Carousel autoPlay='true' className="login-section mt-3">
            <div className="flex flex-col h-fit  rounded-xl p-6 gap-[20px]" style={{ backgroundColor: "rgb(29 107 98)" }}>
              <div className="mb-4 text-left leading-normal">“ Hiring is a big problem with a huge TAM & the way ValueMatrix team is solving is something I believe will surely make them a market leader. I know Aditya, the founder from my Freshworks days and I have full faith in his execution skills. "</div>
              <div className="mx-2 row">
                <div>
                  <img className="rounded-lg" src={testiPictureSid}></img>
                </div>
                <div className="ml-3">
                  <p className="text-xl" align="left">Siddharth Malik</p>
                  <p className="text-[#E3E3E3]">Global CEO CleverTap, Ex CRO Freshworks</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-fit  rounded-xl p-6 gap-[20px]" style={{ backgroundColor: "rgb(29 107 98)" }}>
              <div className="mb-4 text-left leading-normal">“ In the war for talent, you need to have the best instruments to help you be certain of the talent you hire. ValueMatrix is your tool to locate right, interview better and select best. All that in the best timelines while reducing the fatigue in the client systems fighting an unending talent war.  "</div>
              <div className=" mx-2 row">
                <div>
                  <img className="rounded-lg" src={testiPicturePrabhir}></img>
                </div>
                <div className="ml-3">
                  <p className="text-xl" align="left">Prabir Jha</p>
                  <p className="text-[#E3E3E3]">Former CHRO Cipla, Tata Motors</p>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default JourneyContainer;