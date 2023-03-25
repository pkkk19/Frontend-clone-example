import React, { useEffect, useState } from "react";
import { ProductApi } from "../../api/main/product";
import RiveResult from "../loader/rive-result";
import ProductCard from "./card";
import ProductSection from "./section";

const Related = ({ data }) => {
  const [relatedProduct, setRelatedProduct] = useState(null);
  const getRelatedProduct = () => {
    ProductApi.get({
      brand_id: data?.brand_id,
      category_id: data?.category_id,
      shop_id: data?.shop?.id,
      perPage: 3,
    })
      .then((res) => {
        setRelatedProduct(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getRelatedProduct();
  }, []);
  return (
    <div className="same-product">
      <ProductSection title="Releted products">
        {relatedProduct
          ?.filter((item) => item.id !== data?.id)
          .map((data, key) => {
            return <ProductCard key={key} data={data} />;
          })}
        {relatedProduct?.length < 2 && (
          <RiveResult text="There are no items in the related products" />
        )}
      </ProductSection>
    </div>
  );
};

export default Related;
