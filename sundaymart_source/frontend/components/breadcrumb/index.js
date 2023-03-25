import React from "react";
import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import UserAvatar from "../header/avatar";

const Breadcrumb = ({ data = {} }) => {
  const router = useRouter();
  const { t: tl } = useTranslation();
  return (
    <div className="breadcrumb">
      <div className="go-back" onClick={() => router.back()}>
        <ArrowLeftSLineIcon size={28} />
        <span>{tl("Back")}</span>
      </div>
      <div className="right">
        {Object.keys(data).length !== 0 && (
          <div className="order-data">
            <div className="id">{`#${data?.id}`}</div>
            <span></span>
            <div className="date">{data?.created_at?.slice(0, 16)}</div>
          </div>
        )}
        <UserAvatar />
      </div>
    </div>
  );
};

export default Breadcrumb;
