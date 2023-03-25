import React from "react";
import SiderHorizontal from "../../../../../components/store-layout/sider-horizontal";
import RecipeCard from "../../../../../components/recipe/recipe-card";
import RecipeSection from "../../../../../components/recipe/recipe-section";
import { useSelector } from "react-redux";
import axiosService from "../../../../../services/axios";
import RiveResult from "../../../../../components/loader/rive-result";
import nookies from "nookies";
const ByCategory = ({ oneCategory }) => {
  const shop = useSelector((state) => state.stores.currentStore);
  let isEmpty = oneCategory?.child?.filter((item) => item.recipes?.length);
  return (
    <>
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <div className="page-title">{oneCategory?.translation?.title}</div>
      {oneCategory?.child
        ?.filter((item) => item.recipes?.length)
        .map((item, key) => (
          <RecipeSection
            key={key}
            title={item?.translation?.title}
            to={`/stores/${shop.id}/recipe/by-subcategory/${item.id}`}
          >
            {item?.recipes.map((recipe, key) => (
              <RecipeCard key={key} shop={shop} recipe={recipe} />
            ))}
          </RecipeSection>
        ))}
      {!Boolean(isEmpty?.length) && (
        <RiveResult text="There are not recipes in this category" />
      )}
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const params = {
    perPage: 5,
    lang: language_locale,
    shop_id: query.id,
  };
  try {
    const res = await axiosService.get(`/rest/recipe-category/${query.uuid}`, {
      params,
    });
    const oneCategory = await res.data.data;
    return {
      props: {
        oneCategory,
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
export default ByCategory;
