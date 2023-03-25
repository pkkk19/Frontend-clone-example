import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { SwiperSlide, Swiper } from "swiper/react";
import { BrandApi } from "../../api/main/brand";
import BrandCard from "../brands";
import HistoriesLoader from "../loader/histories-loader";
import RiveResult from "../loader/rive-result";

const Brand = ({ storeDetail }) => {
  const { t: tl } = useTranslation();
  const [brandList, setBrandList] = useState(null);

  const getBrand = (perPage = 6, page = 1) => {
    BrandApi.get({ perPage, page, shop_id: storeDetail?.id })
      .then((response) => {
        setBrandList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getBrand();
  }, []);

  return (
    <div className="product-section">
      {brandList ? (
        <>
          <div className="section-header">
            <div className="title">{tl("Brands")}</div>
            <Link href={`/stores/${storeDetail?.id}/all-brand`}>
              <a className="see-all">
                {tl("See all")}
                <ArrowRightSLineIcon size={20} />
              </a>
            </Link>
          </div>
          <Swiper
            spaceBetween={60}
            breakpoints={{
              280: {
                width: 280,
                slidesPerView: 3.5,
              },
              768: {
                width: 768,
                slidesPerView: 5.5,
              },
              1110: {
                width: 1110,
                slidesPerView: 8.5,
              },
            }}
          >
            {brandList?.map((data, key) => (
              <SwiperSlide key={key}>
                <BrandCard data={data} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <HistoriesLoader />
      )}

      {brandList?.length <= 0 && <RiveResult />}
    </div>
  );
};

export default Brand;
