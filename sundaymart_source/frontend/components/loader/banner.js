import React from "react";
import ContentLoader from "react-content-loader";

const BannerLoader = (props) => (
  <ContentLoader
    speed={1}
    width={"100%"}
    height={300}
    viewBox="0 0 100% 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    className="address-loader"
    {...props}
  >
    <rect x="0" y="0" rx="7" ry="7" width="100%" height="300" />
  </ContentLoader>
);

export default BannerLoader;
