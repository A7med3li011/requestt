/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import lang from "../../assets/images/lang.png";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import { FaSun } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";

const AuthHeader = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isRTL, setIsRTL] = useState(false);
  const toggleLangOptions = () => {
    setIsLangOpen(!isLangOpen);
  };

  useEffect(() => {
    const lang = i18n.language || "en";
    setIsRTL(lang === "ar");
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [i18n.language]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    window.location.reload();
  };
  return (
    <div className="  flex items-center justify-end  mx-5 rtl:inline-flex">
      <div className="lang relative">
        <div
          className="lang_wrapper mx-2 flex gap-1 items-center cursor-pointer"
          onClick={toggleLangOptions}
        >
          <img src={lang} alt="lang" width={30} height={30} />
          <IoIosArrowDown style={{ color: "var(--gray-md)" }} />
        </div>
        <div
          className={`lang_options bg-white shadow-lg rounded-md p-2 absolute w-24 mt-3 transition-all duration-300 ${
            isLangOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <div
            onClick={() => changeLanguage("ar")}
            className="ar font-workSans font-medium text-base text-gray-md m-1 cursor-pointer text-center"
          >
            العربية
          </div>
          <div
            onClick={() => changeLanguage("en")}
            className="en font-workSans font-medium text-base text-gray-md m-1 cursor-pointer text-center"
          >
            English
          </div>
        </div>
      </div>
      {/* <div className="them">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded  ${
            theme === "light"
              ? "bg-gray-200 text-black"
              : "bg-gray-800 text-white"
          }`}
        >
          {theme === "light" ? <FaSun /> : <IoMoon />}
        </button>
      </div> */}
      <Link to="/LogIn/Mail">
        <button className="py-1 px-5 md:px-10 bg-linear_1 rounded-3xl text-white m-2 font-semibold md:text-xl text-base">
          {t("signIn")}
        </button>
      </Link>
      <Link to="/SignUp/ChooseRole">
        <button className="py-1 px-5 md:px-10 bg-light border border-purple border-solid rounded-3xl text-purple m-2 font-semibold md:text-xl text-base ">
          {t("Sign Up")}
        </button>
      </Link>
    </div>
  );
};

export default AuthHeader;
