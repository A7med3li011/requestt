import { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Button from "../../Components/UI/Button/Button";
import { t } from "i18next";
import ProfileAvatar from "../UI/profilePic/profilePic";
import { useSelector } from "react-redux";
import {
  createChatGroup,
  getGroupDataById,
  getUsersToAddMember,
  updateGroupData,
} from "../../Services/api";
import { toast } from "react-toastify";

export const AddMemberToGroup = ({ groupId, projectId }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUsersToAddMember(token, projectId, groupId);
        setGroupMembers(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, projectId, groupId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(memberId)
        ? prevSelected.filter((id) => id !== memberId)
        : [...prevSelected, memberId]
    );
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedMembers.length === 0) {
      setError("Please select at least one member.");
      return;
    }

    setLoading(true);
    const payload = {
      users: selectedMembers,
    };

    try {
      await updateGroupData(token, groupId, payload);
      toast.success("Members added successfully!");
      handleClose();
      window.location.reload()
    } catch (err) {
      console.error("Error while adding members to group:", err);
      toast.error("Failed to add members.");
      setError("An error occurred while adding members.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CreateGroup">
      <button
        onClick={handleOpen}
        className={`${groupMembers.length === 0 ? "hidden" : "block"}`}
      >
        {t("Add Member")}
      </button>

      <Dialog open={open} handler={handleClose}>
        <DialogHeader className="text-gray-dark font-bold text-lg">
          {t("Add New Member")}
        </DialogHeader>
        <hr />
        <DialogBody>
          <span className="text-gray font-medium text-base my-2 mx-2">
            {t("Select members to add to the group :")}
          </span>
          <div className="flex flex-col border border-gray p-2 rounded-lg gap-3 max-h-[30vh] overflow-y-scroll">
            {groupMembers.map((member) => (
              <div className="flex items-center gap-3 mx-2" key={member._id}>
                <input
                  type="checkbox"
                  id={member._id}
                  name={member._id}
                  checked={selectedMembers.includes(member._id)}
                  onChange={() => handleMemberSelect(member._id)}
                  className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple"
                  aria-label={`Select ${member.name}`}
                />
                <label htmlFor={member._id} className="flex items-center gap-2">
                  <ProfileAvatar
                    profilePic={member.profilePic}
                    name={member.name}
                    className={"font-normal text-xs w-6 h-6"}
                  />
                  <span className="font-medium text-base">{member.name}</span>
                </label>
              </div>
            ))}
          </div>
          {selectedMembers.length > 0 && (
            <button
              onClick={handleClearSelection}
              className="ml-2 text-gray  underline text-end"
            >
              {t("clear")}
            </button>
          )}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </DialogBody>
        <DialogFooter>
          <Button
            disabled={loading || selectedMembers.length === 0}
            onClick={handleUpdate}
          >
            {loading ? t("Adding...") : t("Add")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
