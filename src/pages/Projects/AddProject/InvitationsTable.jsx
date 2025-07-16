import React, { useState } from "react";
import {
  Mail,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
} from "lucide-react";
import axios from "axios";

const InvitationsCards = ({ data }) => {
  const [copiedId, setCopiedId] = useState(null);

  async function resend(id) {
    await axios
      .post(`${import.meta.env.VITE_API_URL}project/resendInivite`, {
        invitationId: id,
      })
      .then((res) => {})
      .catch((err) => console.log(err));
  }
  // Direct array data without wrapper
  //   const data = [
  //     {
  //       _id: "687774131f8925e0a3d9ff0a",
  //       project: {
  //         _id: "687773de1f8925e0a3d9feda",
  //         name: "invi",
  //         progress: 0,
  //         tags: [],
  //       },
  //       role: {
  //         _id: "66d33e7a4ad80e468f231f8d",
  //         jobTitle: "consultant",
  //         rights: [
  //           {
  //             model: {
  //               _id: "66ba00b0e39d9694110fd3df",
  //               name: "model1",
  //             },
  //           },
  //         ],
  //       },
  //       email: "7mama3li0111@gmail.com",
  //       comment: "welcome",
  //       projectName: "invi",
  //       isSignUp: true,
  //       isApproved: false,
  //       createdBy: "6851bee9028597549a4ffbcb",
  //       date: "2025-07-16T09:42:43.441Z",
  //       createdAt: "2025-07-16T09:42:43.441Z",
  //       updatedAt: "2025-07-16T09:42:43.497Z",
  //       __v: 0,
  //       inivitaionLink:
  //         "https://request-sa.com/Invitation?id=687774131f8925e0a3d9ff0a",
  //     },
  //     {
  //       _id: "687774a11f8925e0a3da0038",
  //       project: {
  //         _id: "687773de1f8925e0a3d9feda",
  //         name: "invi",
  //         progress: 0,
  //         tags: [],
  //       },
  //       role: {
  //         _id: "66d33a4b4ad80e468f231f83",
  //         jobTitle: "owner",
  //         rights: [
  //           {
  //             model: {
  //               _id: "66ba00b0e39d9694110fd3df",
  //               name: "model1",
  //             },
  //           },
  //         ],
  //       },
  //       email: "a7med3li0111@gmail.com",
  //       comment: "s",
  //       projectName: "invi",
  //       isSignUp: true,
  //       isApproved: true,
  //       createdBy: "6851bee9028597549a4ffbcb",
  //       date: "2025-07-16T09:45:05.673Z",
  //       createdAt: "2025-07-16T09:45:05.673Z",
  //       updatedAt: "2025-07-16T09:45:05.728Z",
  //       __v: 0,
  //       inivitaionLink:
  //         "https://request-sa.com/Invitation?id=687774a11f8925e0a3da0038",
  //     },
  //   ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const StatusBadge = ({ isApproved }) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isApproved
            ? "bg-[#10B981] text-[#FFFFFF]"
            : "bg-[#F59E0B] text-[#FFFFFF]"
        }`}
      >
        {isApproved ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3 mr-1" />
            Pending
          </>
        )}
      </span>
    );
  };

  const RoleBadge = ({ role }) => {
    const colorMap = {
      owner: "bg-[#8B5CF6] text-[#FFFFFF]",
      consultant: "bg-[#3B82F6] text-[#FFFFFF]",
      admin: "bg-[#EF4444] text-[#FFFFFF]",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          colorMap[role] || "bg-[#6B7280] text-[#FFFFFF]"
        }`}
      >
        <User className="w-3 h-3 mr-1" />
        {role}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-linear_1 rounded-lg p-6 mb-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">
          Project Invitations
        </h2>
        <p className="text-white text-sm">Invitations loaded successfully</p>
        {/* <div className="mt-4 text-white text-sm">
          Total invitations: {data.length}
        </div> */}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
        {data.map((invitation, index) => (
          <div
            key={invitation._id}
            className="bg-[#FFFFFF] rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] p-4 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#FFFFFF]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1F2937] truncate">
                      {invitation.email}
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      ID: {invitation._id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <StatusBadge isApproved={invitation.isApproved} />
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-4">
              {/* Project Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6B7280] font-medium mb-1">
                    Project
                  </p>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {invitation.project.name}
                  </p>
                </div>
                {/* <div className="text-right">
                  <p className="text-xs text-[#6B7280] font-medium mb-1">
                    Progress
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-2 bg-[#E5E7EB] rounded-full">
                      <div
                        className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                        style={{ width: `${invitation.project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      {invitation.project.progress}%
                    </span>
                  </div>
                </div> */}
              </div>

              {/* Role */}
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-2">Role</p>
                <RoleBadge role={invitation.role.jobTitle} />
              </div>

              {/* Comment */}
              {invitation.comment && (
                <div>
                  <p className="text-xs text-[#6B7280] font-medium mb-1">
                    Comment
                  </p>
                  <p className="text-sm text-[#4B5563] bg-[#F9FAFB] p-2 rounded-md italic">
                    "{invitation.comment}"
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center text-xs text-[#6B7280]">
                <Calendar className="w-4 h-4 mr-2 text-[#9CA3AF]" />
                <span>{formatDate(invitation.date)}</span>
              </div>

              {/* Model Rights */}
              {/* <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Model Access
                </p>
                <div className="flex flex-wrap gap-1">
                  {invitation.role.rights.map((right, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-[#EFF6FF] text-[#1D4ED8] text-xs rounded"
                    >
                      {right.model.name}
                    </span>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Card Footer */}
            <div className="bg-[#F9FAFB] p-4 border-t border-[#E5E7EB]">
              <div className="flex space-x-2">
                <button
                  disabled={invitation?.isApproved}
                  onClick={() => resend(invitation._id)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 bg-[#3B82F6] disabled:cursor-not-allowed disabled:bg-[#18315a] text-[#FFFFFF] rounded-md text-sm font-medium hover:bg-[#2563EB] transition-colors duration-200`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Resend
                </button>

                {/* <button
                  onClick={() =>
                    copyToClipboard(invitation.inivitaionLink, invitation._id)
                  }
                  className="flex items-center justify-center px-4 py-2 bg-[#6B7280] text-[#FFFFFF] rounded-md text-sm font-medium hover:bg-[#4B5563] transition-colors duration-200"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  cancel
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#1F2937] mb-2">
            No invitations found
          </h3>
          <p className="text-[#6B7280]">
            There are no invitations to display at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default InvitationsCards;
