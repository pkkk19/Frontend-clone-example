import React from "react";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import RestaurantFillIcon from "remixicon-react/RestaurantFillIcon";
import Link from "next/link";
import { getImage } from "../../utils/getImage";
const RecipeCard = ({ shop, recipe }) => {
  return (
    <Link href={`/stores/${shop.id}/recipe/${recipe.id}`}>
      <a className="recipe-card">
        <div className="card-img">{getImage(recipe?.image)}</div>
        <div className="card-body">
          <div className="description">{recipe?.translation?.title}</div>
          <div className="time-kallory">
            <div className="item">
              <div className="icon">
                <TimeFillIcon size={20} />
              </div>
              <div className="label">{`${recipe?.total_time} min`}</div>
            </div>
            <span></span>
            <div className="item">
              <div className="icon">
                <RestaurantFillIcon size={20} />
              </div>
              <div className="label">{`${recipe?.calories} kkl`}</div>
            </div>
          </div>
          <div className="recipe-name">
            <div className="logo">
              {recipe?.user?.img
                ? getImage(recipe?.user?.img)
                : recipe?.user?.firstname?.slice(0, 1)}
            </div>
            <div className="label">{`${recipe?.user?.firstname} ${recipe?.user?.lastname}`}</div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default RecipeCard;
