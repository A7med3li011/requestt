import "./style.scss";
import landing1 from "../../assets/images/landing1.jpg";
import landing2 from "../../assets/images/landing2.jpg";
import landing3 from "../../assets/images/landing3.jpg";
import landing4 from "../../assets/images/1PlaceholderImages-2.svg";
import landing5 from "../../assets/images/1PlaceholderImages-1.svg";
import landing6 from "../../assets/images/1PlaceholderImages.svg";
import box1 from "../../assets/images/box1.png";
import box2 from "../../assets/images/box2.png";
import box3 from "../../assets/images/box3.png";
import { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import { IconButton } from "@mui/material";
import { FaArrowLeft, FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
const Main = () => {
  let [Mode, setMode] = useState("Mode1");
  const [activeIndex, setActiveIndex] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    const modes = ["Mode1", "Mode2", "Mode3"];
    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % modes.length;
      setMode(modes[currentIndex]);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, []);
  useEffect(() => {
    // if (activeIndex === 0) {
    //   setMode("Mode1");
    // } else if (activeIndex === 1) {
    //   setMode("Mode2");
    // } else if (activeIndex === 2) {
    //   setMode("Mode3");
    // }
  }, [activeIndex, Mode]);
  

  const handleSlideChange = (index) => {
    // Update activeIndex when slide changes
    setActiveIndex(index);
  };

  const handleMouseEnter = (mode) => {
    setMode(mode);
    clearInterval(intervalRef.current);
  };
  const handleMouseLeave = () => {
    // Restart the interval on mouse leave
    const modes = ["Mode1", "Mode2", "Mode3"];
    let currentIndex = modes.indexOf(Mode);
    intervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % modes.length;
      setMode(modes[currentIndex]);
    }, 4000);
  };
  return (
    <>
      <div className="Main relative h-[95vh] overflow-hidden hidden xl:block">
        <div className="absolute top-16 right-16 fade-in">
          <span className="halfCircleEffect  transition-transform duration-500 ease-in-out"></span>
        </div>
        <div className="absolute bottom-0 left-16 fade-in">
          <span className="halfCircleLineEffect transition-transform duration-500 ease-in-out"></span>
        </div>
        <div className="flex items-center ltr:justify-start rtl:justify-end h-[80vh]">
          <div className="box bg-linear_1 text-white p-2 m-2 mx-6 rounded-xl max-w-[500px] transition-transform duration-500 ease-in-out hover:scale-105 fade-in">
            <h2 className="text-2xl font-extrabold">
              {Mode === "Mode1"
                ? t("landingMessage.message1")
                : Mode === "Mode2"
                ? t("landingMessage.message2")
                : Mode === "Mode3"
                ? t("landingMessage.message3")
                : ""}
            </h2>
            <p className="ltr:text-base rtl:text-lg font-medium">
              {Mode === "Mode1"
                ? t("landingMessage.message4")
                : Mode === "Mode2"
                ? t("landingMessage.message5")
                : Mode === "Mode3"
                ? t("landingMessage.message6")
                : ""}
            </p>

            <Link to={"/landing/seePlans"}>
              <button className="py-2 px-4 bg-white text-purple rounded-lg my-2 transition-transform duration-500 ease-in-out hover:scale-105 scale-up">
                {t("landingMessage.Btn")}
              </button>
            </Link>
          </div>
        </div>
        <div className="landingImage1 absolute right-52 top-36 transition-transform duration-500 ease-in-out fade-in">
          <img
            src={
              Mode === "Mode1"
                ? landing6
                : Mode === "Mode2"
                ? landing5
                : Mode === "Mode3"
                ? landing4
                : ""
            }
            alt="Landing Main Image"
            width={450}
            height={450}
            className="transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>
        <div className="landingImage2 absolute -right-24 bottom-12 rotate-45 p-2 transition-transform duration-500 ease-in-out fade-in">
          <img
            src={
              Mode === "Mode1"
                ? landing3
                : Mode === "Mode2"
                ? landing1
                : Mode === "Mode3"
                ? landing2
                : ""
            }
            alt="Landing Main Image"
            width={200}
            height={200}
            className="rounded-xl shadow-md transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>
        <div className="landingImage3 absolute right-[500px] -top-28 rotate-45 -z-10 p-2 transition-transform duration-500 ease-in-out fade-in">
          <img
            src={
              Mode === "Mode1"
                ? landing2
                : Mode === "Mode2"
                ? landing3
                : Mode === "Mode3"
                ? landing1
                : ""
            }
            alt="Landing Main Image"
            width={200}
            height={200}
            className="rounded-xl shadow-md transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </div>
        <div
          className={`box1 landing_box cursor-default ${
            Mode === "Mode1" ? "active" : ""
          } bottom-28 left-32 transition-transform duration-500 ease-in-out hover:scale-105 fade-in`}
          onMouseEnter={() => handleMouseEnter("Mode1")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={box1} alt="landing_box" loading="lazy" />
        </div>
        <div
          className={`box2 landing_box cursor-default ${
            Mode === "Mode2" ? "active" : ""
          } bottom-24 left-96 transition-transform duration-500 ease-in-out hover:scale-105 fade-in`}
          onMouseEnter={() => handleMouseEnter("Mode2")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={box2} alt="landing_box" loading="lazy" />
        </div>
        <div
          className={`box3 landing_box cursor-default ${
            Mode === "Mode3" ? "active" : ""
          } bottom-10 left-[600px] transition-transform duration-500 ease-in-out hover:scale-105 fade-in`}
          onMouseEnter={() => handleMouseEnter("Mode3")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={box3} alt="landing_box" loading="lazy" />
        </div>
      </div>
      {/* mobile view */}
      <div className="Main relative overflow-hidden xl:hidden block">
        <div className="slider  px-5 relative">
          <p
            onClick={() => {
              if (Mode == "Mode1") {
                setMode("Mode2");
              }
              if (Mode == "Mode2") {
                setMode("Mode3");
              }
              if (Mode == "Mode3") {
                setMode("Mode1");
              }
            }}
            className=" absolute top-[50%] right-0 bg-[#eee] cursor-pointer px-3 py-3 rounded-full"
          >
            <FaArrowRight />
          </p>
          <p
            onClick={() => {
              if (Mode == "Mode1") {
                setMode("Mode3");
              }
              if (Mode == "Mode2") {
                setMode("Mode1");
              }
              if (Mode == "Mode3") {
                setMode("Mode2");
              }
            }}
            className=" absolute top-[50%] left-0 bg-[#eee] cursor-pointer px-3 py-3 rounded-full"
          >
            <FaArrowLeft />
          </p>
          {Mode == "Mode1" && (
            <img className="h-[300px] w-full" src={landing6} />
          )}
          {Mode == "Mode2" && (
            <img className="h-[300px] w-full" src={landing2} />
          )}
          {Mode == "Mode3" && (
            <img className="h-[300px] w-full" src={landing3} />
          )}

          <div className="flex justify-center gap-x-3 my-2">
            <span
              className={` py-1 px-1 rounded-full cursor-pointer 
               ${Mode === "Mode1" ? "bg-black" : "bg-[#848383]"}
              `}
              onClick={() => setMode("Mode1")}
            ></span>
            <span
              className={` py-1 px-1 rounded-full cursor-pointer ${
                Mode == "Mode2" ? "bg-black" : "bg-[#848383]"
              }`}
              onClick={() => setMode("Mode2")}
            ></span>
            <span
              className={` py-1 px-1 rounded-full cursor-pointer ${
                Mode == "Mode3" ? "bg-black" : "bg-[#848383]"
              }`}
              onClick={() => setMode("Mode3")}
            ></span>
          </div>
          {/* <img src={landing2} />
         <img src={landing3} /> */}
        </div>

        <div className="flex items-center ltr:justify-start rtl:justify-end mt-10">
          <div className="box bg-linear_1 text-white p-2 m-2 mx-6 rounded-xl max-w-[500px] transition-transform duration-500 ease-in-out hover:scale-105 fade-in">
            <h2 className="text-2xl font-extrabold">
              {Mode === "Mode1"
                ? t("landingMessage.message1")
                : Mode === "Mode2"
                ? t("landingMessage.message2")
                : Mode === "Mode3"
                ? t("landingMessage.message3")
                : ""}
            </h2>
            <p className="ltr:text-base rtl:text-lg font-medium">
              {Mode === "Mode1"
                ? t("landingMessage.message4")
                : Mode === "Mode2"
                ? t("landingMessage.message5")
                : Mode === "Mode3"
                ? t("landingMessage.message6")
                : ""}
            </p>

            <Link to={"/landing/seePlans"}>
              <button className="py-2 px-4 bg-white text-purple rounded-lg my-2 transition-transform duration-500 ease-in-out hover:scale-105 scale-up">
                {t("landingMessage.Btn")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
