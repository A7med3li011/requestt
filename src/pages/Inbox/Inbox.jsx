import { useEffect, useState, useCallback, useContext, useRef } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Divider,
} from "@mui/joy";
import { t } from "i18next";
import { BiSearch } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import { IoAttach } from "react-icons/io5";
import RecordAudio from "../../Components/RecordAudio/RecordAudio";
import CustomAudioPlayer from "../../Components/UI/AudioPlayer/AudioPlayer";
import "./style.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  getAllGroupsAndMembers,
  getAllProjectsByUser,
  getAllProjectsForUser,
  getGroupData,
  getMessagesBetweenUsers,
  sendDocsAndVoiceNote,
  sendMessage,
} from "../../Services/api";
import { useSelector } from "react-redux";
import ProfileAvatar from "../../Components/UI/profilePic/profilePic";
import Loader from "../../Components/Loader/Loader";
import { CreateGroup } from "../../Components/CreateGroup/CreateGroup";
import { Skeleton } from "@mui/material";
import { CiChat1 } from "react-icons/ci";
import { toast } from "react-toastify";
import { ChatContext } from "../../context/ChatContext";
import { Record } from "../../Components/RecordAudio/Record";
import { AddMemberToGroup } from "../../Components/CreateGroup/AddMember";
import { Image } from "../../Components/UI/Image/image";

