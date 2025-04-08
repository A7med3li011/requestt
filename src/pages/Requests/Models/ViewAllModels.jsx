import { t } from "i18next";
import BoardViewModels from "../../../Components/boardView/boardviewModels";
import { Link, useLocation } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getModelsByProject } from "../../../Services/api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Loader from "../../../Components/Loader/Loader";

const ViewAllModels = () => {
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const { projectId, projectName, members, taskId, TaskName } =
    location.state || {};
  (location.state);

  const [loading, setLoading] = useState(false);
  const [Models, setModels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const id = taskId ? taskId : projectId;
        const data = await getModelsByProject(token, id);
        setModels(data.results);
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
    <div className="ViewAllModels min-h-screen">
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="title font-inter font-bold text-xl lg:text-3xl text-black m-2">
            {t("All models")}
          </h1>
          <hr className="h-px bg-gray mx-3" />
          <div
            className={`content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4`}
          >
            <Link
              to={`/Models`}
              state={{
                projectId,
                projectName,
                members,
                taskId,
                TaskName,
              }}
              className={` box flex flex-col p-5 justify-center gap-4 items-center col-span-1  h-full bg-white  rounded-md shadow-sm  `}
            >
              <span>
                <IoAddOutline className={`w-12 h-12  text-purple`} />
              </span>
              <span className={`text-linear font-inter font-bold  text-3xl `}>
                {t("AddModel")}
              </span>
            </Link>
            {Models.length > 0 && (
              <>
                {Models.map((model) => (
                  <Link
                    to={`/viewModel/${model._id}`}
                    state={{
                      ModelId: model._id,
                    }}
                  >
                    <BoardViewModels
                      title={model.title}
                      actionCode={model?.actionCode?.name}
                      discipline={model?.discipline?.name}
                      reason={model?.reason?.name}
                      refNo={model?.refNo}
                      date={formatDate(model?.date)}
                      inspectionDate={formatDate(model?.inspectionDate)}
                      status={model?.status}
                      desc={model?.description}
                    />
                  </Link>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAllModels;
