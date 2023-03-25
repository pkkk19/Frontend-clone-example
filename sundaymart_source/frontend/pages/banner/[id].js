import React, { useEffect, useState } from "react";
import nookies from "nookies";
import axiosService from "../../services/axios";
import SEO from "../../components/seo";
import SiderHorizontal from "../../components/store-layout/sider-horizontal";
import { imgBaseUrl } from "../../constants";
import ProductSection from "../../components/products/section";
import ProductCard from "../../components/products/card";
import ProductLoader from "../../components/loader/product";
import RiveResult from "../../components/loader/rive-result";
const BannerDetail = ({ banner }) => {
  const [productList, setProductList] = useState(null);
  const getProduct = () => {
    axiosService
      .get(`/rest/banners/${banner.id}/products`)
      .then((response) => {
        setProductList(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <SEO
        description={banner?.translation.description}
        image={imgBaseUrl + banner?.img}
        keywords={banner?.translation.description}
        title={banner?.translation.title}
      />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <div className="seller-banner">
        <div className="banner-img detail-img">
          <img src={imgBaseUrl + banner?.img} />
        </div>
      </div>
      <ProductSection title="Banner detail">
        {productList ? (
          productList?.map((product, key) => (
            <ProductCard key={key} data={product} />
          ))
        ) : (
          <ProductLoader />
        )}
        {productList?.length === 0 && (
          <RiveResult text="There are no items in the liked products" />
        )}
      </ProductSection>
    </>
  );
};
export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const resBanner = await axiosService.get(`/rest/banners/${query.id}`, {
    params: { lang: language_locale },
  });

  let banner = resBanner.data.data;
  return { props: { banner } };
}
export default BannerDetail;
