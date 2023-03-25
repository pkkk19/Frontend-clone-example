import React from "react";
import Image from "next/image";
import { imgBaseUrl } from "../constants";

export const getImage = (src, alt = "product img") => {
  const myLoader = ({ src, width, quality }) => {
    return `${imgBaseUrl}${src}?w=${width}&q=${quality || 90}`;
  };
  if (src)
    return (
      <Image
        loader={myLoader}
        src={src}
        alt={alt}
        layout="fill"
        loading="lazy"
      />
    );
};

export const getStaticImage = (src, alt = "product img") => {
  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 90}`;
  };
  if (src)
    return (
      <Image
        loader={myLoader}
        src={src}
        alt={alt}
        layout="fill"
        loading="lazy"
      />
    );
};
