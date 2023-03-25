import React, { useState } from "react";
import nookies from "nookies";
import { BrandApi } from "../../../../api/main/brand";
import axiosService from "../../../../services/axios";
import SEO from "../../../../components/seo";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import BrandCard from "../../../../components/brands";
import ProductSection from "../../../../components/products/section";

const AllBrand = ({ setLoader, data }) => {
  const [brandList, setBrandList] = useState(data.data);
  const [page, setPage] = useState(2);
  const [total, setTotal] = useState(data.meta.total);
  const getBrand = (perPage = 12, page = 1, sort = "asc") => {
    BrandApi.get({ perPage, page, sort })
      .then((response) => {
        setTotal(response.meta.total);
        setBrandList([...brandList, ...response.data]);
        setLoader(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handlePaginate = () => {
    setLoader(true);
    getBrand(12, page);
    setPage(page + 1);
  };
  const handleSort = (sort) => {
    setLoader(true);
    BrandApi.get({ perPage: 12, page: 1, sort })
      .then((response) => {
        setLoader(false);
        setBrandList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
      <div className="all-brand">
        <ProductSection
          handleSort={handleSort}
          total={total}
          title="All Brands"
          sort={brandList?.length ? true : false}
        >
          {brandList
            ? brandList.map((data, key) => {
                return <BrandCard key={key} data={data} />;
              })
            : ""}
        </ProductSection>
        {total / 12 >= page && (
          <div onClick={() => handlePaginate(page)} className="see-more">
            {"Load more"}
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const params = { perPage: 12, page: 1, lang: language_locale };
  try {
    const res = await axiosService.get("/rest/brands/paginate", {
      params,
    });
    const data = await res.data;
    return {
      props: {
        data,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        data: {},
        error: error,
      },
    };
  }
}
export default AllBrand;
