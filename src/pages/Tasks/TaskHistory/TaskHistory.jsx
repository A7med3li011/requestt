import { t } from "i18next";
import { HistoryItem } from "../../../Components/HistoryItem/HistoryItem";
import { useEffect, useState } from "react";
import { getTaskHistory } from "../../../Services/api";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../../Components/Loader/Loader";

const TaskHistory = () => {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const { taskId } = location.state || {};
  (location.state);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTaskHistory(token, taskId);
        (data);

        setData(data.results.updates);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


    const getTitleForChange = (change) => {
      if (change.includes("Created")) {
        return t("CreateTask"); 
      } else if (change.includes("updated")) {
        return t("UpdateTask"); 
      }
      return t("GeneralChange"); 
    };
  return (
    <div className="TaskHistory">
      <h1 className="title font-inter font-bold text-3xl text-black ">
        {t("TaskHistory")}
      </h1>
      <div className="history m-2">
        {loading ? (
          <div className="flex">
            <Loader />
          </div>
        ) : data && data.length > 0 ? (
          [...data]
            .reverse()
            .map((item) =>
              item.changes.map((change, index) => (
                <HistoryItem
                  key={`${item._id}-${index}`}
                  title={getTitleForChange(change)}
                  message={change}
                  timestamp={new Date(item.date).toLocaleString()}
                />
              ))
            )
        ) : (
          <p>{t("NoHistoryAvailable")}</p>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;

//  {
//    loading ? (
//      <div className="flex">
//        <Loader />
//      </div>
//    ) : (
//      data.map((item, index) => (
//        <HistoryItem
//          key={index}
//          message={item.changes}
//          timestamp={item.timestamp}
//          // title={item.title}
//          showButtons={true}
//        />
//      ))
//    );
//  }
