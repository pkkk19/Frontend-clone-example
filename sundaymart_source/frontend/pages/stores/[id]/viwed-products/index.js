import React, { useContext, useEffect } from "react";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import SEO from "../../../../components/seo";
import { useSelector } from "react-redux";
import ProductSection from "../../../../components/products/section";
import ProductCard from "../../../../components/products/card";
import RiveResult from "../../../../components/loader/rive-result";
import { MainContext } from "../../../../context/MainContext";
function ViewedProducts() {
  const { checkViewedProduct, productViewedIds } = useContext(MainContext);
  const shop = useSelector((state) => state.stores.currentStore);
  const viewedProduct = useSelector(
    (state) => state.viewedProduct.viewedProductList
  ).filter((item) => item?.shop_id === shop?.id);
  useEffect(() => {
    const checked_viewed = sessionStorage.getItem("checked_viewed");
    if (!checked_viewed && productViewedIds.length) checkViewedProduct();
  }, []);
  return (
    <>
      <SEO />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <ProductSection title="Viewed Products">
        {viewedProduct?.map((data, key) => (
          <ProductCard key={key} data={data} />
        ))}
        {viewedProduct?.length === 0 && (
          <RiveResult text="There are no items in the viewed products" />
        )}
      </ProductSection>
    </>
  );
}

export default ViewedProducts;
