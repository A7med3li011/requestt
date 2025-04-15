import { t } from "i18next";
import avatar from "../../assets/images/Avatar.jpg";
import signature from "../../assets/images/signature.png";
import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Loader from "../../Components/Loader/Loader";
import ProfileAvatar from "../../Components/UI/profilePic/profilePic";
import Button from "../../Components/UI/Button/Button";
import { toast } from "react-toastify";
import Select from "../../Components/UI/Select/Select";
import { Image } from "../../Components/UI/Image/image";
import axios from "axios";
import {
  getAllActionCodes,
  getAllDiscipline,
  getAllMembersByProject,
  getAllProjectsForUser,
  getAllReasons,
  getAllUnits,
  getModelById,
  updateModel,
} from "../../Services/api";
const ViewRequest = () => {
  const [Location, setLocation] = useState("");
  const [model, setModel] = useState(null);
  const [Desc, setDesc] = useState("");
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [UnitsLoading, setUnitsLoading] = useState(true);
  const [selectedDisciplines, setSelectedDisciplines] = useState(null);
  const [Remarks, setRemarks] = useState("");
  const [selectedReasons, setSelectedReasons] = useState(null);
  const [IsOwner, setIsOwner] = useState(user.role.jobTitle === "owner");
  const [WorkArea, setWorkArea] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [approvedMaterial, setApprovedMaterial] = useState("");
  const [IsConsultant, setIsConsultant] = useState(
    user.role.jobTitle === "consultant"
  );
  const [IsContractor, setIsContractor] = useState(
    user.role.jobTitle === "contractor"
  );
  const [selectedUnit, setSelectedUnit] = useState("");
  const [Comment, setComment] = useState("");
  const [ActionCodes, setActionCodes] = useState([]);
  const [selectedActionCodes, setSelectedActionCodes] = useState(null);
  const [ActionCodeLoading, setActionCodeLoading] = useState(true);
  const [projectData, setPRojectData] = useState("");
  const [Reasons, setReasons] = useState([]);
  const [Quantity, setQuantity] = useState("");
  const [BOQ, setBOQ] = useState("");
  const [QTY, setQTY] = useState("");
  const [units, setUnits] = useState([]);
  const [cell, setCell] = useState("");
  const [supplier, setSupplier] = useState("");
  const location = useLocation();
  const { ModelId } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [modelData, actionCodeData] = await Promise.all([
          getModelById(token, ModelId),
          getAllActionCodes(),
        ]);
        getProjectData(modelData?.results?.project?._id);
        setModel(modelData?.results);
        setComment(modelData?.results?.comment || "");
        setSelectedActionCodes(modelData?.results?.actionCode?._id || "");
        modelData;
        setActionCodes(actionCodeData.results);
        setActionCodeLoading(false);
        model;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (ModelId) fetchData();
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
        ]);
        setActionCodes(actionCodeResponse.results);
        setDisciplines(disciplineResponse.results);
        setReasons(ReasonsResponse.reasons);

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

  async function getProjectData(id) {
    await axios
      .get(`https://api.request-sa.com/api/v1/project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => setPRojectData(res.data.results))
      .catch((err) => console.log(err));
  }
  const handleApprove = async (e) => {
    if (!Comment) {
      console.log(Comment, selectedActionCodes);
      return;
    }
    console.log("ahmed");
    try {
      // Prepare payload dynamically based on roles
      const getApprovalPayload = () => {
        const payload = {};

        if (IsOwner) payload.ownerStatus = "approved";
        if (IsConsultant) payload.consultantStatus = "approved";
        if (IsContractor) payload.contractorStatus = "approved";
        if (Comment) payload.comment = Comment;
        if (selectedActionCodes) {
          payload.actionCode = selectedActionCodes;
          payload.firstUpdatedBy = user._id;
        }
        if (selectedDisciplines || model?.discipline?.name) {
          payload.secondUpdatedBy = user._id;
        }
        if (selectedDisciplines) {
          payload.discipline = selectedDisciplines;
        }
        if (Remarks) {
          payload.remarks = Remarks;
        }
        if (Desc) {
          payload.description = Desc;
        }
        if (QTY) {
          payload.qty = QTY;
        }
        if (BOQ) {
          payload.boqItemNo = BOQ;
        }
        if (selectedReasons) {
          payload.reason = selectedReasons;
        }
        if (Location) {
          payload.location = Location;
        }
        if (WorkArea) {
          payload.workArea = WorkArea;
        }
        if (cell) {
          payload.cell = cell;
        }
        if (selectedUnit) {
          payload.unit = selectedUnit;
        }
        if (deliveryNote) {
          payload.deliveryNoteNo = deliveryNote;
        }
        if (approvedMaterial) {
          payload.approvedMaterialSubmittalNo = approvedMaterial;
        }
        if (supplier) {
          payload.supplier = supplier;
        }
        if (Quantity) {
          payload.quantity = Quantity;
        }

        // quantity: Quantity,
        // remarks: Remarks,
        // qty: QTY,
        // boqItemNo: BOQ,

        // Determine how many "pending" statuses exist
        // const pendingStatuses = [
        //   ownerStatus,
        //   consultantStatus,
        //   contractorStatus,
        // ].filter((status) => status === "pending").length;

        // if (pendingStatuses > 1) {
        //   // If more than one role is "pending", set reviewedBy to current user
        //   return { reviewedBy: user._id };
        // } else if (pendingStatuses === 1) {
        //   // If only one role is "pending", set notedBy to current user
        //   return { notedBy: user._id };
        // }

        // Return an empty payload if no conditions are met
        payload;
        return payload;
      };

      const payload = getApprovalPayload();
      "Approval Payload:", payload;

      if (Object.keys(payload).length === 0) {
        console.error("No valid role detected for approval.");
        toast.error("Approval failed: Invalid role.");
        return;
      }

      // Perform the API call
      const res = await updateModel(token, ModelId, payload);
      "API Response:", res;

      // Handle success
      toast.success("Request approved successfully.");
      window.location.reload();
    } catch (error) {
      // Error handling
      console.error("Error during approval:", error);
      toast.error("Failed to approve the request.");
    }
  };

 
  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "dd-MM-yyy");
  };
  if (loading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }
  
  const ApprovalStatus = ({ status, label, reviewer }) => (
    <div className="flex flex-col gap-2">
      <h5 className="font-bold text-base text-gray-dark">{t(label)} :</h5>
      {status === "approved" ? (
        <span className="font-medium text-sm text-gray">{t("Approved")}</span>
      ) : (
        <>
          <span className="font-medium text-sm">
            {reviewer?.name || t("No name available")}
          </span>
          {reviewer?.signature ? (
            <Image
              src={reviewer?.signature}
              alt={"Signature"}
              className={"w-20 h-20"}
            />
          ) : (
            <p className="text-xs">{t("No signature found")}</p>
          )}
        </>
      )}
    </div>
  );
  return (
    <div className="ViewRequest">
      <div className="header bg-white p-4 rounded-l-3xl">
        <h5 className="font-bold text-base">{model?.title}</h5>
      </div>
      <div className="content bg-white p-2 lg:p-4 rounded-3xl my-6 ">
        <div className="flex items-start lg:items-center justify-between flex-col lg:flex-row gap-3">
          <div className="flex items-center  gap-3">
            {model?.owner ? (
              <div className="flex flex-col items-center gap-3">
                <ProfileAvatar
                  name={model?.owner?.companyName}
                  profilePic={
                    model?.owner?.companyLogo
                      ? model?.owner?.companyLogo
                      : model?.owner?.name
                  }
                  className={`!w-16 !h-16`}
                />
                <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                  {model?.owner?.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <ProfileAvatar
                  name={"owner Name"}
                  profilePic={
                    model?.owner?.companyLogo ? model?.owner?.companyLogo : ""
                  }
                  className={`!w-16 !h-16`}
                />
                <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                  {t("ownerName")}
                </span>
              </div>
            )}
            {model?.consultant ? (
              <div className="flex flex-col items-center gap-3">
                <ProfileAvatar
                  name={model?.consultant?.companyName}
                  profilePic={
                    model?.consultant?.companyLogo
                      ? model?.consultant?.companyLogo
                      : ""
                  }
                  className={`!w-16 !h-16 !text-3xl`}
                />
                <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                  {model?.consultant?.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <ProfileAvatar
                  name={"ConsultantName"}
                  profilePic={
                    model?.consultant?.companyLogo
                      ? model?.consultant?.companyLogo
                      : model?.consultant?.name
                  }
                  className={`!w-16 !h-16`}
                />
                <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                  {t("ConsultantName")}
                </span>
              </div>
            )}
            {model?.contractor ? (
              <div className="flex flex-col items-center gap-3">
                <ProfileAvatar
                  name={model?.contractor?.companyName}
                  profilePic={
                    model?.contractor?.companyLogo !== ""
                      ? model?.contractor?.companyLogo
                      : ""
                  }
                  className={`!w-16 !h-16`}
                />
                <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                  {model?.contractor?.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <ProfileAvatar
                  name={"ContractorName"}
                  profilePic={
                    model?.contractor?.companyLogo !== ""
                      ? model?.contractor?.companyLogo
                      : model?.contractor?.name
                  }
                  className={`!w-16 !h-16`}
                />
                <span className="text-purple-dark  underline underline-offset-1 font-bold  text-sm">
                  {t("ContractorName")}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col ">
            <div className="Ref flex items-center gap-2 my-6">
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
                value={model?.refNo}
                className="bg-white border border-gray rounded-lg p-1  lg:max-w-52"
              />
            </div>
            <div className="Date flex items-center gap-2 ">
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
                  value={formatDate(model?.date)}
                  className="bg-white border border-gray rounded-2xl  font-medium text-center mx-1 "
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="bg-gray my-4" />
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{t("PName")} : </h3>
          <span className="text-sm  font-bold"> {model?.project?.name}</span>
        </div>
        <hr className="bg-gray my-4" />

        {((IsOwner && model?.ownerStatus === "pending") ||
          (IsConsultant && model?.consultantStatus === "pending") ||
          (IsContractor && model?.contractorStatus === "pending")) &&
        !model?.actionCode ? (
          <div className="flex flex-col justify-start gap-2">
            <h5 className="font-bold text-base text-gray-dark">
              {t("Action Code")}
            </h5>
            <Select
              isDisabled={
                user?._id == projectData?.consultant?._id ? false : true
              }
              options={ActionCodes.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
              placeholder={t("Action Code")}
              disabled={ActionCodeLoading}
              loading={ActionCodeLoading}
              value={selectedActionCodes}
              required
              onChange={(e) => setSelectedActionCodes(e)}
              className={`bg-white `}
              InputClassName={`border border-gray  rounded-2xl `}
            />
          </div>
        ) : model?.actionCode ? (
          <div className="flex flex-col    gap-2">
            <h5 className="font-bold text-base text-gray-dark">
              {t("Action Code")}
            </h5>
            <input
              type="text"
              disabled
              value={model?.actionCode?.name}
              className="bg-white border    text-start border-solid border-gray rounded-2xl p-2"
            />
          </div>
        ) : (
          <>
            <label htmlFor="desc" className="font-bold text-base text-gray">
              {t("Action Code")}
            </label>
            <input
              placeholder={t("Action Code")}
              disabled
              className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
            />
          </>
        )}

        {((IsOwner && model?.ownerStatus === "pending") ||
          (IsConsultant && model?.consultantStatus === "pending") ||
          (IsContractor && model?.contractorStatus === "pending")) &&
        model?.firstUpdatedBy === null ? (
          <div className="feedback my-4">
            <h5 className="font-bold  text-base">
              {t("Comment")}{" "}
              <span className="text-gray font-medium">(Not required)</span>
            </h5>
            <input
              type="text"
              disabled={
                user?._id == projectData?.consultant?._id ? false : true
              }
              placeholder={t("+add comment")}
              value={Comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-white w-full my-1 text-gray border  border-solid border-gray rounded-2xl p-2"
            />
          </div>
        ) : model?.comment && model?.comment.length > 0 ? (
          <>
            <h5 className="font-bold text-base">{t("Comment")}</h5>
            {model?.comment.map((comment, index) => (
              <div key={index} className="feedback my-4">
                <input
                  type="text"
                  disabled
                  value={comment}
                  className="bg-white w-full my-1 text-gray border border-solid border-gray rounded-2xl p-2"
                />
              </div>
            ))}
          </>
        ) : (
          <div className="feedback my-4">
            <h5 className="font-bold  text-base">{t("Comment")}</h5>
            <input
              type="text"
              disabled
              value={t("No comments available")}
              className="bg-white w-full my-1 text-gray border  border-solid border-gray rounded-2xl p-2"
            />
          </div>
        )}

        {/* <div className="flex items-center gap-3 my-4">
          {model?.firstUpdatedBy !== null ? (
            <div className="flex flex-col gap-2">
              <h5 className="font-bold text-base text-gray-dark">
                {t("Reviewed by")} :
              </h5>
              <span className="font-medium text-sm">
                {model?.firstUpdatedBy?.name}
              </span>
              {model?.firstUpdatedBy?.signature ? (
                <Image
                  src={model?.firstUpdatedBy?.signature}
                  alt="Signature"
                  className="w-20 h-20"
                />
              ) : (
                <p className="text-xs">{t("No signature found")}</p>
              )}{" "}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h5 className="font-bold text-base text-gray">
                {t("Reviewed by")} :
              </h5>
            </div>
          )}

          {model?.secondUpdatedBy !== null ? (
            <div className="flex flex-col gap-2">
              <h5 className="font-bold text-base text-gray-dark">
                {t("Noted by")} :
              </h5>
              <span className="font-medium text-sm">
                {model?.secondUpdatedBy?.name}
              </span>
              {model?.secondUpdatedBy?.signature ? (
                <Image
                  src={model?.secondUpdatedBy?.signature}
                  alt="Signature"
                  className="w-20 h-20"
                />
              ) : (
                <p className="text-xs">{t("No signature found")}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h5 className="font-bold text-base text-gray">
                {t("Noted by")} :
              </h5>
            </div>
          )}
        </div> */}

        <div className="flex gap-x-10">
          <div className="w-fit">
            <p className="font-semibold">{t("Reviewed by")}:</p>
            {model?.consultantStatus == "approved" && (
              <Image
                src={model?.consultant?.profilePic}
                alt="Signature"
                className="w-full h-20"
              />
            )}
          </div>
          <div className="w-fit">
            <p className="font-semibold"> {t("Noted by")}:</p>
            {model?.ownerStatus == "approved" && (
              <Image
                src={model?.owner?.profilePic}
                alt="Signature"
                className="w-full h-20"
              />
            )}
          </div>
        </div>
        <hr className="bg-gray my-4" />

        <div className="grid  grid-cols-2 lg:grid-cols-4  my-4 gap-3">
          {/*  <div className="col-span-2">
            <h5 className="font-bold text-base text-gray-dark">
              {t("Discipline")}
            </h5>
            <input
              type="text"
              disabled
              value={model?.discipline?.name}
              className="bg-white text-gray w-full text-start border  border-solid border-gray rounded-2xl p-2"
            />
          </div> */}
          {!model?.discipline && (
            <Select
              options={disciplines.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
              isDisabled={
                user?._id == projectData?.contractor?._id ? false : true
              }
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
          {model?.discipline && (
            <div className="mt-1 flex flex-col">
              <label className="text-sm"> {t("Discipline")}</label>
              <input
                disabled
                className="bg-white border  my-1 text-gray-500  text-gray border-solid border-gray rounded-2xl p-2"
                value={model?.discipline?.name}
              />
            </div>
          )}
          {model?.type == "requestForDocumentSubmittal" && !model?.remarks && (
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
                  disabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
                  placeholder={t("remarks")}
                  value={Remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            </>
          )}
          {model?.type == "requestForDocumentSubmittal" && model?.remarks && (
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
                  disabled
                  placeholder={t("remarks")}
                  value={model?.remarks}
                  className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            </>
          )}

          {(model?.type == "requestForDocumentSubmittal" ||
            model?.type == "workRequest" ||
            model?.type == "requestForMaterialAndEquipment" ||
            model?.type == "requestForInspaction") &&
            !model?.boqItemNo && (
              <div className="flex flex-col lg:items-start  gap-2 col-span-2">
                <label
                  htmlFor="BOQ item no"
                  className="font-bold text-base text-gray-dark"
                >
                  {t("BOQ item no")}
                </label>
                <input
                  disabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
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
          {(model?.type == "requestForDocumentSubmittal" ||
            model?.type == "workRequest" ||
            model?.type == "requestForMaterialAndEquipment" ||
            model?.type == "requestForInspaction") &&
            model?.boqItemNo && (
              <div className="flex flex-col lg:items-start  gap-2 col-span-2 ">
                <label
                  htmlFor="BOQ item no"
                  className="font-bold text-base text-gray-dark"
                >
                  {t("BOQ item no")}
                </label>
                <input
                  disabled
                  type="number"
                  min="0"
                  id="BOQ item no"
                  placeholder="00"
                  value={model?.boqItemNo}
                  className="bg-white border     text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            )}
          {(model?.type == "requestForDocumentSubmittal" ||
            model?.type == "requestForMaterialAndEquipment") &&
            !model?.qty && (
              <div className="flex flex-col lg:items-start  gap-2 col-span-2">
                <label
                  htmlFor="QTY"
                  className="font-bold text-base text-gray-dark"
                >
                  {t("qty")}
                </label>
                <input
                  disabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
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
          {(model?.type == "requestForDocumentSubmittal" ||
            model?.type == "requestForMaterialAndEquipment") &&
            model?.qty && (
              <div className="flex flex-col lg:items-start  gap-2 col-span-2">
                <label
                  htmlFor="QTY"
                  className="font-bold text-base text-gray-dark"
                >
                  {t("qty")}
                </label>
                <input
                  disabled
                  type="number"
                  min="0"
                  id="QTY"
                  placeholder="00"
                  value={model?.qty}
                  className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            )}
          {model?.reason && (
            <div className="col-span-2">
              <h5 className="font-bold text-base text-gray-dark">
                {t("Reason")}
              </h5>
              <input
                type="text"
                disabled
                value={model?.reason?.name}
                className="bg-white border text-gray w-full  text-start border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {(model?.type == "requestForInspaction" ||
            model?.type == "workRequest") &&
            !model?.reason && (
              <Select
                options={Reasons.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
                isDisabled={
                  user?._id == projectData?.contractor?._id ? false : true
                }
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
        {!model?.description && (
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
              placeholder="desc"
              disabled={
                user?._id == projectData?.contractor?._id ? false : true
              }
              value={Desc}
              onChange={(e) => setDesc(e.target.value)}
              className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
            />
          </div>
        )}
        {model?.description && (
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
              placeholder="desc"
              disabled
              value={model?.description}
              className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
            />
          </div>
        )}

        {model?.remarks && (
          <div className="desc ">
            <label
              htmlFor="remarks"
              className="font-bold text-base text-gray-dark text-start"
            >
              {t("remarks")}
            </label>
            <input
              type="text"
              id="remarks"
              disabled
              value={model?.remarks}
              className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
            />
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
          {model?.supplier && (
            <div className="col-span-2">
              <label
                htmlFor="supplier"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("supplier")}
              </label>
              <input
                type="text"
                id="supplier"
                disabled
                value={model?.supplier}
                className="bg-white my-1 border  w-full  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {!model?.supplier &&
            model?.type == "requestForMaterialAndEquipment" && (
              <div className="col-span-2">
                <label
                  htmlFor="supplier"
                  className="font-bold text-base text-gray-dark text-start"
                >
                  {t("supplier")}
                </label>
                <input
                  placeholder="Supplier"
                  type="text"
                  id="supplier"
                  disabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="bg-white my-1 border  w-full  text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            )}
          {model?.approvedMaterialSubmittalNo &&
            model?.type == "requestForMaterialAndEquipment" && (
              <div className="col-span-2 flex flex-col">
                <label
                  htmlFor="approved"
                  className="font-bold text-base text-gray-dark text-start"
                >
                  {t("approved material submittal no")}
                </label>
                <input
                  type="text"
                  id="approved"
                  disabled
                  value={model?.approvedMaterialSubmittalNo}
                  className="bg-white border my-1    text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            )}
          {!model?.approvedMaterialSubmittalNo &&
            model?.type == "requestForMaterialAndEquipment" && (
              <div className="col-span-2 flex flex-col">
                <label
                  htmlFor="approved"
                  className="font-bold text-base text-gray-dark text-start"
                >
                  {t("approved material submittal no")}
                </label>
                <input
                  placeholder="123"
                  type="number"
                  min={0}
                  id="approved"
                  disabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
                  value={approvedMaterial}
                  onChange={(e) => setApprovedMaterial(e.target.value)}
                  className="bg-white border my-1    text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-8 gap-1 lg:gap-3 my-2">
          {model?.boqItemNo && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="BOQ item no"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("BOQ item no")}
              </label>
              <input
                type="text"
                id="BOQ item no"
                disabled
                value={model?.boqItemNo}
                className="bg-white border  my-1  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.qty && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="QTY"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("qty")}
              </label>
              <input
                type="text"
                id="QTY"
                disabled
                value={model?.qty}
                className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}

          {model?.cell && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="cell"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("cell")}
              </label>
              <input
                type="text"
                id="cell"
                disabled
                value={model?.cell}
                className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.type == "workRequest" ||
            (model?.type == "requestForInspaction" && !model?.cell && (
              <div className="flex flex-col gap-2 col-span-2">
                <label
                  htmlFor="cell"
                  className="font-bold text-base text-gray-dark text-start"
                >
                  {t("cell")}
                </label>
                <input
                  placeholder="cell"
                  type="number"
                  min={0}
                  id="cell"
                  value={cell}
                  disabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
                  onChange={(e) => setCell(e.target.value)}
                  className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            ))}
          {model?.inspectionDate && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="Unit"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("inspectionDate")}
              </label>
              <input
                type="text"
                id="inspectionDate"
                disabled
                value={formatDate(model?.inspectionDate)}
                className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.unit && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="Unit"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("Unit")}
              </label>
              <input
                type="text"
                id="Unit"
                disabled
                value={model?.unit?.name}
                className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {(model?.type == "requestForMaterialAndEquipment" ||
            model?.type == "requestForInspaction") &&
            !model?.unit && (
              <div className="flex flex-col gap-2 col-span-2">
                <Select
                  isDisabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
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
        <div className="grid grid-cols-2   gap-3 my-2 ">
          {model?.deliveryNoteNo && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="delivery note no"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("delivery note no")}
              </label>
              <input
                type="text"
                id="delivery note no"
                disabled
                value={model?.deliveryNoteNo}
                className="bg-white border  my-1 w-full   text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {!model?.deliveryNoteNo &&
            model?.type == "requestForMaterialAndEquipment" && (
              <div className="flex flex-col gap-2 col-span-2">
                <label
                  htmlFor="delivery note no"
                  className="font-bold text-base text-gray-dark text-start"
                >
                  {t("delivery note no")}
                </label>
                <input
                  placeholder="00"
                  type="number"
                  min={0}
                  id="delivery note no"
                  disabled={
                    user?._id == projectData?.contractor?._id ? false : true
                  }
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  value={deliveryNote}
                  className="bg-white border  my-1 w-full   text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            )}
          {model?.location && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="location"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("location")}
              </label>
              <input
                type="text"
                id="location"
                disabled
                value={model?.location}
                className="bg-white border  my-1   text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {/* model?.type == "requestForInspaction" || model?.type == "workRequest" && !model.l && */}
          {(model?.type === "requestForInspaction" ||
            model?.type === "workRequest") &&
            !model?.location && (
              <div className="flex flex-col gap-2 col-span-2">
                <label
                  htmlFor="location"
                  className="font-bold text-base text-gray-dark text-start"
                >
                  {t("location")}
                </label>
                <input
                  disabled={
                    user?._id === projectData?.contractor?._id ? false : true
                  }
                  type="text"
                  id="location"
                  placeholder="Location"
                  value={Location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white border my-1 text-gray border-solid border-gray rounded-2xl p-2"
                />
              </div>
            )}
          {model?.workArea && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="workArea"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("Work Area")}
              </label>
              <input
                type="text"
                id="workArea"
                disabled
                value={model?.workArea}
                className="bg-white border  my-1  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {!model?.workArea && model?.type == "workRequest" && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="workArea"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t("Work Area")}
              </label>
              <input
                type="text"
                id="workArea"
                placeholder="Work Area"
                disabled={
                  user?._id == projectData?.contractor?._id ? false : true
                }
                value={WorkArea}
                onChange={(e) => setWorkArea(e.target.value)}
                className="bg-white border  my-1  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {model?.quantity && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="quantity"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t(" Quantity")}
              </label>
              <input
                type="text"
                id="quantity"
                disabled
                value={model?.quantity}
                className="bg-white border  my-1  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
          {!model?.quantity && model?.type == "requestForInspaction" && (
            <div className="flex flex-col gap-2 col-span-2">
              <label
                htmlFor="quantity"
                className="font-bold text-base text-gray-dark text-start"
              >
                {t(" Quantity")}
              </label>
              <input
                placeholder="Quantity"
                type="number"
                min={0}
                id="quantity"
                disabled={
                  user?._id == projectData?.contractor?._id ? false : true
                }
                onChange={(e) => setQuantity(e.target.value)}
                value={Quantity}
                className="bg-white border  my-1  text-gray border-solid border-gray rounded-2xl p-2"
              />
            </div>
          )}
        </div>
        {model?.contractorStatus == "approved" && (
          <div className="flex flex-col gap-2 mt-4">
            <h5 className="font-bold text-base text-gray-dark">
              {t("submitted by")} :
            </h5>
            <span className="font-medium text-sm">
              {model?.contractor?.name}
            </span>
            <Image
                src={model?.contractor?.profilePic}
                alt="Signature"
                className="w-20 h-20"
              />
          </div>
        )}
        {((IsOwner && model?.ownerStatus === "pending") ||
          (IsConsultant && model?.consultantStatus === "pending") ||
          (IsContractor && model?.contractorStatus === "pending")) && (
          <div className="flex right-0 my-2 items-center gap-3 justify-end">
            <Button onClick={handleApprove}>{t("approve")}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequest;
