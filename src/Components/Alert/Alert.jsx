import React from "react";

const Alert = ({ icon, msg, icon_class, msg_class, customClass }) => {
  return (
    <div className={`Alert flex items-center rounded-md  w-full  ${customClass}`}>
      <span className={`icon ltr:mr-2  rtl:ml-2 rounded-s-md p-2 ${icon_class}`}>
        {icon}
      </span>
      <span className={`message text-xs ms:text-sm lg:text-base   ${msg_class}`}>{msg}</span>
    </div>
  );
};

export default Alert;
