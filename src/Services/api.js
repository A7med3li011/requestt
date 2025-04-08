import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import axios from "axios";

// Sign up
export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post(`auth/signup`, userData);
    "Response => ", response;
    "Response => ", response.data;

    return response.data;
  } catch (error) {
    console.error("Sign-up error: ", error);
    throw error;
  }
};
// Sign in

export const signIn = async (userData) => {
  try {
    const response = await axiosInstance.post(`auth/signin`, userData);
    "Response => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Sign-in error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// resend verification code

export const resendVerificationCode = async (email) => {
  try {
    const response = await axiosInstance.post("auth/resend", { email });
    "Response => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Resend verification code error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// forget password

export const forgetPassword = async (email) => {
  try {
    const response = await axiosInstance.post("auth/forget/", { email });
    "Response => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Forget password error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Update User API Call
export const updateUser = async (userId, userData, token) => {
  try {
    const response = await axiosInstance.put(`users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    "Response from update => ", response;
    return response.data;
  } catch (error) {
    console.error("Update user error: ", error.response?.data || error.message);
    throw error;
  }
};
export const uploadCompanyFiles = async (userId, updatedData) => {
  const formData = new FormData();
  formData.append("name", updatedData.name);
  formData.append("companyLogo", updatedData.companyLogo);
  formData.append("electronicStamp",updatedData.electronicStamp);
  formData.append("signature", updatedData.signature);
  formData.append("companyName", updatedData.companyName);
    console.log(userId,updatedData)

  try {
    const response = await axiosInstance.put(
      `users/company/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    "Response from update => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Update company files error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// upload avatar

export const uploadAvatar = async (userId, profilePic, token) => {
  try {
    const formData = new FormData();
    formData.append("profilePic", profilePic);

    const response = await axiosInstance.put(
      `users/photo/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    "Response from avatar upload => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Upload avatar error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all roles

export const getAllRoles = async (token) => {
  try {
    const response = await axiosInstance.get("type", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from roles => ", response;
    return response.data;
  } catch (error) {
    console.error("Get roles error: ", error.response?.data || error.message);
    throw error;
  }
};

// get all project For User

export const getAllProjectsForUser = async (userId, token) => {
  try {
    const response = await axiosInstance.get(`project/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from projects => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get projects error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get Project history
export const getProjectHistory = async (Status, userId, token) => {
  try {
    const response = await axiosInstance.get(
      `project/user/status/${userId}?status=${Status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    "Response from project history => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get project history error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get analysis

export const getAnalysis = async (UserId, token) => {
  try {
    const response = await axiosInstance.get(
      `project/user/analytics/${UserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    "Response from analysis => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get analysis error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get Project details

export const getProjectDetails = async (projectId) => {
  try {
    const response = await axiosInstance.get(`project/${projectId}`);

    "Response from project details => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get project details error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// update project

export const updateProject = async (projectId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `project/${projectId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    "Response from update project => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Update project error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// add Project

export const addProject = async (token, projectData) => {
  projectData;
  try {
    const response = await axiosInstance.post(`project`, projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    "Response from add project => ", response;
    return response.data;
  } catch (error) {
    console.error("Add project error: ", error.response?.data || error.message);
    throw error;
  }
};

// get all tasks Per Project

export const getAllTasksPerProject = async (projectId, Status) => {
  try {
    // Construct the query parameters

    // Append query parameters to the request URL
    const response = await axiosInstance.get(
      `task/project/${projectId}?status=${Status}`
    );

    "Response from tasks => ", response;
    return response.data;
  } catch (error) {
    console.error("Get tasks error: ", error.response?.data || error.message);
    throw error;
  }
};

// get Task details

export const getTaskDetails = async (taskId) => {
  try {
    const response = await axiosInstance.get(`task/${taskId}`);

    "Response from task details => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get task details error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all Owners

export const getAllOwners = async (token) => {
  try {
    const response = await axiosInstance.get(`users/owners`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from owners => ", response;
    return response.data;
  } catch (error) {
    console.error("Get owners error: ", error.response?.data || error.message);
    throw error;
  }
};

//  get all consultant

export const getAllConsultants = async (token) => {
  try {
    const response = await axiosInstance.get(`users/consultant`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from consultants => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get consultants error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all contractor

export const getAllContractors = async (token) => {
  try {
    const response = await axiosInstance.get(`users/contractor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from contractors => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get contractors error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// addTask function
export const addTask = async (taskData, lang) => {
  try {
    const response = await axiosInstance.post(`task?lang=${lang}`, taskData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    "Response from add task => ", response;
    return response.data;
  } catch (error) {
    console.error("Add task error: ", error.response?.data || error.message);
    throw error;
  }
};

// get all tags

export const getAllTagsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`tags/user/${userId}`);

    "Response from tags => ", response;
    return response.data;
  } catch (error) {
    console.error("Get tags error: ", error.response?.data || error.message);
    throw error;
  }
};

//  Add  Tag
export const addTag = async (tag, userId, lang) => {
  try {
    `tags/${userId}`, "tag", tag;
    const response = await axiosInstance.post(
      `tags/${userId}?lang=${lang}`,
      tag
    );

    "Response from add tag => ", response;
    return response.data;
  } catch (error) {
    console.error("Add tag error: ", error.response?.data || error.message);
    throw error;
  }
};

//  send email contact us

export const sendEmailContactUs = async (contactData, userId) => {
  try {
    const response = await axiosInstance.post(
      `users/contactUs/${userId}`,
      contactData
    );

    "Response from send email contact us => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Send email contact us error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendEmailGetInTouch = async (contactData) => {
  // if (!localStorage.getItem("token")) {
  //   toast.error("please login first");
  //   return
  // }
  try {
    const response = await axiosInstance.post(
      `users/getInTouch/`,
      contactData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    "Response from send email contact us => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Send email contact us error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get all Docs
export const getAllDocs = async (userId) => {
  try {
    const response = await axiosInstance.get(`project/user/files/${userId}`);
    "Response from docs => ", response;
    return response.data;
  } catch (error) {
    console.error("Get docs error: ", error.response?.data || error.message);
    throw error;
  }
};

//  get Files Per Tag

export const getFilesPerTag = async (tagId, projectId) => {
  try {
    const response = await axiosInstance.get(
      `project/files/${tagId}/${projectId}`
    );

    "Response from files per tag => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get files per tag error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  download All Files

export const downloadAllFiles = async (tagId) => {
  try {
    const response = await axiosInstance.get(`project/download/${tagId}`);

    "Response from download all files => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Download all files error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get all discipline

export const getAllDiscipline = async () => {
  try {
    const response = await axiosInstance.get(`discipline`);

    "Response from discipline => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get discipline error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all ActionCodes

export const getAllActionCodes = async () => {
  try {
    const response = await axiosInstance.get(`action`);

    "Response from action codes => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get action codes error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get all reason

export const getAllReasons = async () => {
  try {
    const response = await axiosInstance.get(`reason`);

    "Response from reasons => ", response;
    return response.data;
  } catch (error) {
    console.error("Get reasons error: ", error.response?.data || error.message);
    throw error;
  }
};

// send request

export const sendRequest = async (token, requestData) => {
  try {
    const response = await axiosInstance.post(`request`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    "Response from send request => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Send request error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// add task table

export const addTasksTable = async (tasksTableData) => {
  try {
    const response = await axiosInstance.post(`table`, tasksTableData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    "Response from add task table => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Add task table error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all units

export const getAllUnits = async () => {
  try {
    const response = await axiosInstance.get(`units`);

    "Response from units => ", response;
    return response.data;
  } catch (error) {
    console.error("Get units error: ", error.response?.data || error.message);
    throw error;
  }
};

//  get user-group
export const getUserGroup = async (token) => {
  try {
    const response = await axiosInstance.get(`userGroup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from user-group => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get user-group error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get all vocations
export const getAllVocations = async (userId, lang) => {
  try {
    const response = await axiosInstance.get(
      `vocation/`
    );

    "Response from vocations => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get vocations error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// update team

export const updateTeam = async (token, teamId, teamData, lang) => {
  try {
    const response = await axiosInstance.put(
      `team/${teamId}?lang=${lang}`,
      teamData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    "Response from update team => ", response;
    return response.data;
  } catch (error) {
    console.error("Update team error: ", error.response?.data || error.message);
    throw error;
  }
};

// delegated Team

export const delegatedTeam = async (token, teamId) => {
  try {
    const response = await axiosInstance.get(`team/delegate/${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    "Response from delegated team => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Delegated team error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  delete user from  project  in delegated Team
export const deleteUserFromProject = async (token, project, userId) => {
  try {
    const response = await axiosInstance.delete(`team/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { project },
    });

    "Response from delete user from project => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Delete user from project error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all  parent tasks
export const getAllParentTasks = async (userId, projectId) => {
  try {
    const response = await axiosInstance.get(
      `task/parentTasks/${userId}/${projectId}`
    );
    "Response from parent tasks => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get parent tasks error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all sub Tasks by Parent Task

export const getAllSubTasksByParentTask = async (parentTaskId) => {
  try {
    const response = await axiosInstance.get(`task/sub/${parentTaskId}`);

    "Response from sub tasks by parent task => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get sub tasks by parent task error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get team count

export const getTeamCount = async (teamId) => {
  try {
    const response = await axiosInstance.get(`team/count/${teamId}`);

    "Response from team count => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get team count error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get members by project

export const getMembersByProject = async (projectId) => {
  "projectId from Api => ", projectId;

  try {
    const response = await axiosInstance.get(`project/members/${projectId}`);

    "Response from members by project => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get members by project error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// add member for project

export const addMemberForProject = async (projectId, MemberData, token) => {
  projectId;

  try {
    const response = await axiosInstance.put(
      `project/member/${projectId}`,
      MemberData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    "Response from add member for project => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Add member for project error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  delete member from project team

export const deleteMemberFromProjectTeam = async (projectId, Member) => {
  Member, "-----", projectId;
  try {
    const response = await axiosInstance.put(
      `project/pull/${projectId}`,
      Member,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    "Response from delete member from project team => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Delete member from project team error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// update task

export const updateTask = async (token, taskId, userId, taskData) => {
  // console.log(token, taskId, userId, taskData)
  try {
    const response = await axiosInstance.put(
      `task/${taskId}?id=${userId}`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    "Response from update task => ", response;
    return response.data;
  } catch (error) {
    console.error("Update task error: ", error.response?.data || error.message);
    throw error;
  }
};

//  get notification counts

export const getNotificationCounts = async (token, userId) => {
  try {
    const response = await axiosInstance.get(`project/counts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from notification counts => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get notification counts error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get task history

export const getTaskHistory = async (token, taskId) => {
  try {
    const response = await axiosInstance.get(`taskLog/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from task history => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get task history error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  send invite
export const sendInvite = async (token, invitationData) => {
  try {
    const response = await axiosInstance.post(`users/invite`, invitationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    "Response from send invite => ", response;
   
    return response.data;
  } catch (error) {
    console.error("Send invite error: ", error.response?.data || error.message);
    throw error;
  }
};

// get data for invite
export const getDataForInvite = async (token, invitationId, userId) => {
  try {
    const response = await axiosInstance.get(
      `users/invite/${userId}?id=${invitationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    "Response from get data for invite => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get data for invite error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//   approve invite
export const approveInvite = async (inviteId, inviteData) => {
  try {
    inviteData, inviteId;

    const response = await axiosInstance.put(
      `users/invite/${inviteId}`,
      inviteData
    );

    "Response from approve invite => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Approve invite error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  cancel invite
export const cancelInvite = async (token, inviteId) => {
  try {
    const response = await axiosInstance.delete(`users/invite/${inviteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from cancel invite => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Cancel invite error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get models
export const getModelsByProject = async (token, projectId) => {
  try {
    const response = await axiosInstance.get(`request/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from get models => ", response;
    return response.data;
  } catch (error) {
    console.error("Get models error: ", error.response?.data || error.message);
    throw error;
  }
};

// get model by id
export const getModelById = async (token, ReqId) => {
  try {
    const response = await axiosInstance.get(`request/${ReqId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    "Response from get model by id => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get model by id error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  update model

export const updateModel = async (token, ReqId, modelData) => {
  try {
    const response = await axiosInstance.put(`request/${ReqId}`, modelData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    "Response from update model => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Update model error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// get all members by project

export const getAllMembersByProject = async (projectId, lang) => {
  "projectId from Api => ", projectId;

  try {
    const response = await axiosInstance.get(
      `project/members/${projectId}?lang=${lang}`
    );

    "Response from members by project => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get members by project error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  add vocation

export const addVocation = async (token, vocationData, lang) => {
  try {
    const response = await axiosInstance.post(
      `vocation?lang=${lang}`,
      vocationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    `vocation?lang=${lang}`;

    "Response from add vocation => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Add vocation error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get all tags by project

export const getAllTagsByProject = async (projectId, lang) => {
  try {
    const response = await axiosInstance.get(
      `tags/project/${projectId}?lang=${lang}`
    );

    "Response from tags by project => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get tags by project error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get project tag progress

export const getProjectTagProgress = async (projectId, lang) => {
  try {
    const response = await axiosInstance.get(
      `project/tags/progress/${projectId}?lang=${lang}`
    );

    "Response from get project tag progress => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get project tag progress error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  get all notifications

export const getAllNotifications = async (token, userId, days) => {
  try {
    const response = await axiosInstance.get(
      `notification/${userId}?days=${days}`
    );

    "Response from get all notifications => ", response;
    return response.data;
  } catch (error) {
    console.error(
      "Get all notifications error: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//  update notification

export const updateNotification = async (token, NotifiId, NotifiData) => {
  try {
    const response = await axiosInstance.put(
      `/notification/${NotifiId}`,
      NotifiData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    "Response from update notification =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Update notification error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  make all read
export const MakeAllRead = async (token, userId, NotifiData) => {
  try {
    const response = await axiosInstance.put(
      `/notification/all/${userId}`,
      NotifiData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    "Response from update notifications =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Update notifications error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  get all groups & members
export const getAllGroupsAndMembers = async (token, projectId) => {
  try {
    const response = await axiosInstance.get(`/group/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    "Response from get all groups and members =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Get all groups and members error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  create chat Group
export const createChatGroup = async (token, chatGroupData) => {
  try {
    const response = await axiosInstance.post(`/group`, chatGroupData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    "Response from create chat group =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Create chat group error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  get messages between two users
export const getMessagesBetweenUsers = async (
  token,
  projectId,
  sender,
  receiver
) => {
  try {
    const response = await axiosInstance.get(
      `Message/${projectId}?sender=${sender}&receiver=${receiver}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    "Response from get messages between two users =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Get messages between two users error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  get all projects by user

export const getAllProjectsByUser = async (token, userId) => {
  try {
    const response = await axiosInstance.get(`/Message/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    "Response from get all projects by user =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Get all projects by user error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  send msg
export const sendMessage = async (msgData) => {
  try {
    const response = await axiosInstance.post(`/message`, msgData, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    "Response from send msg =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Send msg error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  send docs & VoiceNote
export const sendDocsAndVoiceNote = async (msgData) => {
  try {
    const response = await axiosInstance.post(`/message/images`, msgData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    "✅ Response from send docs & VoiceNote:", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("❌ Send docs & VoiceNote error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  get group data

export const getGroupData = async (token, projectId, groupId) => {
  try {
    const response = await axiosInstance.get(
      `/Message/group/${projectId}?group=${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    "Response from get group data =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Get group data error:", errorMessage);
    throw new Error(errorMessage);
  }
};

// get Group data by id

export const getGroupDataById = async (token, groupId) => {
  try {
    const response = await axiosInstance.get(`/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    "Response from get group data by id =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Get group data by id error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  get users to add new member

export const getUsersToAddMember = async (token, projectId, groupId) => {
  try {
    const response = await axiosInstance.get(
      `/group/${groupId}/project/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    "Response from get users to add new member =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Get users to add new member error:", errorMessage);
    throw new Error(errorMessage);
  }
};

//  update group

export const updateGroupData = async (token, groupId, data) => {
  try {
    const response = await axiosInstance.put(`/group/${groupId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    "Response from update group =>", response.data;
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    console.error("Update group error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export async function deleteUserFromUsers(userId) {
  await axios
    .delete(`https://api.request-sa.com/api/v1/users/${userId}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err, "err");
    });
}
