import React, { useEffect, useState } from "react";
import ProductSection from "../../../../components/products/section";
import ProductCard from "../../../../components/products/card";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import SEO from "../../../../components/seo";
import axiosService from "../../../../services/axios";
import { ProductApi } from "../../../../api/main/product";
import RiveResult from "../../../../components/loader/rive-result";
import ProductLoader from "../../../../components/loader/product";
import nookies from "nookies";
import { imgBaseUrl } from "../../../../constants";
const AllProductByCategory = ({ categoryDetail, query }) => {
  const [list, setList] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(
    categoryDetail?.children[0]
  );
  const getProduct = (perPage = 15) => {
    ProductApi.get({
      perPage,
      page,
      category_id: currentCategory?.id || categoryDetail?.id,
      shop_id: query.id,
    })
      .then((response) => {
        setLastPage(response.meta.last_page);
        setList((prevList) =>
          prevList ? [...prevList, ...response.data] : response.data
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleCategory = (data) => {
    if (data.id !== currentCategory?.id) {
      setPage(1);
      setList(null);
      setCurrentCategory(data);
    }
  };
  const handlePaginate = () => {
    setPage((perPage) => perPage + 1);
  };
  useEffect(() => {
    getProduct();
  }, [currentCategory, page]);

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
        <div className="name">{categoryDetail?.translation.title}</div>
        <div className="items">
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
        </div>
      </div>
      <ProductSection title="">
        {list ? (
          list.map((data, key) => <ProductCard key={key} data={data} />)
        ) : (
          <ProductLoader />
        )}
        {list?.length === 0 && <RiveResult text="Product not found" />}
      </ProductSection>
      {lastPage > page && (
        <div className="load_more" onClick={handlePaginate}>
          {"View all"}
        </div>
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const params = {
    lang: language_locale,
  };
  try {
    const res = await axiosService.get(`/rest/categories/${query.uuid}`, {
      params,
    });
    const categoryDetail = await res.data.data;
    return {
      props: {
        categoryDetail,
        error: null,
        query,
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
export default AllProductByCategory;
