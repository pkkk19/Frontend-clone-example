import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { persistor, store } from "../../redux/store";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "../../components/loader";
import { AuthProvider } from "../../context/AuthContext";
import Auth from "../../components/auth";
import ShopContextProvider from "../../context/ShopContext";
import nProgress from "nprogress";
import { Router } from "next/router";
import MainContextProvider from "../../context/MainContext";
import useWindowSize from "../../hooks/useWindowSize";
import RippleButton from "../../components/chat/ripple-btn";
import { I18nextProvider } from "react-i18next";
import i18n from "../../services/i18next";
import OrderContextProvider from "../../context/OrderContext";
import PushNotification from "../push-notification";
import { parseCookies } from "nookies";
import DefaultAddress from "../address-modal/default-address";
const Drawer = dynamic(() => import("../../components/drawer"));
const Chat = dynamic(() => import("../../components/chat/chat"));
const Subscribe = dynamic(() => import("../../components/subscribe"));

const MainProvider = ({ loader, children, setLoader }) => {
  const cookie = parseCookies();
  Router.events.on("routeChangeStart", () => nProgress.start());
  Router.events.on("routeChangeComplete", () => nProgress.done());
  Router.events.on("routeChangeError", () => nProgress.done());
  const [openChat, setOpenChat] = useState(false);
  const windowSize = useWindowSize();
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        {cookie.access_token && <PushNotification />}
        {loader && <Loader />}
        {typeof window !== "undefined" ? (
          <PersistGate loading={null} persistor={persistor}>
            <MainContextProvider setOpenChat={setOpenChat}>
              <AuthProvider>
                <ShopContextProvider setLoader={setLoader}>
                  <OrderContextProvider>{children}</OrderContextProvider>
                </ShopContextProvider>
                <Auth />
                {/* {cookie?.subscribtion !== "close" && !cookie.cart_id && (
                  <Subscribe />
                )} */}
                <ToastContainer newestOnTop />
                <RippleButton onClick={setOpenChat} />
              </AuthProvider>
            </MainContextProvider>
            <Drawer
              title="Help center"
              className="chat-drawer"
              visible={openChat}
              setVisible={setOpenChat}
            >
              {openChat && <Chat windowSize={windowSize} />}
            </Drawer>
          </PersistGate>
        ) : (
          <MainContextProvider>
            <AuthProvider>
              <ShopContextProvider setLoader={setLoader}>
                <OrderContextProvider>{children}</OrderContextProvider>
              </ShopContextProvider>
              <Auth />
              <ToastContainer newestOnTop />
            </AuthProvider>
          </MainContextProvider>
        )}
      </Provider>
    </I18nextProvider>
  );
};

export default MainProvider;
