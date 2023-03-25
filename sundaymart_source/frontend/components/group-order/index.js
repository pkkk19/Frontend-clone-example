import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { parseCookies } from "nookies";
import { Modal } from "reactstrap";
import Join from "./join";
const Member = dynamic(() => import("./member"));
const Open = dynamic(() => import("./open"));
const Owner = dynamic(() => import("./owner"));
import { setOpengomodal } from "../../redux/slices/mainState";
import { useDispatch, useSelector } from "react-redux";

const GroupOrder = () => {
  const cookies = parseCookies();
  const dispatch = useDispatch();
  const opengomodal = useSelector((state) => state.mainState.opengomodal);
  const toggle = () => dispatch(setOpengomodal(!opengomodal));
  const cartData = useSelector((state) => state.cart.cartData);
  const memberData = useSelector((state) => state.cart.memberData);
  const cart_id = cookies.cart_id;
  const member_id = memberData.id;
  const cart_data_id = cartData.id;

  useEffect(() => {
    if (cart_id && !member_id) dispatch(setOpengomodal(true));
  }, []);
  return (
    <Modal
      centered
      isOpen={opengomodal}
      toggle={toggle}
      className="together-modal join-together-modal"
    >
      {cart_id && !member_id && <Join />}
      {cart_id && member_id && <Member />}
      {!cart_id && !cart_data_id && <Open />}
      {!cart_id && cart_data_id && <Owner />}
    </Modal>
  );
};

export default GroupOrder;
