import { t } from "i18next";
import React, { useEffect, useState } from "react";
import Input from "../../../Components/UI/Input/Input";
import { MdCalendarToday, MdEditSquare } from "react-icons/md";
// import { FaFileLines } from "react-icons/fa6";
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
import Select from "../../../Components/UI/Select/Select";
import axios from "axios";
import { FaFileLines } from "react-icons/fa6";
const allStatus = [
  {
    value: "working",
    name: "working",
  },
  {
    value: "completed",
    name: "completed",
  },
  {
    value: "delayed",
    name: "delayed",
  },
  {
    value: "waiting",
    name: "waiting",
  },
];
const TaskDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const { taskId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [allDocs, setllDocs] = useState([]);
  const [Task, setTask] = useState({});
  const [initialTask, setInitialTask] = useState({});
  const [IsToq, setIsToq] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(Task?.taskStatus);
  const [doc, setDoc] = useState(null);
  const [progress, setProgress] = useState(0);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setDoc(file);
      // you can do something with the file here (upload, preview, etc.)
    }

    const formData = new FormData();
    formData.append("status", "pending");
    formData.append("uploadedBy", user._id);
    formData.append("comment", "file");
    formData.append("task", Task._id);
    formData.append("document", file);

    await axios
      .post(`${import.meta.env.VITE_API_URL}docs`, formData)
      .then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
        } else {
          toast.success("file uploaded ");
        }
      })
      .catch((err) => console.log(err));
  };
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  async function updateTaskStatus(val) {
    await axios
      .put(`https://api.request-sa.com/api/v1/task?lang=ar`, {
        taskId,
        status: val,
      })

      .catch((err) => console.log(err));
  }

  async function geyallDocs() {
    await axios
      .get(`${import.meta.env.VITE_API_URL}docs/task/${taskId}`)
      .then((res) => setllDocs(res?.data?.data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    geyallDocs();
  }, [taskId]);

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
      "updatedFields", updatedFields;

      const res = await updateTask(token, taskId, user._id, updatedFields);

      setIsEditing(false);
      "res from update task => ", res;
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
    console.log("progressValue");
    let progressValue = 0;
    if (Task.approvedQuantity && Task.requiredQuantity) {
      progressValue = Math.min(
        100,
        (Task.approvedQuantity / Task.requiredQuantity) * 100
      );
    } else {
      setProgress(0);
    }

    return progressValue;
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
      {(Task?.project?.consultant == user._id ||
        Task?.project?.owner == user._id) && (
        <div>
          {user?.access?.edit == true && (
            <Select
              isClearable={false}
              label="Status"
              id="status"
              options={allStatus.map(({ value, name }) => ({
                value,
                label: t(name), // react-select expects label instead of name
              }))}
              value={status}
              onChange={(val) => {
                setStatus(val);
                updateTaskStatus(val);
              }}
              placeholder={`${t(status) || t(Task.taskStatus)}`}
            />
          )}
        </div>
      )}
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
                  {t("Progress")}
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
                  value={
                    status == "completed"
                      ? 100
                      : Math.floor(
                          Math.min(
                            100,
                            (Task?.approvedQuantity / Task?.requiredQuantity) *
                              100
                          )
                        )
                  }
                  variant="solid"
                >
                  {`${
                    status == "completed"
                      ? "100"
                      : Math.floor(
                          Math.min(
                            100,
                            (Task?.approvedQuantity / Task?.requiredQuantity) *
                              100
                          )
                        )
                  }%`}
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
                {t(status || Task?.taskStatus)}
              </span>
              <span
                className={`Tag ${Task.taskPriority} px-14 py-2 w-full  rounded-3xl font-inter font-semibold text-sm mt-2 text-center`}
              >
                {t(Task.taskPriority)}
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
                {/* {Task?.documents?.length} */}
              </span>

              <label htmlFor="fille">
                <FaFileLines className="text-purple-dark h-7 w-7" />
              </label>
              <input
                id="fille"
                hidden
                type="file"
                onChange={handleFileChange}
              />
            </button>

            <AddNote
              taskId={Task?._id}
              projectId={Task?.project?._id}
              Notes={Task.notes}
            />
          </div>
          {/* {IsToq && Task.parentTask === null && ( */}
          {isEditing ? (
            <div className="btn flex items-center justify-center md:justify-end my-3">
              <Button onClick={handleSave}>{t("save")}</Button>
            </div>
          ) : (
            Task.parentTask === null && (
              <div className="flex right-0 my-2 items-center gap-3 justify-end">
                {user?.access?.create == true && (
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
                )}

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
              disabled={
                !(
                  isEditing &&
                  user?.role?.jobTitle === "contractor" &&
                  user?.access?.edit == true
                )
              }
              onChange={(e) => {
                if (+e.target.value > Task?.requiredQuantity) {
                  return;
                } else {
                  handleInputChange(e, "executedQuantity");
                }
              }}
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
            />
            <Input
              type="number"
              min={0}
              max={Task.requiredQuantity}
              label={t("Approved quantity")}
              value={Task.approvedQuantity}
              onChange={(e) => {
                if (
                  +e.target.value > Task?.requiredQuantity ||
                  +e.target.value > Task?.executedQuantity
                ) {
                  return;
                } else {
                  handleInputChange(e, "approvedQuantity");
                }
              }}
              disabled={
                !(
                  isEditing &&
                  user?.role?.jobTitle === "consultant" &&
                  user?.access?.edit == true
                )
              }
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid`}
            />

            <Input
              type="number"
              min={0}
              max={Task.requiredQuantity}
              label={t("invoiced quantity")}
              value={Task.invoicedQuantity}
              disabled={
                !(
                  isEditing &&
                  user?.role?.jobTitle === "owner" &&
                  user?.access?.edit == true
                )
              }
              onChange={(e) => {
                if (+e.target.value > Task?.requiredQuantity) {
                  return;
                } else {
                  handleInputChange(e, "invoicedQuantity");
                }
              }}
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

      {/* Files Section */}
      <div className="files-section">
        <h6 className="title m-2">{t("Uploaded Files")}</h6>
        <div className="bg-white rounded-3xl m-2">
          {allDocs && allDocs.length > 0 ? (
            <div className="files-grid p-4 grid gap-4 grid-cols-1 lg  xl:grid-cols-2">
              {allDocs.map((doc, index) => (
                <div
                  key={doc._id}
                  className="file-item bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  style={{ transition: "all 0.2s ease", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.transform = "translateY(0)")
                  }
                >
                  {/* File Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="file-icon bg-purple-100 p-2 rounded-lg">
                        <FaFileLines className="text-purple h-5 w-5" />
                      </div>
                      <div className="file-info">
                        <h4 className="font-inter font-semibold text-sm text-gray-800 truncate max-w-xs">
                          {doc.path.split("/").pop().replace(/^\d+-/, "")}
                        </h4>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium mt-1 ${
                            doc.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : doc.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {t(doc.status)}
                        </span>
                      </div>
                    </div>

                    {/* Download/View Button */}
                    <button
                      onClick={() =>
                        window.open(
                          `https://api.request-sa.com/${doc.path}`,
                          "_blank"
                        )
                      }
                      className="text-purple hover:text-purple-dark transition-colors duration-200 p-1"
                      title={t("View File")}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Uploader Info */}
                  <div className="uploader-info flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <ProfileAvatar
                        className="h-6 w-6 rounded-full"
                        profilePic={doc.uploadedBy?.profilePic}
                        name={doc.uploadedBy?.name || "Unknown"}
                        alt="Uploader"
                      />
                      <span className="font-medium">
                        {doc.uploadedBy?.name || t("Unknown User")}
                      </span>
                      {/* {doc.uploadedBy?.role && (
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {doc.uploadedBy.role.jobTitle}
                        </span>
                      )} */}
                    </div>

                    {/* Upload Date */}
                    <span className="text-xs text-gray-500">
                      {formatDate(doc.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-files p-8 text-center text-gray-500">
              <FaFileLines className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-inter text-base">
                {t("No files uploaded yet")}
              </p>
              <p className="font-inter text-sm mt-1">
                {t("Upload files using the file icon above")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
