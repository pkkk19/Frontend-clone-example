import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import BannerLoader from "../loader/banner";
import { getImage } from "../../utils/getImage";
function Banner({ bannerList }) {
  return (
    <div className="all_store">
      <div className="banner">
        <Swiper
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={30}
          initialSlide={1}
          navigation={true}
          modules={[Navigation]}
          preloadImages={false}
        >
          {bannerList?.length > 0 ? (
            bannerList?.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="shadow-left"></div>
                {getImage(banner.img)}
                <div className="shadow-right"></div>
              </SwiperSlide>
            ))
          ) : (
            <div className="container">
              <BannerLoader />
            </div>
          )}
        </Swiper>
      </div>
    </div>
  );
}

export default Banner;
