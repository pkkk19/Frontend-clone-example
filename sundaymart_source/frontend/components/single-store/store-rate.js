import React from "react";
import { icons } from "../../constants/icons";
import StarFillIcon from "remixicon-react/StarFillIcon";
import Rating from "react-rating";
import { StarDarkCyan, StarLargeGold } from "../../public/assets/images/svg";
import { useTranslation } from "react-i18next";
const StoreRate = () => {
  const { t: tl } = useTranslation();
  return (
    <div className="store-rate">
      <div className="content">
        <div className="store">
          <div className="logo">
            <img src={icons.Apelsin} />
          </div>
          <div className="store-name">
            <div className="name">{tl("Wallmart store")}</div>
            <div className="rate">
              <div className="icon">
                <StarFillIcon size={24} />
              </div>
              <div className="value">4.5</div>
            </div>
          </div>
        </div>
        <div className="add-rate">
          <div className="add-rating">
            <Rating
              className="rating-star"
              initialRating={0}
              emptySymbol={<StarDarkCyan />}
              fullSymbol={<StarLargeGold />}
              onClick={(value) => console.log(value)}
            />
          </div>
          <div className="review-text">
            <div className="title">{tl("Write a review")}</div>
            <textarea placeholder="Type here..." />
          </div>
          <div className="submit-btn">{tl("Submit")}</div>
        </div>
      </div>
    </div>
  );
};

export default StoreRate;
