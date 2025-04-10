import { Card, Dialog, DialogBody } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Input from "../UI/Input/Input";
import Datepicker from "react-tailwindcss-datepicker";
import Select from "../UI/Select/Select";
import { getAllTagsByUser, getAllUnits } from "../../Services/api";
import { useSelector } from "react-redux";
import { t } from "i18next";
import Button from "../UI/Button/Button";
import { BiEdit } from "react-icons/bi";
import { useLocation } from "react-router-dom";

export const EditTask = ({ task, onUpdateTask }) => {
  const location = useLocation();
  const { members } = location.state || {};

  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  const [isOpen, setIsOpen] = useState(false);
  const [Tags, setTags] = useState([]);
  const [units, setUnits] = useState([]);
  const [TagLoading, setTagLoading] = useState(true);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [error, setError] = useState("");
  const [Total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskName: task.title,
    description: task.description,
    sDate: { startDate: task.sDate, endDate: task.sDate },
    eDate: { startDate: task.dueDate, endDate: task.dueDate },
    priority: task.taskPriority,
    tag: task.tags,
    assignees: task.member,
    price: task.price,
    quantity: task.quantity,
    total: task.price * task.quantity,
    unit: task?.unit?.name,
  });
  "form data :", formData;

  const [fieldErrors, setFieldErrors] = useState({});

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tagsData, UnitsData] = await Promise.all([
          getAllTagsByUser(user._id),
          getAllUnits(),
        ]);

        setTags(
          tagsData?.results?.map((tag) => ({
            value: tag._id,
            label: tag.name,
            colorCode: tag.colorCode,
          }))
        );
        setTagLoading(false);
        setUnits(
          UnitsData?.results.map((unit) => ({
            value: unit._id,
            label: unit.name,
          }))
        );
        setUnitsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (field, date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleSelectChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      total: prevData.price * prevData.quantity,
    }));
  }, [formData.price, formData.quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Validate each field and set errors
    const newFieldErrors = {
      taskName: !formData.taskName.trim(),
      description: !formData.description.trim(),
      sDate: !formData.sDate?.startDate,
      eDate: !formData.eDate?.endDate,
      priority: !formData.priority,
      // tag: !formData.tag,
      member: !formData.assignees,
      // requiredQuantity: formData.requiredQuantity < 0,
      // approvedQuantity: formData.approvedQuantity < 0,
      // executedQuantity: formData.executedQuantity < 0,
      // filteredQuantity: formData.filteredQuantity < 0,
      price: formData.price <= 0,
      quantity: formData.quantity <= 0,
      unit: !formData.unit,
    };

    setFieldErrors(newFieldErrors);

    // If any field has an error, set a general error message and exit
    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setError({ message: "All fields are required." });
      return;
    }

    const formattedSDate = formatDate(formData.sDate.startDate);
    const formattedEDate = formatDate(formData.eDate.endDate);

    try {
      const updatedTask = {
        title: formData.taskName,
        description: formData.description,
        sDate: formattedSDate,
        dueDate: formattedEDate,
        taskPriority: formData.priority,
        tags: formData.tag,
        member: formData.member,
        price: formData.price,
        quantity: formData.quantity,
        total: formData.price * formData.quantity,
        unit: task.unit,
      };
      updatedTask;

      onUpdateTask(updatedTask);

      setIsOpen(false);
    } catch (err) {
      err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="EditSub">
      <button
        onClick={handleOpen}
        className=" font-bold text-lg text-purple  py-1 px-3"
      >
        <BiEdit className="text-purple w-6 h-6" />
      </button>
      <Dialog
        open={isOpen}
        size="lg"
        handler={handleOpen}
        className="overflow-y-scroll"
      >
        <DialogBody>
          <form onSubmit={handleSubmit}>
            <Input
              label={t("TaskName")}
              className={`bg-white border ${
                fieldErrors.taskName ? "border-red" : "border-purple"
              } border-solid focus:border focus:border-gray focus:border-solid`}
              autoFocus
              id="name"
              placeholder={t("TaskName")}
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
            />
            <div className="desc">
              <label
                htmlFor="desc"
                className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
              >
                {t("desc")}
              </label>
              <textarea
                className={`bg-white border ${
                  fieldErrors.description ? "border-red" : "border-purple"
                } border-solid focus:border focus:border-gray focus:border-solid Input text-black font-jost font-normal text-base my-2 py-2 px-4`}
                id="desc"
                name="description"
                rows={4}
                cols={40}
                placeholder={t("desc")}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="date grid grid-cols-2 gap-3">
              <div className="sDate grid-cols-1">
                <label
                  htmlFor="sDate"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  {t("sDate")}
                </label>
                <Datepicker
                  useRange={false}
                  asSingle={true}
                  inputId="sDate"
                  value={formData.sDate}
                  onChange={(date) => handleDateChange("sDate", date)}
                  primaryColor="purple"
                  popoverClassName="!bg-white !border-gray-300 !shadow-md"
                  popoverDirection="down"
                  toggleClassName="text-yellow absolute top-4 ltr:right-4 rtl:left-4"
                  inputClassName={`bg-white text-gray-800 w-full rounded-xl border ${
                    fieldErrors.sDate ? "border-red" : "border-purple"
                  } font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border-purple`}
                />
              </div>
              <div className="eDate grid-cols-1">
                <label
                  htmlFor="eDate"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  {t("dDate")}
                </label>
                <Datepicker
                  useRange={false}
                  asSingle={true}
                  inputId="eDate"
                  value={formData.eDate}
                  onChange={(date) => handleDateChange("eDate", date)}
                  primaryColor="purple"
                  popoverClassName="!bg-white !border-gray-300 !shadow-md"
                  popoverDirection="down"
                  toggleClassName="text-yellow absolute top-4 ltr:right-4 rtl:left-4"
                  inputClassName="bg-white text-gray-800 w-full rounded-xl border border-purple focus:border-gray font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border-purple"
                />
              </div>
            </div>
            <div className="date grid grid-cols-2 gap-3">
              <div className="priority">
                <Select
                  label={t("Priority")}
                  value={formData.priority}
                  InputClassName={`${
                    fieldErrors.priority
                      ? "border  border-red rounded-2xl "
                      : ""
                  }`}
                  onChange={(value) => handleSelectChange("priority", value)}
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                  ]}
                  placeholder={t("Priority")}
                />
              </div>
              <div className="Tags">
                <Select
                  label={t("tag")}
                  id="tag"
                  isMulti={false}
                  value={task.tag}
                  loading={TagLoading}
                  InputClassName={`${
                    fieldErrors.tag ? "border  border-red rounded-2xl " : ""
                  }`}
                  onChange={(value) => handleSelectChange("tag", value)}
                  options={Tags}
                  placeholder={t("tag")}
                />
              </div>
            </div>
            <div className="date grid grid-cols-2 gap-3">
              <div className="assignees col-span-1">
                <Select
                  label={t("Responsible Person")}
                  id="assignees"
                  isMulti={false}
                  value={task?.assignees[0]?.name}
                  InputClassName={` `}
                  onChange={(value) => handleSelectChange("assignees", value)}
                  options={members?.map((member) => ({
                    value: member._id,
                    label: member.name,
                  }))}
                  placeholder={t("Responsible Person")}
                  error={false}
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-4 gap-2">
              <div className="price col-span-1">
                <label
                  htmlFor="requiredQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Required Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="requiredQuantity"
                  name="requiredQuantity"
                  placeholder="Required quantity"
                  value={formData.requiredQuantity}
                  onChange={handleChange}
                />
              </div>
              <div className="Approved quantity col-span-1">
                <label
                  htmlFor="approvedQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Approved Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="approvedQuantity"
                  name="approvedQuantity"
                  placeholder="Approved quantity"
                  value={formData.approvedQuantity}
                  onChange={handleChange}
                />
              </div>
              <div className="Executed quantity col-span-1">
                <label
                  htmlFor="executedQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Executed Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="executedQuantity"
                  name="executedQuantity"
                  placeholder="Executed quantity"
                  value={formData.executedQuantity}
                  onChange={handleChange}
                />
              </div>
              <div className="Filtered quantity col-span-1">
                <label
                  htmlFor="filteredQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Filtered Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="filteredQuantity"
                  name="filteredQuantity"
                  placeholder="Filtered quantity"
                  value={formData.filteredQuantity}
                  onChange={handleChange}
                />
              </div>
            </div> */}

            <div className="grid grid-cols-4 gap-2">
              <div className="price col-span-1">
                <label
                  htmlFor="price"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  {t("Price")}
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4 "
                  type="number"
                  min="0"
                  id="price"
                  name="price"
                  placeholder={t("Price")}
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="Quantity col-span-1">
                <label
                  htmlFor="quantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  {t("Quantity")}
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4 "
                  type="number"
                  min="0"
                  id="quantity"
                  name="quantity"
                  placeholder={t("Quantity")}
                  a
                  value={formData.quantity || formData.total / formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="Total col-span-1">
                <label
                  htmlFor="Total"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  {t("Total")}
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4 "
                  type="number"
                  min="0"
                  id="Total"
                  name="Total"
                  placeholder={t("Total")}
                  value={task.price * task.requiredQuantity}
                  disabled
                  onChange={handleChange}
                />
              </div>
              <div className="Unit col-span-1 mt-2">
                <label
                  htmlFor="unit"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  {t("Unit")}
                </label>
                <Select
                  type="number"
                  min="0"
                  id="unit"
                  name="unit"
                  placeholder={t("Unit")}
                  value={formData.unit}
                  loading={unitsLoading}
                  InputClassName={` ${
                    fieldErrors.unit && "border-red  border rounded-2xl"
                  }`}
                  onChange={(value) => handleSelectChange("unit", value)}
                  options={units}
                />
              </div>
            </div>
            {error && (
              <div className="text-red font-bold text-center p-2">
                {error.message}
              </div>
            )}
            <div className="btn flex items-center justify-center md:justify-end my-3">
              <Button type="submit">{t("Save")}</Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  );
};

