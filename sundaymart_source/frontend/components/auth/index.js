import React, { useContext } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { UserApi } from "../../api/main/user";
import axiosService from "../../services/axios";
import { MainContext } from "../../context/MainContext";
import { useSelector } from "react-redux";
import { setOpenModal } from "../../redux/slices/mainState";
const MyModal = dynamic(() => import("../modal"));
const Login = dynamic(() => import("./login"));
const Register = dynamic(() => import("./register"));
const SocialAuth = dynamic(() => import("./social"));
const SignUpForm = dynamic(() => import("./sign-up-form"));
const Confirm = dynamic(() => import("./confirm"));

const Auth = () => {
  const { handleAuth } = useContext(MainContext);
  const authContent = useSelector((state) => state.mainState.authContent);
  const visibleAuth = useSelector((state) => state.mainState.visibleAuth);
  const router = useRouter();
  const [verifyPhone, setVerifyPhone] = useState({});
  const [isTimeOver, setIsTimeOver] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState(null);
  const [userData, setUserData] = useState({});
  const { getUser } = useContext(MainContext);

  // 946758050
  const getVerifyCode = () => {
    setLoader(true);
    axiosService
      .post("/auth/register", { phone })
      .then((res) => {
        setVerifyPhone(res.data.data);
        handleAuth("confirm");
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
        setLoader(false);
      });
  };
  const handleConfirm = () => {
    setLoader(true);
    axiosService
      .post("/auth/verify/phone", {
        verifyId: verifyPhone.verifyId,
        verifyCode: otp,
      })
      .then((res) => {
        handleAuth("formfull");
        setCookie(null, "access_token", res.data.data.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        getUser();
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
        toast.error(error.response.data.message);
      });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    UserApi.update(userData)
      .then(() => {
        setLoader(false);
        getUser();
        if (router.query.invite) {
          router.push(`/invite/${router.query.invite}`);
        } else router.push("/");
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        toast.error(error.response.data.message);
      });
  };
  return (
    <MyModal
      className="auth"
      visible={visibleAuth}
      centered={true}
      setVisible={setOpenModal}
    >
      {authContent === "login" && <Login />}
      {authContent === "phone" && (
        <SignUpForm
          loader={loader}
          setPhone={setPhone}
          getVerifyCode={getVerifyCode}
          phone={phone}
        />
      )}
      {authContent === "confirm" && (
        <Confirm
          loader={loader}
          otp={otp}
          setOtp={setOtp}
          verifyPhone={verifyPhone}
          isTimeOver={isTimeOver}
          setIsTimeOver={setIsTimeOver}
          getVerifyCode={getVerifyCode}
          handleConfirm={handleConfirm}
        />
      )}
      {authContent === "formfull" && (
        <Register
          loader={loader}
          userData={userData}
          setUserData={setUserData}
          onSubmit={onSubmit}
        />
      )}

      <SocialAuth />
    </MyModal>
  );
};

export default Auth;
