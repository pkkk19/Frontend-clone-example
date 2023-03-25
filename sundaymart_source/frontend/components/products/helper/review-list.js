import React from "react";
import { useTranslation } from "react-i18next";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import { getImage } from "../../../utils/getImage";
import RiveResult from "../../loader/rive-result";
const ReviewList = ({ product }) => {
  const { t: tl } = useTranslation();
  return (
    <div className="reviews">
      <div className="title">{tl("Reviews")}</div>
      {product?.reviews?.length > 0 ? (
        product?.reviews
          ?.sort((a, b) => b.id - a.id)
          ?.map((item, key) => (
            <div key={key}>
              <div className="user-review">
                <div className="user">
                  <div className="name">{`${item.user.firstname} ${item.user.lastname}`}</div>
                  <div className="date">{item.created_at}</div>
                </div>
                <div className="avg-rating">
                  <div className="icon">
                    <StarSmileFillIcon size={18} />
                  </div>
                  <div className="value">{item?.rating?.toFixed(1)}</div>
                </div>
              </div>
              <div className="comment">{item.comment}</div>
              <div className="product-img">
                {item.galleries?.map((img, key) => (
                  <div key={key}>{getImage(img.path)}</div>
                ))}
              </div>
            </div>
          ))
      ) : (
        <RiveResult text="Comment not found" />
      )}
    </div>
  );
};

export default ReviewList;
