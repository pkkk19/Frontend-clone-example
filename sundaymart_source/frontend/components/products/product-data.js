import React, { useContext } from "react";
import PriceTag3FillIcon from "remixicon-react/PriceTag3FillIcon";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import Message2FillIcon from "remixicon-react/Message2FillIcon";
import Heart3LineIcon from "remixicon-react/Heart3LineIcon";
import Heart3FillIcon from "remixicon-react/Heart3FillIcon";
import { useTranslation } from "react-i18next";
import { getPrice } from "../../utils/getPrice";
import { addToSaved, removeFromSaved } from "../../redux/slices/savedProduct";
import { useDispatch, useSelector } from "react-redux";
import AddLineIcon from "remixicon-react/AddLineIcon";
import SubtractLineIcon from "remixicon-react/SubtractLineIcon";
import { OrderContext } from "../../context/OrderContext";
import SummaryProduct from "./summary-product";

function ProdctData({ setVisible, product }) {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const likedProducts = useSelector(
    (state) => state.savedProduct.savedProductList
  );
  const cart = useSelector((state) => state.cart);
  const savedProduct = likedProducts.find((item) => item.id === product.id);
  const currentProduct = cart.cartItems.find(
    (item) => item?.id === product?.id
  );
  const { decrease, increase, handleAddToCart } = useContext(OrderContext);

  return (
    <div className="product-detail-data">
      {Boolean(product?.discount) && (
        <div className="sale">
          <div className="icon">
            <PriceTag3FillIcon size={16} />
          </div>
          <div className="label">
            {`${tl("Sale")} ${(
              (product?.discount / product?.price) *
              100
            ).toFixed(1)} % — ${getPrice(product?.discount)} off`}
          </div>
        </div>
      )}
      <div className="product-name">{product?.product.translation.title}</div>
      <div className="review-box">
        <div className="score item">
          <div className="icon">
            <StarSmileFillIcon size={16} />
          </div>
          <div className="label">
            {product?.rating_avg ? product.rating_avg.toFixed(1) : "0.00"}
          </div>
        </div>
        <div className="review item">
          <div className="icon">
            <Message2FillIcon size={16} />
          </div>
          <div className="label">{`${product?.reviews?.length} reviews`}</div>
        </div>
        <div className="comment-btn item" onClick={() => setVisible(true)}>
          <div className="icon">
            <Message2FillIcon size={16} />
          </div>
          <div className="label">{tl("Add comment")}</div>
        </div>
      </div>
      <div className="price">
        <div className="current-old">
          {product?.discount ? (
            <>
              <div className="current-price">
                {getPrice(product?.price - product?.discount)}
              </div>
              <div className="old-price">{getPrice(product?.price)}</div>
            </>
          ) : (
            <div className="current-price">{getPrice(product?.price)}</div>
          )}
        </div>
        <div className="availability">
          <div className="name">{tl("Availabity — ")} </div>
          <div className="link">{`${
            product?.quantity >= 0
              ? product?.quantity +
                ` ${product.product.unit?.translation?.title}` +
                tl(" in stock")
              : tl("out of stock")
          }`}</div>
        </div>
      </div>
      <div className="btn-box">
        {currentProduct ? (
          <div className="inc-dec">
            <button className="inc" onClick={() => decrease(product)}>
              <SubtractLineIcon />
            </button>
            <span>{`${currentProduct?.qty} ${
              product.product.unit?.translation?.title
            } ${tl(" in cart")}`}</span>
            <button className="dec" onClick={() => increase(product)}>
              <AddLineIcon />
            </button>
          </div>
        ) : (
          <button
            disabled={product?.quantity >= product?.min_qty ? false : true}
            className="add-to-card"
            onClick={() => handleAddToCart(product)}
          >
            {product?.quantity >= product?.min_qty
              ? tl("Add to cart")
              : tl("out of stock")}
          </button>
        )}
        <div className="like-btn">
          {savedProduct?.id === product?.id ? (
            <Heart3FillIcon
              size={24}
              color="#DE1F36"
              onClick={() => dispatch(removeFromSaved(product))}
            />
          ) : (
            <Heart3LineIcon
              size={24}
              onClick={() => dispatch(addToSaved(product))}
            />
          )}
        </div>
      </div>
      {product?.bonus?.status && (
        <div className="bonus">
          <h4>{tl("Bonus Product:")}</h4>
          <SummaryProduct
            data={product?.bonus?.bonus_product}
            isBonus={true}
            qty={product?.bonus?.bonus_quantity}
          />
        </div>
      )}
    </div>
  );
}

export default ProdctData;
