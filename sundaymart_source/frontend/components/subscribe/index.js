import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { images } from "../../constants/images";
import { getStaticImage } from "../../utils/getImage";
import { setCookies } from "../../utils/setCookies";
import InputEmail from "../form/form-item/InputEmail";
const Subscribe = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onClose = () => {
    setIsModalOpen(false);
    setCookies({ name: "subscribtion", value: "close" });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      showModal();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Modal
      className="subscribe"
      toggle={onClose}
      isOpen={isModalOpen}
      centered={true}
    >
      <ModalBody>
        <div className="subscribe-form">
          <div className="form-image">{getStaticImage(images.Subscribe)} </div>
          <div className="form-title">Subscribtion</div>
          <div className="form-description">
            Browse to find the images that fit your needs and click to download.
          </div>
          <form>
            <InputEmail label="Email" placeholder="example@gmail.com" />
            <Button>Submit</Button>
            <span onClick={onClose}>Not now</span>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Subscribe;
