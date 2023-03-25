import { toast } from "react-toastify";
import { UploadApi } from "../api/main/upload";

export const fileSelectedHandler = ({
  event,
  type = "",
  file = [],
  gallery = [],
  uploadImages = [],
  setFile = () => {},
  setGallery = () => {},
  setUploadImages = () => {},
  setAvatar = () => {},
}) => {
  if (
    event.target.files[0].type === "image/jpeg" ||
    event.target.files[0].type === "image/png" ||
    event.target.files[0].type === "image/svg"
  ) {
    setFile([...file, event.target.files[0]]);
    const images = new FormData();
    images.append("image", event.target.files[0]);
    images.append("type", type);
    UploadApi.create(images)
      .then((res) => {
        setUploadImages([...uploadImages, res.data.title]);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error");
      });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setGallery([...gallery, reader.result]);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  } else {
    toast.error(tl("You need to select jpeg, png or svg file"));
  }
};
