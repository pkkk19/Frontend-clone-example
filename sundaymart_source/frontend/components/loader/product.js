import React from "react";
import ProductSkeleton from "../skeleton/product-skeleton";

const ProductLoader = () => {
  return (
    <>
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
      <ProductSkeleton />
    </>
  );
};

export default ProductLoader;
