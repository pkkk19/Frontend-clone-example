import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form } from "reactstrap";
import InputPassword from "../../components/form/form-item/InputPassword";
import InputText from "../../components/form/form-item/InputText";
import { MainContext } from "../../context/MainContext";
import CustomSelect from "../form/form-item/customSelect";
import InputDate from "../form/form-item/InputDate";
import InputEmail from "../form/form-item/InputEmail";

const Register = ({ userData, setUserData, onSubmit, loader }) => {
  const { t: tl } = useTranslation();
  const { handleAuth } = useContext(MainContext);
  const [validate, setValidate] = useState(null);
  const gender = [
    { id: "male", value: "Male" },
    { id: "female", value: "Female" },
  ];
  const handleChange = (event) => {
    const { target } = event;
    const value = target.type === "radio" ? target.checked : target.value;
    const { name } = target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const handleGender = (value) => {
    setUserData({
      ...userData,
      gender: value.id,
    });
  };
  const checkPassword = () => {
    if (userData.password === userData.password_confirmation) {
      setValidate("check");
    } else {
      setValidate("checked");
    }
  };
  return (
    <div className="auth">
      <div className="title">{tl("Sign Up")}</div>
      <Form autoComplete="off" onSubmit={onSubmit}>
        <InputText
          onChange={handleChange}
          label="First name"
          placeholder="First name"
          name="firstname"
          value={userData.firstname}
        />
        <InputText
          name="lastname"
          value={userData.lastname}
          onChange={handleChange}
          label="Last name"
          placeholder="Last name"
        />
        <CustomSelect
          onChange={handleGender}
          options={gender}
          label="Geder"
          placeholder="Male"
          value={userData.gender}
        />
        <InputDate
          onChange={handleChange}
          name="birthday"
          value={userData.birthday?.slice(0, 10)}
          label="Year of birth"
        />
        <InputEmail
          name="email"
          value={userData.email}
          onChange={handleChange}
          label="Email"
          placeholder="anastasiayudaeva@gmail.com"
        />
        <InputPassword
          name="password"
          label="Password"
          placeholder="********"
          onChange={handleChange}
        />
        <InputPassword
          name="password_confirmation"
          label="Confirm password"
          placeholder="*********"
          onChange={handleChange}
          onBlur={checkPassword}
          className={
            validate === "check"
              ? "success"
              : validate === "checked"
              ? "error"
              : ""
          }
        />
        <Button>{tl("Sign Up")}</Button>
        <div className="sign-up">
          <span>{tl("Already have an account?")}</span>
          <span className="to-register" onClick={() => handleAuth("login")}>
            {tl("Sign In")}
          </span>
        </div>
      </Form>
    </div>
  );
};

export default Register;
