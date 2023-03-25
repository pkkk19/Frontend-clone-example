import React, { useEffect, useState } from "react";
import ProductSection from "../../../../components/products/section";
import ProductCard from "../../../../components/products/card";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import SEO from "../../../../components/seo";
import { ProductApi } from "../../../../api/main/product";
import RiveResult from "../../../../components/loader/rive-result";
import ProductLoader from "../../../../components/loader/product";
import { imgBaseUrl } from "../../../../constants";
import { useRouter } from "next/router";

const AllProductByCategory = () => {
  const router = useRouter();
  const [list, setList] = useState(null);
  const getProduct = (perPage = 12, page = 1) => {
    setList(null);
    ProductApi.get({
      perPage,
      page,
      category_id: router.query.category_id,
      shop_id: router.query.id,
      price_from: router.query.price_from,
      price_to: router.query.price_to,
      sort: router.query.sort,
      column_price: router.query.column_price,
    })
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getProduct();
  }, [router.query]);

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
      <div className="category">
        {/* <div className="name">{categoryDetail?.translation.title}</div> */}
        {/* <div className="items">
          {categoryDetail?.children.map((item) => (
            <div
              key={item.uuid}
              className={`item ${
                currentCategory?.id === item?.id ? "active" : ""
              }`}
              onClick={() => handleCategory(item)}
            >
              <img src={imgBaseUrl + item?.img} alt="children" />
              <div className="name">{item?.translation?.title}</div>
            </div>
          ))}
        </div> */}
      </div>
      <ProductSection title="">
        {list ? (
          list.map((data, key) => <ProductCard key={key} data={data} />)
        ) : (
          <ProductLoader />
        )}
        {list?.length === 0 && <RiveResult text="Product not found" />}
      </ProductSection>
    </>
  );
};

export default AllProductByCategory;
