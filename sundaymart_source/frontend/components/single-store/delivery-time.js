import moment from "moment/moment";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";

function DeliveryTime() {
  const [value, onChange] = useState(new Date());
  const shop = useSelector((state) => state.stores.currentStore);
  const getDeliveryTime = () => {
    const timeArray = [];
    let start = parseInt(shop?.open_time?.slice(0, 2));
    let end = parseInt(shop?.close_time?.slice(0, 2));
    for (start; start < end; start++) {
      timeArray.push({
        id: `${start}:00-${start + 1}:00`,
        value: `${start}:00 - ${start + 1}:00`,
      });
    }
    return timeArray;
  };
  return (
    <>
      <Calendar onChange={onChange} value={value} />
      {getDeliveryTime()?.map((item) => (
        <div key={item.id} className="delivery-date">
          <span></span>
          <div className="month">{moment().format("LL")}</div>
          <div className="time">{item.value}</div>
        </div>
      ))}
    </>
  );
}

export default DeliveryTime;
