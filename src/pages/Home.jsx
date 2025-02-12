import { useContext, useEffect } from "react";
import Header from "../components/Header";
import { removeProfileDiv } from "../context/ContextShare";
import { Link } from "react-router-dom";

const Home = () => {
  const { show, setShow, setShowgoal } = useContext(removeProfileDiv);
  const closeProfile = () => {
    if (show) {
      setShow(false);
      setShowgoal(false);
    }
  };
  //   useEffect(()=>{
  // if(sessionStorage.getItem('token')){

  // }
  //   },[])
  return (
    <>
      <div className=" h-[100vh] md:overflow-hidden">
        <Header />
        <div
          className="grid grid-cols-1 md:grid-cols-2 grid-rows-[80vh_auto] md:grid-rows-[68vh_20vh] bg-[#C7BFCC]"
          onClick={closeProfile}
        >
          <div className="flex items-center justify-center">
            <div className="-ml-2">
              <h2 className="text-xl md:text-4xl" style={{ fontWeight: "400" }}>
                Track Your Nutrition
              </h2>
              <h2
                className="mt-6 text-xl md:text-4xl"
                style={{ fontWeight: "300" }}
              >
                with
              </h2>
              <div
                className="mt-6  bg-[#61E952] bg-opacity-40"
                style={{ width: "fit-content", borderRadius: "0 8px 0 0" }}
              >
                <h2 className="ml-2 mr-5 p-1 w-100 bg-[#9ed09b] text-2xl md:text-4xl">
                  NutriHealth
                </h2>
              </div>
              <Link to="/login">
                <button className="btn border-none bg-[#006b60] text-white px-8 py-3 mt-8 rounded-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
          <div className="row-span-2 h-[53rem] md:h-auto relative md:y-overflow-hidden">
            <img
              src="/images/Group 3.png"
              alt=""
              className="w-[20rem] absolute md:w-[60%] md:top-8 md:right-[40%]"
            />
            <img
              src="/images/Group 4 (1).png"
              alt=""
              className="w-[18rem]  absolute top-[16rem] right-0 md:w-[40%] md:top-auto md:-left-40 md:bottom-4"
            />
            <img
              src="/images/Group 5 (1).png"
              alt=""
              className="w-[19rem]  absolute top-[32rem] -left-2 md:w-[60%] md:top-auto md:left-auto md:-right-[10px] md:-bottom-[4rem]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
