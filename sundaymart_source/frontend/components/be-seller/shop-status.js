import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const ShopStatus = ({ title, text, icon, className, href = "" }) => {
  const { t: tl } = useTranslation();
  return (
    <div className="tab-pane-custom">
      <div className="be-seller-status">
        <div className={`icon ${className}`}>{icon}</div>
        <div className="title">{tl(title)}</div>
        {text && (
          <Link href={href}>
            <button className="btn btn-dark">{tl(text)}</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ShopStatus;
