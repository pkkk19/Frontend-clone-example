import React from "react";
import SiderHorizontal from "../../../../../components/store-layout/sider-horizontal";
import RecipeCard from "../../../../../components/recipe/recipe-card";
import RecipeSection from "../../../../../components/recipe/recipe-section";
import { useSelector } from "react-redux";
import axiosService from "../../../../../services/axios";
import nookies from "nookies";

const BySubcategory = ({ oneCategory }) => {
  const shop = useSelector((state) => state.stores.currentStore);
  return (
    <>
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <RecipeSection title={oneCategory?.translation?.title}>
        {oneCategory?.recipes?.map((recipe, key) => (
          <RecipeCard key={key} shop={shop} recipe={recipe} />
        ))}
      </RecipeSection>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const params = {
    perPage: 50,
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
export default BySubcategory;
