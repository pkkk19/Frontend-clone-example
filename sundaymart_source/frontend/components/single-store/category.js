import React from "react";
import Link from "next/link";
import { shallowEqual, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import TaskList from "../loader/category-loader";

function Category({ shop_id }) {
  const categoryList = useSelector(
    (state) => state.category.categoryList,
    shallowEqual
  );

  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={10}
      className="swiper-category"
    >
      {categoryList.map((item) => (
        <SwiperSlide key={item.uuid}>
          <Link
            href={`/stores/${shop_id}/all-product-by-category/${item.uuid}`}
          >
            <div className="item">{item.translation.title}</div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Category;
