import HomeLayout from "../layouts/home-layout";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.scss";
import "nprogress/nprogress.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/bundle";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import "rc-slider/assets/index.css";
import "rc-pagination/assets/index.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "../services/i18next";
import StoreLayout from "../layouts/store-layout";
import { useEffect, useState } from "react";
import MainProvider from "../components/provider";
import { parseCookies } from "nookies";
import i18n from "../services/i18next";
import informationService from "../services/informationService";

const homeRoutes = [
  "all-store",
  "view-in-map",
  "/faq",
  "/term-of-use",
  "/privacy-policy",
  "/contact",
];
function MyApp({ Component, pageProps }) {
  const cookie = parseCookies();
  const router = useRouter();
  const [loader, setLoader] = useState(null);
  const isHomeLayout = homeRoutes.find(
    (item) => router.pathname.includes(item) || router.pathname === "/"
  );
  function fetchTranslations() {
    const lang = cookie.language_locale || "en";
    const params = {
      lang,
    };
    informationService.translations(params).then(({ data }) => {
      i18n.addResourceBundle(lang, "translation", data.data);
      i18n.changeLanguage(lang);
    });
  }

  useEffect(() => {
    fetchTranslations();
  }, []);

  return (
    <MainProvider loader={loader} setLoader={setLoader}>
      {isHomeLayout ? (
        <HomeLayout>
          <Component setLoader={setLoader} {...pageProps} />
        </HomeLayout>
      ) : (
        <StoreLayout>
          <Component setLoader={setLoader} {...pageProps} />
        </StoreLayout>
      )}
    </MainProvider>
  );
}

export default MyApp;
