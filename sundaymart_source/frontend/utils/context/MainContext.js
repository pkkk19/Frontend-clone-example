import { useState, createContext, useEffect } from "react";
import { parseCookies } from "nookies";
import { UserApi } from "../../api/main/user";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { savedUser } from "../../redux/slices/user";
import { getSettings } from "../../redux/slices/settings";
import { getCurrency, getLanguage } from "../../api/main/default-settings";
import { useRouter } from "next/router";
import { ShopApi } from "../../api/main/shops";
import { addCurrentStore } from "../../redux/slices/stores";
import { ProductApi } from "../../api/main/product";
import { updateViwed } from "../../redux/slices/viewed-product";
import { updateSaved } from "../../redux/slices/savedProduct";
import { getBanners } from "../../redux/slices/banner";
export const MainContext = createContext();

const MainContextProvider = ({ children }) => {
  const router = useRouter();
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const productViewedIds = useSelector(
    (state) => state.viewedProduct.viewedProductList,
    shallowEqual
  ).map((data) => data.id);
  const productSavedIds = useSelector(
    (state) => state.savedProduct.savedProductList,
    shallowEqual
  ).map((data) => data.id);
  const shopIds = useSelector(
    (state) => state.savedStore.savedStoreList,
    shallowEqual
  ).map((data) => data.id);
  const banners = useSelector((state) => state.banners.data, shallowEqual);
  const [theme, setTheme] = useState(cookies.theme ? cookies.theme : "light");
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [mapContent, setMapContent] = useState("");
  const [visibleAuth, setVisibleAuth] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [authContent, setAuthContent] = useState(null);
  const [currency, setCurrency] = useState([]);
  const [language, setLanguage] = useState([]);
  const [editAddress, setEditAddress] = useState(null);
  const [opengomodal, setOpengomodal] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenConfirmCheckout, setIsOpenConfirmCheckout] = useState(false);
  const [sort, setSort] = useState("asc");

  const handleVisible = (name) => {
    setDrawerContent(name);
    setVisible(true);
  };
  const handleAuth = (name) => {
    setAuthContent(name);
    setVisibleAuth(true);
  };
  const getUser = () => {
    UserApi.get()
      .then((res) => {
        dispatch(savedUser(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setShop = () => {
    ShopApi.getId(router?.query.id)
      .then((res) => {
        dispatch(addCurrentStore(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkProduct = () => {
    if (productSavedIds?.length)
      ProductApi.checkIds({ products: productSavedIds })
        .then((res) => {
          dispatch(updateSaved(res.data));
          sessionStorage.setItem("checked", "true");
        })
        .catch((error) => {
          console.log(error);
        });
  };
  const checkViewedProduct = () => {
    if (productViewedIds.length)
      ProductApi.checkIds({ products: productViewedIds })
        .then((res) => {
          dispatch(updateViwed(res.data));
          sessionStorage.setItem("checked_viewed", "true");
        })
        .catch((error) => {
          console.log(error);
        });
  };

  useEffect(() => {
    const checked = sessionStorage.getItem("checked");
    const chacked_store = sessionStorage.getItem("checked_store");
    const checked_viewed = sessionStorage.getItem("checked_viewed");
    if (router?.query.id) setShop();
    if (currency.length <= 0) getCurrency(setCurrency);
    if (language.length <= 0) getLanguage(setLanguage);
    if (!checked && productSavedIds.length) checkProduct();
    if (!checked_viewed && productViewedIds.length) checkViewedProduct();
    if (!banners.length) dispatch(getBanners());
    dispatch(getSettings());
  }, []);

  useEffect(() => {
    const body = document.getElementsByTagName("body");
    body[0].setAttribute("data-theme", theme);
    body[0].setAttribute("dir", cookies.dir);
  }, [theme]);

  return (
    <MainContext.Provider
      value={{
        theme,
        setTheme,
        visible,
        setVisible,
        drawerContent,
        handleVisible,
        authContent,
        handleAuth,
        toggleSearch,
        setToggleSearch,
        getUser,
        visibleAuth,
        setVisibleAuth,
        currency,
        language,
        checkProduct,
        checkViewedProduct,
        openModal,
        setOpenModal,
        mapContent,
        setMapContent,
        editAddress,
        setEditAddress,
        sort,
        setSort,
        opengomodal,
        setOpengomodal,
        isOpenConfirm,
        setIsOpenConfirm,
        isOpenConfirmCheckout,
        setIsOpenConfirmCheckout,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
