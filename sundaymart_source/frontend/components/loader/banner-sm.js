import React from "react";
import ContentLoader from "react-content-loader";

const SmBannerLoader = (props) => (
  <ContentLoader
    speed={1}
    width={250}
    height={150}
    viewBox="0 0 250 150"
    backgroundColor="#fff"
    foregroundColor="#f0f0f0"
    className="address-loader"
    {...props}
  >
    <rect x="0" y="0" rx="7" ry="7" width="250" height="150" />
  </ContentLoader>
);

export default SmBannerLoader;