// {
/* <div className="grid grid-cols-4 gap-2">
              <div className="price col-span-1">
                <label
                  htmlFor="requiredQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Required Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="requiredQuantity"
                  name="requiredQuantity"
                  placeholder="Required quantity"
                  value={formData.requiredQuantity}
                  onChange={handleChange}
                />
              </div>
              <div className="Approved quantity col-span-1">
                <label
                  htmlFor="approvedQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Approved Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="approvedQuantity"
                  name="approvedQuantity"
                  placeholder="Approved quantity"
                  value={formData.approvedQuantity}
                  onChange={handleChange}
                />
              </div>
              <div className="Executed quantity col-span-1">
                <label
                  htmlFor="executedQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Executed Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="executedQuantity"
                  name="executedQuantity"
                  placeholder="Executed quantity"
                  value={formData.executedQuantity}
                  onChange={handleChange}
                />
              </div>
              <div className="Filtered quantity col-span-1">
                <label
                  htmlFor="filteredQuantity"
                  className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
                >
                  Filtered Quantity
                </label>
                <input
                  className="bg-white border border-purple border-solid focus:border focus:border-gray focus:border-solid Input font-jost font-normal text-base my-2 py-2 px-4"
                  type="number"
                  min="0"
                  id="filteredQuantity"
                  name="filteredQuantity"
                  placeholder="Filtered quantity"
                  value={formData.filteredQuantity}
                  onChange={handleChange}
                />
              </div>
            </div> */
// }
