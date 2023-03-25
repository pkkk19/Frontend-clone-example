import React from "react";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import IngredientCard from "../../../../components/recipe/ingredients-card";
import RecipeSection from "../../../../components/recipe/recipe-section";
import SEO from "../../../../components/seo";
import { useSelector } from "react-redux";
import axiosService from "../../../../services/axios";
import nookies from "nookies";

const AllRecipeCategory = ({ recipeCategoryList }) => {
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
      <RecipeSection title="All recipe categories">
        {recipeCategoryList?.map((item, key) => (
          <IngredientCard key={key} data={item} shop={shop} />
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
    perPage: 160,
    lang: language_locale,
  };
  try {
    const res = await axiosService.get("/rest/recipe-category/paginate", {
      params,
    });
    const recipeCategoryList = await res.data.data;
    return {
      props: {
        recipeCategoryList,
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
export default AllRecipeCategory;
