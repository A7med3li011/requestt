import React, { useState } from "react";
import {
  Mail,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const InvitationsCards = ({ data }) => {
  const [copiedId, setCopiedId] = useState(null);

  async function resend(id) {
    await axios
      .post(`${import.meta.env.VITE_API_URL}project/resendInivite`, {
        invitationId: id,
      })
      .then((res) => {
        toast.success("resend invite successfully");
      })
      .catch((err) => console.log(err));
  }

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

  const StatusBadge = ({ isApproved, reject }) => {
    // Check if rejected first
    if (reject === true) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EF4444] text-[#FFFFFF]">
          <AlertCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      );
    }

    // Then check if approved
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#10B981] text-[#FFFFFF]">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    }

    // Default to pending
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F59E0B] text-[#FFFFFF]">
        <XCircle className="w-3 h-3 mr-1" />
        Pending
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
                <StatusBadge
                  isApproved={invitation.isApproved}
                  reject={invitation.reject}
                />
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
