import Footer from "../components/footer";
import AboutCompany from "../components/home/AboutCompany";
import Deliveries from "../components/home/Deliveries";
import GroceryDelivery from "../components/home/GroceryDelivery";
import SeeMapMobile from "../components/home/SeeMapMobile";
import Store from "../components/home/Store";
import SEO from "../components/seo";
import axiosService from "../services/axios";
import { useEffect } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSelector } from "react-redux";
import Banner from "../components/banner/store";
import nookies from "nookies";
const Home = ({ shopsList = [], error }) => {
  const bannerList = useSelector((state) => state.banners.data);
  const { setStores } = useContext(ShopContext);

  useEffect(() => {
    setStores(shopsList.data);
  }, []);

  return (
    <div className="home">
      <SEO />
      <Banner bannerList={bannerList} />
      <SeeMapMobile />
      <Store filter={true} totalCount={shopsList?.meta?.total} />
      <GroceryDelivery />
      <AboutCompany />
      <Deliveries />
      <Footer />
    </div>
  );
};
export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const language_locale = cookies?.language_locale;
  const currency_id = cookies?.currency_id;
  const params = { page: 1, perPage: 8, lang: language_locale, currency_id };
  try {
    const res = await axiosService.get("/rest/shops/paginate", {
      params,
    });
    const shopsList = await res.data;
    return {
      props: {
        shopsList,
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
export default Home;
