import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getNotification } from "../../utils/getNotification";

export default function PushNotification() {
  const { t: tl } = useTranslation();
  const audioPlayer = useRef();
  const [notificationData, setNotificationData] = useState(null);
  const settings = useSelector((state) => state.settings.data, shallowEqual);

  const notify = () => {
    audioPlayer.current.play();
    toast(
      <div className="notification-body">
        <div className="title">{`${tl("Order")}_${
          notificationData?.title
        }`}</div>
        <div className="text">{notificationData?.body}</div>
      </div>,
      { hideProgressBar: true, className: "custom-toast" }
    );
  };
  useEffect(() => {
    if (notificationData?.title) {
      notify();
    }
  }, [notificationData]);

  useEffect(() => {
    if (Object.keys(settings).length)
      getNotification({
        vapid_key: settings.vapid_key,
        setNotificationData,
      });
  }, [notificationData, Object.keys(settings).length]);
  return (
    <div className="notification">
      <audio
        allow="autoplay"
        ref={audioPlayer}
        src={"/assets/media/web_whatsapp.mp3"}
      />
    </div>
  );
}
