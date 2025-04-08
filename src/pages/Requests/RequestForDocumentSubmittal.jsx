import React, { useState } from "react";
import RequestForm from "./Request";

const RequestForDocumentSubmittal = () => {
  const [showProjectName, setShowProjectName] = useState(true);
  const [showDiscipline, setShowDiscipline] = useState(true);
  const [showActionCodes, setShowActionCodes] = useState(true);
  const [showReasons, setShowReasons] = useState(false);

  return (
    <div>
      <RequestForm
        showProjectName={showProjectName}
        showDiscipline={showDiscipline}
        showActionCodes={showActionCodes}
        showReasons={showReasons}
        ReqTitle={"Request For Document Submittal"}
        ApproveTitle={"requestForDocumentSubmittalApproval"}
      />
    </div>
  );
};

export default RequestForDocumentSubmittal;
