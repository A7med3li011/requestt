import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "../config/i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [isRTL, setIsRTL] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    setIsRTL(language === "ar");
    document.body.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ isRTL, language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
