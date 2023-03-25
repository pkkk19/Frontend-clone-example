import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { getImage } from "../../utils/getImage";

function BrandCard({ data }) {
  const shop = useSelector((state) => state.stores.currentStore);
  return (
    <>
      <Link href={`/stores/${shop?.id}/all-brand/${data.id}`}>
        <div className="brand-card">{getImage(data.brand?.img)}</div>
      </Link>
    </>
  );
}

export default BrandCard;
