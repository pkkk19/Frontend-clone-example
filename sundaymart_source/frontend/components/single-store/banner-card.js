import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { BannerApi } from "../../api/main/banner";
import { imgBaseUrl } from "../../constants";
import SmBannerLoader from "../loader/banner-sm";

function BannerCard({ shop_id }) {
  const [banner, setBanner] = useState(null);
  const getBanner = () => {
    BannerApi.get({ shop_id }).then((res) => {
      setBanner(res.data);
    });
  };
  useEffect(() => {
    getBanner();
  }, []);
  return (
    <>
      {banner?.length > 0 && (
        <div className="banner-cards">
          <Swiper slidesPerView={"auto"} spaceBetween={12}>
            {banner?.map((item, key) => (
              <SwiperSlide key={key}>
                <Link href={`/banner/${item.id}`}>
                  <div className="card-item">
                    <div className="title">{item?.translation?.title}</div>
                    <div className="description">
                      {item?.translation?.description}
                    </div>
                    <div className="card-btn">
                      {item?.translation?.button_text}
                    </div>
                    <div className="card-img">
                      <img src={imgBaseUrl + item.img} alt="Orange" />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      {!banner && (
        <div className="banner-cards">
          <Swiper slidesPerView={"auto"} spaceBetween={12}>
            <SwiperSlide>
              <SmBannerLoader />
            </SwiperSlide>
            <SwiperSlide>
              <SmBannerLoader />
            </SwiperSlide>
            <SwiperSlide>
              <SmBannerLoader />
            </SwiperSlide>
            <SwiperSlide>
              <SmBannerLoader />
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </>
  );
}

export default BannerCard;
