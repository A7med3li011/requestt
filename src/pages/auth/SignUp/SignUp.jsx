import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../Components/UI/Button/Button";
import SignUpImg from "../../../assets/images/SignUp.png";
import Input from "../../../Components/UI/Input/Input";
import { FaEye, FaPhoneAlt, FaRegEyeSlash } from "react-icons/fa";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import Google from "../../../assets/images/Google.png";
import Apple from "../../../assets/images/Apple.png";
import Facebook from "../../../assets/images/Facebook.png";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "./style.scss";
import image2 from "../../../assets/images/sign-no-tagline-transparent-1500x1500 (1).png";
import i18next, { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  startAuth,
  authSuccess,
  authFailure,
} from "../../../redux/slices/authSlice";
import { useEffect, useState } from "react";
import Loader from "../../../Components/Loader/Loader";
import { PhoneInput } from "react-international-phone";
import "react-phone-number-input/style.css";
import Select from "react-select";
import countries from "react-select-country-list";
import { TbUserEdit } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";
import { handleSignUp } from "../../../redux/services/authServices";
import { toast } from "react-toastify";
import LandingHeader from "../../../Components/landingHeader/landingHeader";
import { useTranslation } from "react-i18next";

import {
  Input as MaterialInput,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Button as Btn,
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useCountries } from "use-react-countries";
import { IoIosFlash } from "react-icons/io";
const emojiToISO2 = {
  "🇪🇬": 11, // Egypt
  "🇦🇪": 9,

  "🇶🇦": 8, // Qatar
  "🇰🇼": 8, // Kuwait
  "🇱🇸": 8, // Lebanon
  "🇱🇸": 9, // Jordan
  "🇩🇿": 9, // Algeria
  "🇲🇦": 9, // Morocco
  "🇧🇭": 8, // Bahrain
  "🇴🇲": 9, // Oman
  "🇬🇧": 10, // United Kingdom
  "🇸🇾": 9, // Syria
  "🇵🇸": 9, // Palestine
  "🇮🇶": 10, // Iraq
  "🇹🇳": 9, // Tunisia
  "🇾🇪": 9, // Yemen

  "🇺🇸": 10, // United States
  "🇮🇳": 10, // India

  "🇸🇦": 9, // Saudi Arabia
  "🇩🇪": 11, // Germany
  "🇮🇹": 10, // Italy
  "🇫🇷": 10, // France
  "🇯🇵": 11, // Japan
  "🇨🇦": 10, // Canada
  "🇧🇷": 11, // Brazil
  "🇦🇺": 9, // Australia
};
const SignUp = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const countries = useCountries().countries;
  console.log(countries[0].flags.png);
  const [countryIndex, setCountryIndex] = useState(230);
  const { name, flags, countryCallingCode } = countries[countryIndex];
  const { roleId } = location.state || {};
  console.log("role id from state =>", roleId);

  const { isLoading, error } = useSelector((state) => state.auth);
  const { i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordErro2, setPasswordError2] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [country, setCountry] = useState({
    value: "SA",
    label: "Saudi Arabia",
  });
  const lang = i18next.language;
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/");
    }
  }, []);
  // if (confirmPassword != password) {
  //   setPasswordError("Passwords do not match")
  // }

  function checkMatch(e) {
    if (e.target.value != password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }
  function checkMatch1(e) {
    if (e.target.value != confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }
  function validatePassword(e) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!regex.test(e.target.value)) {
      setPasswordError2(
        "Password at least 8 characters, 1 lower case, 1 upper case, 1 special character"
      );
    } else {
      setPasswordError2("");
    }
  }
  const handleConfirmPasswordChange = (e) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);

    if (confirmPasswordValue != password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(passwordError);

    if (passwordErro2) return;
    const trimmedEmail = email.trim();
    const trimmedPassword = password;
    const trimmedName = Name.trim();
    const trimmedPhone = phone.trim();
    const trimmedConfirmPassword = confirmPassword;

    if (
      trimmedEmail === "" ||
      trimmedPassword === "" ||
      trimmedName === "" ||
      trimmedPhone === ""
    ) {
      toast.error(t("field cannot be empty, Please fill in all fields."));
      return;
    }

    // Check for empty fields
    if (
      !trimmedEmail ||
      !trimmedPassword ||
      !trimmedName ||
      !trimmedPhone ||
      !trimmedConfirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password != confirmPassword) {
      return;
    }
    if (phoneError) return;
    const userData = {
      email: trimmedEmail,
      password: trimmedPassword,
      name: trimmedName,
      phone: trimmedPhone,
      role: roleId,
    };
    console.log("userData :::: =>  ", userData);
    try {
      const result = await dispatch(handleSignUp(userData)).unwrap();
      console.log("result -----> ", result);
      console.log(result.results);
      console.log(result.token);

      const userData_signUp = result.results;
      const token_signUp = result.token;

      // Navigate to OTP page with user data
      navigate("/Otp", {
        state: {
          email_signUp: trimmedEmail,
          userData_signUp,
          token_signUp,
        },
      });
    } catch (err) {
      console.error("Sign Up failed:", err);
    }
  };

  // const countryOptions = countries()
  //   .getData()
  //   .map((country) => ({
  //     value: country.value,
  //     label: `${country.label}`,
  //   }));

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "40%",
      borderRadius: "1.5rem",
      margin: "0.5rem 1rem",
      position: "absolute",
      zIndex: "99",
      right: "0",
      backgroundColor: "#EAF0F7",
    }),
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      backgroundColor: "#EAF0F7",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      font: "jost",
      boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
      transform: "translateY(-10px)",
      transition: "opacity 200ms ease, transform 200ms ease",
      ".react-select__menu-list": {
        opacity: 1,
        transform: "translateY(0)",
      },
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      borderRadius: "0.5rem",
      overflow: "auto",
      overflowX: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      borderRadius: state.isSelected ? ".25rem" : "0",
      background: state.isSelected ? "var(--linear1)" : "#EAF0F7",
      color: state.isSelected ? "#ffffff" : "#000000",
      "&:hover": {
        background: state.isSelected ? "var(--linear1)" : "#f0f0f0",
      },
    }),
  };

  return (
    <div className="LogIn h-full relative effect overflow-hidden">
      {isLoading ? (
        <div className="loader flex items-center justify-center m-auto">
          <Loader />
        </div>
      ) : (
        <>
          <LandingHeader />
          <div className="Wrapper flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center mt-8 sm:mt-12 md:mt-14 lg:my-20 xl:my-40">
              <div className="image_phone lg:hidden mb-4 sm:mb-6">
                <img
                  src={SignUpImg}
                  alt="LogIn By Phone"
                  className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="  relative lg:right-16">
                <h3 className="font-workSans font-semibold text-purple text-center lg:text-left lg:text-gray-dark lg:font-bold text-md sm:text-xl md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl px-4 sm:px-0">
                  {t("sign up To activate your business easily")}
                </h3>
                <p className="font-jost font-medium hidden lg:block text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl mt-4 text-center lg:text-left">
                  {t("if you have an account you can")}
                  <Link className="text-blue block" to={"/LogIn/Mail"}>
                    {t("sign in here!")}
                  </Link>
                </p>
              </div>
            </div>
            <div className="LogIn_Image lg:flex justify-center hidden -z-10">
              <img
                src={SignUpImg}
                alt="SignUpImg"
                className="w-96 h-96 xl:w-[500px] xl:h-[500px] object-contain"
                loading="lazy"
              />
            </div>
            <div className="form flex flex-col mt-8 sm:mt-12 md:mt-14 w-full lg:w-auto lg:max-w-md xl:max-w-lg  relative lg:left-14">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="Name relative w-full sm:w-4/5 lg:w-full mx-auto">
                  {!Name && (
                    <p
                      className={`text-rose-600 absolute text-lg z-10 ${
                        i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                      }`}
                    >
                      *
                    </p>
                  )}
                  <Input
                    placeholder={t("yourName")}
                    type="text"
                    id="Name"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    label={t("yourName")}
                    labelIcon={<TbUserEdit />}
                    autoComplete="Name"
                    required
                  />
                </div>
                <div className="email w-full sm:w-4/5 lg:w-full mx-auto relative">
                  {!email && (
                    <p
                      className={`text-rose-600 absolute text-lg z-10 ${
                        i18n.language == "en" ? "left-[-2%]" : "right-[-2%]"
                      }`}
                    >
                      *
                    </p>
                  )}
                  <Input
                    placeholder="Name@email.com"
                    type="email"
                    id="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    labelIcon={<CiMail />}
                    label={t("enter email")}
                  />
                </div>

                <div className="phone w-full sm:w-4/5 lg:w-full mx-auto">
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 font-jost text-sm sm:text-base font-medium mb-2"
                  >
                    {t("Phone number")}
                  </label>
                  <div className="flex flex-col gap-1">
                    <PhoneInput
                      name="phoneNumber"
                      className="flex flex-row w-full"
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      defaultCountry="sa"
                      inputStyle={{
                        borderRadius: "",
                        height: "44px",
                        width: "100%",
                        backgroundColor: "#DADFE4",
                        fontSize: "14px",
                        "@media (min-width: 640px)": {
                          fontSize: "15px",
                        },
                      }}
                      countrySelectorStyleProps={{
                        flagStyle: {
                          borderRadius: "20px",
                          height: "18px",
                          width: "24px",
                          objectFit: "fill",
                          "@media (min-width: 640px)": {
                            height: "20px",
                            width: "26px",
                          },
                        },
                        buttonStyle: {
                          width: "50px",
                          height: "44px",
                          backgroundColor: "#DADFE4",
                          "@media (min-width: 640px)": {
                            width: "60px",
                          },
                        },
                      }}
                      prefix="+"
                    />
                  </div>
                  {phoneError && (
                    <div className="text-xs bg-[#FFF3CD] text-[#8A6B3C] flex items-center justify-between px-2 py-1 mt-1 rounded">
                      <p className="text-xs sm:text-sm">{phoneError}</p>
                      <p className="text-sm sm:text-base">
                        <IoIosFlash />
                      </p>
                    </div>
                  )}
                </div>

                <div className="password w-full sm:w-4/5 lg:w-full mx-auto relative">
                  {!password && (
                    <p
                      className={`text-rose-600 absolute text-lg z-10 ${
                        i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                      }`}
                    >
                      *
                    </p>
                  )}
                  <Input
                    type="password"
                    placeholder={"••••••••"}
                    className="placeholder:font-normal placeholder:text-lg sm:placeholder:text-xl placeholder:font-inter"
                    id="password"
                    autoComplete="password"
                    required
                    value={password}
                    label={t("Enter password")}
                    labelIcon={<MdLockOutline />}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      checkMatch1(e);
                      validatePassword(e);
                    }}
                    minLength={8}
                    inputIcons={[
                      {
                        element: <FaRegEyeSlash className="text-gold" />,
                        type: "visibility",
                      },
                      {
                        element: <FaEye />,
                        type: "visibility",
                      },
                    ]}
                  />
                </div>

                <div className="confirmPassword w-full sm:w-4/5 lg:w-full mx-auto relative">
                  {!confirmPassword && (
                    <p
                      className={`text-rose-600 absolute text-lg z-10 ${
                        i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                      }`}
                    >
                      *
                    </p>
                  )}

                  <Input
                    label={t("confirm password")}
                    placeholder={"••••••••"}
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    className="confirmPassword_input border-purple-dark border focus:!border relative placeholder:font-normal placeholder:text-lg sm:placeholder:text-xl placeholder:font-inter"
                    required
                    labelIcon={<MdLockOutline />}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      checkMatch(e);
                    }}
                    minLength={8}
                    inputIcons={[
                      {
                        element: <FaRegEyeSlash className="text-gold" />,
                        type: "visibility",
                      },
                      {
                        element: <FaEye />,
                        type: "visibility",
                      },
                    ]}
                  />

                  <div className="w-[350px]">
                    {passwordError && (
                      <div className="error flex justify-between items-start px-2 sm:px-4 bg-[#FFF3CD] text-[#8A6B3C] py-2 text-xs mt-2 mx-auto rounded">
                        <p className="text-xs sm:text-sm break-words flex-1 mr-2">
                          {passwordError}
                        </p>
                        <p className="text-sm sm:text-lg flex-shrink-0">
                          <IoIosFlash />
                        </p>
                      </div>
                    )}
                    {passwordErro2 && (
                      <div className="error flex justify-between items-start px-2 sm:px-4 bg-[#FFF3CD] text-[#8A6B3C] py-2 text-xs mt-2 mx-auto rounded">
                        <p className="text-xs sm:text-sm break-words flex-1 mr-2">
                          {passwordErro2}
                        </p>
                        <p className="text-sm sm:text-lg flex-shrink-0">
                          <IoIosFlash />
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="error text-red mt-4 text-center text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="mt-5 flex justify-center items-center w-full sm:w-4/5 lg:w-full mx-auto"
                >
                  {t("Register")}
                </Button>
              </form>

              {/* <div className="my-4 sm:my-6 flex items-center justify-center relative">
                <span className="or text-sm sm:text-base">{t("or")}</span>
              </div> */}

              <div className="flex items-center justify-center sm:justify-between mt-4 gap-2 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
                <div className="box_Google flex-1 sm:flex-none">
                  <img
                    src={Google}
                    alt="Google"
                    className="w-5 h-6 sm:w-6 sm:h-7"
                  />
                </div>
                <div className="box_Apple flex-1 sm:flex-none">
                  <img
                    src={Apple}
                    alt="Apple"
                    className="w-5 h-6 sm:w-6 sm:h-7"
                  />
                </div>
                <Link to={"/LogIn"} className="box_phone flex-1 sm:flex-none">
                  <FaPhoneAlt className="text-purple text-sm sm:text-base" />
                </Link>
              </div>

              <p className="font-jost font-medium text-sm sm:text-base lg:text-lg text-center block lg:hidden my-4 sm:my-6 px-4">
                {t("if you do not have an account you can")}
                <Link to="/sign-up" className="text-blue block">
                  {t("Register here!")}
                </Link>
              </p>
            </div>
          </div>
        </>
      )}

      <div className="py-4 px-4 mt-6 sm:mt-8 lg:mt-10">
        <div className="w-fit flex items-center mx-auto sm:me-auto flex-col sm:flex-row text-center sm:text-left">
          <img
            src={image2}
            alt=""
            className="w-16 sm:w-20 md:w-24 mb-2 sm:mb-0 sm:mr-3"
          />
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-xs sm:max-w-md lg:max-w-2xl leading-relaxed">
            {t("Code Skills Information Technology Company")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
