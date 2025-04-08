import { IoFilter } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getAllDocs, downloadAllFiles } from "../../Services/api"; // Import downloadAllFiles
import Loader from "../../Components/Loader/Loader";
import { FaFolderOpen } from "react-icons/fa6";
import { HiOutlineDownload } from "react-icons/hi";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useSelector } from "react-redux";

const DriveFiles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userId = user._id
  
  

  const extractFileName = (url) => {
    if (typeof url === "string") {
      const parts = url.split("-").filter((part) => part.trim() !== "");
      if (parts.length > 0) {
        return parts.slice(1).join("-");
      }
    }
    return "Unknown File";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllDocs(userId);
        setData(data.results);
        (data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (tagId) => {
    setLoading(true); // Set loading to true when starting download
    try {
      const res = await downloadAllFiles(tagId);
      (tagId);
      
      ("res from downloadAllFiles => ", res);
      
      const fileUrls = res.results.tasks;

      // Check if the array is empty
      if (fileUrls.length === 0) {
        toast.info("No files to download.");
        return;
      }

      const zip = new JSZip(); // Create a new JSZip instance
      const downloadPromises = fileUrls.map(async (fileUrl) => {
        const response = await fetch(fileUrl);
        const blob = await response.blob(); // Get the file as a Blob
        const fileName = extractFileName(fileUrl); // Extract the file name
        zip.file(fileName, blob); // Add the file Blob to the ZIP
      });

      // Wait for all downloads to finish
      await Promise.all(downloadPromises);

      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Create a link element for downloading
      saveAs(zipBlob, "files.zip"); // Use FileSaver.js to save the ZIP file
    } catch (error) {
      console.error("Download failed: ", error);
    } finally {
      setLoading(false); // Set loading to false after completion
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
          <div className="divider h-px w-full bg-purple my-2"></div>
          <div className="content">
            {data.map((Project) => (
              <div key={Project._id}>
                <h6 className="Project_name font-normal md:font-medium text-lg md:text-xl bg-white rounded-xl p-1 my-3 px-2">
                  {Project.projectName}
                </h6>
                <div className="Folders grid xl:grid-cols-6 md:grid-cols-4 grid-cols-2 md:gap-6 gap-2 m-2 ">
                  {Project.tags.map((tag) => (
                    <div
                      key={tag._id}
                      className="folder col-span-1 bg-white rounded-xl px-2 py-6 cursor-pointer flex items-center flex-col relative"
                    >
                      <button
                        className="download absolute top-3 right-3"
                        onClick={() => handleDownload(tag._id)} 
                      >
                        <HiOutlineDownload className="text-blue" />
                      </button>
                      <Link
                        to={`/DriveFiles/Tag/${tag.name}`}
                        state={{ TagId: tag._id, projectId: Project._id }}
                        className="flex flex-col items-center w-full"
                      >
                        <span>
                          <FaFolderOpen
                            className="w-16 h-16"
                            style={{
                              color: tag.colorCode,
                            }}
                          />
                        </span>
                        <span
                          className="w-full py-2 rounded-3xl font-inter font-semibold text-sm mt-2 text-center"
                          style={{
                            color: tag.colorCode,
                            backgroundColor: `${tag.colorCode}40`,
                          }}
                        >
                          {tag.name}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DriveFiles;
