import React from "react";
import Link from "next/link";
import { StarOutline } from "../../public/assets/images/svg";
import Bookmark3LineIcon from "remixicon-react/Bookmark3LineIcon";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentStore } from "../../redux/slices/stores";
import { getImage } from "../../utils/getImage";

function StoreCard({ data }) {
  const dispatch = useDispatch();
  const likedStore = useSelector((state) => state.savedStore.savedStoreList);
  const cartData = likedStore.find((item) => item.id === data.id);

  return (
    <Link href={`/stores/${data.id}`}>
      <div
        className="store_item"
        onClick={() => dispatch(addCurrentStore(data))}
      >
        <div className="mobile_card_header">
          <div className="logo">{getImage(data.logo_img, "shop logo")}</div>
          <div>
            <div className="title">{data.translation?.title}</div>
            <div className="score">
              <StarOutline />
              {data.rating_avg ? parseInt(data.rating_avg)?.toFixed(1) : "0.0"}
            </div>
          </div>
        </div>
        <div className="logo">{getImage(data.logo_img, "shop logo")}</div>
        {cartData && (
          <div className="liked">
            <Bookmark3LineIcon color="#16AA16" />
          </div>
        )}
        <div className="title">{data.translation?.title}</div>
        <div className="short_description">{data.translation?.description}</div>
        <div className="footer">
          <div className="time">{`${data.open_time} - ${data.close_time}`}</div>
          <div className="score">
            <StarOutline />
            {data.rating_avg ? parseInt(data.rating_avg)?.toFixed(1) : "0.0"}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StoreCard;
