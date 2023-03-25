import React from "react";
import FileList2LineIcon from "remixicon-react/FileList2LineIcon";
const StatisticCard = ({ type }) => {
  return (
    <div className="card statistics-card">
      <div className="card-body">
        <div className={`icon ${type}`}>
          <FileList2LineIcon size={27} />
        </div>
        <div className="count">11,831</div>
        <div className="label">Total order</div>
      </div>
    </div>
  );
};

export default StatisticCard;
