import React from "react";
import Message3Lineicon from "remixicon-react/Message3LineIcon";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
const RippleButton = ({ onClick }) => {
  const handleCLick = () => {
    const cookie = parseCookies();
    if (cookie?.access_token) {
      onClick(true);
    } else {
      toast.error("Please login first");
    }
  };
  return (
    <div className="ripple-btn" onClick={handleCLick}>
      <button>
        <Message3Lineicon />
      </button>
    </div>
  );
};

export default RippleButton;
