import React from "react";
import Link from "next/link";
import { getImage } from "../../utils/getImage";
const IngredientCard = ({ shop, data }) => {
  return (
    <Link href={`/stores/${shop.id}/recipe/by-category/${data.id}`}>
      <a className="ingredient-card">
        <div className="img-box">{getImage(data.image)}</div>
        <div className="category">
          <div className="category_name">{data.translation.title}</div>
          <div className="amount">{`${data.recipes_count} recipes`}</div>
        </div>
      </a>
    </Link>
  );
};

export default IngredientCard;
