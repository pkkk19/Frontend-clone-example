import React from "react";
import { useSelector } from "react-redux";
import TimerFlashFillIcon from "remixicon-react/TimerFlashFillIcon";
function TimeRange() {
  const shop = useSelector((state) => state.stores.currentStore);
  return (
    <div className="time-range">
      <div className="time">
        <div className="icon">
          <TimerFlashFillIcon size={20} />
        </div>
        <div className="range">{`By ${shop?.open_time} - ${shop?.close_time}`}</div>
      </div>
    </div>
  );
}

export default TimeRange;
