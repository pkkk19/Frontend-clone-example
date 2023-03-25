import React from "react";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
function GoBack() {
  return (
    <div className="back-btn" onClick={() => window.history.back()}>
      <ArrowLeftLineIcon />
    </div>
  );
}

export default GoBack;
