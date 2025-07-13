/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import image from "../../../assets/images/LogInByPhone.png";
import "./style.scss";
import Button from "../../../Components/UI/Button/Button";
import { useEffect, useState } from "react";
import Loader from "../../../Components/Loader/Loader";
import { t } from "i18next";
import { FiPhone } from "react-icons/fi";
// import PhoneInput from "react-phone-number-input/input";
// import "react-phone-number-input/style.css";
// import Select from "react-select";
// import countries from "react-select-country-list";
import { useDispatch, useSelector } from "react-redux";
import { TelPhone } from "../../../Components/UI/telInput/telInput";
import LandingHeader from "../../../Components/landingHeader/landingHeader";

const LoginByPhone = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { phone, error } = useSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState(phone);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/");
    }
  }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   try {
  //     // setError("");
  //     // setLoading(true);
  //     navigate("/Otp");
  //   } catch (err) {
  //     (err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePhoneChange = (newPhoneValue) => {
    setPhoneNumber(newPhoneValue);
  };

  return (
    <div className="LogIn h-screen relative effect overflow-hidden">
      {loading ? (
        <div className="loader flex justify-center items-center m-auto">
          <Loader />
        </div>
      ) : (
        <>
          <LandingHeader />
          <div className="Wrapper flex items-center justify-between flex-wrap mt-52 relative top-20 px-4 sm:px-6 lg:px-8">
            {/* Text Section */}
            <div className="w-full lg:w-96 my-20 mx-auto lg:mx-0 text-center lg:text-left">
              <h3 className="font-workSans font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                {t("sign in To activate your business easily")}
              </h3>
              <p className="font-jost mx-auto lg:mx-0 font-medium text-lg sm:text-xl md:text-2xl mt-4">
                {t("if you don't have an account you can")}
                <Link
                  to={"/SignUp/ChooseRole"}
                  className="text-blue block mt-1"
                >
                  {t("Register here!")}
                </Link>
              </p>
            </div>

            {/* Image Section */}
            <div className="LogIn_Image lg:flex justify-center hidden  w-full lg:w-auto order-first lg:order-none mb-8 lg:mb-0">
              <img
                src={image}
                alt="image"
                className="w-48 sm:w-64 md:w-72 lg:w-80 xl:w-96 max-w-full h-auto"
                loading="lazy"
              />
            </div>

            {/* Form Section */}
            <div className="form flex flex-col w-full lg:w-auto max-w-md mx-auto lg:mx-0 justify-center items-center">
              <div className="phone relative w-full">
                <label className="Input_label flex ms-10 sm:ms-0 items-center gap-2 font-jost text-base font-medium mb-2">
                  <span className="label_icon w-4 h-4">
                    <FiPhone />
                  </span>
                  {t("PhoneNumber")}
                </label>
                <div className="input flex  justify-center  items-center my-2 w-full ">
                  <TelPhone
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="w-[300px]  sm:w-[450px] lg:!w-[330px]"
                  />
                </div>
              </div>
              {error && <p className="error text-red text-sm mt-2">{error}</p>}
              <Button
                onClick={() => console.log("ahmded")}
                className={"mt-5  w-[300px]  sm:w-[450px] lg:!w-[330px]"}
              >
                {t("sendOtp")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginByPhone;
