import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = (props) => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={70}
    viewBox="0 0 100% 70"
    backgroundColor="rgba(192, 194, 204, 0.18)"
    foregroundColor="#eceff3"
    {...props}
  >
    <rect x="10" y="0" rx="8" ry="8" width="91" height="50" />
    <rect x="117" y="0" rx="8" ry="8" width="101" height="50" />
    <rect x="235" y="0" rx="8" ry="8" width="116" height="50" />
    <rect x="367" y="0" rx="8" ry="8" width="100" height="50" />
  </ContentLoader>
);

export default MyLoader;
