import { t } from "i18next";
import avatar from "../../assets/images/Avatar.jpg";
import signature from "../../assets/images/signature.png";
import { useEffect, useState } from "react";
import {
  getAllActionCodes,
  getModelById,
  updateModel,
} from "../../Services/api";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Loader from "../../Components/Loader/Loader";
import ProfileAvatar from "../../Components/UI/profilePic/profilePic";
import Button from "../../Components/UI/Button/Button";
import { toast } from "react-toastify";
import Select from "../../Components/UI/Select/Select";
import { Image } from "../../Components/UI/Image/image";

const ViewRequest = () => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [IsOwner, setIsOwner] = useState(user.role.jobTitle === "owner");
  const [IsConsultant, setIsConsultant] = useState(
    user.role.jobTitle === "consultant"
  );
  const [IsContractor, setIsContractor] = useState(
    user.role.jobTitle === "contractor"
  );
  const [Comment, setComment] = useState("");
  const [ActionCodes, setActionCodes] = useState([]);
  const [selectedActionCodes, setSelectedActionCodes] = useState(null);
  const [ActionCodeLoading, setActionCodeLoading] = useState(true);
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
        setModel(modelData.results);
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

  const handleApprove = async (e) => {
    if (!Comment || !selectedActionCodes) return;
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
        } else {
          payload.secondUpdatedBy = user._id;
        }
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
                  profilePic={avatar}
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
                      : model?.consultant?.name
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
                  profilePic={avatar}
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
                      : model?.contractor?.name
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
                  profilePic={avatar}
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
              placeholder={t("+add comment")}
              value={Comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-white w-full my-1 text-gray border  border-solid border-gray rounded-2xl p-2"
            />
          </div>
        ) : model?.comment && model.comment.length > 0 ? (
          <>
            <h5 className="font-bold text-base">{t("Comment")}</h5>
            {model.comment.map((comment, index) => (
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

        <div className="flex items-center gap-3 my-4">
          {model.firstUpdatedBy !== null ? (
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
        </div>
        <hr className="bg-gray my-4" />

        <div className="grid  grid-cols-2 lg:grid-cols-4  my-4 gap-3">
          {model?.discipline && (
            <div className="col-span-2">
              <h5 className="font-bold text-base text-gray-dark">
                {t("Discipline")}
              </h5>
              <input
                type="text"
                disabled
                value={model?.discipline?.name}
                className="bg-white text-gray w-full text-start border  border-solid border-gray rounded-2xl p-2"
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
        </div>
        <div className="desc ">
          <label htmlFor="desc" className="font-bold text-base text-gray-dark">
            {t("desc")}
          </label>
          <input
            type="text"
            id="desc"
            disabled
            value={model?.description}
            className="bg-white border  my-1 w-full  text-gray border-solid border-gray rounded-2xl p-2"
          />
        </div>

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
          {model?.approvedMaterialSubmittalNo && (
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
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <h5 className="font-bold text-base text-gray-dark">
            {t("submitted by")} :
          </h5>
          <span className="font-medium text-sm">{model?.createdBy?.name}</span>
          {model?.createdBy?.signature ? (
            <Image
              src={model?.createdBy?.signature}
              alt="Signature"
              className="w-20 h-20"
            />
          ) : (
            <p className="text-xs">{t("No signature found")}</p>
          )}
        </div>
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
