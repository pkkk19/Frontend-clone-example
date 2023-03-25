import React from "react";
import { useSelector } from "react-redux";
import RiveResult from "../../../../../components/loader/rive-result";
import ProductCard from "../../../../../components/products/card";
import ProductSection from "../../../../../components/products/section";

const ViewedProductsList = () => {
  const shop = useSelector((state) => state.stores.currentStore);
  const viewedProduct = useSelector(
    (state) => state.viewedProduct.viewedProductList
  ).filter((item) => item?.shop_id === shop?.id);
  return (
    <ProductSection title="Viewed Products">
      {viewedProduct?.map((data, key) => (
        <ProductCard key={key} data={data} />
      ))}
      {viewedProduct?.length === 0 && (
        <RiveResult text="There are no items in the viewed products" />
      )}
    </ProductSection>
  );
};

export default ViewedProductsList;
