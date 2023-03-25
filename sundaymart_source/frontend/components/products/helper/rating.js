import React from "react";
import { useTranslation } from "react-i18next";
import Rating from "react-rating";
import { Progress } from "reactstrap";
import { BoldStarCyan, BoldStarGold } from "../../../public/assets/images/svg";
const ViewRating = ({ product }) => {
  const { t: tl } = useTranslation();
  const getRating = (key) => {
    if (product?.rating_percent)
      return product?.rating_percent[key]?.toFixed(1);
  };
  return (
    <div className="rating">
      <div className="avg-rating">
        <div className="icon">
          <BoldStarGold />
        </div>
        <div className="value">
          {product?.rating_avg ? product?.rating_avg.toFixed(1) : "0.0"}
        </div>
        <div className="total-review">
          {`(${product?.reviews?.length} ${tl("reviews")})`}
        </div>
      </div>
      {[5, 4, 3, 2, 1].map((data) => {
        return (
          <div key={data} className="rating-item">
            <Rating
              initialRating={data}
              readonly
              emptySymbol={<BoldStarCyan />}
              fullSymbol={<BoldStarGold />}
            />
            <Progress value={getRating(data)} max={5} />
            <span className="item-percent">{`${
              getRating(data) ? getRating(data) : 0
            } %`}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ViewRating;
