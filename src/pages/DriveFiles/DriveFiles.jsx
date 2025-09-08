import { IoFilter } from "react-icons/io5";
import { useEffect, useState } from "react";
import {
  getAllDocs,
  downloadAllFiles,
  getAllModelsDriveFile,
} from "../../Services/api"; // Import downloadAllFiles
import Loader from "../../Components/Loader/Loader";
import { FaFolderOpen } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useSelector } from "react-redux";

const DriveFiles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [groupedModels, setGroupedModels] = useState({});
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;

  async function getModels() {
    await getAllModelsDriveFile(userId)
      .then((res) => {
        setModels(res?.data);

        // Group models by project name
        const grouped = res?.data?.reduce((acc, model) => {
          const projectName = model?.project?.name || "Unknown Project";
          if (!acc[projectName]) {
            acc[projectName] = [];
          }
          acc[projectName].push(model);
          return acc;
        }, {});

        setGroupedModels(grouped);
        console.log(res?.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getModels();
  }, []);

  const extractFileName = (url) => {
    if (typeof url === "string") {
      const parts = url.split("-").filter((part) => part.trim() !== "");
      if (parts.length > 0) {
        return parts.slice(1).join("-");
      }
    }
    return "Unknown File";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="DriveFiles">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      ) : (
        <>
          <div className="header flex items-center justify-between">
            <h1 className="font-bold text-xl md:text-3xl ">{t("All Files")}</h1>
            <button className="bg-white p-2 rounded-lg">
              <span>
                <IoFilter className="text-purple" />
              </span>
            </button>
          </div>
          <div className="divider h-px w-full "></div>
          <div className="content">
            {Object.keys(groupedModels).length > 0 ? (
              <div className="mt-6">
                {Object.entries(groupedModels).map(
                  ([projectName, projectModels]) => (
                    <div key={projectName} className="mb-8">
                      {/* Project Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <FaFolderOpen className="text-blue-500 text-xl" />
                        <h2 className="text-lg font-semibold text-gray-800">
                          {projectName}
                        </h2>
                        <span className="text-sm text-gray-500">
                          ({projectModels.length} models)
                        </span>
                      </div>

                      {/* Models for this project */}
                      <div className="flex flex-wrap gap-3 ml-8">
                        {projectModels.map((model, index) => (
                          <div
                            onClick={() =>
                              navigate(`/viewModel/${model?._id}`, {
                                state: {
                                  projectId: model?.project,
                                  ModelId: model?._id,
                                },
                              })
                            }
                            key={model._id}
                            className="bg-white px-4 py-3 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group relative"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-sm font-medium text-gray-800 truncate">
                                    {model?.title}
                                  </h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                                      model?.status
                                    )}`}
                                  >
                                    {model?.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {model?.owner?.companyName}
                                </p>
                              </div>
                              {/* <button
                              onClick={() => handleDownload(model._id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                              disabled={loading}
                              title="Download"
                            >
                              <HiOutlineDownload className="text-gray-600 text-sm" />
                            </button> */}
                            </div>

                            {/* Tooltip with full details */}
                            <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-1">
                                    {model.title}
                                  </h4>
                                  {model.description && (
                                    <p className="text-sm text-gray-600">
                                      {model.description}
                                    </p>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500">
                                      Owner
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {model.owner?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {model.owner?.email}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {model.owner?.companyName}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500">
                                      Contractor
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {model.contractor?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {model.contractor?.email}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {model.contractor?.companyName}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-gray-500">
                                      Consultant
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      {model.consultant?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {model.consultant?.email}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {model.consultant?.companyName}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                                  <span>
                                    Created: {formatDate(model.createdAt)}
                                  </span>
                                  <span>
                                    Updated: {formatDate(model.updatedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FaFolderOpen className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-500 text-lg">No models found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DriveFiles;
