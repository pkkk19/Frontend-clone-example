import React from "react";
import Rating from "react-rating";
import { Progress } from "reactstrap";
import GoogleMap from "../../components/map";
import { images } from "../../../constants/images";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import RoadsterFillIcon from "remixicon-react/RoadsterFillIcon";
import { StarDarkCyan, StarLargeGold } from "../../../public/assets/images/svg";
import InputText from "../../components/form/form-item/InputText";

const ViewMap = () => {
  return (
    <div className="view-in-map">
      <GoogleMap width={"100%"} height={840} />
      <div className="arrive-time">
        <div className="times">
          <div className="time">
            <span>4 km</span>
            <span>16:10 min</span>
            <span>2 min</span>
          </div>
          <Progress value={50} />
        </div>
        <div className="type-car">
          <RoadsterFillIcon size={28} />
        </div>
      </div>
      <div className="delivery-boy-card">
        <div className="delivery-boy">
          <div className="avatar">
            <img src={images.Avatar} />
            <div className="rate">
              <div className="icon">
                <StarSmileFillIcon size={20} />
              </div>
              <div className="value">4.5</div>
            </div>
          </div>
          <div className="name">Michael Schumacher</div>
        </div>
        <div className="add-rate">
          <div className="title">Please rate the delivery boy</div>
          <Rating
            className="rating-star"
            initialRating={0}
            emptySymbol={<StarDarkCyan />}
            fullSymbol={<StarLargeGold />}
            onClick={(value) => console.log(value)}
          />
        </div>
        <div className="add-comment">
          <InputText label="Comment" placeholder="Enter your comment" />
          <div className="btn btn-submit">Done</div>
        </div>
      </div>
      <div className="backdrop"></div>
    </div>
  );
};

export default ViewMap;
