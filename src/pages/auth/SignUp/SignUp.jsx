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
import i18next, { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  startAuth,
  authSuccess,
  authFailure,
} from "../../../redux/slices/authSlice";
import { useEffect, useState } from "react";
import Loader from "../../../Components/Loader/Loader";
import {PhoneInput} from "react-international-phone";
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
  "role id from state =>", roleId;

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
    "userData :::: =>  ", userData;
    try {
      const result = await dispatch(handleSignUp(userData)).unwrap();
      "result -----> ", result;
      result.results;
      result.token;

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
          <div className="Wrapper flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="w-full  md:w-1/2 lg:w-2/5 flex  flex-col items-center  mt-14  md:my-40">
              <div className="image_phone md:hidden">
                <img
                  src={SignUpImg}
                  alt="LogIn By Phone"
                  width={300}
                  height={300}
                  loading="lazy"
                />
              </div>
              <h3 className="font-workSans font-semibold text-purple text-center md:text-left md:text-gray-dark md:font-bold text-xl md:text-3xl lg:text-5xl">
                {t("sign up To activate your business easily")}
              </h3>
              <p className="font-jost font-medium hidden md:block md:text-xl lg:text-2xl">
                {t("if you have an account you can")}
                <Link className="text-blue block" to={"/LogIn/Mail"}>
                  {t("sign in here!")}
                </Link>
              </p>
            </div>
            <div className="LogIn_Image md:flex justify-center hidden -z-10">
              <img
                src={SignUpImg}
                alt="SignUpImg"
                width={500}
                height={500}
                loading="lazy"
              />
            </div>
            <div className="form flex flex-col mt-14">
              <form onSubmit={handleSubmit}>
                <div className="Name relative w-4/5 mx-auto md:w-full  ">
                  {!Name && (
                    <p
                      className={`text-rose-600 absolute text-lg  ${
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
                <div className="email w-4/5 mx-auto md:w-full relative">
                  {!email && (
                    <p
                      className={`text-rose-600 absolute text-lg  ${
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

                <div className="phone my-3 w-4/5 mx-auto md:w-full ">
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 font-jost text-base font-medium"
                  >
                    {t("Phone number")}
                  </label>
                  {/* <div className="flex relative bg-[#E8F0FE] ">
                    <Menu placement="bottom-start">
                      <MenuHandler>
                        <Btn
                          ripple={false}
                          variant="text"
                          color="blue-gray"
                          className="flex h-10 items-center gap-2 pl-3"
                        >
                          <img
                            src={flags.svg}
                            alt={name}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                          {countryCallingCode}
                        </Btn>
                      </MenuHandler>
                      <MenuList className="max-h-[20rem] max-w-[18rem]">
                        {countries.map(
                          (
                            { name, flags, countryCallingCode, iso2 },
                            index
                          ) => (
                            <MenuItem
                              key={name}
                              value={name}
                              className="flex items-center gap-2"
                              onClick={() => setCountryIndex(index)}
                            >
                              <img
                                src={flags.svg}
                                alt={name}
                                className="h-5 w-5 rounded-full object-cover"
                              />
                              {name}
                              <span className="ml-auto">
                                {countryCallingCode}
                              </span>
                            </MenuItem>
                          )
                        )}
                      </MenuList>
                    </Menu>

                    {!phone && (
                      <p
                        className={`text-rose-600 absolute text-lg ${
                          i18n.language === "en"
                            ? "left-[-2%] bottom-9"
                            : "right-[-2%] bottom-9"
                        }`}
                      >
                        *
                      </p>
                    )}

                    <input
                      id="phone"
                      dir={i18n.language === "en" ? "ltr" : "rtl"}
                      type="tel"
                      placeholder={t("Phone number")}
                      value={phone}
                      onFocus={() => setPhoneError(false)}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        const iso2 = countries[countryIndex].emoji;

                        const maxLength = emojiToISO2[iso2] || 15;
                        if (onlyDigits.length < maxLength) {
                          setPhoneError(
                            `Phone Number Isn't valid, must be ${maxLength}-digit`
                          );
                        } else {
                          setPhoneError("");
                        }
                        if (onlyDigits.length > maxLength) return;

                        setPhone(onlyDigits);
                      }}
                      className={`w-full focus:outline-none bg-[#E8F0FE] px-2 ${
                        i18n.language === "en"
                          ? "rounded-l-none rounded-lg"
                          : "rounded-r-none rounded-lg"
                      } ${phoneError ? "" : ""}`}
                    />
                  </div> */}
                  <div className="flex flex-col gap-1">
                    
                    <PhoneInput
                      name="phoneNumber"
                      className={`flex flex-row w-full g`}
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      defaultCountry="sa"
                      inputStyle={{
                        // border: "#258F424D solid 2px",
                        borderRadius: "",
                        height: "44px",
                        width:"100%",
                        backgroundColor:"#DADFE4",
                        fontSize:"15px"
                        
                      }}
                      countrySelectorStyleProps={{
                        flagStyle: {
                          borderRadius: "20px",
                          height: "20px",
                          objectFit: "fill",
                        },
                        buttonStyle: {
                          
                          width: "60px",
                          height: "44px",
                          backgroundColor:"#DADFE4"
                        },
                      }}
                      prefix="+"
                    />
                  </div>
                  {phoneError && (
                    <div className="text-xs bg-[#FFF3CD] text-[#8A6B3C] flex items-center justify-between px-1 py-1 mt-1">
                      <p>{phoneError}</p>
                      <p>
                        {" "}
                        <IoIosFlash />
                      </p>
                    </div>
                  )}
                </div>
                <div className="password w-4/5 mx-auto md:w-full relative">
                  {!password && (
                    <p
                      className={`text-rose-600 absolute text-lg  ${
                        i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                      }`}
                    >
                      *
                    </p>
                  )}
                  <Input
                    type="password"
                    placeholder={"••••••••"}
                    className="placeholder:font-normal placeholder:text-xl placeholder:font-inter"
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
                <div className="confirmPassword w-4/5 mx-auto md:w-full relative">
                  {!confirmPassword && (
                    <p
                      className={`text-rose-600 absolute text-lg  ${
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
                    className="confirmPassword_input border-purple-dark border focus:!border relative placeholder:font-normal placeholder:text-xl placeholder:font-inter"
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
                  {passwordError && (
                    <div className="error flex justify-between items-start px-4   bg-[#FFF3CD] text-[#8A6B3C] py-2 text-xs mt-2 mx-auto text-center">
                      <p>{passwordError}</p>
                      <p className="text-lg">
                        <IoIosFlash />
                      </p>
                    </div>
                  )}
                  {passwordErro2 && (
                    <div className="error flex justify-between items-start px-4     bg-[#FFF3CD] text-[#8A6B3C] py-2 text-xs mt-2 mx-auto text-center">
                      <p>{passwordErro2}</p>
                      <p className="text-lg">
                        <IoIosFlash />
                      </p>
                    </div>
                  )}
                </div>
                {error && (
                  <div className="error text-red mt-4 text-center">{error}</div>
                )}

                <Button
                  type="submit"
                  className="mt-5   flex justify-center  items-center w-4/5 mx-auto md:w-full"
                >
                  {t("Register")}
                </Button>
              </form>
              <div className="my-2 flex items-center justify-center relative">
                <span className="or">{t("or")}</span>
              </div>
              <div className="flex items-center justify-between mt-4 gap-4">
                <div className="box_Google">
                  <img src={Google} alt="Google" width={23} height={28} />
                </div>
                <div className="box_Apple">
                  <img src={Apple} alt="Apple" width={23} height={28} />
                </div>
                <Link to={"/LogIn"} className="box_phone">
                  <FaPhoneAlt className="text-purple" />
                </Link>
              </div>
              <p className="font-jost font-medium  text-lg text-center block md:hidden my-4">
                {t("if you do not have an account you can")}
                <Link to="/sign-up" className="text-blue block">
                  {t("Register here!")}
                </Link>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignUp;
