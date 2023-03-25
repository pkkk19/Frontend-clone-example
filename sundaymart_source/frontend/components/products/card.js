import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddFillIcon from "remixicon-react/AddFillIcon";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import PercentFillIcon from "remixicon-react/PercentFillIcon";
import AddLineIcon from "remixicon-react/AddLineIcon";
import Gift2FillIcon from "remixicon-react/Gift2FillIcon";
import Link from "next/link";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";
import { addToViewed } from "../../redux/slices/viewed-product";
import { useTranslation } from "react-i18next";
import { OrderContext } from "../../context/OrderContext";

function ProductCard({ data }) {
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const cart = useSelector((state) => state.cart);
  const shop = useSelector((state) => state.stores.currentStore);
  const cartData = cart.cartItems.find((item) => item.id === data.id);
  const { decrease, increase, handleAddToCart } = useContext(OrderContext);
  return (
    <div
      className="product-card"
      onClick={() => dispatch(addToViewed({ ...data, shop }))}
    >
      {Boolean(data.discount) && (
        <div className="percent-icon">
          <PercentFillIcon size={20} />
        </div>
      )}
      {data.quantity >= data.min_qty && (
        <div className="liked-icon">
          {cartData?.id === data.id ? (
            <div className={`add-btn ${cartData.qty} active`}>
              <span>{cartData.qty}</span>
              <div className="counter-btn">
                <div className="decrement" onClick={() => decrease(data)}>
                  <SubtractFillIcon />
                </div>
                <div className="count">{`${cartData.qty} ${data?.product?.unit?.translation?.title}`}</div>
                <div className="increment" onClick={() => increase(data)}>
                  <AddFillIcon />
                </div>
              </div>
            </div>
          ) : (
            <div className="add-btn" onClick={() => handleAddToCart(data)}>
              <AddLineIcon size={20} />
            </div>
          )}
        </div>
      )}
      <Link href={`/product/${data.uuid}`} className="product-name">
        <div className="product-img">{getImage(data.product.img)}</div>
      </Link>
      {data.discount_expired && (
        <div className="sale-expire">{data.discount_expired}</div>
      )}
      <div className="product-card-footer">
        <div className="price">
          {`${
            data.discount
              ? getPrice(data.price - data.discount)
              : getPrice(data.price)
          } / 1 ${data?.product?.unit?.translation?.title}`}
        </div>
      </div>
      <Link href={`/product/${data.uuid}`} className="product-name">
        <a>{data.product.translation?.title}</a>
      </Link>
      <div className="product-name">
        {data.quantity < data.min_qty && <a>{tl("out of stock")}</a>}
      </div>
      {Boolean(data?.bonus) && (
        <div className="bonus">
          <Gift2FillIcon color="red" size={20} />
          <span>Bonus</span>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
