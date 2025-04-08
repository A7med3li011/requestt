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
    <div className="LogIn h-screen relative effect overflow-hidden ">
      {loading ? (
        <div className="loader flex justify-center items-center  m-auto">
          <Loader />
        </div>
      ) : (
        <>
          <LandingHeader />
          <div className="Wrapper flex items-center justify-between flex-wrap ">
            <div className="w-96 my-20 mx-auto sm:mx-0 ">
              <h3 className="font-workSans  font-bold md:text-5xl">
                {t("sign in To activate your business easily")}
              </h3>
              <p className="font-jost  mx-auto sm:mx-0  font-medium md:text-2xl">
                {t("if you don’t have an account you can")}
                <Link to={"/SignUp/ChooseRole"} className="text-blue block ">
                  {t("Register here!")}
                </Link>
              </p>
            </div>
            <div className=" LogIn_Image  flex justify-center ">
              <img src={image} alt="image" width={400} loading="lazy" />
            </div>
            <div className="form flex flex-col ">
              <div className="phone relative w-full">
                <label className="Input_label flex items-center  gap-2 font-jost text-base font-medium ">
                  <span className="label_icon w-4 h-4 ">
                    <FiPhone />
                  </span>
                  {t("PhoneNumber")}
                </label>
                <div className="input flex items-center my-2  ">
                  <TelPhone value={phoneNumber} onChange={handlePhoneChange} />
                </div>
              </div>
              {error && <p className="error text-red text-sm ">{error}</p>}
              <Button onClick={() => console.log("ahmded")} className={"mt-5"}>
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
