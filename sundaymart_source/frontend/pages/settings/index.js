import React, { useState } from "react";
import { Button, Col, Form, Label, Row, Spinner } from "reactstrap";
import InputDate from "../../components/form/form-item/InputDate";
import InputEmail from "../../components/form/form-item/InputEmail";
import InputPassword from "../../components/form/form-item/InputPassword";
import InputText from "../../components/form/form-item/InputText";
import PencilFillIcon from "remixicon-react/PencilFillIcon";
import CheckboxBlankCircleLineIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import CheckboxCircleLineIcon from "remixicon-react/CheckboxCircleLineIcon";
import SEO from "../../components/seo";
import { getImage } from "../../utils/getImage";
import { useTranslation } from "react-i18next";
import { UserApi } from "../../api/main/user";
import { toast } from "react-toastify";
import { useContext } from "react";
import { MainContext } from "../../context/MainContext";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fileSelectedHandler } from "../../utils/uploadFile";

function ProfileSettings() {
  const { t: tl } = useTranslation();
  const { getUser } = useContext(MainContext);
  const user = useSelector((state) => state.user.data);
  const [gender, setGender] = useState("male");
  const [update, setUpdate] = useState({});
  const [loader, setLoader] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [uploadImages, setUploadImages] = useState([]);
  const findHTTPS = user?.img?.includes("https");

  const handleChange = (event) => {
    const { target } = event;
    const value = target.type === "radio" ? target.checked : target.value;
    const { name } = target;
    setUpdate({
      ...update,
      [name]: value,
    });
  };
  const handleGender = (e) => {
    setGender(e);
    setUpdate({ ...update, gender: e });
  };
  const onSubmit = (e) => {
    setLoader(true);
    e.preventDefault();
    delete update.email;
    delete update.phone;
    if (uploadImages?.length) update.images = uploadImages;
    UserApi.update(update)
      .then(() => {
        getUser();
        toast.success("Profile data updated");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(() => {
    setUpdate({
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      birthday: user.birthday,
    });
  }, [user]);
  return (
    <div className="profile-settings">
      <SEO />
      <div className="title">{tl("Profile Setting")}</div>
      <Form onSubmit={onSubmit} autoComplete="off">
        <div className="profile-data">
          <div className="avatar">
            <div className="name">{tl("Avatar")}</div>
            {avatar ? (
              <img src={avatar} alt="avatar" />
            ) : findHTTPS ? (
              <img src={user?.img} alt="avatar" />
            ) : user?.img ? (
              getImage(user?.img)
            ) : (
              <div className="no-avatar">{user?.firstname?.slice(0, 1)}</div>
            )}
            <label>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(event) =>
                  fileSelectedHandler({
                    event,
                    uploadImages,
                    setUploadImages,
                    type: "users",
                    setAvatar,
                  })
                }
                multiple={false}
              />
              <div className="edit-avatar">
                <PencilFillIcon />
              </div>
            </label>
          </div>
          <div className="gender-box">
            <div className="name">{tl("Gender")}</div>
            <div className="gender">
              <div
                className={gender === "male" ? "male active" : "male"}
                onClick={() => handleGender("male")}
              >
                {gender === "male" ? (
                  <CheckboxCircleLineIcon size={20} />
                ) : (
                  <CheckboxBlankCircleLineIcon size={20} />
                )}
                <Label for="male">{tl("Male")}</Label>
              </div>
              <div
                className={gender === "female" ? "female active" : "female"}
                onClick={() => handleGender("female")}
              >
                {gender === "female" ? (
                  <CheckboxCircleLineIcon size={20} />
                ) : (
                  <CheckboxBlankCircleLineIcon size={20} />
                )}
                <Label for="female">{tl("Female")}</Label>
              </div>
            </div>
          </div>
        </div>
        <div className="form">
          <Row xs="1" lg="2">
            <Col>
              <InputText
                onChange={handleChange}
                name="firstname"
                label="Firstname"
                value={update?.firstname}
              />
            </Col>
            <Col>
              <InputText
                onChange={handleChange}
                name="lastname"
                label="Lastname"
                value={update?.lastname}
              />
            </Col>
            <Col>
              <InputText
                onChange={handleChange}
                name="phone"
                label="Phone number"
                value={update?.phone}
                disabled={true}
              />
            </Col>
            <Col>
              <InputEmail
                onChange={handleChange}
                name="email"
                label="Email"
                disabled={true}
                value={update?.email}
              />
            </Col>
            <Col>
              <InputPassword
                onChange={handleChange}
                name="password"
                label="Password"
              />
            </Col>
            <Col>
              <InputDate
                onChange={handleChange}
                name="birthday"
                label="Year of birth"
                value={update?.birthday?.slice(0, 10)}
              />
            </Col>
            <Col>
              <InputPassword
                onChange={handleChange}
                name="password_confirmation"
                label="Confirm password"
              />
            </Col>
          </Row>
          <Row xs="1" lg="2" className="mt-5">
            <Col>
              <Button color="btn btn-success">
                {loader ? <Spinner /> : tl("Submit")}
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}

export default ProfileSettings;
