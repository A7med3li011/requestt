import { t } from "i18next";
import React, { useEffect, useState } from "react";
import Input from "../../../Components/UI/Input/Input";
import { MdCalendarToday, MdEditSquare } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { CircularProgress } from "@mui/joy";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import Loader from "../../../Components/Loader/Loader";
import { getAllUnits, getTaskDetails, updateTask } from "../../../Services/api";
import avatar from "../../../assets/images/avatar1.png";
import Button from "../../../Components/UI/Button/Button";
import { AddNote } from "../../../Components/AddNote/AddNote";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Image } from "../../../Components/UI/Image/image";
import ProfileAvatar from "../../../Components/UI/profilePic/profilePic";
const TaskDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const { taskId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [Task, setTask] = useState({});
  const [initialTask, setInitialTask] = useState({});
  const [IsToq, setIsToq] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsToq(Task.type === "toq");
  }, [Task.type]);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const [taskData] = await Promise.all([getTaskDetails(taskId)]);
        setTask(taskData.results);
        setInitialTask(taskData.results);
      } catch (error) {
        console.error("Error fetching Task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);
  // console.log(Task.project._id)

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const getUpdatedFields = () => {
    const updatedFields = {};

    // Compare each field in Task with the initialTask to detect changes
    if (Task.executedQuantity !== initialTask.executedQuantity) {
      updatedFields.executedQuantity = Task.executedQuantity;
    }
    if (Task.invoicedQuantity !== initialTask.invoicedQuantity) {
      updatedFields.invoicedQuantity = Task.invoicedQuantity;
    }
    if (Task.approvedQuantity !== initialTask.approvedQuantity) {
      updatedFields.approvedQuantity = Task.approvedQuantity;
    }
    if (progress !== initialTask.progress) {
      updatedFields.progress = progress;
    }

    return updatedFields;
  };

  const handleSave = async () => {
    try {
      const updatedFields = getUpdatedFields();
      ("updatedFields", updatedFields);

      const res = await updateTask(token, taskId, user._id, updatedFields);

      setIsEditing(false);
      ("res from update task => ", res);
      toast.success(t("toast.TaskSavedSuccess"));
      const updatedTask = await getTaskDetails(taskId);
      setTask(updatedTask.results);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleInputChange = (e, field) => {
    const value =
      field === "invoicedQuantity" ||
      field === "executedQuantity" ||
      field === "approvedQuantity"
        ? Number(e.target.value)
        : e.target.value;

    setTask({ ...Task, [field]: value });
  };

  const calculateProgress = (task) => {
    if (Task.executedQuantity && Task.requiredQuantity) {
      const progressValue = Math.min(
        100,
        (Task.executedQuantity / Task.requiredQuantity) * 100
      );
      setProgress(progressValue);
    } else {
      setProgress(0);
    }
  };

  useEffect(() => {
    calculateProgress();
  }, [Task.executedQuantity, Task.requiredQuantity]);

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yyyy");
  };

  if (loading) {
    return (
      <div className="loader flex items-center justify-center m-auto">
        <Loader />
      </div>
    );
  }

  const assignee = Task.assignees && Task.assignees[0];

  return (
    <div className="TaskDetails mx-1">
      <div className="header m-2 flex justify-between items-center">
        <div className="">
          <h1 className="title font-inter font-bold text-3xl text-black ">
            {Task.title}
          </h1>
          <div className="sData">
            <span className="text-purple text-sm font-medium">
              {t("task started:")}
            </span>
            <span
              className="text-sm  font-semibold mx-1"
              style={{
                color: "#A9B1BF",
              }}
            >
              {formatDate(Task.sDate)}
            </span>
          </div>
        </div>
        <Link
          to={`/TaskHistory/${Task._id}`}
          state={{
            taskId: Task._id,
          }}
          className="underline underline-offset-1  text-gray "
        >
          {t("view all history")}
        </Link>
      </div>

      <div className="wrapper bg-white grid grid-cols-2 rounded-3xl m-2 ">
        <div className="box relative col-span-2 lg:col-span-1 flex justify-center items-center">
          <div className="analytics_box rounded-md shadow-sm p-8 flex flex-col gap-3 items-center">
            {Task.tags && Task.tags !== null && (
              <span
                className="font-inter font-semibold text-base text-center py-1 px-6 w-full rounded-2xl m-2"
                style={{
                  background: `${Task.tags.colorCode}40`,
                  color: Task.tags.colorCode,
                }}
              >
                {Task.tags.name}
              </span>
            )}
            {IsToq && (
              <div className="progress_wrapper rounded-2xl shadow-md p-8 relative">
                <span className="absolute top-1 font-inter font-extrabold text-xs leading-4 my-1 ">
                  Progress
                </span>
                <CircularProgress
                  className="!text-black font-poppins font-normal text-4xl"
                  determinate
                  sx={{
                    "--CircularProgress-size": "180px",
                    "--CircularProgress-trackThickness": "30px",
                    "--CircularProgress-progressThickness": "30px",
                    "--CircularProgress-animationDuration": "1s",
                    "--CircularProgress-trackColor": "#F5F5F5",
                    "--CircularProgress-progressColor": "var(--purple)",
                    "--CircularProgress-trackShadowColor":
                      "rgba(0, 0, 0, 0.12)",
                    "--CircularProgress-progressShadowColor":
                      "rgba(0, 0, 0, 0.12)",
                    "--CircularProgress-trackBorderRadius": "50%",
                    "--CircularProgress-progressBorderRadius": "50%",
                    "--CircularProgress-trackShadowBlur": "10px",
                    "--CircularProgress-progressShadowBlur": "10px",
                    "--CircularProgress-progressShadowOffset": "0px 2px",
                  }}
                  value={progress}
                  variant="solid"
                >
                  {`${Math.round(progress)}%`}
                </CircularProgress>
              </div>
            )}
            <div className="status_wrapper flex flex-col">
              <span
                className="Tag px-14 py-2 w-full  rounded-3xl font-inter font-semibold text-sm mt-2"
                style={{
                  background: "#FFDD9533",
                  color: "#CA8A04",
                }}
              >
                {Task.taskStatus === "working"
                  ? "Working On It"
                  : "waiting"
                  ? "Waiting For Review"
                  : "Ended"
                  ? "Completed"
                  : Task.taskStatus}
              </span>
              <span
                className={`Tag ${Task.taskPriority} px-14 py-2 w-full  rounded-3xl font-inter font-semibold text-sm mt-2 text-center`}
              >
                {Task.taskPriority}
              </span>
            </div>
          </div>
        </div>
        <div className="form m-3 col-span-2 lg:col-span-1 lg:mr-24">
          <Input
            type={"name"}
            required={true}
            className="bg-white border border-purple border-solid"
            label={t("TaskName")}
            placeholder={Task.title}
            disabled
          />
          <Input
            disabled
            required={true}
            className="bg-white border border-purple border-solid"
            label={t("sDate")}
            placeholder={formatDate(Task.sDate)}
            inputIcons={{
              element: <MdCalendarToday />,
              type: "calendar",
            }}
            iconClass={"text-yellow"}
          />
          <Input
            disabled
            required={true}
            className="bg-white border border-purple border-solid"
            label={t("dDate")}
            placeholder={formatDate(Task.dueDate)}
            inputIcons={{
              element: <MdCalendarToday />,
              type: "calendar",
            }}
            iconClass={"text-yellow"}
          />
          {Task.createdBy && (
            <div className="Tasksetter my-2">
              <p className="font-inter font-bold text-sm leading-4 my-2">
                {t("Tasksetter")}
              </p>
              <div className="flex justify-between items-center gap-1 border border-purple rounded-lg py-1  px-2">
                <div className="flex items-center gap-5">
                  <ProfileAvatar
                    className="h-8 w-8 rounded-full"
                    src={Task?.createdBy?.profilePic}
                    name={Task?.createdBy?.name}
                    alt="Tasksetter"
                  />

                  <span className="font-inter font-medium text-base">
                    {Task?.createdBy?.name}
                  </span>
                </div>

                <span className="font-inter font-medium text-base">
                  {Task?.createdBy?.role?.name}
                </span>
              </div>
            </div>
          )}

          {assignee && (
            <div className="Responsible my-2">
              <p className="font-inter font-bold text-sm leading-4 my-2">
                {t("Responsible Person")}
              </p>
              <div className="flex justify-between items-center gap-1 border border-purple rounded-lg py-1  px-2">
                <div className="flex items-center gap-5">
                  <ProfileAvatar
                    className="h-8 w-8 rounded-full"
                    src={assignee?.profilePic}
                    name={assignee?.name}
                    alt="Tasksetter"
                  />

                  <span className="font-inter font-medium text-base">
                    {assignee.name}
                  </span>
                </div>
                {assignee.role && (
                  <span className="font-inter font-medium text-base">
                    {assignee?.role?.name}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex right-0 my-2 items-center justify-end">
            {IsToq && (
              <button onClick={handleEditToggle}>
                <MdEditSquare className="text-purple h-7 w-7" />
              </button>
            )}
            <button className="files flex items-center gap-1 mx-1">
              <span className="text-purple-dark font-inter font-extrabold text-sm leading-4">
                {Task?.documents?.length}
              </span>
              <FaFileLines className="text-purple-dark h-7 w-7" />
            </button>

            <AddNote taskId={Task?._id} projectId={Task?.project?._id} Notes={Task.notes} />
          </div>
          {/* {IsToq && Task.parentTask === null && ( */}
          {isEditing ? (
            <div className="btn flex items-center justify-center md:justify-end my-3">
              <Button onClick={handleSave}>{t("save")}</Button>
            </div>
          ) : (
            Task.parentTask === null && (
              <div className="flex right-0 my-2 items-center gap-3 justify-end">
                <Link
                  to={`/AddTask/${Task.project._id}`}
                  state={{
                    projectId: Task.project._id,
                    taskType: Task.type,
                    members: Task.assignees,
                    ParentId: Task._id,
                    subTask: true,
                  }}
                >
                  <Button className="w-fit px-7">{t("AddSubTask")}</Button>
                </Link>

                <Link
                  to={`/SubTasks/${Task._id}`}
                  state={{
                    projectId: Task.project._id,
                    taskType: Task.type,
                    members: Task.assignees,
                    ParentId: Task._id,
                    taskId: Task._id,
                  }}
                >
                  <Button
                    className="w-fit px-7 border border-solid !border-purple !text-purple"
                    style={{ background: "white" }}
                  >
                    {t("AllSubTasks")}
                  </Button>
                </Link>
              </div>
            )
          )}
          <div className="flex right-0 my-2 items-center gap-3 justify-end">
            <Link
              to={"/ViewAllModels"}
              state={{
                projectId: Task?.project?._id,
                taskId: Task._id,
                TaskName: Task.title,
              }}
            >
              <Button className="w-fit ">{t("All models")}</Button>
            </Link>

            {/* <Button
              className="w-fit px-7 border border-solid !border-purple !text-purple"
              style={{ background: "white" }}
            >
              approve models
            </Button> */}
          </div>
        </div>

        {/*  parentTask.type === parent (task.parentTask.parentTask === null) && IsToq */}
        {IsToq && (
          <div className="grid col-span-2 grid-cols-4 gap-3 m-2">
            <Input
              type="number"
              min={0}
              value={Task?.price}
              disabled
              label={t("Price")}
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid
                    `}
            />
            <Input
              type="number"
              min={0}
              label={t("Quantity")}
              value={Task?.requiredQuantity}
              disabled
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
            />
            <Input
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
              label={t("Total")}
              type="number"
              min={0}
              value={Task?.total}
              disabled
            />
            {/* <Select
              placeholder={t("Unit")}
              label={t("Unit")}
              value={Task.unit.name}
              className={`bg-white mx-4`}
            /> */}
            <Input
              type="text"
              label={t("Unit")}
              value={Task?.unit?.name}
              disabled
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
            />
            <Input
              type="number"
              min={0}
              max={Task.requiredQuantity}
              label={t("Executed quantity")}
              value={Task.executedQuantity}
              disabled={!(isEditing && user.role.jobTitle === "contractor")}
              onChange={(e) => handleInputChange(e, "executedQuantity")}
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
            />
            <Input
              type="number"
              min={0}
              max={Task.requiredQuantity}
              label={t("Approved quantity")}
              value={Task.approvedQuantity}
              onChange={(e) => handleInputChange(e, "approvedQuantity")}
              disabled={!(isEditing && user.role.jobTitle === "consultant")}
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
            />

            <Input
              type="number"
              min={0}
              max={Task.requiredQuantity}
              label={t("invoiced quantity")}
              value={Task.invoicedQuantity}
              disabled={!(isEditing && user.role.jobTitle === "owner")}
              onChange={(e) => handleInputChange(e, "invoicedQuantity")}
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
            />
          </div>
        )}
      </div>
      <div className="desc">
        <h6 className="title m-2 ">{t("desc")}</h6>
        <div className="bg-white rounded-3xl m-2">
          <div
            className="content px-4 py-4 font-normal text-base "
            style={{
              color: "#A9B1BF",
            }}
          >
            {Task.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
