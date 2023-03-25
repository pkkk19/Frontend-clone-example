import React, { useEffect, useState } from "react";
import AddFillIcon from "remixicon-react/AddFillIcon";
import SubtractFillIcon from "remixicon-react/SubtractFillIcon";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";

const RecipeProduct = ({ data, measurement, setProductList, productsList }) => {
  const [qty, setQty] = useState(0);

  const decrease = (measurement) => {
    const m = parseInt(measurement);
    if (qty > m) {
      setQty((prev) => prev - 1);
    }
    const nextArray = productsList.map((element) => {
      if (element.shop_product_id === data.id) {
        return {
          shop_product_id: element.shop_product_id,
          quantity: element.quantity - 1,
        };
      } else {
        return element;
      }
    });
    setProductList(nextArray);
  };
  const increase = (measurement) => {
    const m = parseInt(measurement);
    if (qty >= m) {
      setQty((prev) => prev + 1);
    }
    const nextArray = productsList.map((element) => {
      if (element.shop_product_id === data.id) {
        return {
          shop_product_id: element.shop_product_id,
          quantity: element.quantity + 1,
        };
      } else {
        return element;
      }
    });
    setProductList(nextArray);
  };
  useEffect(() => {
    setQty(parseInt(measurement));
  }, []);
  return (
    <div className="ordered-product">
      <div className="product-img">{getImage(data.product?.img)}</div>
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
              disabled={qty === parseInt(measurement)}
              className="decrement"
              onClick={() => decrease(measurement)}
            >
              <SubtractFillIcon />
            </button>
            <div className="count">{getCount(measurement, qty)}</div>
            <button className="increment" onClick={() => increase(measurement)}>
              <AddFillIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function getCount(measurement, qty) {
  return `${qty ? qty : measurement}`;
}
export default RecipeProduct;
