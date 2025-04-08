import { Card, Dialog, DialogBody } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Input from "../UI/Input/Input";
import Datepicker from "react-tailwindcss-datepicker";
import Select from "../UI/Select/Select";
import {
  addTask,
  getAllMembersByProject,
  getAllTagsByProject,
  getAllTagsByUser,
  getAllUnits,
} from "../../Services/api";
import { useSelector } from "react-redux";
import { t } from "i18next";
import Button from "../UI/Button/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import i18n from "../../config/i18n";
import axios from "axios";

export const AddNewTask = ({ newTask, task, setReFetch }) => {
  const user = useSelector((state) => state.auth.user);

  const lang = i18n.language;
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, taskType } = location.state || {};
  location.state;
  "projectId :", projectId;

  console.log();
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [TaskType, setTaskType] = useState(taskType);
  const [isSubtask, setIsSubtask] = useState(false);
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
  const [Member, setMember] = useState([]);
  const [MemberLoading, setMemberLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [SelectedMember, setSelectedMember] = useState("");
  const [tagsLoading, setTagsLoading] = useState(true);
  const [TaskId, setTaskId] = useState(false);
  const [project, setProject] = useState("");
  const [sDate, setSDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [eDate, setEDate] = useState({
    startDate: "",
    endDate: "",
  });
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
  });

  async function getProjectById() {
    await axios
      .get(`https://api.request-sa.com/api/v1/project/${projectId}`)
      .then((res) => setProject(res.data.results))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getProjectById();
  }, [projectId]);
  useEffect(() => {
    setIsSubtask(TaskType === "sub");
  }, [TaskType]);

  console.log(Tags);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsData, UnitsData, MembersData] = await Promise.all([
          getAllTagsByProject(projectId, lang),
          getAllUnits(),
          getAllMembersByProject(projectId, lang),
        ]);

        setTags(tagsData?.tags);
        setTagsLoading(false);
        setUnits(
          UnitsData.results.map((unit) => ({
            value: unit._id,
            label: unit.name,
          }))
        );
        setUnitsLoading(false);

        setMember(
          MembersData?.groupedMembers?.map((member) => ({
            value: member._id,
            label: member.name,
          }))
        );

        // setMember((prev) => prev.filter((member) => member.value != user._id));
        setMemberLoading(false);
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

  const clearFormFields = () => {
    setName("");
    setDescription("");
    setSDate({
      startDate: "",
      endDate: "",
    });
    setEDate({
      startDate: "",
      endDate: "",
    });

    setPrice(0);
    setQuantity(0);
    setTotal(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // if (SelectedMember) {
    //   setError("you should assign this task to any member");
    //   return;
    // }

    const newFieldErrors = {
      Name: !Name.trim(),
      Description: !Description.trim(),
      sDate: !sDate.startDate,
      eDate: !eDate.endDate,
      priority: !selectedPriority,

      price: !Price || isNaN(Price),
      quantity: !Quantity || isNaN(Quantity),
      unit: !selectedUnit,
      total: !Total || isNaN(Total),
      member: !SelectedMember,
    };

    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setError({ message: "All fields are required." });
      return;
    }

    const formattedSDate = formatDate(sDate.startDate);
    const formattedEDate = formatDate(eDate.endDate);

    try {
      const taskData = {
        title: Name,
        description: Description,
        sDate: formattedSDate,
        project: projectId,
        dueDate: formattedEDate,
        taskPriority: selectedPriority,
        assignees: SelectedMember,
        createdBy: user._id,
        tags: selectedTag ? selectedTag : null,
        type: "toq",
        price: Price,
        requiredQuantity: Quantity,
        unit: selectedUnit,
        total: Total,
      };

      "taskData", taskData;
      console.log(taskData);
      await addTask(taskData);

      clearFormFields();
    } catch (err) {
      setError(err.message);
      err;
      setLoading(false);
    } finally {
      setLoading(false);
      handleOpen();
      setReFetch((prev) => !prev);
    }
  };
  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) clearFormFields();
  };
  const handleTagChange = (selectedOptions) => {
    // ("Selected options:", selectedOptions);
    setSelectedTag(selectedOptions || null);
  };

  const calculateTotal = (Price, Quantity) => {
    const Total = Number(Price || 0) * Number(Quantity || 0);
    setTotal(Total);
  };

  return (
    <div className="AddNewTask">
      <button
        onClick={handleOpen}
        className=" font-bold text-sm sm:text-lg text-purple underline underline-offset-1"
      >
        {t("+add new")}
      </button>
      <Dialog
        open={isOpen}
        size="lg"
        handler={handleOpen}
        className="overflow-y-scroll  h-[80vh]"
      >
        <DialogBody>
          <form action="submit" className="">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="flex flex-col my-2 col-span-1">
                <label
                  htmlFor="sDate"
                  className="flex items-center ps-1 gap-2 font-jost text-base font-medium "
                >
                  {t("sDate")}
                </label>
                <Datepicker
                  useRange={false}
                  asSingle={true}
                  inputId="sDate"
                  minDate={new Date(formatDate(project.sDate))}
                  value={sDate}
                  onChange={(date) => {
                    setSDate(date);
                    if (date.startDate > eDate.startDate) {
                      setEDate(date); // Reset eDate to sDate if it becomes invalid
                    }
                  }}
                  primaryColor={"purple"}
                  popoverClassName="!bg-white !border-gray-300 !shadow-md"
                  popoverDirection="down"
                  toggleClassName="text-black absolute top-4 ltr:right-4 rtl:left-4"
                  inputClassName={`bg-white text-gray-800 w-full rounded-xl border border-black font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border-purple focus:border-solid ${
                    fieldErrors.sDate ? "border-red border" : ""
                  }`}
                />
              </div>
              <div className="flex flex-col my-2 col-span-1">
                <label
                  htmlFor="dDate"
                  className="flex items-center ps-1 gap-2 font-jost text-base font-medium "
                >
                  {t("dDate")}
                </label>
                <Datepicker
                  useRange={false}
                  asSingle={true}
                  primaryColor={"purple"}
                  value={eDate}
                  minDate={sDate.startDate} // Prevent selection of dates before sDate
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="mt-[1px]">
                <label className="text-base font-normal">{t("Priority")}</label>
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
                  fieldErrors.priority ? "border  border-red rounded-2xl " : ""
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
                    fieldErrors.tag ? "border  border-red rounded-2xl " : ""
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
                              <span className="text">{tag.name}</span>
                              <span
                                className="w-4 h-4 ml-2 rounded-full"
                                style={{ backgroundColor: tag.colorCode }}
                              />
                            </div>
                          ),
                          value: tag._id,
                        }))
                  }
                  error={false}
                  placeholder={t("tag")}
                /> */}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                    <option className="" value={ele.value}>
                      {ele?.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* <Select
                id=""
                label={t("Responsible Person")}
                InputClassName={` ${
                  fieldErrors.member && "border-red  border rounded-2xl"
                }`}
                value={SelectedMember}
                onChange={(e) => setSelectedMember(e)}
                options={Member}
                placeholder={t("Responsible Person")}
                error={false}
                loading={MemberLoading}
              /> */}
            </div>

            <div className="grid grid-cols-2  ps-2 lg:grid-cols-4 gap-x-4 mt-3">
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
                      ${fieldErrors.quantity && "border-red "}
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
              <div className="">
                <label className="text-base font-normal mb-1 inline-block">
                  {t("Unit")}
                </label>
                <select
                  className={`w-full rounded-lg  px-3 py-[10px] focus:outline-none border-[1px] border-black ${
                    fieldErrors.unit && "border-red"
                  }`}
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                >
                  <option value={null} hidden selected>
                    {t("Unit")}
                  </option>
                  {Units?.map((ele) => (
                    <option value={ele.value}>{ele?.label}</option>
                  ))}
                </select>
                {/* <Select
                  options={Units}
                  placeholder={t("Unit")}
                  disabled={UnitsLoading}
                  label={t("Unit")}
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e)}
                  className={`bg-white mx-4  `}
                  InputClassName={`    rounded-xl ${fieldErrors.unit && " "}`}
                  loading={UnitsLoading}
                /> */}
              </div>
            </div>

            {error && (
              <div className="text-red font-bold text-center p-2">
                {error.message}
                {/* {t("all fields are required")} */}
              </div>
            )}
            <div className="btn flex items-center justify-center md:justify-end my-3">
              <Button onClick={handleSubmit}>{t("Next")}</Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  );
};
