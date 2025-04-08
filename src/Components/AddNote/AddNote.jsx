import { useState } from "react";
import { FaCommentMedical } from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoIosSend } from "react-icons/io";
import { updateProject, updateTask } from "../../Services/api";
import { useSelector } from "react-redux";
import { RiCloseCircleLine } from "react-icons/ri";
import avatar from "../../assets/images/Avatar.jpg";
import { t } from "i18next";
import ProfileAvatar from "../UI/profilePic/profilePic";
import Empty from "../empty/empty";
import { Image } from "../UI/Image/image";

export const AddNote = ({ projectId, taskId, Notes }) => {
  console.log(projectId, taskId, Notes);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [notes, setNotes] = useState(Notes || []);
  // console.log()
  const handleAddNote = async () => {
    if (!messageInput.trim()) return;

    try {
      const payload = {
        notes: {
          content: messageInput,
          postedBy: user._id,
        },
      };
      let data = {
        notes: messageInput,
      };
      let res;
      if (taskId) {
        res = await updateTask(token, taskId, user._id, data);
        setNotes(res.updatedTask.notes);
      } else if (projectId) {
        res = await updateProject(projectId, payload);
        setNotes(res.updatedProject.notes);
      }
      const newNote = {
        content: messageInput,
        postedBy: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar || avatar,
        },
        createdAt: new Date().toISOString(),
      };

      setNotes([newNote, ...notes]);
      setMessageInput("");
    } catch (error) {
      error;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Format time as HH.MM AM/PM
    const time = date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(":", "."); // Replace ":" with "."

    // Format date as DD-MM-YYYY
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    return `${time} ${formattedDate}`;
  };

  const handleOpen = () => setOpen(!open);
  return (
    <div className="AddNote">
      <button className="addNote m-1" onClick={handleOpen}>
        <span>
          <FaCommentMedical className="h-7 w-7 " style={{ color: "#81D4C2" }} />
        </span>
      </button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="relative">
          <button onClick={handleOpen}>
            <RiCloseCircleLine className="text-red absolute right-4 top-4 cursor-pointer" />
          </button>
        </DialogHeader>
        <DialogBody className="h-[300px] overflow-y-scroll">
          {notes && notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="note flex items-start gap-2 p-2">
                {note?.postedBy?.profilePic ? (
                  <Image
                    src={note.postedBy.profilePic}
                    alt={"Avatar"}
                    className={"w-10 h-10 rounded-full"}
                  />
                ) : (
                  <ProfileAvatar
                    name={note.postedBy?.name}
                    profilePic={note.postedBy?.profilePic}
                  />
                )}
                <div className="flex flex-col w-full">
                  <div className="font-semibold">{note.postedBy?.name}</div>
                  <div
                    className="p-3 rounded-xl w-full border border-solid border-purple"
                    style={{ backgroundColor: "#fcfcfd" }}
                  >
                    <p className="text-gray-dark">{note.content}</p>
                    <div className="ltr:text-right rtl:text-left text-xs text-gray-500">
                      {formatDate(note.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty paragraph={t("Add Your Note")} />
          )}
        </DialogBody>
        <DialogFooter>
          <div className="footer flex items-center gap-1 md:gap-2 p-2 md:p-2  w-full">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={t("Type something")}
              className={`w-full p-2 rounded-md border `}
            />
            <button
              className="bg-purple p-2 rounded-md"
              onClick={handleAddNote}
            >
              <IoIosSend className="text-white" />
            </button>
          </div>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
