import React, { useContext, useEffect, useState } from "react";
import PauseCircleLineIcon from "remixicon-react/PauseCircleLineIcon";
import FileCopyLineIcon from "remixicon-react/FileCopyLineIcon";
import ShareLineIcon from "remixicon-react/ShareLineIcon";
import i18n from "../../services/i18next";
import { MainContext } from "../../context/MainContext";
import { parseCookies, setCookie } from "nookies";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { UserApi } from "../../api/main/user";
import { savedUser } from "../../redux/slices/user";
import { setCurrency } from "../../utils/setCurrency";
import { setLanguage } from "../../utils/setLanguage";
import CustomSelect from "../../components/form/form-item/customSelect";
import informationService from "../../services/informationService";
import { clearViewedList } from "../../redux/slices/viewed-product";
import AddressCard from "../../components/address-modal/helper/address-card";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const SiteSettings = ({ setLoader }) => {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const router = useRouter();
  const {
    theme,
    setTheme,
    checkProduct,
    checkViewedProduct,
    currency,
    language,
  } = useContext(MainContext);
  const [defaultCurrency, setDefaultCurrency] = useState(cookies?.currency_id);
  const [defaultLanguage, setDefaultLanguage] = useState(cookies?.language_id);

  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setCookie(null, "theme", theme === "light" ? "dark" : "light");
  };
  const currencyList = () => {
    const array = [];
    currency.forEach((element) => {
      array.push({
        id: element.id,
        value: `${element.title} - (${element.symbol})`,
        ...element,
      });
    });
    return array;
  };
  const languageList = () => {
    const array = [];
    language.forEach((element) => {
      array.push({
        id: element.id,
        value: element.title,
        img: element.img,
        ...element,
      });
    });
    return array;
  };
  const handleCurrency = (e) => {
    if (cookies.access_token)
      UserApi.get({ currency_id: e.id })
        .then((res) => {
          dispatch(savedUser(res.data));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          checkProduct();
          checkViewedProduct();
        });
    setCurrency(e);
    setDefaultCurrency(e.id);
  };
  const handleLanguae = (e) => {
    const body = document.getElementsByTagName("body");
    setLoader(true);
    const { locale } = e;
    setDefaultLanguage(e.id);
    setLanguage(e);
    if (e.backward) {
      body[0].setAttribute("dir", "rtl");
      setCookie(null, "dir", "rtl");
    } else {
      body[0].setAttribute("dir", "ltr");
      setCookie(null, "dir", "ltr");
    }
    informationService
      .translations({ lang: locale })
      .then(({ data }) => {
        i18n.addResourceBundle(locale, "translation", data.data);
        i18n.changeLanguage(locale);
      })
      .finally(() => {
        setLoader(false);
        router.push("/");
      });
    dispatch(clearViewedList());
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BASE_URL);
    toast.success("Url copied");
  };
  useEffect(() => {
    setDefaultCurrency(cookies.currency_id);
    setDefaultLanguage(cookies.language_id);
  }, [cookies?.language_id]);
  return (
    <>
      <AddressCard title={true} />
      <div className="site-settings">
        <div className="title">{tl("Interface")}</div>
        <div className="settings-content">
          <div className="interface">
            <div className="context">
              <div className="icon">
                <PauseCircleLineIcon />
              </div>
              <div className="label">{tl("UI Theme")}</div>
            </div>
            <div className="swith-btn" onClick={handleClick}>
              <div className="suffix">
                <div className="icon">
                  <PauseCircleLineIcon size={20} />
                </div>
                <div className="label">
                  {theme === "light" ? tl("Dark") : tl("Light")}
                </div>
              </div>
            </div>
          </div>
          <CustomSelect
            options={languageList()}
            onChange={(e) => {
              handleLanguae(e);
            }}
            value={defaultLanguage}
            placeholder="Language"
          />
          <CustomSelect
            options={currencyList()}
            onChange={(e) => handleCurrency(e)}
            value={defaultCurrency}
            placeholder="Currency"
          />
        </div>
      </div>
      <div className="site-settings">
        <div className="title">{tl("Share friends")}</div>
        <div className="settings-content">
          <div className="interface">
            <div className="context">
              <div className="icon">
                <ShareLineIcon />
              </div>
              <div className="label">{process.env.NEXT_PUBLIC_BASE_URL}</div>
            </div>
            <div className="suffix" onClick={handleCopy}>
              <FileCopyLineIcon size={20} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteSettings;
