import { t } from "i18next";
import { FaBars } from "react-icons/fa";
import { RiGalleryView2 } from "react-icons/ri";
import { useEffect, useState } from "react";
import StatusHeader from "../../../Components/StatusHeader/StatusHeader";
import { getProjectHistory } from "../../../Services/api";
import BoardViewProject from "../../../Components/boardView/boardViewProject";
import { Link } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import Loader from "../../../Components/Loader/Loader";
import avatar from "../../../assets/images/Avatar.jpg";
import ListView from "../../../Components/ListView/listView";
import { useSelector } from "react-redux";

const ProjectHistory = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState("board");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      })
      .replace("/", "-")
      .replace("/", "-");
  };

  const buttonData = [
    { label: t("All"), value: "all" },
    { label: t("Waiting"), value: "waiting" },
    { label: t("Working"), value: "working" },
    { label: t("completed"), value: "completed" },
    { label: t("Delayed"), value: "delayed" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProjectHistory(Status, user._id);
        setData(data.results);
        "res with filter Status =", Status, "res => ", data;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [Status]);

  const handleFilterChange = (value) => {
    setStatus(value);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };
  console.log(avatar);
  return (
    <div className="ProjectHistory">
      <h1 className="title font-inter font-bold text-xl lg:text-3xl text-black m-2">
        {t("ProjectHistory")}
      </h1>
      <div className="GroupBtn flex items-center mx-2 my-4">
        <button
          className={`BoardView flex items-center gap-2 p-2 border border-gray border-solid rounded-s-md font-inter font-bold text-xs  ${
            viewMode === "board" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleViewChange("board")}
        >
          <span>
            <RiGalleryView2 className="w-4 h-3" />
          </span>
          {t("boardView")}
        </button>
        <button
          className={`ListView flex items-center gap-2 p-2 border border-gray border-solid font-inter font-bold text-xs  ${
            viewMode === "list" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleViewChange("list")}
        >
          <span>
            <FaBars className="w-4 h-4" />
          </span>
          {t("listView")}
        </button>
        <button
          className={`ListView flex items-center gap-2 p-2 border border-gray border-solid rounded-e-md font-inter font-bold text-xs  ${
            viewMode === "timeline" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleViewChange("timeline")}
        >
          <span>
            <FaBars className="w-4 h-4" />
          </span>
          {t("timeLineView")}
        </button>
      </div>
      <StatusHeader buttons={buttonData} onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="Loader">
          <Loader />
        </div>
      ) : (
        <div
          className={`content ${
            viewMode === "board"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
              : "flex flex-col gap-3"
          } mt-4`}
        >
          {" "}
          <Link
            to={`/AddProject`}
            className={` box bg-white  ${
              viewMode === "list"
                ? "flex items-center justify-center text-xl "
                : "flex flex-col p-5 justify-center gap-4 items-center col-span-1 min-h-[286px] h-full"
            } rounded-md shadow-sm  `}
          >
            <span>
              <IoAddOutline
                className={`${
                  viewMode === "board" ? "w-12 h-12 " : "w-8 h-8"
                } text-purple`}
              />
            </span>
            <span
              className={`text-linear font-inter font-bold  ${
                viewMode === "board" ? "text-3xl" : "text-xl"
              } `}
            >
              {" "}
              {t("AddProject")}
            </span>
          </Link>
          {viewMode === "board" &&
            data.map((Project) => {
              const avatars = Project.members.map(
                (member) => member.profilePic || avatar
              );

              return (
                <div className="Project" key={Project._id}>
                  <Link
                    to={`/ProjectDetails/${Project._id}`}
                    state={{ projectId: Project._id }}
                  >
                    <BoardViewProject
                      ProgressValue={Project?.progress}
                      NameOfTask={Project?.name}
                      Status={Project?.status}
                      avatars={avatars}
                      filesLength={Project?.documentsLength}
                      MsgLength={Project?.notes?.length}
                      sDate={formatDate(Project?.sDate)}
                      eDate={formatDate(Project?.dueDate)}
                      Submit={"Submitting"}
                    />
                  </Link>
                </div>
              );
            })}
          {viewMode === "list" &&
            data.map((Project) => {
              const avatars = Project.members.map(
                (member) => member.profilePic || avatar
              );

              return (
                <div className="Project" key={Project._id}>
                  <Link
                    to={`/ProjectDetails/${Project._id}`}
                    state={{ projectId: Project._id }}
                  >
                    <ListView
                      ProgressValue={Project?.progress}
                      NameOfTask={Project?.name}
                      taskPriority={Project?.projectPriority}
                      status={Project?.status}
                      avatars={avatars}
                      filesLength={Project?.documentsLength}
                      MsgLength={Project?.notes?.length}
                      Submit={"Submitting"}
                    />
                  </Link>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ProjectHistory;
