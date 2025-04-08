import React from "react";
import Button from "../UI/Button/Button";
import { t } from "i18next";
import { IoWarningOutline } from "react-icons/io5";
import { LuBadgeCheck } from "react-icons/lu";
import i18n from "../../config/i18n";

const NotificationItem = ({
  // icon,
  message_en,
  message_ar,
  timestamp,
  showButtons,
  onApprove,
  onCancel,
  isRead,
  type,
}) => {
  const lang = i18n.language;

  console.log(
    message_ar
      
  );
  return (
    <div
      className={`notification-item  p-3 rounded-md flex items-center justify-start space-x-4 my-1 border-b border-solid border-gray  `}
      style={{
        background: isRead ? "rgba(204, 171, 218, 0.1)" : "#fff",
      }}
    >
      <div className="icon text-2xl">
        <span>
          {type === "warning" ? (
            <IoWarningOutline className="text-yellow" />
          ) : type === "success" ? (
            <LuBadgeCheck className="text-green" />
          ) : (
            <LuBadgeCheck className="text-purple" />
          )}
        </span>
      </div>
      <div className="content flex-1">
        {lang === "ar" ? (
          <p className="text-sm my-1">
            {message_ar
              .replace("owner", "مالك")
              .replace("contractor", "مقاول")
              .replace("consultant", "استشاري")}
          </p>
        ) : (
          <p className="text-sm my-1">{message_en}</p>
        )}

        <p className="text-xs text-gray-400 my-1">{timestamp}</p>
        {showButtons && (
          <div className="actions flex justify-end gap-2 space-x-2 mt-2">
            <button
              className="text-red text-base font-medium"
              onClick={onCancel}
            >
              {t("Cancel")}
            </button>
            <Button onClick={onApprove} className={"px-5 !py-2"}>
              {t("Approve")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
