import React from "react";
import { useTranslation } from "react-i18next";
import CheckLineIcon from "remixicon-react/CheckLineIcon";

const Status = ({ orderDetail }) => {
  const { t: tl } = useTranslation();
  const index = status.findIndex((item) => item.id === orderDetail?.status);
  return (
    <div className="delivery-step">
      {status?.map((data, key) => (
        <div className="step" key={key}>
          <div className="data">
            <div
              className={
                key < index || index === status?.length - 1
                  ? "icon active"
                  : key === index
                  ? "icon waiting"
                  : "icon"
              }
            >
              {key > 0 && (
                <span
                  className={
                    key < index + 1
                      ? "active"
                      : key === index + 1
                      ? "waiting"
                      : ""
                  }
                />
              )}
              {key <= index && <CheckLineIcon size={18} />}
            </div>
            <div className="label">{tl(data.value)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
const status = [
  { id: "new", value: "New" },
  { id: "accepted", value: "Accepted" },
  { id: "ready", value: "Ready" },
  { id: "on_a_way", value: "On a way" },
  { id: "delivered", value: "Delivered" },
];
export default Status;
