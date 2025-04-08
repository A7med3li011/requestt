import { t } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import { FaBars, FaBarsStaggered } from "react-icons/fa6";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { CheckInput } from "../../pages/setting/setting";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/images/transpairant_leatest.png";
const LandingHeader = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [open, setOpen] = useState(false);
  const [languageChecked, setLanguageChecked] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const { changeLanguage } = useLanguage();

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const toggleLangOptions = () => {
    setIsLangOpen(!isLangOpen);
  };

  useEffect(() => {
    const lang = i18n.language || "en";
    setIsRTL(lang === "ar");
    setLanguageChecked(lang === "ar");

    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [i18n.language]);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageChecked(lang === "ar"); // Update the checkbox status
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    window.location.reload(); // Optionally reload after changing language
  };
  return (
    <div
      className={`header ${
        location.pathname === "/landing/services" ||
        location.pathname === "/landing/ContactUs"
          ? "header_effect"
          : ""
      }`}
    >
      <header className="relative flex  justify-center items-center">
        <img
          src={logo}
          alt="logo"
          className={`object-contain me-3    md:block md:h-20 md:w-20 w-12 h-12 ${
            isRTL ? "right-4" : "left-4"
          } top-2 z-10  backdrop-blur-md rounded-lg bg-transparent`}
        />

        <div className="flex lg:mx-auto md:py-6 md:px-10 px-2 py-2 shadow-lg ring-1 me-auto z-20 rounded-full border my-4 transition-all duration-300 hover:shadow-xl">
          {/* mobile view items */}
          {/* <img 
          src={logo} 
          alt="logo" 
          onClick={openDrawer}
          className={`object-contain  md:hidden h-20 w-20  z-10  backdrop-blur-md rounded-lg bg-transparent`}
        /> */}

          <div className="block lg:hidden items-start">
            <button
              onClick={openDrawer}
              className="transition-transform duration-200 hover:scale-110"
            >
              <FaBars className="text-purple pt-1 text-xl  " />
            </button>

            <Drawer open={open} onClose={closeDrawer} className="p-4   ">
              <div className="mb-6 flex items-center justify-between">
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={closeDrawer}
                  className="transition-all duration-300 hover:bg-purple/10 hover:scale-110"
                >
                  <IoMdClose className="h-6 w-6" />
                </IconButton>
              </div>
              <div className="flex flex-col items-center gap-6 mt-10">
                <Link
                  to={"/landing"}
                  className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                >
                  {t("Home")}
                </Link>
                <Link
                  to={"/landing/services"}
                  className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                >
                  {t("Services")}
                </Link>
                <Link
                  to={"/landing/seePlans"}
                  className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                >
                  {t("Price")}
                </Link>
                <Link
                  to={"/landing/ContactUs"}
                  className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                >
                  {t("Contact us")}
                </Link>
                <div className="flex items-center justify-between w-full px-4 py-2 select-none gap-1 font-medium text-lg hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg">
                  <span>{t("language")}</span>
                  <CheckInput
                    checked={languageChecked}
                    onChange={() => {
                      const newLang = languageChecked ? "en" : "ar";
                      changeLang(newLang);
                    }}
                  />
                </div>
              </div>
            </Drawer>
          </div>
          <div className="items relative">
            <nav className="hidden lg:flex items-center gap-5">
              <Link
                to={"/landing"}
                className="font-medium text-lg hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200"
              >
                {t("Home")}
              </Link>
              <Link
                to={"/landing/services"}
                className="font-medium text-lg hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200"
              >
                {t("Services")}
              </Link>
              <Link
                to={"/landing/seePlans"}
                className="font-medium text-lg hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200"
              >
                {t("Price")}
              </Link>
              <Link
                to={"/landing/ContactUs"}
                className="font-medium text-lg hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200"
              >
                {t("Contact us")}
              </Link>
              <Link
                className="flex items-center select-none gap-1 font-medium text-lg hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200"
                onClick={toggleLangOptions}
              >
                <span>{t("language")}</span>
                <span className="transition-transform duration-300">
                  <IoIosArrowDown
                    style={{ color: "var(--gray-md)" }}
                    className={`transform ${
                      isLangOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </span>
              </Link>
            </nav>
            <div
              className={`lang_options z-50 bg-white shadow-lg rounded-md p-2 absolute ltr:right-3 rtl:-left-2 w-24 mt-3 transition-all duration-300 ${
                isLangOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div
                onClick={() => changeLang("ar")}
                className="ar font-workSans font-medium text-base text-gray-md m-1 cursor-pointer text-center transition-colors duration-200 hover:text-purple"
              >
                العربية
              </div>
              <div
                onClick={() => changeLang("en")}
                className="en font-workSans font-medium text-base text-gray-md m-1 cursor-pointer text-center transition-colors duration-200 hover:text-purple"
              >
                English
              </div>
            </div>
          </div>
        </div>
        <div className="CTA flex items-center ">
          <Link to="/LogIn/Mail">
            <button className=" px-5 py-3 sm:px-6  md:px-8 bg-linear_1 rounded-3xl text-light ms-1 font-semibold text-xs  md:text-xl  transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {t("signIn")}
            </button>
          </Link>
          <Link to="/SignUp/ChooseRole">
            <button className=" px-5 py-3 sm:px-6 md:px-8 bg-light border-2 border-purple border-solid rounded-3xl text-purple ms-1 font-semibold text-xs  md:text-xl  transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-purple hover:text-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              {t("Sign Up")}
            </button>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default LandingHeader;
