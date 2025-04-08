import { useState } from "react";
import RequestForm from "./Request";

const WorkRequest = () => {
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
        ReqTitle={"Work Request"}
        ApproveTitle={"workRequest"}
      />
    </div>
  );
};

export default WorkRequest;