const Inbox = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  const { messages, setMessages } = useContext(ChatContext);
  const [loading, setLoading] = useState(true);
  const [ChatLoading, setChatLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [Projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [IsGroup, setIsGroup] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const chatContainerRef = useRef(null);
  const topRef = useRef(null);

  // const handleRecordingStateChange = (
  //   recordingState,
  //   pausedState,
  //   audioBlob = null
  // ) => {
  //   setIsRecording(recordingState);
  //   setIsPaused(pausedState);
  //   (audioBlob);

  //   if (audioBlob) {
  //     setAudioData(audioBlob);
  //     (
  //       "Audio Blob:",
  //       URL.createObjectURL(audioBlob),
  //       audioBlob.size / 1024, // Convert bytes to KB
  //       audioBlob.type
  //     );
  //   }
  // };

  // const handleClear = () => {
  //   setIsRecording(false);
  //   setIsPaused(false);
  //   setAudioData(null); // Clear the audio data
  //   setRecordingTime(0); // Reset the timer
  // };

  // Scroll to the bottom whenever messages change or chat loading state updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, ChatLoading]);
  const fetchData = async () => {
    setLoading(false);
    try {
      const projectsData = await getAllProjectsByUser(token, userId);
      setProjects(projectsData.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesData = async () => {
    // setChatLoading(true);
    const { projectId, member } = activeChat;

    try {
      if (IsGroup) {
        const groupData = await getGroupData(token, projectId, member._id);
        setMessages(groupData.results);
      } else {
        const messagesData = await getMessagesBetweenUsers(
          token,
          projectId,
          userId,
          member._id
        );
        setMessages(messagesData.results);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatClick = (member, projectId) => {
    setActiveChat({ member, projectId });
    setIsGroup(member.isGroup);
    setIsChatVisible(true);
  };

  // Fetch projects when component mounts
  useEffect(() => {
    fetchData();
    // const interval = setInterval(fetchData, 3000);

    // // Clear on unmount
  }, [token, userId]);

  // Detect if the active chat is a group chat
  useEffect(() => {
    setIsGroup(activeChat?.member?.isGroup || false);
  }, [activeChat]);

  // Fetch group or direct messages based on the active chat type
  useEffect(() => {
    fetchMessagesData();

    const interval = setInterval(fetchMessagesData, 5000);

    // Clear on unmount
    return () => clearInterval(interval);
  }, [messageInput, IsGroup, token, userId]);

  // const loadMoreMessages = async () => {
  //   if (!activeChat || !hasMoreMessages) return;
  //   try {
  //     const newOffset = offset + limit; // Update the offset
  //     ("newOffset", newOffset);
  //     const messagesData = await getMessagesBetweenUsers(
  //       token,
  //       activeChat.projectId,
  //       userId,
  //       activeChat.member._id,
  //       limit,
  //       newOffset
  //     );

  //     if (messagesData.results.length < limit) {
  //       setHasMoreMessages(false); // No more messages available
  //     }

  //     // Append new messages at the beginning of the current list
  //     setMessages((prevMessages) => [...messagesData.results, ...prevMessages]);
  //     setOffset(newOffset);
  //   } catch (error) {
  //     console.error("Error loading more messages:", error);
  //   }
  // };

  //  addAudioMessage log the data only
  const addAudioMessage = async () => {
    ("Voice Added");
  };
  const addAttachmentMessage = async () => {
    setFile(null);

    try {
      if (!file) {
        console.error("No file selected for upload.");
        throw new Error("File is required to send an attachment.");
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.info("File size exceeds 10MB limit.");
        return null;
      }

      const formData = new FormData();
      formData.append("docs", file);

      const res = await sendDocsAndVoiceNote(formData);

      if (res && res.docs) {
        "✅ Attachment uploaded successfully:", res;
        setPreview(null);
        return res.docs; // Return the uploaded file path
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      console.error("❌ Error adding attachment:", err.message || err);
      toast.error("Failed to upload attachment. Please try again.");
      return null;
    } finally {
      setPreview(null);
      setFile(null);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      if (!messageInput.trim() && !file) {
        console.warn("No content or file to send.");
        return;
      }
      let uploadedFilePath = null;

      if (file) {
        // Get the file path directly from addAttachmentMessage
        uploadedFilePath = await addAttachmentMessage();

        if (!uploadedFilePath) {
          console.error("File upload failed, no file path received.");
          throw new Error("Failed to upload the file.");
        }
      }

      const newMessage = {
        sender: userId,
        project: activeChat.projectId,
        isSender: true,
        type: messageInput ? "text" : file ? "doc" : "text",
        name: "sss",
      };

      if (messageInput.trim()) {
        newMessage.content = messageInput;
      }

      if (uploadedFilePath) {
        newMessage.docs = uploadedFilePath;
      }

      if (IsGroup) {
        newMessage.group = activeChat.member._id;
      } else {
        newMessage.receiver = activeChat.member._id;
      }

      "newMessage from inbox:", newMessage;

      const res = await sendMessage(newMessage);
      "Message sent successfully:", res;

      // Reset state after message is sent
      setMessageInput("");
      setPreview(null);
      setFile(null);
    } catch (error) {
      console.error("❌ Error sending message:", error.message || error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      fetchMessagesData();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    "Selected File:", selectedFile;

    const fileUrl = URL.createObjectURL(selectedFile);
    const extension = selectedFile.name.split(".").pop().toLowerCase();

    // Set file state
    setFile(selectedFile);

    // Set preview based on extension (optional preview logic)
    const supportedExtensions = {
      image: ["jpg", "jpeg", "png", "gif", "bmp"],
      document: ["pdf", "doc", "docx", "xls"],
    };

    if (supportedExtensions.image.includes(extension)) {
      setPreview({ type: "image", url: fileUrl });
    } else if (supportedExtensions.document.includes(extension)) {
      setPreview({ type: "document", name: selectedFile.name });
    } else {
      toast.info(`File type ${extension} is not supported.`);
      setFile(null);
      return;
    }
  };

  const handleCancelFile = () => {
    // Reset preview and file state
    setPreview(null);
    setFile(null);
  };

  const handleSearch = useCallback(
    (term) => {
      const filtered = Projects.map((project) => ({
        ...project,
        members: project.combinedList.filter((member) =>
          member.name.toLowerCase().includes(term.toLowerCase())
        ),
      })).filter((project) => project.members.length > 0);
      setFilteredProjects(filtered);
    },
    [Projects]
  );

  // search by project
  // const handleSearch = useCallback(
  //   (term) => {
  //     const filtered = Projects.filter((project) =>
  //       project.name.toLowerCase().includes(term.toLowerCase())
  //     );
  //     setFilteredProjects(filtered);
  //   },
  //   [Projects]
  // );

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const cleanFileName = (filePath) => {
    const fileName = filePath.split("/").pop();
    return fileName.replace(/^\d+-/, "");
  };

  const renderMessageContent = (message) => {
    // Check if docs exist and determine the file extension
    const extension = message.docs
      ? message.docs.split(".").pop().toLowerCase()
      : null;

    // Define supported image extensions
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "svg",
      "webp",
    ];

    switch (true) {
      // If message.docs exists and the file is an image
      case message.docs && imageExtensions.includes(extension):
        return renderImage(message);

      // If message.docs exists and the file is not an image
      case message.docs && !imageExtensions.includes(extension):
        return renderPDF(message);

      // If message.audio exists, render audio
      case message.audio:
        return renderAudio(message);

      // Default case: Render text
      default:
        return renderText(message);
    }
  };

  const renderImage = (message) => {
    const senderId = message.sender?._id || message.sender;
    const isSender = senderId === userId;

    const senderName = message.sender?.name || message.senderName;
    const formattedDate =
      message.date ||
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    return (
      <div className={`relative max-w-xs rounded-lg  m-2 `}>
        {IsGroup && (
          <div
            className={`text-black w-full  m-1 ${
              isSender ? "hidden" : "block"
            }`}
          >
            {senderName}
            {/* {isSender && <span className="text-gray"> (you)</span>} */}
          </div>
        )}
        <div
          className={` relative   border-gray-100 border  border-solid  text-white`}
        >
          <Image
            src={message?.docs}
            alt={"attachment"}
            className={"w-full min-w-[200px] max-w-xs rounded-lg"}
          />

          <span className={`absolute bottom-2 right-2 text-xs`}>
            {formattedDate}
          </span>
        </div>
      </div>
    );
  };

  const renderPDF = (message) => {
    const senderId = message.sender?._id || message.sender;
    const isSender = senderId === userId;
    const senderName = message.sender?.name || message.senderName;
    const formattedDate =
      message.date ||
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return (
      <div className="w-full max-w-md  my-1 ">
        {IsGroup && (
          <div
            className={`text-black w-full  m-1 ${
              isSender ? "hidden" : "block"
            }`}
          >
            {senderName}
            {/* {isSender && <span className="text-gray"> (you)</span>} */}
          </div>
        )}
        <div
          className={` ltr:text-start rtl:text-end relative p-2  ${
            isSender ? "bg-linear_1 send" : "bg-linear_3 receive"
          } ${IsGroup ? "mx-2 " : "m-2"} text-white`}
        >
          <a
            href={`https://api.request-sa.com/${message.docs}`}
            target="_blank"
            rel="noopener noreferrer"
            className=" underline m-2"
          >
            {cleanFileName(message.docs)}
          </a>
          <span className={`absolute bottom-2 right-2 text-xs`}>
            {formattedDate}
          </span>
        </div>
      </div>
    );
  };

  const renderAudio = (message) => (
    <div className="relative max-w-xs">
      <CustomAudioPlayer
        src={message.voiceNote}
        className={`${
          message.sender === userId ? "bg-linear_1 send" : "bg-linear_3 receive"
        }`}
      />
      <span
        className={`absolute  bottom-2 p-2  rounded-full text-white ${
          message.isSender === true ? "right-2  " : "left-2   "
        } text-xs`}
      >
        {message.date ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
      </span>
    </div>
  );

  const renderText = (message) => {
    // Check if the sender is the current user (handle both object and primitive ID cases)
    const senderId = message.sender?._id || message.sender;
    const isSender = senderId === userId;

    const senderName = message.sender?.name || message.senderName;
    const formattedDate =
      message.date ||
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    return (
      <div className="w-full max-w-md  my-1 ">
        {IsGroup && (
          <div
            className={`text-black w-full ${
              isSender ? "hidden" : "block"
            } mx-3`}
          >
            {senderName}
          </div>
        )}
        <div
          className={`message ltr:text-start rtl:text-end relative p-2  ${
            isSender ? "bg-linear_1 send" : "bg-linear_3 receive"
          } ${IsGroup ? "mx-2 " : "m-2"} text-white`}
        >
          <div className="text">{message.content}</div>
          <span className={`absolute bottom-2 right-2 text-xs`}>
            {formattedDate}
          </span>
        </div>
      </div>
    );
  };

  const renderSkeletonLoader = () => (
    <div
      className={`message-skeletons flex items-center flex-col ${messages.map(
        (msg) => (msg.isSender === true ? "justify-start " : "justify-end")
      )}`}
    >
      {Array.from({ length: messages.length }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-item  relative p-2 m-2 w-full max-w-sm  md:max-w-md ${
            index % 2 === 0 ? "self-start" : "self-end"
          } 

            `}
        >
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={400}
            height={30}
            className={`rounded-lg !bg-gray-100`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="Inbox h-screen overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Loader />
        </div>
      ) : (
        <>
          <h1
            className={`title font-inter font-bold text-xl lg:text-3xl ${
              isChatVisible ? "hidden" : ""
            } lg:block text-black m-2`}
          >
            {t("Inbox")}
          </h1>
          <Divider className={`${isChatVisible ? "hidden" : ""} lg:block`} />
          {isChatVisible && (
            <div className="sm_header bg-white p-2 rounded-2xl w-full lg:hidden flex items-center  justify-between">
              <div className="back">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full text-purple rtl:rotate-180 ltr:rotate-0"
                  onClick={() => setIsChatVisible(false)}
                >
                  <FaArrowLeft />
                </button>
              </div>
              <div className="title text-purple  font-bold text-lg">
                {t("Inbox")}
              </div>
            </div>
          )}
          <div className="container flex items-center justify-center  md:gap-10 ">
            <div
              className={`Inbox_sidebar bg-white rounded-3xl shadow-sm p-2 m-2 mt-4 ${
                isChatVisible ? "hidden" : ""
              } lg:flex flex-col h-[70vh] overflow-y-scroll`}
            >
              <div className="Inbox_search relative w-full my-4">
                <input
                  type="text"
                  className="w-full px-16 py-2 rounded-xl text-sm border"
                  placeholder={t("search")}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute rtl:right-10 ltr:left-10 top-3 w-6 h-6 text-gray">
                  <BiSearch />
                </span>
              </div>
              <AccordionGroup>
                {filteredProjects
                  .filter(
                    (project) =>
                      project.members &&
                      project.members.length > 0 && // Ensure there are members in the project
                      project.members.some((member) => member._id !== userId) // Ensure at least one member's _id is not equal to userId
                  )

                  .map((project) => (
                    <Accordion key={project._id} className="">
                      <AccordionSummary className="hover:!bg-gray-100 p-2 rounded-lg">
                        {project.name}
                      </AccordionSummary>
                      <AccordionDetails>
                        <>
                          <CreateGroup
                            members={project.members.filter(
                              (member) =>
                                !member.isGroup && member._id !== userId
                            )}
                            projectId={project._id}
                          />

                          {project.combinedList
                            .filter((member) => member._id !== userId)
                            .map((member) => (
                              <div
                                key={member._id}
                                className="group-item flex items-center gap-2 p-2 m-1 rounded-3xl cursor-pointer"
                                onClick={() =>
                                  handleChatClick(member, project._id)
                                }
                              >
                                <ProfileAvatar
                                  profilePic={member?.profilePic}
                                  name={member?.name}
                                />
                                <div className="content flex flex-col">
                                  <span>{member?.name}</span>
                                  <span>{member?.role?.jobTitle}</span>
                                </div>
                              </div>
                            ))}
                        </>
                      </AccordionDetails>
                    </Accordion>
                  ))}
              </AccordionGroup>
            </div>

            {!activeChat && (
              <div className="bg-white rounded-3xl max-w-3xl w-full shadow-sm p-4 mx-2 mt-4 min-h-[70vh] max-h-[90vh] hidden  lg:flex flex-col items-center justify-center">
                <span className="material-icons text-gray-300 text-6xl">
                  <CiChat1 />
                </span>
                <h2 className="text-gray-500 text-lg font-semibold">
                  {t("No Active Chat")}
                </h2>
                <p className="text-gray-400 text-sm">
                  {t(
                    "Select a chat from the list to get started, or start a new conversation."
                  )}
                </p>
              </div>
            )}

            <div
              className={`chat bg-white rounded-3xl ${
                !isChatVisible ? "hidden" : ""
              } shadow-sm p-2 mֱx-2 mt-4 min-h-[70vh] max-h-[90vh]  max-w-3xl w-full`}
            >
              <div className="header flex items-center justify-between m-2 ">
                <div className="flex gap-2">
                  <ProfileAvatar
                    profilePic={activeChat?.member?.profilePic}
                    name={activeChat?.member?.name}
                  />
                  <div className="content flex flex-col">
                    <span>{activeChat?.member?.name || "Loading..."}</span>
                    {activeChat?.member?.isGroup && (
                      <div className="avatars flex items-center  -space-x-2">
                        {activeChat?.member?.users?.slice(0, 3).map((user) => (
                          <ProfileAvatar
                            key={user._id}
                            profilePic={user?.profilePic}
                            name={user?.name}
                            className={`!w-6 !h-6 text-xs font-normal border border-gray-100 `}
                          />
                        ))}
                        {activeChat?.member?.users?.length > 3 && (
                          <div className="avatar-placeholder w-6 h-6 flex items-center justify-center text-xs font-normal border border-gray-100">
                            +{activeChat?.member?.users.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {activeChat?.member?.isGroup && (
                  <AddMemberToGroup
                    groupId={activeChat?.member?._id}
                    projectId={activeChat?.projectId}
                  />
                )}

                {/* <div className="dot">
                  // <HiOutlineDotsHorizontal />
                 
                </div> */}
              </div>
              <Divider />
              <div
                className="chat_container overflow-y-scroll relative  h-[70vh] lg:h-[50vh] my-3 "
                ref={chatContainerRef}
              >
                {/* <InfiniteScroll
                  dataLength={messages.length}
                  next={loadMoreMessages}
                  hasMore={hasMoreMessages}
                  loader={<h4>Loading...</h4>}
                  inverse={true}
                  endMessage={
                    <p className="text-red text-center">No more messages</p>
                  }
                > */}
                {/* <button className="" onclick={loadMoreMessages}>
                    load more{" "}
                  </button> */}
                {ChatLoading
                  ? renderSkeletonLoader()
                  : messages
                      .slice()
                      .reverse()
                      .map((msg, idx) => {
                        const senderId = msg.sender?._id || msg.sender;
                        const isSender = senderId === userId;

                        return (
                          <div
                            key={idx}
                            className={`flex items-center ${
                              isSender ? "justify-end" : "justify-start"
                            }`}
                          >
                            {renderMessageContent(msg)}
                          </div>
                        );
                      })}
                <div ref={topRef} />
                {messages?.length === 0 && (
                  <div className="flex items-center justify-center text-center text-gray-500">
                    {IsGroup ? (
                      <p>
                        {t(
                          "No messages in this group chat yet. Be the first to send a message!"
                        )}
                      </p>
                    ) : (
                      <p>
                        {t(
                          "No messages in this chat yet. Start a conversation!"
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* </InfiniteScroll> */}
              </div>
              <div className="preview  relative flex items-center justify-center">
                {preview && preview.type === "image" && (
                  <div className=" -bottom-3 p-2 absolute bg-gray-100  rounded-md">
                    <img
                      src={preview.url}
                      alt="File preview"
                      className="preview-image !w-[80vh] !h-[40vh] object-contain rounded-md"
                    />

                    <div className="actions mt-1 flex items-center justify-end gap-3">
                      <button
                        onClick={handleCancelFile}
                        className="p-2 font-bold text-red"
                      >
                        {t("Cancel")}
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="py-2 px-4 font-bold bg-purple text-white rounded-md"
                      >
                        {t("Send")}
                      </button>
                    </div>
                  </div>
                )}
                {preview && preview.type === "document" && (
                  <div className=" -bottom-3 p-3 absolute bg-gray-100 w-full h-[20vh]  rounded-md">
                    <div className=" text-center my-3">
                      <h4 className="font-bold text-lg"> {preview.name}</h4>
                      <span className="font-bold text-sm text-gray">
                        {(preview.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>

                    <div className="actions mt-1 flex items-center  gap-3 bottom-2 absolute right-5">
                      <button
                        onClick={handleCancelFile}
                        className="p-2 font-bold text-red"
                      >
                        {t("Cancel")}
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="py-2 px-4 font-bold bg-purple text-white rounded-md"
                      >
                        {t("Send")}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="footer flex items-center gap-1 md:gap-2 p-2 md:p-2 "
              >
                {!preview && (
                  <>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={t("Type something")}
                      className={`w-full p-2 rounded-md border ${
                        isRecording ? "hidden" : ""
                      }`}
                    />
                    <RecordAudio
                      setIsRecording={setIsRecording}
                      onAddAudioMessage={addAudioMessage}
                    />
                    {/* <Record
                      isRecording={isRecording}
                      isPaused={isPaused}
                      onRecordingStateChange={handleRecordingStateChange}
                      setRecordingTime={setRecordingTime}
                    /> */}
                    {/* {isRecording && (
                      <span>
                        {Math.floor(recordingTime / 60)}:
                        {String(recordingTime % 60).padStart(2, "0")}
                      </span>
                    )} */}

                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileInput"
                    />

                    <label
                      htmlFor="fileInput"
                      className={`${isRecording ? "hidden" : ""}`}
                    >
                      <IoAttach className="text-yellow w-8 h-8" />
                    </label>
                    <button type="submit" className="bg-purple p-2 rounded-md">
                      <IoIosSend className="text-white" />
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Inbox;
