import { useEffect, useState } from "react";
import { t } from "i18next";
import { BiTrash } from "react-icons/bi";
import {
  addTask,
  addTasksTable,
  getAllTasksPerProject,
  getAllUnits,
  updateProject,
  updateTask,
} from "../../../Services/api";
import Empty from "../../../Components/empty/empty";
import Input from "../../../Components/UI/Input/Input";
import Button from "../../../Components/UI/Button/Button";
import Select from "../../../Components/UI/Select/Select";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AddNewTask } from "../../../Components/Parent_task/AddNewTask";
import { EditTask } from "../../../Components/Parent_task/EditTask";
import axios from "axios";
import { useSelector } from "react-redux";

// TaskRow Component
const TaskRow = ({
  task,
  index,
  onRemove,
  onChange,
  onUpdateTask,
  units,
  UnitsLoading,
  errors,
}) => {
  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  const calculateTotal = (price, requiredQuantity) => {
    const total = Number(price || 0) * Number(requiredQuantity || 0);
    handleChange("total", total);
  };

  return (
    <div className="flex items-center  flex-wrap justify-around ">
      <div className="w-[70px]  lg:w-1/6 ">
        <Input
          type="text"
          value={task.description}
          className={`bg-white  border text-sm  ${
            errors[index]?.description ? "border-red" : "border-gray"
          }`}
          disabled
        />
      </div>
      <div className="w-[70px]  lg:w-1/6">
        <Input
          type="number"
          min={0}
          value={task.price}
          className={`bg-white border   ${
            errors[index]?.price ? "border-red" : "border-gray"
          }`}
          disabled
        />
      </div>
      <div className="w-[70px]  lg:w-1/6">
        <Input
          type="number"
          min={0}
          value={task.requiredQuantity}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("requiredQuantity", value);
            calculateTotal(task.price, value);
          }}
          className={`bg-white border  ${
            errors[index]?.quantity ? "border-red" : "border-gray"
          }`}
          disabled
        />
      </div>
      <div className=" w-[70px]   lg:w-1/6">
        <input
          className="bg-white border w-full rounded-2xl p-2 border-gray "
          type="number"
          min={0}
          value={task.price * task.requiredQuantity}
          disabled
        />
      </div>

      <div className="flex  justify-center items-center gap-3  mt-4  w-[70px]  lg:w-1/6">
        <EditTask
          task={task}
          onUpdateTask={(updatedTask) => onUpdateTask(updatedTask, index)}
        />
        <button onClick={() => onRemove(index)}>
          <BiTrash className="text-red" size={20} />
        </button>
      </div>
    </div>
  );
};

// Main TableOfQuantities Component
const TableOfQuantities = () => {
  const [tasks, setTasks] = useState([]);
  const [units, setUnits] = useState([]);
  const [UnitsLoading, setUnitsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const { projectId, taskType, members, projectName } = location.state || {};
  location.state;
  "project id :", projectId;

  const [reFetch, setReFetch] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const handleNewTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Handle task change for a specific row
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  // Handle task removal
  const handleTaskRemove = async (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
    await axios
      .delete(`https://api.request-sa.com/api/v1/task/${tasks[index]._id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  // Handle task update
  const handleUpdateTask = async (updatedTask, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], ...updatedTask };
    setTasks(updatedTasks);

    await updateTask(
      localStorage.getItem("token"),
      tasks[index]._id,
      user._id,
      updatedTask
    );
  };

  const handleUpdateProject = async () => {
    try {
      const res = await updateProject(projectId, {
        tableOfQuantities: true,
      });
      "res from update project => ", res;
    } catch (error) {
      console.error("Failed to update tasks:", error);
      toast.error(t("Failed to update tasks"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        tasks.map(async (task) => {
          await addTask(task);
        })
      );
      toast.success(t("toast.TaskSavedSuccess"));
      "All tasks saved:", tasks;
      setTasks([]);
      navigate(`/`);
      if (!taskType) {
        handleUpdateProject();
        navigate("/Models", {
          state: {
            projectId,
            projectName,
          },
        });
      }
    } catch (error) {
      console.error("Failed to add tasks:", error);
      toast.error(t(`Failed to add tasks, ${error.message}`));
    }
  };

  async function getTasksbyProject() {
    await axios
      .get(
        `https://api.request-sa.com/api/v1/task/project/${projectId}?status=all`
      )
      .then((res) => setTasks(res.data.results))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getTasksbyProject();
  }, [reFetch]);
  return (
    <div className="TableOfQuantities w-[320px] sm:w-[600px] lg:w-[750px] mx-auto overflow-x-scroll lg:overflow-hidden ">
      <div className="header  bg-white w-[500px] sm:w-[600px] lg:w-[750px]   p-4 rounded-l-3xl flex items-center justify-between">
        <h5 className="font-bold text-sm  sm:text-base">
          {t("Table of Quantities")}
        </h5>
        <AddNewTask
          setReFetch={setReFetch}
          newTask={handleNewTask}
          projectId={projectId}
        />
      </div>

      {tasks.length > 0 ? (
        <div className="content bg-white p-4  w-[500px] sm:w-[600px] lg:w-[750px] rounded-3xl mx-auto   my-6">
          <div className="flex justify-between px-3 font-semibold">
            <p className="w-[70px] lg:w-1/6 text-xs lg:text-base ">
              {t("desc")}
            </p>
            <p className="w-[70px] lg:w-1/6 text-xs lg:text-base ">
              {t("Price")}
            </p>
            <p className="w-[70px] lg:w-1/6 text-xs lg:text-base ">
              {t("Quantity")}
            </p>
            <p className="w-[70px] lg:w-1/6 text-xs lg:text-base ">
              {t("Total")}
            </p>
            <p className="w-[70px] lg:w-1/6 text-xs lg:text-base   ps-12">
              {t("Actions")}
            </p>
          </div>

          {tasks.map((task, index) => (
            <TaskRow
              key={index}
              task={task}
              index={index}
              onChange={handleTaskChange}
              onRemove={handleTaskRemove}
              onUpdateTask={handleUpdateTask}
              units={units}
              UnitsLoading={UnitsLoading}
              errors={errors}
            />
          ))}

          <div className="btn flex items-center justify-end my-3">
            <Button onClick={handleSubmit}>{t("Save")}</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <Empty paragraph={t("You haven't posted any tasks yet")} />
          {!taskType && (
            <Link
              to="/Models"
              state={{ projectId, taskType, members, projectName }}
              className="text-purple underline mt-4"
            >
              {t("Skip This Request")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TableOfQuantities;
