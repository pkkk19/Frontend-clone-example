import React from "react";
import moment from "moment";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import { Message } from "@chatscope/chat-ui-kit-react";
const UserMessage = ({ text, time, status = "", chat_img }) => {
  return (
    <div className="user-sms-wrapper">
      <div className={`user-message ${chat_img && "chat-image"}`}>
        {chat_img && (
          <Message
            type="image"
            model={{
              direction: "incoming",
              payload: {
                src: chat_img,
                alt: "Joe avatar",
                width: "100%",
                height: "100%",
              },
            }}
          />
        )}
        {text && <div className="text">{text}</div>}
        <div className="time">{moment(new Date(time)).format("HH:mm")}</div>
        <span className="double-check">
          {status === "pending" ? "" : <CheckDoubleLineIcon size={16} />}
        </span>
      </div>
    </div>
  );
};

export default UserMessage;
