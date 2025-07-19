import { t } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import { FaBars } from "react-icons/fa6";
import { Drawer, IconButton } from "@material-tailwind/react";
import { CheckInput } from "../../pages/setting/setting";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/images/transpairant_leatest.png";
import { Switch } from "@mui/material";

const LandingHeader = () => {
  const [isRTL, setIsRTL] = useState(false);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [languageChecked, setLanguageChecked] = useState(false);

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { changeLanguage } = useLanguage();

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    const lang = i18n.language || "en";
    setIsRTL(lang === "ar");
    setLanguageChecked(lang === "ar");
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [i18n.language]);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageChecked(lang === "ar");
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    window.location.reload();
  };

  const handleLanguageSwitch = () => {
    const newLang = languageChecked ? "en" : "ar";
    changeLang(newLang);
  };

  return (
    <div
      className={`header mx-4 sm:mx-6 md:mx-8 lg:mx-10 ${
        location.pathname === "/services" || location.pathname === "/ContactUs"
          ? "header_effect"
          : ""
      }`}
    >
      <header className="relative flex justify-between items-center py-2">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="logo"
            className="object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 backdrop-blur-md rounded-lg bg-transparent"
          />
          <p className="ml-2 text-xs sm:text-sm md:text-base lg:text-lg font-medium">
            {t("Trial version")}
          </p>
        </div>

        {/* Navigation Container */}
        <div className="flex items-center justify-center flex-1 max-w-4xl mx-4 ">
          <div className="flex items-center px-3 sm:px-4 md:px-6 lg:px-10 py-2 md:py-4 lg:py-6 shadow-lg ring-1 rounded-full border transition-all duration-300 hover:shadow-xl  ">
            {/* Mobile Menu Button */}
            <div className="block lg:hidden">
              <button
                onClick={openDrawer}
                className="transition-transform duration-200 hover:scale-110 p-2"
              >
                <FaBars className="text-purple text-lg md:text-xl" />
              </button>

              {/* Mobile Drawer */}
              <Drawer open={open} onClose={closeDrawer} className="p-4">
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
                    to={"/"}
                    className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                  >
                    {t("Home")}
                  </Link>
                  <Link
                    to={"/services"}
                    className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                  >
                    {t("Services")}
                  </Link>
                  <Link
                    to={"/seePlans"}
                    className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                  >
                    {t("Price")}
                  </Link>
                  <Link
                    to={"/ContactUs"}
                    className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                  >
                    {t("Contact us")}
                  </Link>
                  <Link
                    to={"/testimonials"}
                    className="font-medium text-lg w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
                  >
                    {i18n.language == "en" ? "Testimonials" : "آراء العملاء"}
                  </Link>

                  {/* Mobile Language Switcher */}
                  <div className="flex items-center justify-between w-full px-4 py-2 select-none gap-3 font-medium text-lg">
                    <span className="text-gray-600">العربية</span>
                    <CheckInput
                      checked={languageChecked}
                      onChange={handleLanguageSwitch}
                    />
                    <span className="text-gray-600">English</span>
                  </div>
                </div>
              </Drawer>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 x  ">
              <Link
                to={"/"}
                className="font-medium text-s  hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200 px-2 py-1 rounded-md hover:bg-purple/5"
              >
                {t("Home")}
              </Link>
              <Link
                to={"/services"}
                className="font-medium text-s  hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200 px-2 py-1 rounded-md hover:bg-purple/5"
              >
                {t("Services")}
              </Link>
              <Link
                to={"/seePlans"}
                className="font-medium text-s  hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200 px-2 py-1 rounded-md hover:bg-purple/5"
              >
                {t("Price")}
              </Link>
              <Link
                to={"/ContactUs"}
                className="font-medium text-s  hover:text-purple focus:text-purple cursor-pointer transition-colors duration-200 px-2 py-1 rounded-md hover:bg-purple/5"
              >
                {t("Contact us").split(" ")}
              </Link>
              <Link
                to={"/testimonials"}
                className="font-medium text-sm w-full text-center py-2 hover:text-purple focus:text-purple cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-purple/5 rounded-lg"
              >
                {i18n.language == "en" ? "Testimonials" : "آراء العملاء"}
              </Link>

              {/* Desktop Language Switcher */}
              <div className="flex items-center gap-2 ml-4 px-3 py-2 bg-gray-50 rounded-full">
                <span
                  className={`text-xs xl:text-xs font-medium transition-colors duration-200 ${
                    !languageChecked ? "text-purple" : "text-gray-500"
                  }`}
                >
                  EN
                </span>
                <CheckInput
                  checked={languageChecked}
                  onChange={handleLanguageSwitch}
                />
                <span
                  className={`text-xs xl:text-sm font-medium transition-colors duration-200 ${
                    languageChecked ? "text-purple" : "text-gray-500"
                  }`}
                >
                  عربي
                </span>
              </div>
            </nav>

            {/* Additional Switch (keeping your existing one) */}
            {/* <div className="hidden lg:flex items-center ml-4">
              <Switch
                size="small"
                checked={checked}
                onChange={handleChange}
                inputProps={{ "aria-label": "small switch" }}
              />
            </div> */}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-1 sm:gap-2  md:flex-col xl:flex-row">
          <Link to="/LogIn/Mail">
            <button className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-linear_1 rounded-2xl md:rounded-3xl text-light font-semibold text-xs sm:text-sm md:text-base lg:text-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-1 sm:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">{t("signIn")}</span>
            </button>
          </Link>
          <Link to="/SignUp/ChooseRole">
            <button className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-light border-2 border-purple border-solid rounded-2xl md:rounded-3xl text-purple font-semibold text-xs sm:text-sm md:text-base lg:text-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-purple hover:text-white flex items-center gap-1 sm:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              <span className="hidden sm:inline">{t("Sign Up")}</span>
            </button>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default LandingHeader;
