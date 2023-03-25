import React from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../components/header"));
const Address = dynamic(() => import("../components/address-modal/Address"));
export default function HomeLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Address />
    </>
  );
}
