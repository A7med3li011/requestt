import { t } from "i18next";
import { useEffect, useState } from "react";
import Input from "../../../Components/UI/Input/Input";
import { MdCalendarToday, MdEdit } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { IoAddOutline, IoPrint } from "react-icons/io5";
import { FaCommentMedical } from "react-icons/fa6";
import { CircularProgress } from "@mui/joy";
import { CircularProgress as CircularProgressbar } from "@mui/material";

import {
  getAllTagsByProject,
  getProjectDetails,
  getProjectTagProgress,
} from "../../../Services/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { BiTask } from "react-icons/bi";
import { Box } from "@mui/material";
import avatar from "../../../assets/images/Avatar.jpg";
import Loader from "../../../Components/Loader/Loader";
import { AddNote } from "../../../Components/AddNote/AddNote";
import { useSelector } from "react-redux";
import { IoMdPersonAdd } from "react-icons/io";
import Button from "../../../Components/UI/Button/Button";
import { TagsChart } from "../../../Components/TagsChart/TagsChart";
import i18next from "i18next";
import { Image } from "../../../Components/UI/Image/image";
import ProfileAvatar from "../../../Components/UI/profilePic/profilePic";
import Select from "../../../Components/UI/Select/Select";
import axios from "axios";
import { toast } from "react-toastify";

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

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, projectName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("Delete Project")}
          </h3>
          <p className="text-sm text-black mb-6">
            {t("Are you sure you want to delete")} "{projectName}"? {t("This action cannot be undone")}.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-rose-600 bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              {t("Delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [Project, setProject] = useState({});
  const [Owner, setOwner] = useState({});
  const [name, setName] = useState("");
  const [Contractor, setContractor] = useState([]);
  const [tags, setTags] = useState({});
  const [status, setStatus] = useState(Project?.status);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const location = useLocation();
  const { projectId } = location.state || {};
  const lang = i18next.language;
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  async function deleteProject() {
    await axios
      .delete(`${import.meta.env.VITE_API_URL}project/${projectId}`)
      .then((res) => {
        toast.success(t("messageDelete"))
        navigate("/Projects")
      })
      .catch((err) => console.log(err));
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    deleteProject();
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const [ProjectData, tagsData] = await Promise.all([
          getProjectDetails(projectId),
          getProjectTagProgress(projectId, lang),
        ]);

        setProject(ProjectData?.results);
        setOwner(ProjectData?.results?.owner);
        setContractor(
          ProjectData?.results?.contractor
            ? ProjectData?.results?.contractor[0]
            : ""
        );
        setTags(tagsData?.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "dd MMM");
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  async function updateProjectStatus() {
    await axios
      .put(`${apiUrl}project`, {
        projectId,
        status,
        name,
      })
      .then((res) => setToggle(false))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    updateProjectStatus();
  }, [status]);

  return (
    <div className="ProjectDetails mx-1">
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h1 className="title font-inter font-bold text-3xl text-black m-2">
              {t("ProjectDetails")}
            </h1>
            <Link
              to={`/Project/Tasks/${projectId}`}
              state={{ members: Project.members }}
            >
              <button
                className="bg-white  flex items-center gap-2"
                style={{
                  borderRadius: "18px",
                  padding: "9px 8px 9px 8px",
                  color: "#515151",
                }}
              >
                <span>
                  <BiTask className="w-8 h-8  text-red" />
                </span>
                <span className="underline underline-offset-2 font-jost text-base font-normal leading-6 ">
                  {t("view all tasks")}
                </span>
              </button>
            </Link>
          </div>
          <div className="boxes grid grid-cols-1 lg:grid-cols-3 gap-2 m-2 p-2">
            <div
              className={`desc  ${
                user?.plan?.name === "RequestPlus" ? "col-span-1" : "col-span-3"
              } `}
            >
              <div className="desc_content bg-linear_1 text-white py-3 px-6 rounded-3xl   capitalize text-center">
                <p className="font-inter font-normal text-lg   leading-6  ">
                  {Project.description}
                </p>
              </div>
            </div>

            {user?.access?.edit == true && (
              <div>
                {(Project?.consultant?._id == user._id ||
                  Project?.owner?._id == user._id) && (
                  <div className="p-4">
                    <Select
                      isClearable={false}
                      label="Status"
                      id="status"
                      options={allStatus.map(({ value, name }) => ({
                        value,
                        label: t(name), // react-select expects label instead of name
                      }))}
                      value={status}
                      onChange={(val) => setStatus(val)}
                      placeholder={`${t(status) || t(Project?.status)}`}
                    />
                  </div>
                )}
              </div>
            )}
            {user?.access?.edit == true && (
              <div className="col-start-3 row-start-2">
                {(Project?.consultant?._id == user._id ||
                  Project?.owner?._id == user._id) && (
                  <div className="p-4 pt-10 ">
                    <button
                      onClick={handleDeleteClick}
                      className="py-[10px] px-4 text-center text-white rounded-xl  bg-linear_1 w-full"
                    >
                      {t("DELETEPROJECT")}
                    </button>
                  </div>
                )}
              </div>
            )}
            {user?.plan?.name === "RequestPlus" && (
              <>
                <div className="fullBudget  col-span-1  h-[140px]  relative w-full  bg-white  p-6 rounded-3xl">
                  <p
                    className="font-inter font-bold text-2xl absolute top-4 ltr:left-4  rtl:right-4 col-span-1"
                    style={{ color: "#81D4C2" }}
                  >
                    {t("fullBudget")}
                  </p>
                  <span className="font-inter font-bold text-xl absolute bottom-4 ltr:right-4  rtl:left-4 col-span-1">
                    {Project.budget}
                  </span>
                </div>
                <div className="Remaining col-span-1 h-[140px]  bg-white relative w-full   p-6 rounded-3xl">
                  <p className="font-inter font-bold text-2xl text-purple absolute top-4 ltr:left-4  rtl:right-4 ">
                    {t("Remaining")}
                  </p>
                  <span className="font-inter font-bold text-xl absolute bottom-4 ltr:right-4  rtl:left-4">
                    {Project.remaining}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="team flex items-center justify-between my-2 mx-3">
            <h5 className="Team font-bold text-2xl  ">{t("Team")}</h5>
            <div className="avatars flex items-center  -space-x-2">
              {Project.members && Project.members.length > 0 ? (
                <>
                  {Project.members.length > 5 && (
                    <span
                      className="w-8 h-8 text-black font-semibold rounded-full flex items-center justify-center m-1 "
                      title={`${Project.members.length - 5} more members`}
                    >
                      +{Project.members.length - 5}
                    </span>
                  )}
                  {Project?.members?.map((member, index) => (
                    <Link
                      to="/ProjectTeam"
                      state={{ projectId: Project._id }}
                      key={index}
                      className="avatar-container w-10 h-10 ring-2 ring-white inline-block rounded-full overflow-hidden"
                      title={member.name}
                    >
                      <ProfileAvatar
                        profilePic={member?.profilePic}
                        name={member?.name}
                        alt={`${member?.name}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  ))}
                </>
              ) : (
                <p className="mx-2">{t("No Team Members")}</p>
              )}
              <Link
                to={"/ProjectTeam"}
                state={{ projectId: Project._id }}
                className="w-10 h-10 rounded-full  flex justify-center items-center "
                style={{
                  background: "#444D61",
                }}
              >
                <span>
                  <IoAddOutline className="w-6 h-6 text-white" />
                </span>
              </Link>
            </div>
          </div>
          <div className="wrapper bg-white grid grid-cols-2 rounded-3xl m-2 ">
            <div className="box col-span-2 lg:col-span-1 relative flex flex-col ">
              <div className="head flex items-center  justify-between  my-3 mx-4">
                <div className="flex items-center flex-wrap  gap-x-5">
                  <h5 className="font-bold  text-2xl ">
                    {name || Project.name}
                  </h5>
                  <button
                    onClick={() => {
                      setToggle((prev) => !prev);
                    }}
                    className="text-lg"
                  >
                    <MdEdit />
                  </button>
                </div>
                <p className="font-semibold  text-sm">{t("Architecture")}</p>
              </div>
              {toggle && (
                <div className="w-full px-3  flex justify-between items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="py-2 px-4  rounded-lg border-[1px] border-black  me-2 focus:outline-none"
                    placeholder={`${t("ProjectName")}`}
                  />
                  <button
                    onClick={updateProjectStatus}
                    className="bg-linear_1 text-white py-2  px-3 rounded-lg block ms-auto"
                  >
                    {t("Confirm")}
                  </button>
                </div>
              )}
              <div className="analytics_box rounded-md shadow-md p-8 flex flex-col gap-3  mt-4 mb-4 mx-4 ">
                <div
                  className={`progress_wrapper flex flex-col lg:flex-row items-center gap-2 rounded-2xl shadow-md p-8 relative ${
                    user?.plan?.name === "RequestPlus"
                      ? "lg:justify-between"
                      : "lg:justify-center"
                  }`}
                >
                  {user?.plan?.name === "RequestPlus" && (
                    <div className="Progress">
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
                        value={Project?.progress}
                        variant="solid"
                      >
                        {Math.round(Project?.progress)}%
                      </CircularProgress>
                    </div>
                  )}

                  <div className="tags relative">
                    <span className="absolute -top-5 font-inter font-extrabold text-xs leading-4 my-1 ">
                      {t("Tags")}
                    </span>

                    <TagsChart tags={tags} />
                  </div>
                </div>

                <div className="Badges flex items-center  justify-around gap-2">
                  <span
                    className={`${Project.status} w-full capitalize text-center py-2 rounded-3xl font-inter font-semibold text-sm mt-2`}
                  >
                    {t(status || Project.status)}
                  </span>
                  <span
                    className={`${Project.projectPriority} w-full capitalize text-center py-2 rounded-3xl font-inter font-semibold text-sm mt-2`}
                  >
                    {t(Project.projectPriority)}
                  </span>
                </div>
                {tags && tags.length > 0 && (
                  <div className="Tags flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="tag-item flex items-center gap-1 px-3 py-1 rounded-full"
                      >
                        <span
                          className="w-4  h-4  rounded-sm"
                          style={{
                            backgroundColor: tag.colorCode || "#D3D3D3",
                          }}
                        />
                        <span className="text-black font-semibold text-xs">
                          {tag.tagName || "Unknown Tag"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form m-3 col-span-2 lg:col-span-1 lg:mr-24 ">
              <Input
                disabled
                required={true}
                className="bg-white border border-purple border-solid "
                label={t("sDate")}
                placeholder={formatDate(Project.sDate)}
                inputIcons={{
                  element: <MdCalendarToday />,
                  type: "calendar",
                }}
                iconClass={"text-yellow"}
              />
              <Input
                disabled
                required={true}
                className="bg-white border border-purple border-solid "
                label={t("dDate")}
                placeholder={formatDate(Project.dueDate)}
                inputIcons={{
                  element: <MdCalendarToday />,
                  type: "calendar",
                }}
                iconClass={"text-yellow"}
              />
              {Project.owner && (
                <Input
                  disabled
                  type={"name"}
                  required={true}
                  className="bg-white border border-purple border-solid "
                  label={t("owner")}
                  placeholder={Project?.owner?.name || "N/A"}
                />
              )}
              {Project.contractor && (
                <Input
                  disabled
                  type={"name"}
                  required={true}
                  className="bg-white border border-purple border-solid "
                  label={t("contractor")}
                  placeholder={Project?.contractor?.name || "N/A"}
                />
              )}
              <Input
                disabled
                // value={Project.location}
                type={"name"}
                required={true}
                className="bg-white border border-purple border-solid "
                label={t("location")}
                placeholder={Project.location || t("location")}
              />
              {user?.access?.edit == true && (
                <div className="flex right-0 my-2 items-center justify-end">
                  <Link
                    to={"/AddProject/Invite"}
                    state={{
                      projectId: Project._id,
                      projectName: Project.name,
                      fromProject: true,
                    }}
                  >
                    <span>
                      <IoMdPersonAdd className="text-red h-8 w-8 " />
                    </span>
                  </Link>
                  {/* <button className="files flex items-center gap-1 mx-1">
                  <span className="text-purple-dark font-inter font-extrabold text-sm leading-4">
                    {Project?.documentsLength || 0}
                  </span>
                  <FaFileLines className="text-purple-dark h-7 w-7 " />
                </button> */}
                  <AddNote projectId={Project._id} Notes={Project.notes} />
                  <button className="print mx-1">
                    <span>
                      <IoPrint className="h-7 w-7 text-yellow" />
                    </span>
                  </button>
                </div>
              )}
              <div className="flex flex-wrap right-0 my-2 items-center gap-3 justify-end">
                {/* <Button
                  className="w-fit px-7 border border-solid !border-purple !text-purple"
                  style={{ background: "white" }}
                >
                  approve models
                </Button> */}
                <Link
                  to={"/ViewAllModels"}
                  state={{
                    projectId: Project._id,
                    projectName: Project.name,
                  }}
                >
                  <Button className="w-fit ">{t("All models")}</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            projectName={Project.name}
          />
        </>
      )}
    </div>
  );
};

export default ProjectDetails;