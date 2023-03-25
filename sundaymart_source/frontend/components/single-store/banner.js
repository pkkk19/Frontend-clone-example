import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Store2FillIcon from "remixicon-react/Store2FillIcon";
import RestaurantFillIcon from "remixicon-react/RestaurantFillIcon";
import TimerFlashFillIcon from "remixicon-react/TimerFlashFillIcon";
import { useDispatch, useSelector } from "react-redux";
import { addToSaved, removeFromSaved } from "../../redux/slices/savedStore";
import { getImage } from "../../utils/getImage";
import BannerFooter from "./helper/banner-footer";
import useWindowSize from "../../hooks/useWindowSize";
import MobileBannerFooter from "./helper/mobile-banner-footer";
import { useTranslation } from "react-i18next";

function Banner({ setVisible, data = {}, handleTogether }) {
  const { t: tl } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const savedStores = useSelector((state) => state.savedStore.savedStoreList);
  const shop = useSelector((state) => state.stores.currentStore);
  const savedStore = savedStores.find((store) => store.id === data?.id);
  const windowSize = useWindowSize();
  const saved = () => {
    if (savedStore?.id === data?.id) {
      dispatch(removeFromSaved(data));
    } else {
      dispatch(addToSaved(data));
    }
  };

  return (
    <div className="banner-wrapper">
      <div className="single-store-banner">
        <div className="banner-img">{getImage(data.background_img)}</div>
        <div className="banner-icon">{getImage(data.logo_img)}</div>
        {windowSize?.width > 610 ? (
          <BannerFooter
            data={data}
            setVisible={setVisible}
            saved={saved}
            savedStore={savedStore}
            handleTogether={handleTogether}
          />
        ) : (
          <MobileBannerFooter
            data={data}
            setVisible={setVisible}
            saved={saved}
            savedStore={savedStore}
            handleTogether={handleTogether}
          />
        )}
        <div className="mobile-date-range">
          <TimerFlashFillIcon size={20} />
          {`By ${data.open_time} - ${data.close_time}`}
        </div>
      </div>
      <div className="banner-category">
        <div
          onClick={() => window.history.back()}
          className={router?.route === "/stores/[id]" ? "item active" : "item"}
        >
          <Store2FillIcon size={32} className="icon" />
          <div className="label">{tl("Shop")}</div>
        </div>
        <Link href={`/stores/${shop.id}/recipe`}>
          <a
            className={
              router?.asPath === `/stores/${shop.id}/recipe`
                ? "item active"
                : "item"
            }
          >
            <RestaurantFillIcon className="icon" size={32} />
            <div className="label">{tl("Recipes")}</div>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default Banner;
