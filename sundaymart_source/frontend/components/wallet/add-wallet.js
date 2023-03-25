import React from "react";
import InputText from "../form/form-item/InputText";

const AddWallet = () => {
  return (
    <div className="add-wallet">
      <InputText label="Amount" placeholder="0" />
      <div className="btn btn-success">Top up wallet</div>
    </div>
  );
};

export default AddWallet;
