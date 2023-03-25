import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";

function StoreCategory({ categoryList, handleCategory }) {
  const { t: tl } = useTranslation();
  const [curretCategory, setCurrentCategory] = useState("all");
  const onClick = (item) => {
    if (item?.id) setCurrentCategory(item);
    else setCurrentCategory("all");
    handleCategory({ group_id: item.id, page: 1 });
  };
  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={10}
      className="swiper-category"
    >
      {categoryList?.map((item, key) => (
        <>
          {key === 0 && (
            <SwiperSlide key={item.uuid}>
              <div
                className={`item ${curretCategory === "all" && "active"}`}
                onClick={onClick}
              >
                {tl("All")}
              </div>
            </SwiperSlide>
          )}
          <SwiperSlide key={item.uuid}>
            <div
              className={`item ${curretCategory?.id === item.id && "active"}`}
              onClick={() => onClick(item)}
            >
              {item.translation.title}
            </div>
          </SwiperSlide>
        </>
      ))}
    </Swiper>
  );
}

export default StoreCategory;
