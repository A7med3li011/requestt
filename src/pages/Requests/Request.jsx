import React, { useEffect, useState } from "react";
import Button from "../../Components/UI/Button/Button";
import Loader from "../../Components/Loader/Loader";
import CheckboxGroup from "../../Components/UI/CheckboxGroup/CheckboxGroup";
import avatar from "../../assets/images/Avatar.jpg";
import signature from "../../assets/images/signature.png";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getAllActionCodes,
  getAllDiscipline,
  getAllMembersByProject,
  getAllProjectsForUser,
  getAllReasons,
  getAllUnits,
  sendRequest,
  updateProject,
  updateTask,
} from "../../Services/api";
import { useLocation, useNavigate } from "react-router-dom";
import i18next, { t } from "i18next";
import Select from "../../Components/UI/Select/Select";
import ProfileAvatar from "../../Components/UI/profilePic/profilePic";
import i18n from "../../config/i18n";
import { Image } from "../../Components/UI/Image/image";
import axios from "axios";

const RequestForm = ({
  ReqTitle,
  // showProjectName,
  showDiscipline,
  showActionCodes,
  showReasons,
  ApproveTitle,
}) => {
  const lang = i18next.language;
  const user = useSelector((state) => state.auth.user);

  const token = useSelector((state) => state.auth.token);
  // console.log(token, "ssssssss");
  const [IsOwner, setIsOwner] = useState(user.role.jobTitle === "owner");
  const [IsConsultant, setIsConsultant] = useState(
    user.role.jobTitle === "consultant"
  );
  const [IsContractor, setIsContractor] = useState(
    user.role.jobTitle === "contractor"
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, projectName, members, fromTask, TaskId, TaskName } =
    location.state || {};
  const [actionCodes, setActionCodes] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isReviewed, setIsReviewed] = useState(false);
  const [Reasons, setReasons] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedActionCodes, setSelectedActionCodes] = useState(null);
  const [selectedDisciplines, setSelectedDisciplines] = useState(null);
  const [refNO, setRefNO] = useState("");
  // const [comments, setComments] = useState([]);
  // const [commentInput, setCommentInput] = useState("");
  const [Desc, setDesc] = useState("");
  const [supplier, setSupplier] = useState("");
  const [approvedMaterial, setApprovedMaterial] = useState("");
  const [BOQ, setBOQ] = useState("");
  const [QTY, setQTY] = useState("");
  const [units, setUnits] = useState([]);
  const [UnitsLoading, setUnitsLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [Location, setLocation] = useState("");
  const [WorkArea, setWorkArea] = useState("");
  const [cell, setCell] = useState("");
  const [InspectionDate, setInspectionDate] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Remarks, setRemarks] = useState("");
  const [MembersInProject, setMembersInProject] = useState([]);
  const [IsWorkRequest, setIsWorkRequest] = useState(
    ReqTitle === "Work Request"
  );
  const [newSig, setnewSig] = useState("");
  const [IsReqForMaterial, setIsReqForMaterial] = useState(
    ReqTitle === "Request For Material"
  );
  const [IsReqForDocumentSubmittal, setIsReqForDocumentSubmittal] = useState(
    ReqTitle === "Request For Document Submittal"
  );
  const [IsRfiReq, setIsRfiReq] = useState(
    ReqTitle === "Request For Inspection(RFI)"
  );
  const [signature, setSignature] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  async function getUserData() {
    await axios
      .get(`https://api.request-sa.com/api/v1/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setnewSig(res.data.results.signature))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getUserData();
  }, []);
  useEffect(() => {
    const savedSignature = localStorage.getItem("Signature");
    if (savedSignature) {
      setSignature(savedSignature);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          actionCodeResponse,
          disciplineResponse,
          ReasonsResponse,
          projectsResponse,
          UnitsData,
          MemberInProject,
        ] = await Promise.all([
          getAllActionCodes(),
          getAllDiscipline(),
          getAllReasons(),
          getAllProjectsForUser(user._id, token),
          getAllUnits(),
          getAllMembersByProject(projectId, lang),
        ]);
        setActionCodes(actionCodeResponse.results);
        setDisciplines(disciplineResponse.results);
        setReasons(ReasonsResponse.reasons);
        setProjects(projectsResponse.results);
        setMembersInProject(MemberInProject.admins);
        MemberInProject;

        setUnits(
          UnitsData.results.map((unit) => ({
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
  }, [user._id, token]);

  const handleReviewChange = (e) => {
    setIsReviewed(e.target.checked);
  };

  const handleUpdate = async () => {
    try {
      "ApproveTitle :", ApproveTitle;
      if (TaskId) {
        const res = await updateTask(token, TaskId, user._id, {
          [ApproveTitle]: true,
        });

        "res from update task => ", res;
      } else {
        const res = await updateProject(projectId, {
          [ApproveTitle]: true,
        });

        "res from update project => ", res;
      }
    } catch (error) {
      console.error("Failed to update tasks:", error);
      toast.error(t("Failed to update tasks"));
    }
  };

  useEffect(() => {
    "selectedDisciplines", selectedDisciplines;
    "selectedReasons", selectedReasons;
  }, [selectedDisciplines, selectedReasons]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    // if (!selectedDisciplines) {
    //   setError("All fields are required");
    //   setLoading(false);
    //   return;
    // }

    // Base request data
    const requestData = {
      // refNo: refNO,
      title: ReqTitle,
      discipline: selectedDisciplines,
      description: Desc,
      project: projectId,
      date: new Date().toLocaleDateString(),
      createdBy: user._id,
    };

    // Add dynamic fields based on conditions
    const addConditionalFields = () => {
      if (showReasons) requestData.reason = selectedReasons;
      if (fromTask) {
        Object.assign(requestData, { task: TaskId });
      }
      if (IsReqForDocumentSubmittal) {
        Object.assign(requestData, {
          remarks: Remarks,
          qty: QTY,
          boqItemNo: BOQ,
          type: "requestForDocumentSubmittal",
        });
      }

      if (IsReqForMaterial) {
        Object.assign(requestData, {
          qty: QTY,
          boqItemNo: BOQ,
          deliveryNoteNo: deliveryNote,
          unit: selectedUnit,
          approvedMaterialSubmittalNo: approvedMaterial,
          supplier,
          type: "requestForMaterialAndEquipment",
        });
      }

      if (IsRfiReq) {
        Object.assign(requestData, {
          cell,
          boqItemNo: BOQ,
          location: Location,
          unit: selectedUnit,
          inspectionDate: new Date().toISOString(),
          quantity: Quantity,
          type: "requestForInspaction",
        });
      }

      if (IsWorkRequest) {
        Object.assign(requestData, {
          boqItemNo: BOQ,
          location: Location,
          workArea: WorkArea,
          inspectionDate: new Date().toISOString(),
          cell,
          type: "workRequest",
        });
      }

      if (IsOwner) {
        Object.assign(requestData, {
          ownerStatus: "approved",
        });
      }

      if (IsConsultant) {
        Object.assign(requestData, {
          consultantStatus: "approved",
        });
      }

      if (IsContractor) {
        Object.assign(requestData, {
          contractorStatus: "approved",
        });
      }
    };

    // Execute the conditional logic
    addConditionalFields();

    // Debug the request data
    "Request Data:", requestData;

    try {
      // Send request
      await sendRequest(token, requestData);

      // Success handling
      toast.success(t("toast.ReqSentSuccess"));
      resetForm();
      handleUpdate();
      navigate("/Models", {
        state: { projectId, projectName, members, fromTask, TaskId, TaskName },
      });
      // window.location.reload()
    } catch (error) {
      // Error handling
      console.error("Error submitting form:", error);
      setError("Failed to submit form");
    } finally {
      // Always stop the loading spinner
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRefNO("");
    setSelectedProject(null);
    setSelectedActionCodes([]);
    setSelectedDisciplines([]);
    setDesc("");
    // setComments([]);
    // setCommentInput("");
  };

  // const handleAddComment = () => {
  //   if (commentInput.trim() !== "") {
  //     setComments([...comments, { text: commentInput, isEditing: false }]);
  //     setCommentInput("");
  //   }
  // };

  // const handleEditComment = (index) => {
  //   const newComments = [...comments];
  //   newComments[index].isEditing = !newComments[index].isEditing;
  //   setComments(newComments);
  // };

  // const handleUpdateComment = (index, newText) => {
  //   const newComments = [...comments];
  //   newComments[index].text = newText;
  //   setComments(newComments);
  // };

  // const handleSaveComment = (index) => {
  //   const newComments = [...comments];
  //   newComments[index].isEditing = false;
  //   setComments(newComments);
  // };

  // const handleDeleteComment = (index) => {
  //   const newComments = comments.filter((_, i) => i !== index);
  //   setComments(newComments);
  // };
  // const customStyles = {
  //   control: (provided) => ({
  //     ...provided,
  //     backgroundColor: "white",
  //     border: "1px solid var(--gray)",
  //     borderRadius: "12px",
  //     padding: "0  15px",
  //     boxShadow: "none",
  //     "&:hover": { borderColor: "var(--gray)" },
  //   }),
  //   placeholder: (provided) => ({
  //     ...provided,
  //     color: "#999",
  //   }),
  //   dropdownIndicator: (provided) => ({
  //     ...provided,
  //     color: "var(--gray)",
  //     "&:hover": { color: "var(--gray)" },
  //   }),
  //   indicatorSeparator: () => ({ display: "none" }),
  //   option: (provided, state) => ({
  //     ...provided,
  //     backgroundColor: state.isSelected ? "#CCABDA66" : "white",
  //     color: state.isSelected ? "var(--purple)" : "var(--gray)",
  //     padding: "10px",
  //     borderRadius: "8px",
  //     cursor: "pointer",
  //     "&:hover": {
  //       backgroundColor: "var(--purple)",
  //       color: "white",
  //     },
  //   }),
  //   menu: (provided) => ({
  //     ...provided,
  //     borderRadius: "10px",
  //     marginTop: "4px",
  //     boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  //   }),
  // };

  return (
    <div className="RequestForm">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="header bg-white p-4 rounded-l-3xl">
            <h5 className="font-bold text-base">{ReqTitle}</h5>
          </div>
          <div className="content bg-white p-4 rounded-3xl my-6 ">
            <form onSubmit={handleSubmit}>
              <div className="flex items-start lg:items-center justify-between flex-col lg:flex-row gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-3">
                    <ProfileAvatar
                      name={user.name}
                      profilePic={user.profilePic}
                      className={`!w-16 !h-16 !text-3xl`}
                    />
                    <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                      {user.name}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    {MembersInProject?.consultant ? (
                      <>
                        <ProfileAvatar
                          name={MembersInProject?.consultant?.name}
                          profilePic={MembersInProject?.consultant?.profilePic}
                          className={`!w-16 !h-16`}
                        />
                        <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                          {MembersInProject?.consultant?.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <ProfileAvatar
                          name={"ConsultantName"}
                          profilePic={null}
                          className={`!w-16 !h-16`}
                        />
                        <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                          {t("ConsultantName")}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    {MembersInProject?.contractor ? (
                      <>
                        <ProfileAvatar
                          name={MembersInProject?.contractor?.name}
                          profilePic={MembersInProject?.contractor?.profilePic}
                          className={`!w-16 !h-16`}
                        />
                        <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                          {MembersInProject?.contractor?.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <ProfileAvatar
                          name={"ContractorName"}
                          profilePic={null}
                          className={`!w-16 !h-16`}
                        />
                        <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                          {t("ContractorName")}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col ">
                  <div className="Ref flex items-center gap-2 ">
                    <label
                      htmlFor="Ref"
                      className="font-bold text-base text-gray-dark"
                    >
                      {t("REF NO")}
                    </label>
                    <input
                      type="text"
                      id="Ref"
                      disabled
                      placeholder={t("REF NO")}
                      onChange={(e) => setRefNO(e.target.value)}
                      className="bg-white  border-gray rounded-lg p-1 max-w-52"
                    />
                  </div>
                  <div className="Date flex items-center gap-2 my-6 ">
                    <label
                      htmlFor="currentDay"
                      className="font-bold text-base text-gray-dark"
                    >
                      {t("date")}
                    </label>
                    <div className="inputs">
                      <input
                        type="text"
                        id="currentDay"
                        name="Date"
                        value={`${currentDay}`}
                        className="bg-white  border-gray rounded-2xl max-w-12 font-medium text-center mx-1 "
                        disabled
                      />
                      <input
                        type="text"
                        id="currentMonth"
                        name="Date"
                        value={`${currentMonth}`}
                        className="bg-white  border-gray rounded-2xl max-w-12 font-medium text-center mx-1 "
                        disabled
                      />
                      <input
                        type="text"
                        id="currentYear"
                        name="Date"
                        value={`${currentYear}`}
                        className="bg-white  border-gray rounded-2xl max-w-16 font-medium text-center mx-1 "
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="bg-gray my-4" />
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{t("PName")} : </h3>
                <span className="text-sm  font-bold">
                  {TaskName ? TaskName : projectName}
                </span>
              </div>
              <hr className="bg-gray my-4" />

              {showActionCodes && (
                <div>
                  <label
                    htmlFor="desc"
                    className="font-bold text-base text-gray"
                  >
                    {t("Action Code")}
                  </label>
                  <input
                    placeholder={t("Action Code")}
                    disabled
                    className="bg-white   my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                  />
                </div>
              )}
              <div className="feedback my-4">
                <h5 className="font-bold  text-base text-gray">
                  {t("Comment")}
                </h5>
                <input
                  type="text"
                  disabled
                  value={t("Comment")}
                  className="bg-white w-full my-1 text-gray   border-solid border-gray rounded-2xl p-2"
                />

                {/* {showReasons && (
                <CheckboxGroup
                  label={t("Reason")}
                  options={Reasons?.map((item) => ({
                    id: item._id,
                    label: item.name,
                  }))}
                  namePrefix="reason"
                  selectedValue={selectedReasons}
                  onChange={setSelectedReasons}
                />
              )}
              {showDiscipline && (
                <CheckboxGroup
                  label={t("Discipline")}
                  options={disciplines.map((item) => ({
                    id: item._id,
                    label: item.name,
                  }))}
                  namePrefix="discipline"
                  selectedValue={selectedDisciplines}
                  onChange={setSelectedDisciplines}
                />
              )}
              {showActionCodes && (
                <CheckboxGroup
                  label={t("Action Code")}
                  options={actionCodes.map((item) => ({
                    id: item._id,
                    label: item.name,
                  }))}
                  namePrefix="actionCode"
                  selectedValue={selectedActionCodes}
                  onChange={setSelectedActionCodes}
                />
              )} */}

                <div className="flex items-center gap-3 my-4 mb-8">
                  <div className="flex flex-col gap-2 ">
                    <h5 className="font-bold text-base text-gray">
                      {t("Reviewed by")} :
                    </h5>
                    {/* <span className="font-medium text-sm"></span> */}
                    {/* <img src={signature} alt="signature" className="w-14 h-14" /> */}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h5 className="font-bold text-base text-gray">
                      {t("Noted by")} :
                    </h5>
                    {/* <span className="font-medium text-sm"></span> */}
                    {/* <img src={signature} alt="signature" className="w-14 h-14" /> */}
                  </div>
                </div>

                {/* <div className="comment flex flex-col my-6  ">
                <label
                  htmlFor="comment"
                  className="font-bold text-base text-gray-dark flex justify-start"
                >
                  {t("consultant comments")}
                </label>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  className="bg-white border border-gray rounded-2xl p-2"
                  placeholder={t("Comment")}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button
                  type="button"
                  className="text-purple underline underline-offset-1 text-end my-2 mx-1"
                  onClick={handleAddComment}
                >
                  {t("+add new")}
                </button>
              </div>

              <div className="comments-container my-6 ">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className="comment-item flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2"
                  >
                    {comment.isEditing ? (
                      <input
                        type="text"
                        value={comment.text}
                        className="w-full max-w-3xl h-full  p-1 rounded-md"
                        onChange={(e) =>
                          handleUpdateComment(index, e.target.value)
                        }
                      />
                    ) : (
                      <span>{comment.text}</span>
                    )}
                    <div className="flex items-center  gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (comment.isEditing) {
                            handleSaveComment(index);
                          } else {
                            handleEditComment(index);
                          }
                        }}
                      >
                        {comment.isEditing ? (
                          <>
                            <FaSave className="text-blue w-5 h-5" />
                          </>
                        ) : (
                          <>
                            <MdOutlineEdit className="text-blue w-5 h-5" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(index)}
                      >
                        <MdDelete className="text-red w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div> */}

                <hr className="bg-gray my-4" />

                <div className="grid  grid-cols-2 lg:grid-cols-4  my-4 gap-3">
                  <div className="col-span-2">
                    {showDiscipline && (
                      <Select
                        options={disciplines.map((item) => ({
                          value: item._id,
                          label: item.name,
                        }))}
                        placeholder={t("Discipline")}
                        disabled={UnitsLoading}
                        label={t("Discipline")}
                        value={selectedDisciplines}
                        onChange={(e) => {
                          "Discipline Selected:", e;
                          setSelectedDisciplines(e);
                        }}
                        className={`bg-white `}
                        InputClassName={`border border-gray  rounded-2xl `}
                      />
                    )}
                  </div>
                  <div className="col-span-2">
                    {showReasons && (
                      <Select
                        options={Reasons.map((item) => ({
                          value: item._id,
                          label: item.name,
                        }))}
                        placeholder={t("Reason")}
                        disabled={UnitsLoading}
                        label={t("Reason")}
                        value={selectedReasons}
                        onChange={(e) => setSelectedReasons(e)}
                        className={`bg-white `}
                        InputClassName={`border border-gray  rounded-2xl `}
                      />
                    )}
                  </div>
                </div>
                <div className="desc ">
                  <label
                    htmlFor="desc"
                    className="font-bold text-base text-gray-dark"
                  >
                    {t("desc")}
                  </label>
                  <input
                    type="text"
                    id="desc"
                    placeholder={t("desc")}
                    value={Desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                  />
                </div>
              </div>
              {IsReqForDocumentSubmittal && (
                <>
                  <div className="Remarks">
                    <label
                      htmlFor="Remarks"
                      className="font-bold text-base text-gray-dark"
                    >
                      {t("remarks")}
                    </label>
                    <input
                      type="text"
                      id="Remarks"
                      placeholder={t("remarks")}
                      value={Remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                    />
                  </div>
                </>
              )}
              {IsReqForMaterial && (
                <div className="grid grid-col-2 lg:grid-cols-4 gap-3 my-4">
                  <div className="col-span-2">
                    <label
                      htmlFor="supplier"
                      className="font-bold text-base text-gray-dark"
                    >
                      {t("supplier")}
                    </label>
                    <input
                      type="text"
                      id="supplier"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder={t("supplier")}
                      className="bg-white my-1 border  w-full  text-gray border-solid border-gray rounded-2xl p-2"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col items-start">
                    <label
                      htmlFor="approved"
                      className="font-bold text-base text-gray-dark"
                    >
                      {t("approved material submittal no")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      id="approved"
                      placeholder="123"
                      value={approvedMaterial}
                      onChange={(e) => setApprovedMaterial(e.target.value)}
                      className="bg-white border my-1    text-gray border-solid border-gray rounded-2xl p-2"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-8 gap-1 lg:gap-3 my-2">
                {(IsReqForDocumentSubmittal ||
                  IsReqForMaterial ||
                  IsWorkRequest ||
                  IsRfiReq) && (
                  <div className="flex flex-col lg:items-start  gap-2 col-span-2">
                    <label
                      htmlFor="BOQ item no"
                      className="font-bold text-base text-gray-dark"
                    >
                      {t("BOQ item no")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      id="BOQ item no"
                      placeholder="00"
                      value={BOQ}
                      onChange={(e) => setBOQ(e.target.value)}
                      className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
                    />
                  </div>
                )}
                {(IsReqForDocumentSubmittal || IsReqForMaterial) && (
                  <div className="flex flex-col lg:items-start  gap-2 col-span-2">
                    <label
                      htmlFor="QTY"
                      className="font-bold text-base text-gray-dark"
                    >
                      {t("qty")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      id="QTY"
                      placeholder="00"
                      value={QTY}
                      onChange={(e) => setQTY(e.target.value)}
                      className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
                    />
                  </div>
                )}
                {(IsWorkRequest || IsRfiReq) && (
                  <>
                    <div className="flex flex-col lg:items-start gap-2 col-span-2">
                      <label
                        htmlFor="cell"
                        className="font-bold text-base text-gray-dark"
                      >
                        {t("cell")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        id="cell"
                        placeholder={t("cell")}
                        value={cell}
                        onChange={(e) => setCell(e.target.value)}
                        className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
                      />
                    </div>
                    <div className="flex flex-col lg:items-start gap-2 col-span-2">
                      <label
                        htmlFor="currentDay"
                        className="font-bold text-base text-gray-dark"
                      >
                        {t("inspectionDate")}
                      </label>
                      <div className="Date flex items-center gap-2 ">
                        <div className="inputs">
                          <input
                            type="text"
                            id="currentDay"
                            name="Date"
                            value={`${currentDay}`}
                            className="bg-white border border-gray rounded-2xl max-w-12 font-medium text-center mx-1 "
                            disabled
                          />
                          <input
                            type="text"
                            id="currentMonth"
                            name="Date"
                            value={`${currentMonth}`}
                            className="bg-white border border-gray rounded-2xl max-w-12 font-medium text-center mx-1 "
                            disabled
                          />
                          <input
                            type="text"
                            id="currentYear"
                            name="Date"
                            value={`${currentYear}`}
                            className="bg-white border border-gray rounded-2xl max-w-16 font-medium text-center mx-1 "
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {(IsReqForMaterial || IsRfiReq) && (
                  <div className="flex flex-col gap-2 col-span-2">
                    <Select
                      options={units}
                      placeholder={t("Unit")}
                      disabled={UnitsLoading}
                      label={t("Unit")}
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e)}
                      className={`bg-white lg:mx-4`}
                      InputClassName={` `}
                      loading={UnitsLoading}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2   gap-3 my-2">
                {IsReqForMaterial && (
                  <div className="flex flex-col   gap-2 col-span-2">
                    <label
                      htmlFor="delivery note no"
                      className="font-bold text-base text-gray-dark "
                    >
                      {t("delivery note no")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      id="delivery note no"
                      placeholder="00"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
                    />
                  </div>
                )}
              </div>
              {IsWorkRequest && (
                <div className="WorkArea col-span-2">
                  <label
                    htmlFor="WorkArea"
                    className="font-bold text-base text-gray-dark"
                  >
                    {t("Work Area")}
                  </label>
                  <input
                    type="text"
                    id="WorkArea"
                    placeholder={t("Work Area")}
                    value={WorkArea}
                    onChange={(e) => setWorkArea(e.target.value)}
                    className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                  />
                </div>
              )}
              {IsRfiReq && (
                <div className="Quantity col-span-2">
                  <label
                    htmlFor="Quantity"
                    className="font-bold text-base text-gray-dark "
                  >
                    {t(" Quantity")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    id="Quantity"
                    placeholder={t(" Quantity")}
                    value={Quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                  />
                </div>
              )}
              {(IsWorkRequest || IsRfiReq) && (
                <div className="Location col-span-2">
                  <label
                    htmlFor="Location"
                    className="font-bold text-base text-gray-dark "
                  >
                    {t("location")}
                  </label>
                  <input
                    type="text"
                    id="location"
                    placeholder={t("location")}
                    value={Location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 ">
                <h5 className="font-bold text-base text-gray-dark">
                  {t("submitted by")} :
                </h5>
                <span className="font-medium text-sm">{user?.name}</span>
                {newSig ? (
                  <Image
                    src={newSig}
                    alt={"Signature"}
                    className={"w-20 h-20"}
                  />
                ) : (
                  <p>{t("No signature found")}</p>
                )}
              </div>

              {/* <div className="flex flex-col gap-2 mt-4">
                <h5 className="font-bold text-base text-gray-dark">
                  submitted by:
                </h5>
                <span className="font-medium text-sm">fadl mohamed</span>
                <img src={signature} alt="signature" className="w-14 h-14" />
              </div> */}
              <div className="review flex items-center gap-2 m-2">
                <input
                  type="checkbox"
                  name="review"
                  id="review"
                  onChange={handleReviewChange}
                  className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
                />
                <label
                  htmlFor="review"
                  className="text-purple font-medium text-base underline select-none"
                >
                  {t(
                    "Please review the following item(s) and return a copy with your Action code"
                  )}
                </label>
              </div>
              {error && (
                <div className="error-message text-red text-center">
                  {error}
                </div>
              )}
              <div className="send text-end mt-5">
                <Button disabled={!isReviewed} type="submit">
                  {t("Send")}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default RequestForm;
