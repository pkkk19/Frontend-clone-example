import React, { useState } from "react";
import dynamic from "next/dynamic";
import { recipes } from "../../../../constants/recipe";
import SiderHorizontal from "../../../../components/store-layout/sider-horizontal";
import axiosService from "../../../../services/axios";
import SEO from "../../../../components/seo";
import { imgBaseUrl } from "../../../../constants";
import { useTranslation } from "react-i18next";
import RecipeProduct from "../../../../components/products/recipe-product";
import { CartApi } from "../../../../api/main/cart";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
import { useRouter } from "next/router";
const Drawer = dynamic(() => import("../../../../components/drawer"));
const RecipeDetail = ({ recipeDetail }) => {
  const { t: tl } = useTranslation();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const shop = useSelector((state) => state.stores.currentStore);
  const [productsList, setProductList] = useState(
    recipeDetail.products?.flatMap((item) => [
      {
        shop_product_id: item.shopProduct.id,
        quantity: parseInt(item.measurement),
      },
    ])
  );
  const insertProduct = () => {
    setLoader(true);
    CartApi.insertProduct({ shop_id: shop.id, products: productsList })
      .then(() => {
        router.push(`/stores/${router.query.id}`);
        toast.success("Recipe added to crat");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  return (
    <>
      <SEO
        description={recipeDetail.translation.description}
        image={imgBaseUrl + recipeDetail.image}
        keywords={recipeDetail.translation.description}
        title={recipeDetail.translation.title}
      />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <div className="recipe-detail">
        <div className="ingredient-description">
          <div className="recipe-banner">
            <img src={imgBaseUrl + recipeDetail.image} />
            <div className="banner-footer">
              <div className="title">{recipeDetail.translation.title}</div>
              <div className="recipe-name">
                <div className="icon">
                  <img src={recipes.Recipe} />
                </div>
                <div className="label">{tl("Parents")}</div>
              </div>
            </div>
            <div className="cooking-data">
              <div className="data-item">
                <span>{tl("Active time")}</span>
                <div className="time">{`${recipeDetail.active_time} min`}</div>
              </div>
              <div className="data-item">
                <span>{tl("Total time")}</span>
                <div className="time">{`${recipeDetail.total_time} min`}</div>
              </div>
              <div className="data-item">
                <span>{tl("Calories")}</span>
                <div className="time">{`${recipeDetail.calories} kkal`}</div>
              </div>
              <div className="data-item">
                <span>{tl("Servings")}</span>
                <div className="time">6</div>
              </div>
            </div>
            <div className="cooking-data-mobile">
              <div className="data-item">
                <span>{tl("Active time")}</span>
                <div className="time">{`${recipeDetail.active_time} min`}</div>
              </div>
              <div className="data-item">
                <span>{tl("Total time")}</span>
                <div className="time">{`${recipeDetail.total_time} min`}</div>
              </div>
              <div className="data-item">
                <span>{tl("Calories")}</span>
                <div className="time">{`${recipeDetail.calories} kkal`}</div>
              </div>
              <div className="data-item">
                <span>{tl("Servings")}</span>
                <div className="time">6</div>
              </div>
            </div>
          </div>
          <div className="ingredient-list">
            <div className="list-blog">
              <div className="title">{tl("Ingredients List")}</div>
              <ul>
                {recipeDetail.products.map((item, key) => (
                  <li
                    key={key}
                  >{`${item.measurement} ${item.shopProduct?.product?.translation?.title}`}</li>
                ))}
              </ul>
            </div>
            <div className="list-blog instruction">
              <div className="title">{tl("Instructions")}</div>
              <ol>
                {recipeDetail.instructions?.map((item, key) => (
                  <li key={key}>{item.translation.title}</li>
                ))}
              </ol>
            </div>
            <div className="list-blog nutrition">
              <div className="title">{tl("Nutrition info")}</div>
              <ul>
                {recipeDetail.nutritions?.map((item, key) => (
                  <li key={key}>
                    <span>{item.translation.title}</span>
                    <span>{item.weight}</span>
                    <span>{`${item.percentage} %`}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="ingredient-cart">
          <div className="cart-header">
            <div className="title">{tl("Ingredients")}</div>
            {getButton(loader, recipeDetail, insertProduct, tl)}
          </div>
          {recipeDetail.products.map((item, key) => (
            <RecipeProduct
              key={key}
              measurement={item.measurement}
              data={item.shopProduct}
              setProductList={setProductList}
              productsList={productsList}
            />
          ))}
        </div>
      </div>
      <div className="view-ingredient" onClick={() => setVisible(true)}>
        {tl("View ingredients")}
      </div>
      <Drawer
        title="Ingredients"
        direction="bottom"
        visible={visible}
        setVisible={setVisible}
      >
        {recipeDetail.products.map((item, key) => (
          <RecipeProduct
            key={key}
            measurement={item.measurement}
            data={item.shopProduct}
            setProductList={setProductList}
            productsList={productsList}
          />
        ))}
        {getButton(loader, recipeDetail, insertProduct, tl)}
      </Drawer>
    </>
  );
};

function getButton(loader, recipeDetail, insertProduct, tl) {
  return (
    <div className="add-to-cart" onClick={insertProduct}>
      {loader ? (
        <Spinner color="light" size="sm" />
      ) : (
        `${tl("Add")} ${recipeDetail?.products?.length} ${tl("items to cart")}`
      )}
    </div>
  );
}
export async function getServerSideProps(ctx) {
  const { query } = ctx;
  try {
    const res = await axiosService.get(`/rest/recipe/${query.uuid}`);
    const recipeDetail = await res.data.data;
    return {
      props: {
        recipeDetail,
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
export default RecipeDetail;
