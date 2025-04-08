import { useLocation } from "react-router-dom";
import File from "../../Components/UI/File/File";
import { getFilesPerTag } from "../../Services/api";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader/Loader";
import Empty from "../../Components/empty/empty";

const FilesPerTag = () => {
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { TagId, projectId } = location.state || {}; 
  (location.state);
  
  useEffect(() => {
    if (!TagId) return;

    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await getFilesPerTag(TagId, projectId);
        setFiles(response.results);
      } catch (error) {
        console.error("Error fetching Files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [TagId]);

  const extractFileName = (url) => {
    if (typeof url === "string") {
      const parts = url.split("-").filter((part) => part.trim() !== "");
      if (parts.length > 0) {
        return parts.slice(1).join("-");
      }
    }
    return "Unknown File";
  };

  // Check if all tasks have no documents
  const areAllTasksEmpty = files.tasks?.every(
    (task) => !task.documents || task.documents.length === 0
  );

  return (
    <div className="FilesPerTag">
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <>
          <h6 className="TagName font-normal md:font-medium sm:text-lg md:text-xl bg-white rounded-xl p-2 my-2 md:my-3">
            {files.tagName}
          </h6>

          <div>
            {areAllTasksEmpty ? (
              <div className="empty-container flex items-center justify-center h-60">
                <Empty paragraph="No documents available for this tag" />
              </div>
            ) : (
              files.tasks?.map((task) => (
                <div
                  className="Files grid xl:grid-cols-6 md:grid-cols-4 grid-cols-2 md:gap-6 gap-2 m-2"
                  key={task._id}
                >
                  {task.documents && task.documents.length > 0
                    ? task.documents.map((doc) => (
                        <File
                          key={doc._id}
                          TaskName={task.title}
                          Pdf_Name={extractFileName(doc.document)}
                          style_bg={{
                            backgroundColor: `${files.tagColor || "#000000"}40`,
                          }}
                          style_color={{
                            color: files.tagColor || "#000000",
                          }}
                          documentUrl={doc.document}
                        />
                      ))
                    : // Don't show anything if task has no documents, as this is handled globally
                      null}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilesPerTag;
