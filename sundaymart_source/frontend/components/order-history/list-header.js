import React from "react";
import { useTranslation } from "react-i18next";

const ListHeadeer = ({ activeTab }) => {
  const { t: tl } = useTranslation();
  return (
    <div className="list-header">
      <div className="head-data">{tl("ID, Store name")}</div>
      <div className="head-data">{tl("Number of products")}</div>
      <div className="head-data">{tl("Amount")}</div>
      <div className="head-data">{tl("Date")}</div>
      {/* {activeTab === "delivered" && (
        <div className="head-data refund">{tl("Refund")}</div>
      )} */}
    </div>
  );
};

export default ListHeadeer;
