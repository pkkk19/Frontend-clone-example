import { parseCookies } from "nookies";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
import ShoppingBag3FillIcon from "remixicon-react/ShoppingBag3FillIcon";
import { DrawerConfig } from "../../configs/drawer-config";
import { MainContext } from "../../context/MainContext";
import { OrderContext } from "../../context/OrderContext";
import { getPrice } from "../../utils/getPrice";

function Balance() {
  const dc = DrawerConfig;
  const cookies = parseCookies();
  const { handleVisible, handleAuth } = useContext(MainContext);
  const { cartLoader, orderedProduct } = useContext(OrderContext);
  const onClick = () => {
    if (cookies.access_token || cookies.cart_id) handleVisible(dc.order_list);
    else {
      toast.error("Please login first");
      handleAuth("login");
    }
  };
  return (
    <div className="balance" onClick={onClick}>
      <div className="icon">
        {cartLoader ? (
          <Spinner color="light" size="sm" />
        ) : (
          <ShoppingBag3FillIcon size={20} />
        )}
      </div>
      <div className="amount">{getPrice(orderedProduct?.total_price)}</div>
    </div>
  );
}

export default Balance;
