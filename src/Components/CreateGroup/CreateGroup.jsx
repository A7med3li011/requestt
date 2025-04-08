import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react"; // Ensure imports are correct
import Button from "../../Components/UI/Button/Button"; // Correct import for Button
import Input from "../UI/Input/Input";
import { t } from "i18next";
import ProfileAvatar from "../UI/profilePic/profilePic";
import { useSelector } from "react-redux";
import { createChatGroup } from "../../Services/api";
import { toast } from "react-toastify";

export const CreateGroup = ({ members, projectId }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMemberSelect = (memberId) => {
    setSelectedMembers(
      (prevSelected) =>
        prevSelected.includes(memberId)
          ? prevSelected.filter((id) => id !== memberId) // Remove member if already selected
          : [...prevSelected, memberId] // Add member if not selected
    );
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  const handleCreateGroup = async () => {
    try {
      const payload = {
        name: groupName,
        users: selectedMembers,
        createdBy: user._id,
        project: projectId,
        isGroup: true,
      };
      ("creating group with payload:", payload);
      const res = await createChatGroup(token, payload);
      (res);
      toast.success(t("toast.groupCreatedSuccess"));
      window.location.reload();
    } catch (err) {
      (err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="CreateGroup">
      <button
        onClick={handleOpen}
        className="border border-solid border-yellow text-yellow w-full py-2 my-2 rounded-lg"
      >
        {t("Create Group")}
      </button>

      <Dialog open={open} handler={handleClose}>
        <DialogHeader className="text-gray-dark font-bold text-lg">
          {" "}
          {t("Create Group")}
        </DialogHeader>
        <hr />
        <DialogBody>
          <div className="">
            <Input
              label={t("groupName")}
              placeholder={t("groupName")}
              className={`bg-white border border-purple border-solid focus:border focus:border-purple focus:border-solid `}
              type={"name"}
              required={true}
              id={"name"}
              autoComplete="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              autoFocus={true}
              label_class={`text-gray`}
            />
          </div>

          <span className="text-gray font-medium text-base my-2 mx-2">
            {t("Select members to add to the group :")}
          </span>
          <div className="flex flex-col border border-gray p-2 rounded-lg gap-3 max-h-[30vh] overflow-y-scroll">
            {members.map((member) => (
              <div className="flex items-center gap-3   mx-2 " key={member._id}>
                <input
                  type="checkbox"
                  id={member._id}
                  name={member._id}
                  checked={selectedMembers.includes(member._id)}
                  onChange={() => handleMemberSelect(member._id)}
                  className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple"
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
              variant="outlined"
              onClick={handleClearSelection}
              className="ml-2 text-gray  underline text-end"
            >
              {t("clear")}
            </button>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={handleCreateGroup}
            disabled={selectedMembers.length === 0 || !groupName}
          >
            {t("Create")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
