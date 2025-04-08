import { Progress } from "@material-tailwind/react";
import "./style.scss";
import { FaPen } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { t } from "i18next";
import { memo, useMemo } from "react";

const BoardViewModels = ({
  discipline,
  actionCode,
  reason,
  refNo,
  title,
  date,
  inspectionDate,
  status,
  createdBy,
  supplier,
  unit,
  qty,
  workArea,
  location,
  desc,
  approved,
}) => {
  const truncatedDesc = useMemo(
    () => (desc?.length > 40 ? `${desc.slice(0, 30)}...` : desc),
    [desc]
  );
  return (
    <div className="box bg-white rounded-lg shadow-sm p-2 flex flex-col  col-span-1 min-h-[230px]">
      {status && (
        <span className="Tag text-center px-14 py-2 rounded-3xl font-inter font-semibold text-sm mt-2 capitalize">
          {status}
        </span>
      )}
      <div className="name flex justify-between items-center mx-2 my-3">
        <p className="font-inter font-medium text-xs leading-5">{title}</p>
        {refNo && (
          <span className="font-inter font-medium text-xs leading-5">
            {refNo}
          </span>
        )}
      </div>

      <div className={` chips flex items-center justify-start gap-2 mx-2 my-3`}>
        {discipline && (
          <span
            className={` capitalize font-inter font-semibold text-xs text-center py-1 px-2 rounded-3xl`}
            style={{
              backgroundColor: "#007aff1a",
              color: "#4285f4",
            }}
          >
            {discipline}
          </span>
        )}
        {actionCode && (
          <span
            className={` font-inter font-semibold text-xs text-center py-1 px-2 rounded-3xl`}
            style={{
              backgroundColor: "#34c75926",
              color: "#34c759",
            }}
          >
            {actionCode}
          </span>
        )}
        {reason && (
          <span
            className={` font-inter font-semibold text-xs text-center py-1 px-2 rounded-3xl`}
            style={{
              backgroundColor: "#ccabda33",
              color: "#a855f7",
            }}
          >
            {reason}
          </span>
        )}
      </div>
      <div className="desc font-inter font-medium text-xs leading-5  mx-2">
        {truncatedDesc}
      </div>
      {/* <div className=" flex justify-between items-center mx-2 my-3">
        <div className="flex items-center">
          <p className="font-poppins font-bold text-xs">{t("createdBy")} : </p> 
          <p className="font-inter font-medium text-xs leading-5">
            {createdBy}
          </p>
        </div>
      </div> */}

      <div className="date flex justify-between items-center mx-2 my-3">
        <div className="sDate flex items-center gap-1">
          <p className="font-poppins font-bold text-xs">{t("date")}:</p>
          <span className="font-poppins font-normal text-xs text-gray">
            {date}
          </span>
        </div>
        {inspectionDate && (
          <div className="inspectionDate  flex items-center gap-1  ">
            <p className="font-poppins font-bold text-xs">
              {t("inspectionDate")} :
            </p>                
            <span className="font-poppins font-normal text-xs text-gray">
              {inspectionDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardViewModels;


