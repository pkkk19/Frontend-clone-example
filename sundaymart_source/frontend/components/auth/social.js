import React, { useContext } from "react";
import GoogleFillIcon from "remixicon-react/GoogleFillIcon";
import FacebookFillIcon from "remixicon-react/FacebookFillIcon";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { MainContext } from "../../context/MainContext";
import { toast } from "react-toastify";
import axiosService from "../../services/axios";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setVisibleAuth } from "../../redux/slices/mainState";

const SocialAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const { googleSignIn, facebookSignIn } = useAuth();
  const { getUser } = useContext(MainContext);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn().then((res) => {
        axiosService
          .post("/auth/google/callback", {
            name: res.user.displayName,
            email: res.user.email,
            id: res.user.uid,
            avatar: res.user.photoURL,
          })
          .then((response) => {
            setCookie(null, "access_token", response.data.data.access_token, {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            });
            getUser();
            dispatch(setVisibleAuth(false));
            if (router.query.invite) {
              router.push(`/invite/${router.query.invite}`);
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message);
          });
      });
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
  };

  const handleFacebookSignIn = async (e) => {
    e.preventDefault();
    try {
      await facebookSignIn().then((res) => {
        axiosService
          .post("/auth/facebook/callback", {
            name: res.user.displayName,
            email: res.user.email,
            id: res.user.uid,
            avatar: res.user.photoURL,
          })
          .then((response) => {
            setCookie(null, "access_token", response.data.data.access_token, {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            });
            dispatch(setVisibleAuth(false));
            getUser();
            if (router.query.invite) {
              router.push(`/invite/${router.query.invite}`);
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message);
          });
      });
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <div className="devider"></div>
      <div className="auth-btn-group">
        <button className="auth-btn google" onClick={handleGoogleSignIn}>
          <div className="label">{tl("Google")}</div>
          <div className="icon">
            <GoogleFillIcon size={18} />
          </div>
        </button>
        <button className="auth-btn apple" onClick={handleFacebookSignIn}>
          <div className="label">{tl("Facebook")}</div>
          <div className="icon">
            <FacebookFillIcon size={22} />
          </div>
        </button>
      </div>
    </>
  );
};

export default SocialAuth;
