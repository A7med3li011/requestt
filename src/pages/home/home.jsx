import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiGalleryView2 } from "react-icons/ri";
import { FaBars } from "react-icons/fa6";
import Loader from "../../Components/Loader/Loader";
import Empty from "../../Components/empty/empty";
import BoardView from "../../Components/boardView/boardView";
import header from "../../assets/images/Project1.png";
import avatar from "../../assets/images/Avatar.jpg";

import { getAllProjectsForUser, getAnalysis } from "../../Services/api";
import "./style.scss";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { Typography } from "@material-tailwind/react";
import { MdAlarmAdd } from "react-icons/md";
import { RiProgress4Line } from "react-icons/ri";
import ListView from "../../Components/ListView/listView";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
 
  const token = useSelector((state) => state.auth.token);
  const userId = user?._id;



  const [data, setData] = useState({ results: [] });
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("board");
     
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const analysisData = await getAnalysis(userId);
        setAnalysis(analysisData);
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [userId]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projectsData = await getAllProjectsForUser(userId, token);
        setData(projectsData);
        (projectsData);
      } catch (error) {
        console.error("Error fetching projects data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId, token]);
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

 const formatDate = (date) => {
   if (!date) return "";
   return format(new Date(date), "dd MMM");
 };  
  
  // Filter projects that have tasks more than 0
  const filteredProjects = data?.results?.filter(
    (project) => project.tasks && project.tasks.length > 0
  );

  return (
    <div className="home">
      {/* Header */}
      {loading ? (
        <div className="Loader m-auto flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="header grid grid-cols-8 gap-2">
            <div className="box col-span-8 md:col-span-5 lg:col-span-6 bg-white rounded-3xl shadow-sm p-3 flex items-center justify-between mx-2  ">
              <div className="content">
                <h6 className="font-poppins font-normal text-lg md:text-xl text-gray-400 m-2">
                  {t("WelcomeTo")}
                </h6>
                <h5 className="font-poppins font-semibold text-lg md:text-xl lg:text-2xl text-purple-dark m-2">
                  {t("YourTaskManagementArea")}
                </h5>
                <p className="font-poppins font-light text-xs md:text-sm leading-5 m-2 text-gray-400-md">
                  {t("headerDesc")}
                </p>
                {/* <button className="mt-3 mx-2 text-white font-Poppins py-3 px-5 rounded-3xl capitalize border bg-linear_1 text-sm md:text-base font-medium text-left">
                  {t("LearnMore")}
                </button> */}
              </div>
              <div className="image">
                <img
                  src={header}
                  alt="Project Header"
                  height={180}
                  width={245}
                />
              </div>
            </div>
            <div className="col-span-8 md:col-span-3 lg:col-span-2 grid grid-cols-2 gap-3">
              <div className="col-span-1 flex flex-col justify-center items-center gap-5">
                <div className="box bg-linear_2 w-full py-4 px-2 rounded-3xl text-white flex items-center justify-center gap-1">
                  <span className="icon bg-white w-8 h-8 rounded-full flex justify-center items-center">
                    <IoMdCheckmarkCircleOutline className="text-red" />
                  </span>
                  <div className="flex flex-col font-poppins font-normal">
                    <span className="text-xl leading-6">
                      {analysis.totalTasks || 0}
                    </span>
                    <p className="text-xs leading-4">{t("totalTasks")}</p>
                  </div>
                </div>
                <div className="box bg-linear_4 w-full py-4 px-2 rounded-3xl text-white flex items-center justify-center gap-1">
                  <span className="icon bg-white w-8 h-8 rounded-full flex justify-center items-center">
                    <MdAlarmAdd className="text-red" />
                  </span>
                  <div className="flex flex-col font-poppins font-normal">
                    <span className="text-xl leading-6">
                      {analysis.delayedTasks || 0}
                    </span>
                    <p className="text-xs leading-4">{t("delayed")}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-1 flex flex-col justify-center items-center gap-3">
                <div className="box bg-linear_3 w-full py-4 px-2 rounded-3xl text-white flex items-center justify-center gap-1">
                  <span className="icon bg-white w-8 h-8 rounded-full flex justify-center items-center">
                    <RiProgress4Line className="text-green" />
                  </span>
                  <div className="flex flex-col font-poppins font-normal">
                    <span className="text-xl leading-6">
                      {analysis.inProgressTasks || 0}
                    </span>
                    <p className="text-xs leading-4">{t("inProgress")}</p>
                  </div>
                </div>
                <div className="box bg-linear_5 w-full py-4 px-2 rounded-3xl text-white flex items-center justify-center gap-1">
                  <span className="icon bg-white w-8 h-8 rounded-full flex justify-center items-center">
                    <IoMdCheckmarkCircleOutline className="text-yellow" />
                  </span>
                  <div className="flex flex-col font-poppins font-normal">
                    <span className="text-xl leading-6">
                      {analysis.completedTasks || 0}
                    </span>
                    <p className="text-xs leading-4">{t("completed")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="GroupBtn flex items-center  mx-2 my-4">
              <button
                onClick={() => handleViewChange("board")}
                className="BoardView flex items-center gap-2 p-2 border border-gray border-solid rounded-s-md font-inter font-bold text-xs text-gray-400-md"
              >
                <span>
                  <RiGalleryView2 className="w-4  h-3  text-gray-400" />
                </span>
                {t("boardView")}
              </button>
              <button
                onClick={() => handleViewChange("list")}
                className="ListView flex items-center gap-2 p-2 border border-gray border-solid rounded-e-md font-inter font-bold text-xs text-gray-400-md"
              >
                <span>
                  <FaBars className="w-4  h-4  text-gray-400" />
                </span>
                {t("listView")}
              </button>
            </div>


            {filteredProjects?.length > 0 ? (
              filteredProjects.map((project) => {
                return (
                  <div className="project" key={project._id}>
                    <Link
                      to={`/ProjectDetails/${project._id}`}
                      state={{ projectId: project._id }}
                    >
                      <div className="title flex items-center gap-3 m-3">
                        <p className="font-inter font-semibold text-base">
                          {project.name}
                        </p>
                        <span className="text-red font-extrabold text-xs w-6 h-6 rounded-full num flex justify-center items-center">
                          {project.taskCount}
                        </span>
                      </div>
                    </Link>
                    {viewMode === "board" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        {project.tasks.map((task) => {
                          const avatars =
                            Array.isArray(task.assignees) &&
                            task.assignees.length > 0
                              ? task.assignees.map(
                                  (assignee) => assignee.profilePic || avatar
                                )
                              : [avatar];
                          return (
                            <div className="task" key={task._id}>
                              <Link
                                to={`/TaskDetails/${task._id}`}
                                state={{ taskId: task._id }}
                              >
                                <BoardView
                                  ProgressValue={70}
                                  NameOfTask={task.title}
                                  Tagname={"Project"}
                                  taskPriority={task.taskPriority}
                                  status={task.taskStatus}
                                  avatars={avatars}
                                  parentTask={task.parentTask}
                                  taskType={task.type}
                                  filesLength={task?.documentsLength}
                                  MsgLength={task?.notesLength}
                                  sDate={formatDate(task.sDate)}
                                  eDate={formatDate(task.dueDate)}
                                />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {viewMode === "list" && (
                      <div className="flex flex-col gap-3">
                        {project.tasks.map((task) => {
                          const avatars =
                            Array.isArray(task.assignees) &&
                            task.assignees.length > 0
                              ? task.assignees.map(
                                  (assignee) => assignee.profilePic || avatar
                                )
                              : [avatar];
                          return (
                            <div className="task" key={task._id}>
                              <Link
                                to={`/TaskDetails/${task._id}`}
                                state={{ taskId: task._id }}
                              >
                                <ListView
                                  ProgressValue={70}
                                  NameOfTask={task.title}
                                  Tagname={"Project"}
                                  taskPriority={task.taskPriority}
                                  status={task.taskStatus}
                                  avatars={avatars}
                                  filesLength={task.documentsLength}
                                  MsgLength={task.notesLength}
                                />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="empty flex items-center justify-center mt-20">
                <Empty
                  paragraph={t("You're just steps away from your screens")}
                />
              </div>
            )}
          </div>
        </>
      )}
        {/* <img className="w-[300px] h-[300px]" src={`https://api.request-sa.com/${user?.profilePic}`} alt=""/> */}
      
    </div>
  );
};

export default Home;
