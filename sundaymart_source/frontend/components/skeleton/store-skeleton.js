import React from "react";
import useWindowSize from "../../hooks/useWindowSize";

const StoreSkeleton = () => {
  const data = [1, 2, 3, 4, 5];
  const window = useWindowSize();
  return (
    <div className="store-loading">
      {data.slice(0, window.width > 768 ? 5 : 1).map((store) => {
        return (
          <div key={store} className="store_item skeleton">
            <div className="logo"></div>
            <div className="title"></div>
            <div className="short_description"></div>
            <div className="short_description"></div>
            <div className="footer">
              <div className="time"></div>
              <div className="score"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StoreSkeleton;
