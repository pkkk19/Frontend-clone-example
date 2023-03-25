import React from "react";
import { useTranslation } from "react-i18next";
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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setCartData } from "../../../redux/slices/cart";
import { setCookies } from "../../../utils/setCookies";
import { setOpengomodal } from "../../../redux/slices/mainState";

function Open() {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const shop = useSelector((state) => state.stores.currentStore, shallowEqual);
  const opengomodal = useSelector(
    (state) => state.mainState.opengomodal,
    shallowEqual
  );
  const toggle = () => dispatch(setOpengomodal(!opengomodal));

  const openCart = () => {
    setLoader(true);
    CartApi.open({ shop_id: shop.id })
      .then((res) => {
        setCookies({ name: "group_id", value: res.data.id });
        dispatch(setCartData(res.data));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <ModalHeader toggle={toggle}>
        {`Together order in ${shop?.translation?.title}`}
      </ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            <CardText>{tl("together.order.text")}</CardText>
          </CardBody>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={openCart}>
          {loader && <Spinner size="sm" />} <span>Start</span>
        </Button>
      </ModalFooter>
    </>
  );
}

export default Open;
