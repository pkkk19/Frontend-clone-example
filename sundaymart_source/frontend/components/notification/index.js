import Link from "next/link";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BlogApi } from "../../api/main/blog";
import {
  markAllList,
  addToViewed,
} from "../../redux/slices/viewed-notification";
import DiscordLoader from "../loader/discord-loader";

function Notification({ setVisible }) {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const [notificationList, setNotificationList] = useState(null);
  const notification = useSelector((state) => state.notification.data);
  const getNotification = () => {
    BlogApi.get({ type: "notification", perPage: 5 })
      .then((res) => {
        setNotificationList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleNotification = (value) => {
    dispatch(addToViewed(value));
    setVisible(false);
  };
  const handleMarkAllNotification = (value) => {
    dispatch(markAllList(value));
  };
  const readed = (item) => {
    const readed = notification.includes(item.id);
    return readed;
  };

  useEffect(() => {
    getNotification();
  }, []);
  return (
    <div className="notification-box">
      {notificationList ? (
        notificationList?.map((item, key) => (
          <Link key={key} href={`/notification/${item.uuid}`}>
            <div
              className="notification-item"
              onClick={() => handleNotification(item.id)}
            >
              {!readed(item) && <span></span>}
              <div className="title">{item?.translation.title}</div>
              <div className="date">
                <div className="day">{item?.created_at?.slice(0, 16)}</div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <DiscordLoader />
      )}
      <div
        className="clear-btn"
        onClick={() =>
          handleMarkAllNotification(notificationList?.map((item) => item.id))
        }
      >
        {tl("Clear all")}
      </div>
    </div>
  );
}

export default Notification;
