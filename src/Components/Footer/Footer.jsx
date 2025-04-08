import React, { useState, useEffect } from 'react';
import logo from "../../assets/images/Mask_group.png";


const Footer = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Footer will disappear after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <footer 
      className={`flex rounded-t-lg opacity-80 justify-center w-56 mx-auto items-center bg-gray-600 text-white p-4 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-full'
      }`}
    >
      <img src={logo} alt="Logo" className="h-6 mr-2 animate-pulse" />
      <span><a href="https://mdarj.org/" className="hover:underline">Powered By Mdarj</a></span>
    </footer>
  );
};

export default Footer;