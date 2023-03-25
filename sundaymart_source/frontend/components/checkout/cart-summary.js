import React, { useContext } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CartApi } from "../../api/main/cart";
import SummaryProduct from "../../components/products/summary-product";
import { DrawerConfig } from "../../configs/drawer-config";
import { MainContext } from "../../context/MainContext";
import { OrderContext } from "../../context/OrderContext";
import { getPrice } from "../../utils/getPrice";
import OrderedProductLoader from "../loader/ordered-product";

const CartSummary = ({ setCalculated, calculated }) => {
  const { t: tl } = useTranslation();
  const dc = DrawerConfig;
  const { handleVisible } = useContext(MainContext);
  const { orderedProduct } = useContext(OrderContext);

  const getCalculate = () => {
    CartApi.calculate(orderedProduct?.id)
      .then((res) => {
        setCalculated(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (orderedProduct?.id) getCalculate();
  }, []);

  return (
    <div className="cart-summary">
      {calculated?.products ? (
        calculated?.products?.map((data, key) => (
          <SummaryProduct key={key} data={data} />
        ))
      ) : (
        <>
          <OrderedProductLoader />
          <OrderedProductLoader />
        </>
      )}
      {calculated.bonus_shop && (
        <SummaryProduct
          isBonus={calculated.bonus_shop}
          data={calculated.bonus_shop.shop_product}
          qty={calculated.bonus_shop.bonus_quantity}
        />
      )}
      <div className="total-price">
        <div className="label">{tl("Total product price")}</div>
        <div className="value">
          {getPrice(calculated?.product_total + calculated?.total_discount)}
        </div>
      </div>
      <div className="expenses">
        <div className="item">
          <div className="label">{tl("Discount")}</div>
          <div className="value">{getPrice(calculated?.total_discount)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("Shop tax")}</div>
          <div className="value">{getPrice(calculated?.order_tax)}</div>
        </div>
        <div className="item">
          <div className="label">{tl("VAT tax")}</div>
          <div className="value">{getPrice(calculated?.product_tax)}</div>
        </div>
      </div>
      <div className="total-amount">
        <div className="label">{tl("Total Amount")}</div>
        <div className="value">{getPrice(calculated?.order_total)}</div>
      </div>
      <div className="btn-group-box">
        <div
          className="btn btn-default"
          onClick={() => handleVisible(dc.order_list)}
        >
          {tl("Cancel")}
        </div>
        <div
          className="btn btn-success"
          onClick={() => handleVisible(dc.checkout)}
        >
          {tl("Order now")}
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
