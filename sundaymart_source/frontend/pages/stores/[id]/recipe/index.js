import React, { useState } from "react";
import dynamic from "next/dynamic";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import IngredientCard from "../../../../components/recipe/ingredients-card";
import RecipeCard from "../../../../components/recipe/recipe-card";
import RecipeSection from "../../../../components/recipe/recipe-section";
import SEO from "../../../../components/seo";
import { useSelector } from "react-redux";
import axiosService from "../../../../services/axios";
import nookies from "nookies";
import RiveResult from "../../../../components/loader/rive-result";
const Drawer = dynamic(() => import("../../../../components/drawer"));
const Banner = dynamic(() =>
  import("../../../../components/single-store/banner")
);
const StoreInfo = dynamic(() =>
  import("../../../../components/single-store/store-info")
);
const DeliveryTime = dynamic(() =>
  import("../../../../components/single-store/delivery-time")
);
const StoreRate = dynamic(() =>
  import("../../../../components/single-store/store-rate")
);
const Recipe = ({ recipeList, recipeCategoryList }) => {
  const [visible, setVisible] = useState(false);
  const [openContent, setOpenContent] = useState("");
  const shop = useSelector((state) => state.stores.currentStore);
  const openDrawer = (name) => {
    setVisible(true);
    setOpenContent(name);
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
      <Banner setVisible={openDrawer} data={shop} />
      {recipeCategoryList?.length ? (
        <>
          <RecipeSection
            title="Recipe categories"
            to={`/stores/${shop.id}/recipe/all-recipe-category`}
            className="scroller"
          >
            {recipeCategoryList?.map((item, key) => (
              <IngredientCard key={key} data={item} shop={shop} />
            ))}
          </RecipeSection>
          <RecipeSection
            title="Recipes"
            to={`/stores/${shop.id}/recipe/all-recipes`}
          >
            {recipeList?.map((recipe, key) => (
              <RecipeCard key={key} recipe={recipe} shop={shop} />
            ))}
            {recipeList?.length === 0 && <RiveResult text="Recipe not fount" />}
          </RecipeSection>
        </>
      ) : (
        recipeList?.length === 0 && <RiveResult text="Recipe not fount" />
      )}
      <Drawer title="Store info" visible={visible} setVisible={setVisible}>
        {openContent === "store-info" && <StoreInfo />}
        {openContent === "store-delivery" && <DeliveryTime />}
        {openContent === "rating" && <StoreRate />}
      </Drawer>
    </>
  );
};
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const { query } = ctx;
  const res = await axiosService.get("/rest/recipe/paginate", {
    params: {
      perPage: 5,
      lang: language_locale,
      shop_id: query.id,
    },
  });
  const resCat = await axiosService.get("/rest/recipe-category/paginate", {
    params: {
      perPage: 4,
      lang: language_locale,
      shop_id: query.id,
    },
  });
  const recipeList = await res.data.data;
  const recipeCategoryList = await resCat.data.data;
  return { props: { recipeList, recipeCategoryList } };
}
export default Recipe;
