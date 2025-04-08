import { t } from "i18next";
import { FaBars } from "react-icons/fa6";
import { RiGalleryView2 } from "react-icons/ri";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import StatusHeader from "../../../Components/StatusHeader/StatusHeader";
import { IoAddOutline } from "react-icons/io5";
import "./style.scss";
import { useEffect, useState } from "react";
import { getAllTasksPerProject } from "../../../Services/api";
import BoardView from "../../../Components/boardView/boardView";
import ListView from "../../../Components/ListView/listView";
import Loader from "../../../Components/Loader/Loader";
import { format } from "date-fns";
import avatar from "../../../assets/images/Avatar.jpg";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { TbTargetArrow } from "react-icons/tb";
import Select from "../../../Components/UI/Select/Select";
import Button from "../../../Components/UI/Button/Button";
import { Trans } from "react-i18next";

const TasksPerProject = () => {
  const { id } = useParams();
  const location = useLocation();
  const { members } = location.state || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState("board");
  const [progress, setProgress] = useState(0);

  const [open, setOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const navigate = useNavigate();
  const handleOpen = () => setOpen(!open);

  const buttonData = [
    { label: t("All"), value: "all" },
    { label: t("Waiting"), value: "waiting" },
    { label: t("working"), value: "working" },
    { label: t("completed"), value: "completed" },
    { label: t("Delayed"), value: "delayed" },
  ];

 const calculateProgress = (task) => {
   if (task?.executedQuantity && task?.requiredQuantity) {
     return Math.min(
       100,
       (task.executedQuantity / task.requiredQuantity) * 100
     );
   }
   return 0;
 };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllTasksPerProject(id, Status);
       const tasksWithProgress = data.results.map((task) => ({
         ...task,
         progress: calculateProgress(task),
       }));
       (tasksWithProgress);
       
       setData(tasksWithProgress);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, Status]);

  const handleFilterChange = (value) => {
    setStatus(value);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const handleTaskTypeChange = (value) => {
    setSelectedTaskType(value);
  };

  const task = data.map((task) => (
    task
  ))




  useEffect(() => {
    calculateProgress();
  }, [task.executedQuantity, task.requiredQuantity]);
  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "dd MMM");
  };
  return (
    <div className="AllTasks">
      <h1 className="title font-inter font-bold text-3xl text-black m-2">
        {t("ProjectTasks")}
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

      <StatusHeader buttons={buttonData} onFilterChange={handleFilterChange} />

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
          <button
            onClick={handleOpen}
            className={`AddTask box bg-white  ${
              viewMode === "list"
                ? "flex items-center justify-center text-2xl"
                : "flex flex-col p-5 justify-center gap-4 items-center col-span-1 h-[286px]"
            } rounded-md shadow-sm p-5 `}
          >
            <span>
              <IoAddOutline className="w-12 h-12 text-purple" />
            </span>
            <span
              className={`text-linear font-inter font-bold  ${
                viewMode === "board" ? "text-3xl" : "text-2xl"
              } `}
            >
              {t("AddTask")}
            </span>
          </button>
          <Dialog open={open} handler={handleOpen} className="h-[60vh]">
            <DialogHeader className="relative flex justify-center  ">
              <TbTargetArrow className="text-white absolute bg-linear_1 rounded-full  p-1 -top-7 w-16 h-16 " />
              <span className="w-4 h-4 rounded-full bg-red absolute -top-16 left-72" />
              <span className="w-4 h-4 rounded-full bg-yellow absolute -top-12 right-64" />
              <span className="w-4 h-4 rounded-full bg-green absolute  right-60" />
              <span className="w-4 h-4 rounded-full bg-gold absolute -top-3  left-60" />
            </DialogHeader>
            <DialogBody className="flex items-center flex-col">
              <span className="mx-auto text-center font-bold text-xl">
                <Trans i18nKey="The type of task you want to">
                  The type of task you want to <br /> create
                </Trans>{" "}
              </span>
              <Select
                className={"w-3/4 my-4 "}
                label={t("type")}
                id={"type"}
                options={[
                  { label: t("Table of Quantities"), value: "parent" },
                  // { label: t("Sub Task"), value: "sub" },
                  { label: t("Milestone"), value: "milestone" },
                  { label: t("Recurring Task"), value: "recurring" },
                  { label: t("One-time Task"), value: "oneTime" },
                ]}
                required
                onChange={handleTaskTypeChange}
                placeholder={t("Select type of Task")}
              />
            </DialogBody>
            <DialogFooter className="flex items-center justify-center mt-10">
              {selectedTaskType && (
                <Link
                  to={
                    selectedTaskType === "parent"
                      ? "/Requests/TableOfQuantities"
                      : `/AddTask/${id}`
                  }
                  state={{ projectId: id, taskType: selectedTaskType, members }}
                  disabled={!selectedTaskType}
                >
                  <Button>{t("AddTask")}</Button>
                </Link>
              )}
            </DialogFooter>
          </Dialog>

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
                     ProgressValue={task.progress} 
                     NameOfTask={task.title}
                      Tagname={task?.tags?.name}
                      Tag={task.tags}
                      taskPriority={task.taskPriority}
                      status={task.taskStatus}
                      parentTask={task.parentTask}
                      taskType={task.type}
                      avatars={avatars}
                      filesLength={task?.documents.length}
                      MsgLength={task?.notes.length}
                      sDate={formatDate(task.sDate)}
                      eDate={formatDate(task.dueDate)}
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
                      ProgressValue={task.progress}
                      NameOfTask={task.title}
                      Tagname={task.title}
                      taskPriority={task.taskPriority}
                      status={task.taskStatus}
                      taskType={task.type}
                      avatars={avatars}
                      filesLength={task?.documents.length}
                      MsgLength={task?.notes.length}
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

export default TasksPerProject;
