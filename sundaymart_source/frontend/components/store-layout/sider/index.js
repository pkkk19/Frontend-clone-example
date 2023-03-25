import React from "react";
import Link from "next/link";
import { BurgerOutline } from "../../../public/assets/images/svg";
import Menu from "../menu";
import UserData from "./components/UserData";
import { useTranslation } from "react-i18next";
function Sider() {
  const { t: tl } = useTranslation();
  return (
    <>
      <div className="sider">
        <div className="sider-header">
          <div className="burger-btn">
            <BurgerOutline />
          </div>
          <Link href="/" className="logo">
            <a>{tl("Sudaymart")}</a>
          </Link>
        </div>
        <div className="sider-content">
          <UserData />
          <Menu />
        </div>
      </div>
    </>
  );
}

export default Sider;
