import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalBody,
} from "reactstrap";
import { DrawerConfig } from "../../../configs/drawer-config";
import { MainContext } from "../../../context/MainContext";
import { setIsOpenConfirmCheckout } from "../../../redux/slices/mainState";

function ConfirmChackout(args) {
  const dc = DrawerConfig;
  const dispatch = useDispatch();
  const { t: tl } = useTranslation();
  const isOpenConfirmCheckout = useSelector(
    (state) => state.mainState.isOpenConfirmCheckout
  );
  const { handleVisible } = useContext(MainContext);
  const toggle = () =>
    dispatch(setIsOpenConfirmCheckout(!isOpenConfirmCheckout));
  const Continue = () => {
    handleVisible(dc.cart_summary);
    dispatch(setIsOpenConfirmCheckout(false));
  };
  return (
    <div>
      <Modal
        isOpen={isOpenConfirmCheckout}
        toggle={toggle}
        {...args}
        centered={true}
        className="confirm"
      >
        <ModalBody>
          <Card>
            <CardBody>
              <article>{tl("confirm.continue")}</article>
            </CardBody>
            <CardFooter>
              <Button className="secondary" outline onClick={toggle}>
                Cancel
              </Button>
              <Button color="success" outline onClick={Continue}>
                Continue
              </Button>
            </CardFooter>
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ConfirmChackout;
