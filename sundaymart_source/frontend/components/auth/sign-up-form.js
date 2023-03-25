import Link from "next/link";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import InputText from "../../components/form/form-item/InputText";
import Loader4LineIcon from "remixicon-react/Loader4LineIcon";
import { MainContext } from "../../context/MainContext";
const SignUpForm = ({ getVerifyCode, setPhone, loader, phone }) => {
  const [privacy, setPrivacy] = useState(true);
  const { handleAuth } = useContext(MainContext);
  const { t: tl } = useTranslation();
  const onFinish = (e) => {
    e.preventDefault();
    getVerifyCode();
  };
  return (
    <div className="sign-up-form">
      <form onSubmit={onFinish}>
        <InputText
          onChange={(e) => setPhone(e.target.value)}
          label="Phone number"
          placeholder="1 202 340 1032"
        />
        <div className="privacy">
          <input type="checkbox" onChange={() => setPrivacy(!privacy)} />
          {tl("i agree")}
          <Link href="/privacy-policy">
            <span>{tl("Privacy and Policy")}</span>
          </Link>
        </div>
        <button
          data-loader={loader}
          disabled={!(!privacy && phone)}
          type="submit"
          className="btn-success"
        >
          <Loader4LineIcon />
          {tl("Send sms code")}
        </button>
        <div className="sign-up">
          <span>{tl("Already have an account?")}</span>
          <span className="to-register" onClick={() => handleAuth("login")}>
            {tl("Sign In")}
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
