import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DrawerConfig } from "../../../configs/drawer-config";
import { MainContext } from "../../../context/MainContext";
import OrderedProduct from "../../products/ordered-product";
import { Button } from "reactstrap";
import RiveResult from "../../loader/rive-result";
import { getPrice } from "../../../utils/getPrice";
import { useTranslation } from "react-i18next";
import { clearCart } from "../../../redux/slices/cart";

const LocalOrderedProduct = () => {
  const dc = DrawerConfig;
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const { handleVisible, setVisible } = useContext(MainContext);
  const shop = useSelector((state) => state.stores.currentStore);
  const cartList = useSelector((state) => state.cart);
  const currentStoreProducts = cartList.cartItems?.filter(
    (item) => item.shop_id === shop.id
  );
  const clear = () => {
    dispatch(clearCart(shop.id));
    setVisible(false);
  };
  return (
    <>
      {currentStoreProducts?.length > 0 ? (
        <>
          <div className="order-header">
            <div className="total-count">
              {cartList.cartTotalQuantity} {tl("products")}
            </div>
            <div className="clear-btn" onClick={clear}>
              {tl("Clear all")}
            </div>
          </div>
          {currentStoreProducts?.map((data, key) => (
            <OrderedProduct key={key} data={data} />
          ))}
          <div className="to-checkout">
            <div className="total-amount">
              <div className="label">{tl("Total amount")}</div>
              <div className="count">{getPrice(cartList.cartTotalAmount)}</div>
            </div>
            <Button
              className="btn btn-success"
              onClick={() => handleVisible(dc.cart_summary)}
              disabled={cartList.cartTotalAmount <= 0 ? true : false}
            >
              {tl("Checkout")}
            </Button>
          </div>
        </>
      ) : (
        <RiveResult id="noproductsfound" />
      )}
    </>
  );
};

export default LocalOrderedProduct;
