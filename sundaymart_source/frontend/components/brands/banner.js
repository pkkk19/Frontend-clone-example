import React from "react";
import { imgBaseUrl } from "../../constants";
import { images } from "../../constants/images";

const BrandBanner = ({ brand }) => {
  return (
    <div className="brand-banner">
      <div className="logo">
        <img src={imgBaseUrl + brand?.data?.brand.img} alt="logo" />
      </div>
      <div className="banner-img">
        <img src={images.Banner} alt="logo" />
      </div>
    </div>
  );
};

export default BrandBanner;
