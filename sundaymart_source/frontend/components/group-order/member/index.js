import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { MainContext } from "../../../context/MainContext";
import {
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardText,
} from "reactstrap";
import { useState } from "react";
import { CartApi } from "../../../api/main/cart";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import OrderMember from "../helper/order-member";
import { parseCookies } from "nookies";
import { OrderContext } from "../../../context/OrderContext";
import { useRouter } from "next/router";
import { setOpengomodal } from "../../../redux/slices/mainState";

function Member() {
  const cookies = parseCookies();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const cart_id = cookies.cart_id;
  const memberData = useSelector(
    (state) => state.cart.memberData,
    shallowEqual
  );
  const opengomodal = useSelector((state) => state.mainState.opengomodal);
  const [buttonText, setButtonText] = useState("Copy link");
  const { clearMemberData } = useContext(OrderContext);
  const toggle = () => dispatch(setOpengomodal(!opengomodal));
  const handleCopyLink = () => {
    setButtonText("Link copied");
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/together/${memberData.shop_id}?cart_id=${cart_id}`
    );
  };
  const deleteMember = () => {
    CartApi.deleteMember({ member_id: memberData?.uuid, cart_id })
      .then((res) => {
        clearMemberData();
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <ModalHeader toggle={toggle}>{`Together order`}</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            <CardText>{tl("together.order.text")}</CardText>
            <OrderMember />
          </CardBody>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button color="success" outline onClick={handleCopyLink}>
          {buttonText}
        </Button>
        <Button color="danger" outline onClick={deleteMember}>
          Leave group
        </Button>
      </ModalFooter>
    </>
  );
}

export default Member;
