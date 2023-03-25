import React from "react";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import RecipeCard from "../../../../components/recipe/recipe-card";
import RecipeSection from "../../../../components/recipe/recipe-section";
import SEO from "../../../../components/seo";
import { useSelector } from "react-redux";
import axiosService from "../../../../services/axios";
import nookies from "nookies";

const AllRicepes = ({ recipeList }) => {
  const shop = useSelector((state) => state.stores.currentStore);
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
      <RecipeSection title="All Recipes">
        {recipeList?.map((recipe, key) => (
          <RecipeCard key={key} recipe={recipe} shop={shop} />
        ))}
      </RecipeSection>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const params = {
    perPage: 500,
    lang: language_locale,
  };
  try {
    const res = await axiosService.get("/rest/recipe/paginate", {
      params,
    });
    const recipeList = await res.data.data;
    return {
      props: {
        recipeList,
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
export default AllRicepes;
