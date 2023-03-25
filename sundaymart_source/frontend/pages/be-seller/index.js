import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/breadcrumb";
import UploadCloud2LineIcon from "remixicon-react/UploadCloud2LineIcon";
import InputText from "../../components/form/form-item/InputText";
import MessageInput from "../../components/form/form-item/msg-input";
import InputTime from "../../components/form/form-item/input-time";
import MapPinLineIcon from "remixicon-react/MapPinLineIcon";
import TimeLineIcon from "remixicon-react/TimeLineIcon";
import GoogleMap from "../../components/map";
import { useTranslation } from "react-i18next";
import { UploadApi } from "../../api/main/upload";
import DeleteBin5LineIcon from "remixicon-react/DeleteBin5LineIcon";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";
import { ShopApi } from "../../api/main/shops";
import { UserApi } from "../../api/main/user";
import ShopStatus from "../../components/be-seller/shop-status";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import DiscordLoader from "../../components/loader/discord-loader";
import SEO from "../../components/seo";
import { useRouter } from "next/router";
import { Card, Toast, ToastBody } from "reactstrap";
import InputNumber from "../../components/form/form-item/InputNumber";
import GetPosition from "../../components/map/get-position";
const BeSeller = () => {
  const router = useRouter();
  const { t: tl } = useTranslation();
  const cookies = parseCookies();
  const locale = cookies.language_locale;
  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);
  const [uploadImages, setUploadImages] = useState([]);
  const [shopData, setShopData] = useState({});
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [address, setAddress] = useState(null);
  const [value, setValue] = useState(null);

  const handleBackground = (event) => {
    const images = new FormData();
    const reader = new FileReader();
    images.append("image", event.target.files[0]);
    images.append("type", "shops/background");
    UploadApi.create(images)
      .then((res) => {
        setUploadImages([...uploadImages, res.data.title]);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error");
      });
    reader.onload = () => {
      if (reader.readyState === 2) {
        setBackground(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const handleLogo = (event) => {
    const images = new FormData();
    const reader = new FileReader();
    images.append("image", event.target.files[0]);
    images.append("type", "shops/logo");
    UploadApi.create(images)
      .then((res) => {
        setUploadImages([...uploadImages, res.data.title]);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error");
      });
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogo(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const deleteLogo = () => {
    setLogo(null);
    const nextUpload = uploadImages.filter((item) => item != logo);
    setUploadImages(nextUpload);
  };
  const deleteBg = () => {
    setBackground(null);
    const nextUpload = uploadImages.filter((item) => item != background);
    setUploadImages(nextUpload);
  };
  const handleChange = (event) => {
    const { target } = event;
    const value = target.type === "radio" ? target.checked : target.value;
    const { name } = target;
    if (name === "title" || name === "description" || name === "address") {
      setShopData({
        ...shopData,
        [name]: { [locale]: value },
      });
    } else {
      setShopData({
        ...shopData,
        [name]: value,
      });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    shopData.images = uploadImages;
    shopData.location = `${address?.location?.lat},${address?.location?.lng}`;
    shopData.address = { [locale]: address?.address };
    if (address.address) {
      ShopApi.create(shopData)
        .then((res) => {
          setRefresh(true);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please select address");
    }
  };
  const getUser = () => {
    UserApi.get()
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (cookies.access_token) {
      getUser();
    } else {
      toast.error("Please login first");
      router.push("/auth/sign-in");
    }
  }, [refresh]);
  return (
    <>
      <SEO />
      <Breadcrumb />
      <div className="be-seller tab-pane-custom">
        {user ? (
          <>
            {user?.shop?.status === "new" && (
              <ShopStatus
                icon={<TimeFillIcon color="#FFB800" size={70} />}
                title="The shop is currently under review"
                text={null}
                className="new"
              />
            )}
            {user?.shop?.status === "rejected" && (
              <ShopStatus
                icon={<CloseLineIcon color="#EF233C" size={70} />}
                title="shop was canceled"
                text="Become Seller"
                className="rejected"
              />
            )}
            {user?.shop?.status === "approved" && (
              <ShopStatus
                icon={<CheckDoubleLineIcon color="#61DC00" size={70} />}
                title="Shop accepted"
                text="Go to admin"
                className="approved"
                href={process.env.NEXT_PUBLIC_ADMIN_API}
              />
            )}
            {user?.shop === null && (
              <div className="tab-pane">
                <div className="title">{tl("Become seller")}</div>
                <form>
                  <div className="seller-form-box">
                    <div className="form-box-item">
                      <div className="item">
                        <div className="title">{tl("Upload image")}</div>
                        <div className="upload-wrapper">
                          <div className="logo-upload">
                            {logo ? (
                              <div className="img-wrapper">
                                <img src={logo} alt="product" />
                                <div
                                  className="remove-img"
                                  onClick={deleteLogo}
                                >
                                  <DeleteBin5LineIcon size={32} color="#fff" />
                                </div>
                              </div>
                            ) : (
                              <label>
                                <input
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleLogo}
                                  required
                                  multiple={false}
                                />
                                <div className="upload">
                                  <UploadCloud2LineIcon size={28} />
                                  <span>{tl("Logo image")}</span>
                                </div>
                              </label>
                            )}
                          </div>
                          <div className="background-upload">
                            {background ? (
                              <div className="img-wrapper">
                                <img src={background} alt="product" />
                                <div className="remove-img" onClick={deleteBg}>
                                  <DeleteBin5LineIcon size={32} color="#fff" />
                                </div>
                              </div>
                            ) : (
                              <label>
                                <input
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleBackground}
                                  required
                                  multiple={false}
                                />
                                <div className="upload">
                                  <UploadCloud2LineIcon size={28} />
                                  <span>{tl("Background image")}</span>
                                </div>
                              </label>
                            )}
                          </div>
                        </div>
                        <div className="warning-text">
                          <div className="text">
                            <strong>Logo Supported: </strong>
                            <label>(.jpeg .png .jpg .svg) 70x70</label>
                          </div>
                          <div className="text">
                            <strong>Background Supported: </strong>
                            <label>(.jpeg .png .jpg .svg) 980x200</label>
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="title">{tl("General")}</div>
                        <InputText
                          onChange={handleChange}
                          label="Title"
                          placeholder="Title"
                          required={true}
                          name="title"
                        />
                        <InputNumber
                          onChange={handleChange}
                          name="phone"
                          label="Phone"
                          placeholder="Phone"
                          required={true}
                        />
                        <MessageInput
                          onChange={handleChange}
                          name="description"
                          placeholder="Description"
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-box-item">
                      <div className="item">
                        <div className="title">{tl("Show working hours")}</div>
                        <InputTime
                          onChange={handleChange}
                          name="open_time"
                          label="Open hours"
                          required={true}
                        />
                        <InputTime
                          onChange={handleChange}
                          name="close_time"
                          label="Close hours"
                          required={true}
                        />
                      </div>
                      <div className="item">
                        <div className="title">{tl("Order")}</div>
                        <InputNumber
                          onChange={handleChange}
                          name="min_price"
                          label="Min Amount"
                          placeholder="Amount"
                          required={true}
                        />
                        <InputNumber
                          onChange={handleChange}
                          name="tax"
                          label="Tax"
                          placeholder="Imposition"
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-box-item">
                      <div className="item">
                        <div className="title">{tl("Address")}</div>
                        <div className="shipping-info">
                          <div className="info-wrapper">
                            <div className="general-info">
                              <InputNumber
                                onChange={handleChange}
                                name="delivery_range"
                                label="Delivery range"
                                placeholder="Delivery range"
                                suffix={<TimeLineIcon size={20} />}
                                required={true}
                              />
                              {/* <InputText
                                onChange={handleChange}
                                name="address"
                                label="Address"
                                placeholder="Address"
                                suffix={<MapPinLineIcon size={20} />}
                                required={true}
                                value={address?.address}
                              /> */}
                              <GetPosition
                                setValue={setValue}
                                value={value}
                                setAddress={setAddress}
                                className="form-item"
                              />
                              <div className="mt-4">
                                <GoogleMap
                                  address={address}
                                  setAddress={setAddress}
                                  setValue={setValue}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="btn-group">
                            <button
                              type="submit"
                              className="btn btn-success"
                              onClick={(e) => {
                                onSubmit(e);
                              }}
                            >
                              {tl("Save")}
                            </button>
                            <button
                              type="reset"
                              className="btn btn-danger"
                              onClick={() => {}}
                            >
                              {tl("Cancel")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="tab-pane">
            <div className="row">
              <DiscordLoader />
              <DiscordLoader />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BeSeller;
