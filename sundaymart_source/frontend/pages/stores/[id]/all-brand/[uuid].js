import React, { useState } from "react";
import nookies from "nookies";
import BrandBanner from "../../../../components/brands/banner";
import ProductCard from "../../../../components/products/card";
import ProductSection from "../../../../components/products/section";
import axiosService from "../../../../services/axios";
import { ProductApi } from "../../../../api/main/product";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import SEO from "../../../../components/seo";
import RiveResult from "../../../../components/loader/rive-result";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";

const BrandDetail = ({ setLoader, brand, products }) => {
  const { t: tl } = useTranslation();
  const router = useRouter();
  const [productList, setProductList] = useState(products.data);
  const [page, setPage] = useState(2);
  const [total, setTotal] = useState(products.meta.total);

  const getProduct = (perPage = 4, page = 1) => {
    ProductApi.get({ perPage, page, brand_id: router.query.id })
      .then((response) => {
        setTotal(response.meta.total);
        setProductList([...productList, ...response.data]);
        setLoader(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handlePaginate = () => {
    setLoader(true);
    getProduct(4, page);
    setPage(page + 1);
  };

  return (
    <>
      <SEO title={brand?.data?.brand.title} image={brand?.data?.brand.img} />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <div className="brand-detail">
        <BrandBanner brand={brand} />
        <ProductSection
          total={products.meta.total}
          title={brand?.data?.brand.title}
          sort={true}
        >
          {productList.map((product, key) => (
            <ProductCard key={key} product={product} />
          ))}
          {productList?.length <= 0 && (
            <RiveResult text="Product not found in the brand" />
          )}
        </ProductSection>
        {total / 4 >= page && (
          <div onClick={() => handlePaginate(page)} className="see-more">
            {tl("Load more")}
          </div>
        )}
      </div>
    </>
  );
};
export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const currency_id = cookies?.currency_id;
  const language_locale = cookies?.language_locale;
  const brandRes = await axiosService.get(`/rest/brands/${query.uuid}`, {
    params: { lang: language_locale },
  });
  const productRes = await axiosService.get(`/rest/products/paginate`, {
    params: {
      perPage: 4,
      brand_id: query.uuid,
      currency_id,
      lang: language_locale,
    },
  });
  const brand = await brandRes.data;
  const products = await productRes.data;
  return { props: { brand, products } };
}
export default BrandDetail;
