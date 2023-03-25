import { useState, createContext, useEffect } from "react";
import { parseCookies } from "nookies";
import { UserApi } from "../api/main/user";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { savedUser } from "../redux/slices/user";
import { getSettings } from "../redux/slices/settings";
import { useRouter } from "next/router";
import { ShopApi } from "../api/main/shops";
import { addCurrentStore } from "../redux/slices/stores";
import { ProductApi } from "../api/main/product";
import { updateViwed } from "../redux/slices/viewed-product";
import { updateSaved } from "../redux/slices/savedProduct";
import { getBanners } from "../redux/slices/banner";
import {
  setAuthContent,
  setDrawerContent,
  setVisibleAuth,
} from "../redux/slices/mainState";
import { getCurrency, getLanguage } from "../api/main/default-settings";
export const MainContext = createContext();

const MainContextProvider = ({ children, setOpenChat }) => {
  const router = useRouter();
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const productViewedIds = useSelector(
    (state) => state.viewedProduct.viewedProductList
  ).map((data) => data.id);
  const productSavedIds = useSelector(
    (state) => state.savedProduct.savedProductList
  ).map((data) => data.id);
  const banners = useSelector((state) => state.banners.data, shallowEqual);
  const [theme, setTheme] = useState(cookies.theme ? cookies.theme : "light");
  const [visible, setVisible] = useState(false);
  const [currency, setCurrencyList] = useState([]);
  const [language, setLanguageList] = useState([]);
  const handleVisible = (name) => {
    dispatch(setDrawerContent(name));
    setVisible(true);
  };
  const handleAuth = (name) => {
    batch(() => {
      dispatch(setAuthContent(name));
      dispatch(setVisibleAuth(true));
    });
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
          console.log(res.data);
          dispatch(updateViwed(res.data));
          sessionStorage.setItem("checked_viewed", "true");
        })
        .catch((error) => {
          console.log(error);
        });
  };

  useEffect(() => {
    const checked = sessionStorage.getItem("checked");
    if (router?.query.id) setShop();
    if (!checked && productSavedIds.length) checkProduct();
    getCurrency(setCurrencyList);
    getLanguage(setLanguageList);
    batch(() => {
      if (!banners.length) dispatch(getBanners());
      dispatch(getSettings());
    });
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
        handleVisible,
        handleAuth,
        getUser,
        checkProduct,
        checkViewedProduct,
        productViewedIds,
        currency,
        language,
        setOpenChat,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
