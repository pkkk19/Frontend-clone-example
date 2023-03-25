import React from "react";
import Link from "next/link";
import { LargeArrowRight } from "../../public/assets/images/svg";
import { images } from "../../constants/images";

function SeeMapMobile() {
  return (
    <div className="container">
      <div className="see_map_mobile">
        <img className="map-img" src={images.SeeMap} alt="See map" />
        <div className="icon large">
          <img src={images.Location} alt="See map" />
        </div>
        <div className="icon middle">
          <img src={images.Location} alt="See map" />
        </div>
        <div className="icon small">
          <img src={images.Location} alt="See map" />
        </div>
        <Link href="view-in-map">
          <a className="view_map">
            <div className="name">See the store on the map</div>
            <LargeArrowRight />
          </a>
        </Link>
      </div>
    </div>
  );
}

export default SeeMapMobile;
