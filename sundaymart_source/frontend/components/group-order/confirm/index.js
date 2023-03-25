import { parseCookies } from "nookies";
import React, { useContext } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { batch, shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CartApi } from "../../../api/main/cart";
import { clearCart, setCartData } from "../../../redux/slices/cart";
import { OrderContext } from "../../../context/OrderContext";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalBody,
  Spinner,
} from "reactstrap";
import {
  setIsOpenConfirm,
  setOpengomodal,
} from "../../../redux/slices/mainState";

function Confirm(args) {
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const [loader, setLoader] = useState(null);
  const cartData = useSelector((state) => state.cart.cartData, shallowEqual);
  const isOpenConfirm = useSelector(
    (state) => state.mainState.isOpenConfirm,
    shallowEqual
  );
  const memberData = useSelector(
    (state) => state.cart.memberData,
    shallowEqual
  );
  const { clearMemberData } = useContext(OrderContext);
  const toggle = () => dispatch(setIsOpenConfirm(!isOpenConfirm));
  const deleteCart = () => {
    setLoader("deleteCart");
    CartApi.delete(cartData.id)
      .then(() => {
        batch(() => {
          dispatch(setCartData({}));
          dispatch(clearCart(cartData?.shop_id));
        });
        dispatch(setOpengomodal(false));
        dispatch(setIsOpenConfirm(false));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoader(null);
      });
  };
  const deleteMember = () => {
    setLoader("deleteMember");
    CartApi.deleteMember({
      member_id: memberData?.uuid,
      cart_id: cookies?.cart_id,
    })
      .then((res) => {
        clearMemberData();
        dispatch(setOpengomodal(false));
        dispatch(setIsOpenConfirm(false));
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(null);
      });
  };
  return (
    <div>
      <Modal
        isOpen={isOpenConfirm}
        toggle={toggle}
        {...args}
        centered={true}
        className="confirm"
      >
        <ModalBody>
          {memberData?.id ? (
            <Card>
              <CardBody>
                <strong>{tl("Do you have a group order?")}</strong>
                <article>
                  {tl("Leave a group to add products from a new shop")}
                </article>
              </CardBody>
              <CardFooter>
                <Button className="secondary" outline onClick={toggle}>
                  Cancel
                </Button>
                <Button color="danger" outline onClick={deleteMember}>
                  {loader === "deleteMember" ? (
                    <Spinner size="sm" />
                  ) : (
                    "Leave group"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <strong>{tl("Do you have a group order?")}</strong>
                <article>
                  {tl("Delete a group to add products from a new shop")}
                </article>
              </CardBody>
              <CardFooter>
                <Button className="secondary" outline onClick={toggle}>
                  Cancel
                </Button>
                <Button color="danger" outline onClick={deleteCart}>
                  {loader === "deleteCart" ? <Spinner size="sm" /> : "Delete"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Confirm;
