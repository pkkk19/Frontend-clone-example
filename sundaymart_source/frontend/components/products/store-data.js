import React from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual, useSelector } from "react-redux";
import Message2FillIcon from "remixicon-react/Message2FillIcon";
import StarSmileFillIcon from "remixicon-react/StarSmileFillIcon";
import { imgBaseUrl } from "../../constants";
import { getImage } from "../../utils/getImage";
import RiveResult from "../loader/rive-result";

const ProductStoreData = ({ data, setVisible }) => {
  const { t: tl } = useTranslation();
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);

  return (
    <div className="store-data">
      <div className="about-store">
        <div className="logo">
          <img src={imgBaseUrl + shop?.logo_img} alt="alt" />
        </div>
        <div className="title-box">
          <div className="product-store">{tl("Product store")}</div>
          <div className="store-title">{shop?.translation?.title}</div>
        </div>
      </div>
      {data?.product?.translation?.description && (
        <div className="description">
          <div className="title">{tl("Description")}</div>
          <p>{data?.product?.translation?.description}</p>
        </div>
      )}
      {data?.product.properties?.length > 0 && (
        <div className="description">
          <div className="title">{tl("Additional information")}</div>
          {data.product.properties?.map((item, key) => (
            <div
              key={key}
              className={
                item?.value?.length > 28
                  ? "description-item column"
                  : "description-item"
              }
            >
              <div className="label">{item.key}</div>
              <div className="value">{item.value}</div>
            </div>
          ))}
        </div>
      )}
      <div className="reviews">
        <div className="review-head">
          <div className="title">{tl("Reviews")}</div>
          <div className="comment-btn" onClick={() => setVisible(true)}>
            <div className="icon">
              <Message2FillIcon size={16} />
            </div>
            <div className="label">{tl("Add comment")}</div>
          </div>
        </div>
        {data?.reviews?.length > 0 ? (
          data?.reviews
            ?.sort((a, b) => b.id - a.id)
            ?.map((item, key) => (
              <div key={key} className="review-item">
                <div className="item-head">
                  <div className="user">
                    <div className="name">{`${item.user.firstname} ${item.user.lastname}`}</div>
                    <div className="date">{item.created_at}</div>
                  </div>
                  <div className="score">
                    <div className="icon">
                      <StarSmileFillIcon size={16} />
                    </div>
                    <div className="label">{item?.rating?.toFixed(1)}</div>
                  </div>
                </div>
                <div className="example-images">
                  {item.galleries?.map((img, key) => (
                    <div key={key}>{getImage(img.path)}</div>
                  ))}
                </div>
                <div className="review-text">{item.comment}</div>
              </div>
            ))
        ) : (
          <RiveResult text="Comment not found" />
        )}
      </div>
    </div>
  );
};

export default ProductStoreData;
