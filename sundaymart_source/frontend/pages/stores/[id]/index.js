import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SEO from "../../../components/seo";
import axiosService from "../../../services/axios";
import ProductLoader from "../../../components/loader/product";
import RiveResult from "../../../components/loader/rive-result";
import { ProductByCategoryApi } from "../../../api/main/product-by-category";
import nookies, { parseCookies } from "nookies";
import { imgBaseUrl } from "../../../constants";
import { batch, useDispatch } from "react-redux";
import { OrderContext } from "../../../context/OrderContext";
import { getCategory } from "../../../redux/slices/category";
import { getTotals } from "../../../redux/slices/cart";
import GroupLineIcon from "remixicon-react/GroupLineIcon";
import { useTranslation } from "react-i18next";
import { MainContext } from "../../../context/MainContext";
import { toast } from "react-toastify";
import Banner from "../../../components/single-store/banner";
import SiderHorizontal from "../../../components/store-layout/sider-horizontal";
import ProductSection from "../../../components/products/section";
import ProductCard from "../../../components/products/card";
import Category from "../../../components/single-store/category";
import { setOpengomodal } from "../../../redux/slices/mainState";
import { setRoleId } from "../../../redux/slices/chat";
const Drawer = dynamic(() => import("../../../components/drawer"));
const Brand = dynamic(() => import("../../../components/single-store/brand"));
const StoreInfo = dynamic(() =>
  import("../../../components/single-store/store-info")
);
const DeliveryTime = dynamic(() =>
  import("../../../components/single-store/delivery-time")
);
const StoreRate = dynamic(() =>
  import("../../../components/single-store/store-rate")
);
const BannerCard = dynamic(() =>
  import("../../../components/single-store/banner-card")
);
function SingleStore({ storeDetail }) {
  const cookies = parseCookies();
  const { handleAuth } = useContext(MainContext);
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [categoryBlog, setCategoryBlog] = useState(null);
  const [lastPage, setLastPage] = useState();
  const [visible, setVisible] = useState(false);
  const [openContent, setOpenContent] = useState("");
  const { fetchCart } = useContext(OrderContext);

  const openDrawer = (name) => {
    setVisible(true);
    setOpenContent(name);
  };
  const getProductByCategory = () => {
    setLoader(true);
    ProductByCategoryApi.get({
      page: page,
      perPage: 3,
      shop_id: storeDetail?.id,
    })
      .then((res) => {
        if (categoryBlog) setCategoryBlog([...categoryBlog, ...res.data]);
        else setCategoryBlog([...res.data]);
        setLastPage(res.meta.last_page);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(() => {
    getProductByCategory();
  }, [page]);

  useEffect(() => {
    if (cookies?.access_token && !cookies?.cart_id) fetchCart();
    batch(() => {
      dispatch(getTotals(storeDetail?.id));
      dispatch(setRoleId(storeDetail?.id));
      dispatch(
        getCategory({
          lang: cookies.language_locale,
          shop_id: storeDetail?.id,
        })
      );
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleScroll = () => {
    const lastProductLoaded = document.querySelector(
      ".products_row > .product-section:last-child"
    );
    if (lastProductLoaded) {
      const lastProductLoadedOffset =
        lastProductLoaded.offsetTop + lastProductLoaded.clientHeight;
      const pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset > lastProductLoadedOffset) {
        if (lastPage > page && !loader) {
          setPage((prev) => prev + 1);
        }
      }
    }
  };
  const handleTogether = () => {
    const cookie = parseCookies();
    if (cookie.access_token || cookie.cart_id) dispatch(setOpengomodal(true));
    else {
      toast.error("Please login first");
      handleAuth("login");
    }
  };
  return (
    <>
      <SEO
        description={storeDetail?.translation.description}
        image={imgBaseUrl + storeDetail?.logo_img}
        keywords={storeDetail?.translation.description}
        title={storeDetail?.translation.title}
      />
      <SiderHorizontal
        goBack={true}
        address={true}
        searchFilter={true}
        timeRange={true}
        balance={true}
      />
      <Banner
        setVisible={openDrawer}
        data={storeDetail}
        handleTogether={handleTogether}
      />
      <BannerCard shop_id={storeDetail?.id} />
      <div className="together-wrapper">
        <div className="together-order" onClick={handleTogether}>
          <GroupLineIcon className="icon" size={20} />
          <div className="label">{tl("Together order")}</div>
        </div>
        <Category shop_id={storeDetail?.id} />
      </div>
      <div className="products_row">
        {categoryBlog &&
          categoryBlog?.map((data, key) => (
            <ProductSection
              key={key}
              title={data.translation.title}
              to={`/stores/${storeDetail.id}/all-product-by-category/${data.uuid}`}
            >
              {data.shop_product?.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </ProductSection>
          ))}
      </div>
      {loader && (
        <>
          <ProductSection>
            <ProductLoader />
          </ProductSection>
          <ProductSection>
            <ProductLoader />
          </ProductSection>
        </>
      )}
      {categoryBlog?.length <= 0 && (
        <ProductSection>
          <RiveResult text="No products found in this shop" />
        </ProductSection>
      )}
      <Brand storeDetail={storeDetail} />
      <Drawer title="Store info" visible={visible} setVisible={setVisible}>
        {openContent === "store-info" && <StoreInfo />}
        {openContent === "store-delivery" && <DeliveryTime />}
        {openContent === "rating" && <StoreRate />}
      </Drawer>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const currency_id = cookies?.currency_id;
  const params = { perPage: 0, page: 1, lang: language_locale, currency_id };
  try {
    const res = await axiosService.get(`/rest/shops/byId/${query.id}`, {
      params,
    });
    const storeDetail = res.data.data;
    return {
      props: {
        storeDetail,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        storeDetail: {},
        error: error,
      },
    };
  }
}

export default SingleStore;
