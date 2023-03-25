import React from "react";
import InputText from "../form/form-item/InputText";

const ShareWallet = () => {
  return (
    <div className="add-wallet">
      <InputText label="Amount" placeholder="0" />
      <InputText label="User ID" placeholder="Friend ID" />
      <div className="btn btn-success">Transfer money</div>
    </div>
  );
};

export default ShareWallet;
