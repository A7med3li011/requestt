import React, { useState } from "react";
import { sendRequest } from "../../Services/api";

import RequestForm from "./Request";

const RequestForInspection = () => {
  const [showProjectName, setShowProjectName] = useState(true);
  const [showDiscipline, setShowDiscipline] = useState(true);
  const [showActionCodes, setShowActionCodes] = useState(true);
  const [showReasons, setShowReasons] = useState(true);

  return (
    <div>
      <RequestForm
        showProjectName={showProjectName}
        showDiscipline={showDiscipline}
        showActionCodes={showActionCodes}
        showReasons={showReasons}
        ReqTitle={"Request For Inspection(RFI)"}
        ApproveTitle={"requestForInspectionForm"}
      />
    </div>
  );
};

export default RequestForInspection;
