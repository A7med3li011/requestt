import { t } from "i18next";
import Input from "../../../Components/UI/Input/Input";
import Datepicker from "react-tailwindcss-datepicker";
import Button from "../../../Components/UI/Button/Button";
import { useEffect, useState } from "react";
import {
  addTask,
  getAllParentTasks,
  getAllTagsByProject,
  getAllTagsByUser,
  getAllUnits,
} from "../../../Services/api";
import Select from "../../../Components/UI/Select/Select";
import Loader from "../../../Components/Loader/Loader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiSquarePlus } from "react-icons/ci";
import { HiX } from "react-icons/hi";
import i18next from "i18next";
import axios from "axios";

const AddTask = () => {
  const { ProjectId } = useParams();
  const lang = i18next.language;
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, taskType, members, ParentId, subTask } =
    location.state || {};

  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [TaskType, setTaskType] = useState(taskType);
  const [isSubtask, setIsSubtask] = useState(subTask === true);
  const [isRecurringTask, setIsRecurringTask] = useState(
    taskType === "recurring"
  );
  const [project, setProject] = useState("");
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [Tags, setTags] = useState([]);
  const [Price, setPrice] = useState(0);
  const [Quantity, setQuantity] = useState(0);
  const [Total, setTotal] = useState(0);
  const [Units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [UnitsLoading, setUnitsLoading] = useState(false);
  const [Member, setMember] = useState(members);
  const [SelectedMember, setSelectedMember] = useState("");
  const [ParentTasks, setParentTasks] = useState([]);
  const [SelectedParentTask, setSelectedParentTask] = useState("");
  const [tagsLoading, setTagsLoading] = useState(true);
  const [TaskId, setTaskId] = useState(false);
  const [sDate, setSDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [eDate, setEDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [recurringDates, setRecurringDates] = useState([
    { startDate: new Date(), endDate: new Date() },
  ]);

  const [fieldErrors, setFieldErrors] = useState({
    Name: false,
    Description: false,
    sDate: false,
    eDate: false,
    priority: false,
    tag: false,
    price: false,
    quantity: false,
    unit: false,
    member: false,
    parentTask: false,
  });

  async function getProjectbyId() {
    await axios
      .get(`https://api.request-sa.com/api/v1/project/${projectId}`)
      .then((res) => setProject(res.data.results))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getProjectbyId();
  }, [projectId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsData, UnitsData, parentTasks] = await Promise.all([
          getAllTagsByProject(projectId),
          getAllUnits(),
          getAllParentTasks(user._id, projectId),
        ]);

        setTags(tagsData?.tags);
        setTagsLoading(false);
        setUnits(
          UnitsData?.results.map((unit) => ({
            value: unit._id,
            label: unit.name,
          }))
        );
        setUnitsLoading(false);
        setParentTasks(
          parentTasks?.results?.map((task) => ({
            value: task._id,
            label: task.title,
          }))
        );
        ParentTasks;
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [user._id]);

  const priorityOptions = [
    { value: "low", label: t("low") },
    { value: "medium", label: t("medium") },
    { value: "high", label: t("high") },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const clearFormFields = () => {
    setName("");
    setDescription("");
    setSDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setEDate({
      startDate: new Date(),
      endDate: new Date(),
    });
    setSelectedPriority("");
    setSelectedTag("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const newFieldErrors = {
      Name: !Name.trim(),
      Description: !Description.trim(),
      sDate: !sDate.startDate,
      eDate: !eDate.endDate,
      priority: !selectedPriority,
    };

    if (isSubtask && taskType === "toq") {
      newFieldErrors.price = !Price || isNaN(Price);
      newFieldErrors.requiredQuantity = !Quantity || isNaN(Quantity);
      newFieldErrors.total = !Total || isNaN(Total);
      newFieldErrors.unit = !selectedUnit;
    }
    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setError({ message: "All fields are required." });
      return;
    }

    if (!SelectedMember) {
      setError({ message: "you should assign this task to anyone!" });
      return;
    }
    const formattedSDate = formatDate(sDate.startDate);
    const formattedEDate = formatDate(eDate.endDate);

    try {
      const taskData = {
        title: Name,
        description: Description,
        sDate: formattedSDate,
        project: ProjectId,
        dueDate: formattedEDate,
        taskPriority: selectedPriority,
        assignees: SelectedMember,
        createdBy: user._id,
        tags: selectedTag ? selectedTag : null,
        type: taskType,
      };
      if (isSubtask) {
        taskData.parentTask = ParentId ? ParentId : SelectedParentTask;
      }
      if (isSubtask && taskType === "toq") {
        taskData.price = Price;
        taskData.requiredQuantity = Quantity;
        taskData.unit = selectedUnit;
        taskData.total = Total;
      }

      setLoading(true);
      "task data =>  ", taskData;
      const res = await addTask(taskData, lang);
      setTaskId(res.addedTasks?._id);
      res;
      clearFormFields();
      if (!isSubtask) {
        navigate(`/Models`, {
          state: {
            fromTask: true,
            TaskId: res.addedTasks[0]._id,
            TaskName: Name,
            projectId: projectId,
          },
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      setError({
        message: err.response ? err.response.data.message : err.message,
      });

      err.err;
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (selectedOptions) => {
    "Selected options:", selectedOptions;
    setSelectedTag(selectedOptions || []);
  };

  const calculateTotal = (Price, Quantity) => {
    const Total = Number(Price || 0) * Number(Quantity || 0);
    setTotal(Total);
  };

  const handleAddDateField = () => {
    setRecurringDates([
      ...recurringDates,
      { startDate: new Date(), endDate: new Date() },
    ]);
  };

  const handleRemoveDateField = (index) => {
    setRecurringDates((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  const handleDateChange = (index, type, date) => {
    const updatedDates = [...recurringDates];
    updatedDates[index][type] = date;
    setRecurringDates(updatedDates);
  };

  console.log(Member);
  return (
    <div className="AddTask mx-1 relative">
      {Loading ? (
        <div className="flex">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="title font-inter font-bold text-3xl text-black m-2 rtl:hidden">
            {t("AddTask")}
          </h1>
          <div className="wrapper bg-white rounded-3xl p-3 m-2 ">
            <form action="submit">
              <Input
                label={t("TaskName")}
                placeholder={t("TaskName")}
                className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid ${
                  fieldErrors.Name && "border-red"
                }`}
                type={"name"}
                required={true}
                id={"name"}
                value={Name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoFocus={true}
              />
              <div className="desc">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 font-jost text-base font-medium "
                >
                  {t("desc")}
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder={t("desc")}
                  required={true}
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${
                    fieldErrors.Description && "border-red"
                  } bg-white w-full rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid`}
                />
              </div>
              {isRecurringTask ? (
                <>
                  <div className={`grid grid-cols-2  md:grid-cols-4 gap-2`}>
                    <div className="flex flex-col my-2 col-span-2">
                      <label
                        htmlFor="sDate"
                        className="flex items-center gap-2 ps-1 font-jost text-base font-medium "
                      >
                        {t("sDate")}
                      </label>
                      <Datepicker
                        useRange={false}
                        asSingle={true}
                        inputId="sDate"
                        value={sDate}
                        onChange={(date) => setSDate(date)}
                        primaryColor={"purple"}
                        popoverClassName="!bg-white !border-gray-300 !shadow-md"
                        popoverDirection="down"
                        toggleClassName="text-black absolute top-4 ltr:right-4 rtl:left-4"
                        minDate={new Date(project.sDate)} // Restrict selection to after project start date
                        inputClassName={`bg-white text-gray-800 w-full rounded-xl border border-black font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border-purple focus:border-solid ${
                          fieldErrors.sDate ? "border-red border" : ""
                        }`}
                      />
                    </div>
                    <div className="flex  items-center gap-2 my-2 col-span-2">
                      <div className="flex flex-col w-full">
                        <label
                          htmlFor="dDate"
                          className="flex items-center gap-2 font-jost text-base font-medium "
                        >
                          {t("dDate")}
                        </label>
                        <Datepicker
                          useRange={false}
                          asSingle={true}
                          primaryColor={"purple"}
                          value={eDate}
                          minDate={sDate.startDate} // Ensure due date is not before start date
                          onChange={(date) => setEDate(date)}
                          inputId="dDate"
                          popoverClassName="!bg-white !border-gray-300 !shadow-md"
                          popoverDirection="down"
                          toggleClassName="text-black absolute top-4 ltr:right-4 rtl:left-4"
                          inputClassName={`bg-white w-full rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid ${
                            fieldErrors.eDate && "border-red border"
                          }`}
                        />
                      </div>
                      {/* {recurringDates.length > 0 && (
                          <div className="flex items-center justify-center mt-2">
                            <button
                              className=""
                              onClick={handleRemoveDateField(index)}
                            >
                              <HiX className="bg-yellow  text-white rounded-md w-8 h-8" />
                            </button>
                          </div>
                        )} */}
                    </div>
                  </div>
                </>
              ) : (
                <div className={`grid grid-cols-2  md:grid-cols-4 gap-2`}>
                  <div className="flex flex-col my-2 col-span-2">
                    <label
                      htmlFor="sDate"
                      className="flex items-center gap-2 font-jost text-base font-medium "
                    >
                      {t("sDate")}
                    </label>
                    <Datepicker
                      useRange={false}
                      asSingle={true}
                      inputId="sDate"
                      value={sDate}
                      onChange={(date) => setSDate(date)}
                      primaryColor={"purple"}
                      popoverClassName="!bg-white !border-gray-300 !shadow-md"
                      popoverDirection="down"
                      toggleClassName="text-black absolute top-4 ltr:right-4 rtl:left-4"
                      minDate={new Date(project.sDate)} // Restrict selection to after project start date
                      inputClassName={`bg-white text-gray-800 w-full rounded-xl border border-black font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border-purple focus:border-solid ${
                        fieldErrors.sDate ? "border-red border" : ""
                      }`}
                    />
                  </div>
                  <div className="flex  items-center gap-2 my-2 col-span-2">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="dDate"
                        className="flex items-center gap-2 font-jost text-base font-medium "
                      >
                        {t("dDate")}
                      </label>
                      <Datepicker
                        useRange={false}
                        asSingle={true}
                        primaryColor={"purple"}
                        value={eDate}
                        minDate={sDate.startDate} // Ensure due date is not before start date
                        onChange={(date) => setEDate(date)}
                        inputId="dDate"
                        popoverClassName="!bg-white !border-gray-300 !shadow-md"
                        popoverDirection="down"
                        toggleClassName="text-black absolute top-4 ltr:right-4 rtl:left-4"
                        inputClassName={`bg-white w-full rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid ${
                          fieldErrors.eDate && "border-red border"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mt-[1px]">
                  <label className="text-base font-normal">
                    {t("Priority")}
                  </label>
                  <select
                    className={`w-full rounded-lg  px-3  h-[45px] py-3  focus:outline-none border-[1px] border-black  ${
                      fieldErrors.priority && "border-red"
                    }`}
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option value={null} hidden selected>
                      {t("Priority")}
                    </option>
                    {priorityOptions?.map((ele) => (
                      <option className="" value={ele.value}>
                        {ele?.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <Select
                  id="priority"
                  label={t("Priority")}
                  InputClassName={`${
                    fieldErrors.priority
                      ? "border  border-red rounded-2xl "
                      : ""
                  }`}
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e)}
                  options={priorityOptions}
                  placeholder={t("Priority")}
                  error={false}
                /> */}
                <div className="Tags">
                  <div className="mt-[1px]">
                    <label className="text-base font-normal">{t("tag")}</label>
                    <select
                      className={`w-full rounded-lg   px-3 py-[10px]  focus:outline-none border-[1px] border-black  `}
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                    >
                      <option value={null} hidden selected>
                        {t("tag")}
                      </option>
                      {Tags?.length ? (
                        Tags?.map((ele) => (
                          <option
                            style={{ color: ele.colorCode }}
                            className={`hover:bg-black `}
                            value={ele._id}
                          >
                            {ele?.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          {t("No tags available from consultant")}
                        </option>
                      )}
                    </select>
                  </div>
                  {/* <Select
                    label={t("tag")}
                    id="tag"
                    isMulti={false}
                    value={selectedTag}
                    onChange={handleTagChange}
                    InputClassName={`${
                      fieldErrors.tag ? "border border-red rounded-2xl" : ""
                    }`}
                    options={
                      Tags?.length === 0
                        ? [
                            {
                              label: t("No tags available from consultant"),
                              value: "no-tags",
                              isDisabled: true,
                            },
                          ]
                        : Tags?.map((tag) => ({
                            label: (
                              <div className="flex items-center justify-between">
                                <span className="text">{tag?.name}</span>
                                <span
                                  className="w-4 h-4 ml-2 rounded-full"
                                  style={{ backgroundColor: tag?.colorCode }}
                                />
                              </div>
                            ),
                            value: tag?._id,
                          }))
                    }
                    error={false}
                    placeholder={t("tag")}
                  /> */}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="my-3">
                  <label className="text-base font-normal ">
                    {" "}
                    {t("Responsible Person")}
                  </label>
                  <select
                    className={`w-full rounded-lg  px-3 py-[10px]  focus:outline-none border-[1px] border-black  ${
                      fieldErrors.member && "border-red"
                    }`}
                    value={SelectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                  >
                    <option value={null} hidden selected>
                      {t("Responsible Person")}
                    </option>
                    {Member?.map((ele) => (
                      <option className="" value={ele._id}>
                        {ele?.name}
                      </option>
                    ))}
                  </select>
                </div>
                {isSubtask && !ParentId && (
                  <Select
                    id="ParentTasks"
                    label={t("ParentTasks")}
                    InputClassName={`${
                      fieldErrors.parentTask
                        ? "border  border-red rounded-2xl "
                        : ""
                    }`}
                    placeholder={t("ParentTasks")}
                    value={SelectedParentTask}
                    onChange={(e) => setSelectedParentTask(e)}
                    options={ParentTasks}
                    error={false}
                  />
                )}
              </div>

              {isSubtask && taskType === "toq" && (
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={Price}
                    label={t("Price")}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      setPrice(newPrice);
                      calculateTotal(newPrice, Quantity);
                    }}
                    className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid
                  ${fieldErrors.price && "border-red"}
                    `}
                  />
                  <Input
                    type="number"
                    min={0}
                    label={t("Quantity")}
                    value={Quantity}
                    onChange={(e) => {
                      const newQuantity = e.target.value;
                      setQuantity(newQuantity);
                      calculateTotal(Price, newQuantity);
                    }}
                    className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid
                      ${fieldErrors.requiredQuantity && "border-red "}
                    `}
                  />
                  <Input
                    className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid
                  
                    `}
                    label={t("Total")}
                    type="number"
                    min={0}
                    value={Total}
                    disabled
                  />
                  <Select
                    options={Units}
                    placeholder={t("Unit")}
                    disabled={UnitsLoading}
                    label={"Unit"}
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e)}
                    className={`bg-white mx-4`}
                    InputClassName={` ${
                      fieldErrors.unit && "border-red  border rounded-2xl"
                    }`}
                    loading={UnitsLoading}
                  />
                </div>
              )}

              {error && (
                <div className="text-red font-bold text-center p-2">
                  {t(error.message)}
                </div>
              )}

              <div className="btn  flex items-center justify-center md:justify-end my-3">
                <Button onClick={handleSubmit}>{t("Next")}</Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AddTask;
