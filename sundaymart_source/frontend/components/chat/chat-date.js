import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";

const ChatDate = ({ date }) => {
  const isCurrentDay = moment(date, "DD-MM-YYYY").isSame(moment(), "day");
  const { t: tl } = useTranslation();
  return (
    <div
      className="chat-date"
      data-date={
        isCurrentDay ? tl("Today") : moment(date, "DD-MM-YYYY").format("D MMM")
      }
    />
  );
};

export default ChatDate;
