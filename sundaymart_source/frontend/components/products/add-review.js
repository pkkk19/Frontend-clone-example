import React, { useState } from "react";
import Rating from "react-rating";
import { BoldStarCyan, BoldStarGold } from "../../public/assets/images/svg";
import ImageAddLineIcon from "remixicon-react/ImageAddLineIcon";
import SendPlane2FillIcon from "remixicon-react/SendPlane2FillIcon";
import DeleteBin5LineIcon from "remixicon-react/DeleteBin5LineIcon";
import { useTranslation } from "react-i18next";
import { CommentApi } from "../../api/main/comment";
import { toast } from "react-toastify";
import { getImage } from "../../utils/getImage";
import { getPrice } from "../../utils/getPrice";
import { fileSelectedHandler } from "../../utils/uploadFile";
import ViewRating from "./helper/rating";
import ReviewList from "./helper/review-list";

const AddReview = ({ product, getProduct, setVisible }) => {
  const { t: tl } = useTranslation();
  const [file, setFile] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [uploadImages, setUploadImages] = useState([]);
  const onSubmit = (e) => {
    e.preventDefault();
    if (rating || comment) {
      CommentApi.create(
        {
          rating,
          comment,
          images: uploadImages,
        },
        product?.uuid
      )
        .then(() => {
          toast.success("Success");
          handleClear();
          setVisible(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          getProduct(product?.uuid);
        });
    } else {
      toast.error(tl("Please write a review first"));
    }
  };
  const handleDelete = (key) => {
    gallery.splice(key, 1);
    uploadImages.splice(key, 1);
    file.splice(key, 1);
    setGallery([...gallery]);
    setUploadImages([...uploadImages]);
    setFile([...file]);
  };
  const handleClear = () => {
    setComment("");
    setRating(0);
    setGallery([]);
    setFile([]);
    setUploadImages([]);
  };

  return (
    <div className="add-review">
      <div className="product-data">
        <div className="img-box">
          {getImage(product?.product?.img)}
          {product?.discount && (
            <div className="discount">
              {`${((product?.discount / product?.price) * 100).toFixed(1)} %`}
            </div>
          )}
        </div>
        <div className="name">{product?.product.translation?.title}</div>
        <div className="price">
          {product.discount ? (
            <>
              <div className="current">
                {getPrice(product.price - product.discount)}
              </div>
              <div className="old">{getPrice(product.price)}</div>
            </>
          ) : (
            <div className="current">{getPrice(product.price)}</div>
          )}
        </div>
      </div>
      <ViewRating product={product} />
      <ReviewList product={product} />
      <div className="add-comment">
        <Rating
          className="rating-star"
          initialRating={rating}
          emptySymbol={<BoldStarCyan />}
          fullSymbol={<BoldStarGold />}
          onClick={(value) => setRating(value)}
        />
        <div className="text-area">
          <input
            placeholder="Comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="event-btn">
            <label>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(event) =>
                  fileSelectedHandler({
                    event,
                    file,
                    gallery,
                    uploadImages,
                    setFile,
                    setGallery,
                    setUploadImages,
                    type: "reviews",
                  })
                }
                required
                multiple={true}
                disabled={file?.length > 3 ? true : false}
              />
              <div className="add-img">
                <ImageAddLineIcon />
              </div>
            </label>
            <span></span>
            <div className="send-plane" onClick={onSubmit}>
              <SendPlane2FillIcon />
            </div>
          </div>
        </div>
        <div className="upload-img">
          {gallery?.map((src, key) => (
            <div key={key} className="upload-item">
              <img src={src} alt="product" />
              <div className="remove" onClick={() => handleDelete(key)}>
                <DeleteBin5LineIcon size={32} color="#fff" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddReview;
