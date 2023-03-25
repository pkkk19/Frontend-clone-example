import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { getImage } from "../../utils/getImage";

const Banner = ({ bannerList = [] }) => {
  return (
    <div className="container">
      {
        <Swiper
          pagination={true}
          modules={[Pagination]}
          preloadImages={false}
          className="banner"
        >
          {bannerList?.map((banner, key) => (
            <SwiperSlide key={key}>
              <div className="banner">{getImage(banner.img)}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      }
    </div>
  );
};

export default Banner;
