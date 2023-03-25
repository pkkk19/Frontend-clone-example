import React, { useContext, useEffect, useState } from "react";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { DrawerConfig } from "../../../configs/drawer-config";
import { MainContext } from "../../../context/MainContext";
import { OrderContext } from "../../../context/OrderContext";
import OrderedProduct from "../../products/ordered-product";
import { clearCart, setCartData, setMember } from "../../../redux/slices/cart";
import { Badge, Button, Spinner } from "reactstrap";
import RiveResult from "../../loader/rive-result";
import { getPrice } from "../../../utils/getPrice";
import { useTranslation } from "react-i18next";
import { deteleOrderCart } from "../../../utils/createCart";
import { CartApi } from "../../../api/main/cart";
import { parseCookies } from "nookies";
import SummaryProduct from "../../products/summary-product";
import RadioButtonFillIcon from "remixicon-react/RadioButtonFillIcon";
import { setIsOpenConfirmCheckout } from "../../../redux/slices/mainState";

const ServerOrderedProduct = () => {
  const dc = DrawerConfig;
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const { t: tl } = useTranslation();
  const [status, setStatus] = useState(true);
  const [loader, setLoader] = useState(false);
  const cartList = useSelector((state) => state.cart, shallowEqual);
  const { handleVisible, setVisible } = useContext(MainContext);
  const {
    orderedProduct,
    setOrderedProduct,
    fetchCart,
    balanceLoader,
    cartLoader,
  } = useContext(OrderContext);
  const cartData = useSelector((state) => state.cart.cartData, shallowEqual);
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const memberData = cartList?.memberData;
  const clear = () => {
    deteleOrderCart(orderedProduct?.id);
    setVisible(false);
    setOrderedProduct(null);
    batch(() => {
      dispatch(clearCart(shop.id));
      dispatch(setMember({}));
      dispatch(setCartData({}));
    });
  };
  const changeStatus = () => {
    setLoader(true);
    CartApi.statusChange({ uuid: memberData?.uuid, cart_id: cookies.cart_id })
      .then((res) => {
        setStatus(res.data.status);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(() => {
    fetchCart();
    if (cartData?.id || memberData?.id) {
      const intervalId = setInterval(() => {
        fetchCart();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, []);
  const getMemberStatus = () => {
    const newList = orderedProduct?.userCarts.filter((item) => !item.user_id);
    const isDone = newList?.some((element) => element.status);
    return isDone;
  };
  const handleCheckout = () => {
    if (!getMemberStatus()) {
      handleVisible(dc.cart_summary);
    } else {
      dispatch(setIsOpenConfirmCheckout(true));
    }
  };
  return (
    <>
      {orderedProduct?.userCarts?.length > 0 ? (
        <>
          <div className="order-header">
            <div className="total-count">
              {cartList.cartTotalQuantity} {tl("products")}
            </div>
            <div className="order-condition">
              <div className="replacement">
                <div className="icon">
                  <RadioButtonFillIcon />
                </div>
                <div className="label">Bonus product</div>
              </div>
            </div>
            {!cookies.cart_id && (
              <div className="clear-btn" onClick={clear}>
                {tl("Clear all")}
              </div>
            )}
          </div>
          {orderedProduct?.userCarts
            ?.filter((item) => item.cartDetails.length)
            .map((item) => (
              <>
                <div className="customer">
                  {item.name}:
                  {!item.user_id &&
                    (item.status ? (
                      <Badge color="primary">Choosing...</Badge>
                    ) : (
                      <Badge color="success">Done</Badge>
                    ))}
                </div>
                {item.cartDetails.map((element, key) =>
                  element.bonus ? (
                    <SummaryProduct
                      isBonus={element.bonus}
                      data={element.shopProduct}
                      qty={element.quantity}
                    />
                  ) : (
                    <OrderedProduct
                      key={key}
                      data={element.shopProduct}
                      element={element}
                      shop={shop}
                      isEdit={
                        cartData?.id
                          ? false
                          : memberData?.id
                          ? memberData?.id != item.id
                          : false
                      }
                    />
                  )
                )}
              </>
            ))}
          {!memberData?.id ? (
            <>
              <div className="to-checkout">
                <div className="total-amount">
                  <div className="label">{tl("Total amount")}</div>
                  <div className="count">
                    {balanceLoader ? (
                      <Spinner size="sm" />
                    ) : (
                      getPrice(orderedProduct?.total_price)
                    )}
                  </div>
                </div>
                <Button
                  className="btn btn-success"
                  onClick={handleCheckout}
                  disabled={orderedProduct?.total_price <= 0 ? true : false}
                >
                  {tl("Checkout")}
                </Button>
              </div>
            </>
          ) : (
            <div className="to-checkout">
              {status ? (
                <Button className="btn btn-success" onClick={changeStatus}>
                  {loader ? <Spinner /> : tl("Done")}
                </Button>
              ) : (
                <Button className="btn btn-secondary" onClick={changeStatus}>
                  {loader ? <Spinner /> : tl("Edit Order")}
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        !cartLoader && (
          <RiveResult
            id="noproductsfound"
            text="Product not added to cart yet"
          />
        )
      )}
    </>
  );
};

export default ServerOrderedProduct;
