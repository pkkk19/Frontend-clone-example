import React from "react";
import ContentLoader from "react-content-loader";

const DiscordLoader = (props) => {
  return (
    <ContentLoader height={300} width={"100%"} {...props}>
      <circle cx="25" cy="50" r="25" />
      <circle cx="25" cy="150" r="25" />
      <circle cx="25" cy="250" r="25" />
      <circle cx="25" cy="330" r="25" />

      <rect x="60" y="30" rx="5" ry="5" width="220" height="15" />
      <rect x="60" y="50" rx="5" ry="5" width="70" height="15" />
      <rect x="140" y="50" rx="5" ry="5" width="90" height="15" />
      <rect x="240" y="50" rx="5" ry="5" width="70" height="15" />
      <rect x="60" y="70" rx="5" ry="5" width="60" height="15" />
      <rect x="130" y="70" rx="5" ry="5" width="80" height="15" />
      <rect x="220" y="70" rx="5" ry="5" width="90" height="15" />

      <rect x="60" y="130" rx="5" ry="5" width="220" height="15" />
      <rect x="60" y="150" rx="5" ry="5" width="70" height="15" />
      <rect x="140" y="150" rx="5" ry="5" width="90" height="15" />
      <rect x="240" y="150" rx="5" ry="5" width="70" height="15" />
      <rect x="60" y="170" rx="5" ry="5" width="60" height="15" />
      <rect x="130" y="170" rx="5" ry="5" width="80" height="15" />
      <rect x="220" y="170" rx="5" ry="5" width="90" height="15" />

      <rect x="60" y="230" rx="5" ry="5" width="220" height="15" />
      <rect x="60" y="250" rx="5" ry="5" width="70" height="15" />
      <rect x="140" y="250" rx="5" ry="5" width="90" height="15" />
      <rect x="240" y="250" rx="5" ry="5" width="70" height="15" />
      <rect x="60" y="270" rx="5" ry="5" width="60" height="15" />
      <rect x="130" y="270" rx="5" ry="5" width="80" height="15" />
      <rect x="220" y="270" rx="5" ry="5" width="90" height="15" />

      <rect x="60" y="310" rx="5" ry="5" width="220" height="15" />
      <rect x="60" y="330" rx="5" ry="5" width="70" height="15" />
      <rect x="140" y="330" rx="5" ry="5" width="90" height="15" />
      <rect x="240" y="330" rx="5" ry="5" width="70" height="15" />
      <rect x="60" y="350" rx="5" ry="5" width="60" height="15" />
      <rect x="130" y="350" rx="5" ry="5" width="80" height="15" />
      <rect x="220" y="350" rx="5" ry="5" width="90" height="15" />
    </ContentLoader>
  );
};

DiscordLoader.metadata = {
  name: "Eric Roth",
  github: "Maxgit3",
  description: "Discord sample",
  filename: "DiscordLoader",
};

export default DiscordLoader;
