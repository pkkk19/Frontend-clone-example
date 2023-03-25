import React from "react";
import ContentLoader from "react-content-loader";

const OrderedProductLoader = (props) => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={120}
    viewBox="0 0 100% 120"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="14" ry="14" width="102" height="102" />
    <rect x="120" y="6" rx="7" ry="7" width="240" height="14" />
    <rect x="120" y="30" rx="9" ry="9" width="158" height="13" />
    <circle cx="270" cy="84" r="20" />
    <circle cx="330" cy="83" r="20" />
    <rect x="120" y="75" rx="8" ry="8" width="76" height="23" />
  </ContentLoader>
);

export default OrderedProductLoader;
