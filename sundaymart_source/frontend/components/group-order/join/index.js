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
import { useDispatch } from "react-redux";
import InputText from "../../form/form-item/InputText";
import { toast } from "react-toastify";
import { setMember } from "../../../redux/slices/cart";
import { parseCookies } from "nookies";
import { useContext } from "react";
import { OrderContext } from "../../../context/OrderContext";
import { useRouter } from "next/router";

function JoinTogetherOrder() {
  const cookies = parseCookies();
  const router = useRouter();
  const { t: tl } = useTranslation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const { clearMemberData } = useContext(OrderContext);
  const shop_id = cookies.shop_id;
  const cart_id = cookies.cart_id;
  const handleCancel = () => {
    clearMemberData();
    router.push("/");
  };
  const joinGroup = () => {
    if (name) {
      setLoader(true);
      CartApi.join({
        shop_id,
        cart_id,
        name,
      })
        .then((res) => {
          dispatch(setMember({ ...res.data, shop_id }));
        })
        .catch((error) => {
          if (!error.response.data.status) {
            toast.error("Cart has been deleted");
            handleCancel();
          }
        })
        .finally(() => {
          setLoader(false);
        });
    } else toast.error("Please enter name");
  };

  return (
    <>
      <ModalHeader>You have been invited to a group order</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Enter temprorary name"
              name="name"
              placeholder="name"
            />
            <CardText>
              <strong>Note:</strong> You can only select products from the
              establishment chosen by the creator of the group
            </CardText>
          </CardBody>
        </Card>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={handleCancel}>
          <span>Cancel</span>
        </Button>
        <Button color="primary" onClick={joinGroup}>
          {loader && <Spinner size="sm" />} <span>Join</span>
        </Button>
      </ModalFooter>
    </>
  );
}

export default JoinTogetherOrder;
