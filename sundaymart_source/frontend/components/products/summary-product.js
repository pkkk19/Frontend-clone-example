import React from "react";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";

const SummaryProduct = ({ data, qty, isBonus = false }) => {
  return (
    <div className={`summary-product ${isBonus && "replacement"}`}>
      <div className="product-img">{getImage(data?.product?.img)}</div>
      <div className="text-content">
        <div className="product-name">{data?.product?.translation?.title}</div>
        <div className="price">
          {isBonus
            ? `+${qty} bonus`
            : data?.discount
            ? `${getPrice(data.price_without_tax / data.qty)} x ${
                data?.qty ? data?.qty : qty
              } ${data?.unit?.product?.translation?.title}`
            : `${getPrice(data?.price)} x ${data?.qty ? data?.qty : qty} ${
                data?.product?.unit?.translation?.title
              }`}
        </div>
      </div>
    </div>
  );
};

export default SummaryProduct;
