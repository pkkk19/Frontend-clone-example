import React from "react";
import ContentLoader from "react-content-loader";

const HistoriesLoader = (props) => (
  <ContentLoader
    width={"100%"}
    height={128}
    backgroundColor="#f4f4f6"
    foregroundColor="#eceff3"
    {...props}
  >
    <circle cx="64" cy="64" r="64" />
    <circle cx="202" cy="64" r="64" />
    <circle cx="340" cy="64" r="64" />
    <circle cx="480" cy="64" r="64" />
    <circle cx="620" cy="64" r="64" />
  </ContentLoader>
);

export default HistoriesLoader;
