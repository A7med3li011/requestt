import { Progress } from "@material-tailwind/react";
import { FaPen } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { t } from "i18next";
import { memo, useMemo } from "react";

const AvatarList = memo(({ avatars }) => {
  const displayedAvatars = useMemo(() => avatars.slice(0, 3), [avatars]);
  return (
    <div className="members flex -space-x-2">
      {displayedAvatars.map((avatar, index) => (
        <img
          key={index}
          src={` ${
            avatar.startsWith("/src") || avatar.startsWith("/assets")
              ? avatar
              : `https://api.request-sa.com/${avatar}`
          }`}
          alt="avatar"
          className="w-8 h-8 border-2 border-white rounded-full m-1"
        />
      ))}
      {avatars.length > 5 && (
        <span className="w-8 h-8 text-black font-semibold rounded-full flex items-center justify-center m-1">
          +{avatars.length - 3}
        </span>
      )}
    </div>
  );
});
const ListView = ({
  Tagname,
  Tag,
  NameOfTask,
  ProgressValue,
  taskPriority,
  taskType,
  status,
  avatars = [],
  MsgLength,
  filesLength,
  sDate,
  eDate,
}) => {
  return (
    <div className="box bg-white rounded-lg shadow-sm py-1 px-3 flex items-center justify-between gap-2 ">
      <div className="files flex items-center gap-3 cursor-pointer">
        <div className="pen">
          {/* <span>
            <FaPen className="text-gray w-3 h-3 md:w-4 md:h-4 cursor-pointer" />
          </span> */}
        </div>
        <div className="files flex items-center gap-1">
          <span className="text-purple-dark font-inter font-extrabold text-sm leading-4">
            {filesLength}
          </span>
          <FaFileLines className="text-purple-dark w-3 h-3 md:w-4 md:h-4" />
        </div>
        <div className="msg flex items-center gap-1">
          <span className="text-red font-inter font-extrabold text-sm leading-4">
            {MsgLength}
          </span>
          <MdMessage className="text-yellow w-4 h-4" />
        </div>
      </div>
      <div className="name flex justify-between items-center mx-1 md:mx-2 my-3">
        <p className="font-inter font-medium text-xs leading-5">{NameOfTask}</p>
      </div>
      <div className="chips flex items-center justify-start gap-2">
        <span
          className={`${taskPriority} font-inter font-semibold text-xs text-center py-1 px-1 md:px-2 rounded-3xl`}
        >
          {taskPriority}
        </span>
        <span
          className={`${status} font-inter font-semibold text-xs text-center py-1 px-2 rounded-3xl`}
        >
          {status}
        </span>
      </div>
      <div className="members flex -space-x-2 mx-1">
        {avatars && <AvatarList avatars={avatars} />}
      </div>
      {taskType === "toq" && (
        <div className="progress hidden md:block md:max-w-sm lg:max-w-lg w-full mx-1 my-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-inter font-normal text-xs text-gray-dark">
              Progress
            </p>
            <span className="font-inter font-normal text-xs text-gray-dark px-2">
              {ProgressValue} %
            </span>
          </div>
          <Progress
            value={ProgressValue}
            color="purple"
            trackColor="gray"
            barProps={{
              style: {
                height: "5px",
                backgroundColor: "purple",
              },
            }}
            size="sm"
          />
        </div>
      )}
      {Tag && Tag !== null && (
        <div className="tagName flex justify-center">
          <span
            className="Tag px-14 py-2 rounded-3xl font-inter font-semibold text-sm mt-2"
            style={{
              color: Tag.colorCode,
              backgroundColor: `${Tag.colorCode}40`,
            }}
          >
            {Tagname}
          </span>
        </div>
      )}
    </div>
  );
};

export default ListView;
