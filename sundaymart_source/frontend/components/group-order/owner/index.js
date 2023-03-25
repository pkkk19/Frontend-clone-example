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
  Spinner,
} from "reactstrap";
import { useState } from "react";
import { CartApi } from "../../../api/main/cart";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { clearCart, setCartData } from "../../../redux/slices/cart";
import OrderMember from "../helper/order-member";
import { setOpengomodal } from "../../../redux/slices/mainState";

function Owner() {
  const cratData = useSelector((state) => state.cart.cartData, shallowEqual);
  const opengomodal = useSelector(
    (state) => state.mainState.opengomodal,
    shallowEqual
  );
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const [buttonText, setButtonText] = useState("Copy link");
  const [loader, setLoader] = useState(false);
  const toggle = () => dispatch(setOpengomodal(!opengomodal));
  const handleCopyLink = () => {
    setButtonText("Link copied");
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/together/${cratData.shop_id}?cart_id=${cratData?.id}`
    );
  };
  const clearAll = () => {
    batch(() => {
      dispatch(setCartData({}));
      dispatch(clearCart(cratData.shop_id));
    });
    setButtonText("Copy link");
    dispatch(setOpengomodal(false));
    document.cookie =
      "group_id" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };
  const deleteCart = () => {
    setLoader(true);
    CartApi.delete(cratData.id)
      .then(() => {
        clearAll();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) clearAll();
      })
      .finally(() => {
        setLoader(false);
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
        {buttonText === "Link copied" ? (
          <Button color="success" outline onClick={handleCopyLink}>
            {buttonText}
          </Button>
        ) : (
          <Button color="secondary" outline onClick={handleCopyLink}>
            {buttonText}
          </Button>
        )}
        <Button color="danger" outline onClick={deleteCart}>
          {loader ? <Spinner size="sm" /> : tl("Delete together order")}
        </Button>
      </ModalFooter>
    </>
  );
}

export default Owner;
