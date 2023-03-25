import React from "react";
import ProductSection from "../../../../components/products/section";
import ProductCard from "../../../../components/products/card";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import SEO from "../../../../components/seo";
import { useSelector } from "react-redux";
import RiveResult from "../../../../components/loader/rive-result";
function LikedProducts() {
  const shop = useSelector((state) => state?.stores?.currentStore);
  const likedProducts = useSelector(
    (state) => state.savedProduct?.savedProductList
  )?.filter((item) => item?.shop?.id === shop?.id);
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
      <ProductSection title="Liked products">
        {likedProducts?.map((data, key) => (
          <ProductCard key={key} data={data} />
        ))}
        {likedProducts?.length === 0 && (
          <RiveResult text="There are no items in the liked products" />
        )}
      </ProductSection>
    </>
  );
}

export default LikedProducts;
