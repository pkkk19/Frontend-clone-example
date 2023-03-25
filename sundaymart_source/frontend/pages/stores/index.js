import React, { useContext, useEffect, useState } from "react";
import SiderHorizontal from "../../components/store-layout/sider-horizontal";
import SEO from "../../components/seo";
import axiosService from "../../services/axios";
import StoreCard from "../../components/stores/card";
import RiveResult from "../../components/loader/rive-result";
import { ShopContext } from "../../context/ShopContext";
import nookies from "nookies";
import { useTranslation } from "react-i18next";
import { ShopApi } from "../../api/main/shops";
import MyLoader from "../../components/loader/category-loader";
import StoreCategory from "../../components/stores/category";
import StoreSkeleton from "../../components/skeleton/store-skeleton";

function Stores({ shopsList = [] }) {
  const { t: tl } = useTranslation();
  const {
    stores,
    setStores,
    search,
    setSearch,
    getNearbyShops,
    handleFilter,
    searchStore,
    handleCategory,
    shopLoader,
  } = useContext(ShopContext);
  const [category, setCategory] = useState(null);
  const getCategory = () => {
    ShopApi.getCategory()
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    setStores(shopsList.data);
    getCategory();
  }, []);
  return (
    <>
      <SEO />
      <SiderHorizontal
        searchContent={true}
        categoryFilter={true}
        address={true}
        handleFilter={handleFilter}
        getNearbyShops={getNearbyShops}
        searchStore={searchStore}
        setSearch={setSearch}
        search={search}
      />
      {category ? (
        <div className="together-wrapper">
          <StoreCategory
            handleCategory={handleCategory}
            categoryList={category}
          />
        </div>
      ) : (
        <div className="store-category">
          <MyLoader />
        </div>
      )}
      <div className="content">
        <h3>{tl("Stores")}</h3>
        <div className="store">
          {shopLoader ? (
            <StoreSkeleton />
          ) : (
            stores?.map((item, key) => <StoreCard key={key} data={item} />)
          )}
          {stores?.length <= 0 && !shopLoader && (
            <RiveResult text="Shop not found" />
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const currency_id = cookies?.currency_id;
  const params = { page: 1, perPage: 15, lang: language_locale, currency_id };
  try {
    const res = await axiosService.get(`/rest/shops/paginate`, {
      params,
    });
    const shopsList = await res.data;
    return {
      props: {
        shopsList,
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
export default Stores;
