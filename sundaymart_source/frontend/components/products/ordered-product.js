import React, { useContext, useEffect } from "react";
import AddFillIcon from "remixicon-react/AddFillIcon";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";
import { OrderContext } from "../../context/OrderContext";
import { deleteOrderProduct } from "../../utils/createCart";
import { getTotals, removeFromCart, setToCart } from "../../redux/slices/cart";
import { parseCookies } from "nookies";

const OrderedProduct = ({ data, isEdit, shop, element }) => {
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const cart = useSelector((state) => state.cart, shallowEqual);
  const currentProduct = cart.cartItems.find((item) => item?.id === data?.id);
  const { decrease, increase, getCart, getCartMember } =
    useContext(OrderContext);
  const deleteProduct = (data) => {
    deleteOrderProduct(element.id);
    if (cookies.cart_id) getCartMember();
    else getCart();
    batch(() => {
      dispatch(removeFromCart(data));
      dispatch(getTotals(shop.id));
    });
  };
  return (
    <div className="ordered-product">
      <div className="product-img">
        {getImage(data.product?.img)}
        {!isEdit && (
          <div className="delete" onClick={() => deleteProduct(data)}>
            <DeleteBinLineIcon />
          </div>
        )}
      </div>
      <div className="content">
        <div className="name">{data.product?.translation.title}</div>
        <div className="counter">
          <div className="total-price">
            {data.discount
              ? getPrice(data.price - data.discount)
              : getPrice(data.price)}
          </div>
          <div className="counter-btn">
            <button
              disabled={isEdit}
              className="decrement"
              onClick={() => decrease(data)}
            >
              <SubtractFillIcon />
            </button>
            <div className="count">
              {getCount(data, currentProduct, element)}
            </div>
            <button
              disabled={isEdit}
              className="increment"
              onClick={() => increase(data)}
            >
              <AddFillIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function getCount(data, currentProduct, element) {
  return `${
    currentProduct?.qty
      ? currentProduct?.qty
      : element?.quantity
      ? element?.quantity
      : 0
  } ${data?.product?.unit ? data?.product.unit?.translation?.title : ""}`;
}
export default OrderedProduct;
