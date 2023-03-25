import { Button, Form, Modal } from "reactstrap";
import React from "react";
import { ModalBody } from "reactstrap";
import InputText from "../form/form-item/InputText";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useDispatch } from "react-redux";
import { setNewMessage } from "../../redux/slices/chat";
import { storage } from "../../services/firebase";
import { toast } from "react-toastify";

const UploadMedia = ({
  modal,
  url,
  setModal,
  setPercent = () => {},
  file,
  handleOnSubmit,
}) => {
  const dispatch = useDispatch();
  const toggle = () => setModal(!modal);
  const handleUpload = () => {
    if (!file) {
      toast.error("Please upload an image first!");
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
        if (percent === 100) {
        }
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          handleOnSubmit(url);
        });
      }
    );
  };
  const handleChange = (text) => {
    dispatch(setNewMessage(text));
  };
  return (
    <Modal isOpen={modal} toggle={toggle} centered={true}>
      <ModalBody>
        <div className="upload-form">
          <img src={url} />
          <Form>
            <InputText
              label="Caption"
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            />
          </Form>
          <div className="footer-btns">
            <Button onClick={toggle}>Cancel</Button>
            <Button onClick={handleUpload}>Send</Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UploadMedia;
