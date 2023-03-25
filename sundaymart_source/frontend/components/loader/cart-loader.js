import React from "react";
import { Spinner } from "reactstrap";

const CartLoader = () => {
  return (
    <div className="fetch-cart-loader">
      <Spinner color="success" />
    </div>
  );
};

export default CartLoader;
