import i18next, { t } from "i18next";
import Input from "../../../Components/UI/Input/Input";
import Datepicker from "react-tailwindcss-datepicker";
import Button from "../../../Components/UI/Button/Button";
import { useEffect, useState } from "react";
import { addProject } from "../../../Services/api";
import Loader from "../../../Components/Loader/Loader";
import Select from "../../../Components/UI/Select/Select";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function formatBudget(amount) {
  // Remove non-numeric characters
  let numericValue = amount.replace(/\D/g, "");
  
  // Add commas as thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const AddProject = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  
  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    priority: "",
    role: "",
    location: "",
    sDate: {
      startDate: new Date(),
      endDate: new Date(),
    },
    eDate: {
      startDate: new Date(),
      endDate: new Date(),
    }
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    description: false,
    sDate: false,
    eDate: false,
    budget: false,
    priority: false,
    location: false,
    role: false,
  });

  // Helper functions
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const clearFormFields = () => {
    setFormData({
      name: "",
      description: "",
      budget: "",
      priority: "",
      role: "",
      location: "",
      sDate: {
        startDate: new Date(),
        endDate: new Date(),
      },
      eDate: {
        startDate: new Date(),
        endDate: new Date(),
      }
    });
    setFieldErrors({
      name: false,
      description: false,
      sDate: false,
      eDate: false,
      budget: false,
      priority: false,
      location: false,
      role: false,
    });
    setError(null);
  };

  const validateForm = () => {
    const budgetNumeric = formData.budget.replace(/\D/g, "");
    
    const newFieldErrors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
      sDate: !formData.sDate.startDate,
      eDate: !formData.eDate.endDate,
      budget: !budgetNumeric.trim() || +budgetNumeric < 10,
      priority: !formData.priority,
      location: !formData.location.trim(),
      role: !formData.role,
    };

    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setError({ message: "All fields are required and budget must be at least 10." });
      return false;
    }

    return true;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
    
    // Clear general error
    if (error) {
      setError(null);
    }
  };

  const handleDateChange = (field, date) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
    
    // Auto-adjust end date if start date is after it
    if (field === 'sDate' && date.startDate > formData.eDate.startDate) {
      setFormData(prev => ({
        ...prev,
        eDate: date
      }));
    }
    
    // Clear field error
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return null;
    }

    const budgetNumeric = formData.budget.replace(/\D/g, "");
    const formattedSDate = formatDate(formData.sDate.startDate);
    const formattedEDate = formatDate(formData.eDate.endDate);

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        sDate: formattedSDate,
        dueDate: formattedEDate,
        budget: budgetNumeric,
        projectPriority: formData.priority,
        createdBy: user._id,
        location: formData.location,
        role: formData.role,
      };

      setLoading(true);
      const res = await addProject(token, projectData);
      toast.success(t("toast.ProjectSuccess"));
      clearFormFields();
      
      return {
        projectId: res.addedProject._id,
        projectName: res.addedProject.name,
        members: res.addedProject.members,
      };
    } catch (err) {
      setError({
        message: err.response ? err.response.data.message : err.message,
      });
      console.error("Project creation error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePublic = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(e);
    if (result) {
      navigate("/Requests/TableOfQuantities", {
        state: {
          projectId: result.projectId,
          projectName: result.projectName,
          members: result.members,
        },
      });
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(e);
    if (result) {
      navigate("/AddProject/Invite", {
        state: {
          projectId: result.projectId,
          projectName: result.projectName,
        },
      });
    }
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleSubmit(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [formData]); // Add formData as dependency

  return (
    <div className="AddProject mx-1">
      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <h1 className="title ps-1 font-inter font-bold text-3xl text-black m-2 rtl:hidden">
            {t("AddProject")}
          </h1>
          <div className="wrapper bg-white rounded-3xl p-3">
            <form onSubmit={handleSubmit}>
              <Input
                label={t("PName")}
                placeholder={t("PName")}
                className={`bg-white border border-purple text-black w-full sm:w-full border-solid focus:border focus:border-purple focus:border-solid ${
                  fieldErrors.name && "border-red"
                }`}
                type="text"
                required
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                autoComplete="name"
                autoFocus
              />
              
              <div className="desc">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 capitalize font-jost text-base font-medium"
                >
                  {t("desc")}
                </label>
                <textarea
                  name="description"
                  id="description"
                  placeholder={t("desc")}
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`${
                    fieldErrors.description && "border-red"
                  } bg-white w-full sm:w-full rounded-xl border border-purple focus:outline-none font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid`}
                />
              </div>
              
              <div>
                <label className="font-jost text-base font-medium block">
                  {t("location")}
                </label>
                <input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  type="text"
                  placeholder={t("location")}
                  className={`${
                    fieldErrors.location && "border-red"
                  } bg-white w-full sm:w-full rounded-xl border border-purple focus:outline-none font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid`}
                />
              </div>
              
              <div className="flex flex-wrap gap-x-2 justify-between">
                <div className="flex flex-col my-2 sm:w-[49%] w-full">
                  <label
                    htmlFor="sDate"
                    className="flex ps-1 capitalize items-center gap-2 font-jost text-base font-medium"
                  >
                    {t("sDate")}
                  </label>
                  <Datepicker
                    useRange={false}
                    asSingle={true}
                    inputId="sDate"
                    value={formData.sDate}
                    onChange={(date) => handleDateChange('sDate', date)}
                    primaryColor="purple"
                    popoverClassName="!bg-purple-100"
                    popoverDirection="down"
                    toggleClassName="text-black absolute top-4 ltr:right-4 rtl:left-4"
                    inputClassName={`bg-white w-full focus:outline-none rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid ${
                      fieldErrors.sDate && "border-red"
                    }`}
                  />
                </div>
                <div className="flex flex-col my-2 sm:w-[49%] w-full">
                  <label
                    htmlFor="dDate"
                    className="flex items-center gap-2 font-jost text-base font-medium"
                  >
                    {t("dDate")}
                  </label>
                  <Datepicker
                    useRange={false}
                    asSingle={true}
                    primaryColor="purple"
                    value={formData.eDate}
                    minDate={formData.sDate.startDate}
                    onChange={(date) => handleDateChange('eDate', date)}
                    inputId="dDate"
                    popoverClassName="!bg-purple-100"
                    popoverDirection="down"
                    toggleClassName="text-black absolute top-4 ltr:right-4 rtl:left-4"
                    inputClassName={`bg-white w-full focus:outline-none rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid ${
                      fieldErrors.eDate && "border-red"
                    }`}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex flex-col mt-1 w-full mb-2 ms-0 sm:w-[49%]">
                  <Select
                    label={t("Your Role")}
                    isClearable
                    options={[
                      { value: "owner", label: t("owner") },
                      { value: "contractor", label: t("contractor") },
                      { value: "consultant", label: t("consultant") },
                    ]}
                    className={`bg-white ${
                      fieldErrors.role && "border-b border-red rounded-2xl"
                    }`}
                    value={formData.role}
                    placeholder={t("role")}
                    onChange={(value) => handleInputChange('role', value)}
                  />
                </div>
                <div className="flex flex-col mt-1 ms-0 w-full sm:w-[49%]">
                  <Select
                    label={t("Priority")}
                    isClearable
                    options={[
                      { value: "low", label: t("Low") },
                      { value: "medium", label: t("Medium") },
                      { value: "high", label: t("High") },
                    ]}
                    className={`bg-white ${
                      fieldErrors.priority && "border-b border-red rounded-2xl"
                    }`}
                    value={formData.priority}
                    placeholder={t("Priority")}
                    onChange={(value) => handleInputChange('priority', value)}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Input
                    label={t("budget")}
                    placeholder={t("budget")}
                    className={`bg-white text-black border ms-0 !py-2 border-purple !rounded-lg border-solid focus:border focus:border-purple focus:border-solid ${
                      fieldErrors.budget && "border-red"
                    }`}
                    type="text"
                    required
                    id="budget"
                    value={formatBudget(formData.budget)}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="text-center">
                  <p className="error text-red">{error.message}</p>
                </div>
              )}
              
              <div className="btn flex flex-wrap items-center justify-center md:justify-end my-3 gap-2">
                <button
                  type="button"
                  className="bg-white w-1/3 text-purple border border-purple border-solid font-jost py-3 rounded-xl capitalize opacity-100 disabled:opacity-50 text-base font-medium"
                  onClick={handleInvite}
                  disabled={loading}
                >
                  {loading ? t("loading") : t("invite")}
                </button>

                <button
                  type="button"
                  className="bg-[#C7B0DA] text-white border border-purple border-solid font-jost py-3 w-1/3 rounded-xl capitalize opacity-100 disabled:opacity-50 text-base font-medium"
                  onClick={handlePublic}
                  disabled={loading}
                >
                  {loading ? t("loading") : t("Public")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AddProject;