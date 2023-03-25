import { Button, Modal, ModalHeader } from "reactstrap";
import React, { useState } from "react";
import InputText from "../form/form-item/InputText";
import DeleteBin5LineIcon from "remixicon-react/DeleteBin5LineIcon";
import { fileSelectedHandler } from "../../utils/uploadFile";
import AddLineIcon from "remixicon-react/AddLineIcon";
const RefundModal = ({ modal, setModal }) => {
  const [gallery, setGallery] = useState([]);
  const [comment, setComment] = useState("");
  const [uploadImages, setUploadImages] = useState([]);

  function onSubmit() {}
  const handleDelete = (key) => {
    gallery.splice(key, 1);
    uploadImages.splice(key, 1);
    setGallery([...gallery]);
    setUploadImages([...uploadImages]);
  };
  const handleClear = () => {
    setComment("");
    setGallery([]);
    setUploadImages([]);
  };
  const toggle = () => {
    setModal(!modal);
    handleClear();
  };
  return (
    <Modal isOpen={modal} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle}>Refund</ModalHeader>
      <div className="upload-form">
        <div className="upload-img">
          {gallery?.map((src, key) => (
            <div key={key} className="upload-item">
              <img src={src} alt="product" />
              <div className="remove" onClick={() => handleDelete(key)}>
                <DeleteBin5LineIcon size={26} color="#fff" />
              </div>
            </div>
          ))}
          <label>
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(event) =>
                fileSelectedHandler({
                  event,
                  gallery,
                  uploadImages,
                  setGallery,
                  setUploadImages,
                  type: "reviews",
                })
              }
              accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/svg"
            />
            <div className="upload-select">
              <AddLineIcon size={26} color="#ccc" />
            </div>
          </label>
        </div>

        <InputText label="Caption" />
        <div className="footer-btns">
          <Button onClick={toggle}>Cancel</Button>
          <Button onClick={onSubmit}>Send</Button>
        </div>
      </div>
    </Modal>
  );
};

export default RefundModal;
