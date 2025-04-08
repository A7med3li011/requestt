import { t } from "i18next";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { RiGalleryView2 } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { getAllSubTasksByParentTask } from "../../../Services/api";
import BoardView from "../../../Components/boardView/boardView";
import { format } from "date-fns";
import avatar from "../../../assets/images/Avatar.jpg";
import ListView from "../../../Components/ListView/listView";
import Loader from "../../../Components/Loader/Loader";

const AllSubTasks = () => {
  const location = useLocation();
  const { taskId, projectId, members } = location.state || {};
  (location.state);
  const [viewMode, setViewMode] = useState("board");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllSubTasksByParentTask(taskId);
        setData(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 const formatDate = (date) => {
   if (!date) return "";
   return format(new Date(date), "dd MMM");
 };  
  return (
    <div className="AllSubTasks">
      <h1 className="title font-inter font-bold text-3xl text-black m-2">
        {t("AllSubTasks")}
      </h1>
      <div className="GroupBtn flex items-center mx-2 my-4">
        <button
          className={`BoardView flex items-center gap-2 p-2 border border-gray border-solid rounded-s-md font-inter font-bold text-xs text-gray-md ${
            viewMode === "board" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleViewChange("board")}
        >
          <span>
            <RiGalleryView2 className="w-4 h-3 text-gray" />
          </span>
          {t("boardView")}
        </button>
        <button
          className={`ListView flex items-center gap-2 p-2 border border-gray border-solid font-inter font-bold text-xs text-gray-md ${
            viewMode === "list" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleViewChange("list")}
        >
          <span>
            <FaBars className="w-4 h-4 text-gray" />
          </span>
          {t("listView")}
        </button>
        <button
          className={`ListView flex items-center gap-2 p-2 border border-gray border-solid rounded-e-md font-inter font-bold text-xs text-gray-md ${
            viewMode === "timeline" ? "bg-gray-200" : ""
          }`}
          onClick={() => handleViewChange("timeline")}
        >
          <span>
            <FaBars className="w-4 h-4 text-gray" />
          </span>
          {t("timeLineView")}
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`content ${
            viewMode === "board"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
              : "flex flex-col gap-3"
          } mt-4`}
        >
          <Link
            className={`AddTask ${
              viewMode === "list"
                ? "flex items-center justify-center text-2xl"
                : "flex flex-col p-5 justify-center gap-4 items-center col-span-1 h-[286px]"
            } box bg-white   rounded-md shadow-sm p-5 `}
            // to={`/AddTask/${Task.project._id}`}
            // state={{
            //   projectId: Task.project._id,
            //   taskType: Task.type,
            //   members: Task.assignees,
            //   ParentId: Task._id,
            //   subTask: true,
            // }}
          >
            <span>
              <IoAddOutline className="w-12 h-12 text-purple" />
            </span>
            <span
              className={`text-linear font-inter font-bold  ${
                viewMode === "board" ? "text-3xl" : "text-2xl"
              } `}
            >
              {t("AddSubTask")}
            </span>
          </Link>

          {viewMode === "board" &&
            data.map((task) => {
              const avatars = task.assignees.map(
                (assignee) => assignee.profilePic || avatar
              );

              return (
                <div className="task" key={task._id}>
                  <Link
                    to={`/TaskDetails/${task._id}`}
                    state={{ taskId: task._id }}
                  >
                    <BoardView
                      ProgressValue={70}
                      NameOfTask={task.title}
                      Tagname={task?.tags?.name}
                      Tag={task.tags}
                      taskPriority={task.taskPriority}
                      status={task.taskStatus}
                      avatars={avatars}
                      filesLength={task?.documents?.length}
                      MsgLength={task?.notes?.length}
                      sDate={formatDate(task?.sDate)}
                      eDate={formatDate(task?.dueDate)}
                    />
                  </Link>
                </div>
              );
            })}

          {viewMode === "list" &&
            data.map((task) => {
              const avatars = task.assignees.map(
                (assignee) => assignee.profilePic || avatar
              );

              return (
                <div className="task" key={task._id}>
                  <Link
                    to={`/TaskDetails/${task._id}`}
                    state={{ taskId: task._id }}
                  >
                    <ListView
                      ProgressValue={70}
                      NameOfTask={task.title}
                      Tagname={task.tags.name}
                      Tag={task.tags}
                      taskPriority={task.taskPriority}
                      status={task.taskStatus}
                      avatars={avatars}
                      filesLength={2}
                      MsgLength={6}
                      sDate={formatDate(task.sDate)}
                      eDate={formatDate(task.dueDate)}
                    />
                  </Link>
                </div>
              );
            })}

          {viewMode === "timeline" && (
            <div className="TimelineViewTasks">
              {/* Render your timeline view tasks here */}
              <p>Timeline View will be here</p>
              <span>soon...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllSubTasks;
