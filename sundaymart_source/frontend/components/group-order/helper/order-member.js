import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Badge, CardText, Spinner } from "reactstrap";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { CartApi } from "../../../api/main/cart";
import { OrderContext } from "../../../context/OrderContext";
const OrderMember = () => {
  const { orderedProduct, fetchCart } = useContext(OrderContext);
  const cartData = useSelector((state) => state.cart.cartData, shallowEqual);
  const [loader, setLoader] = useState(false);
  const memberData = useSelector(
    (state) => state.cart.memberData,
    shallowEqual
  );
  const deleteMember = (id) => {
    setLoader(true);
    CartApi.deleteMember({ member_id: id, cart_id: cartData.id })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(() => {
    fetchCart();
    if (cartData?.id || memberData?.id) {
      const intervalId = setInterval(() => {
        fetchCart();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="order-member">
      <ul>
        <CardText>Members</CardText>
        {orderedProduct?.userCarts?.map((item) => (
          <>
            <li className="head">
              {!item.user_id &&
                !memberData?.id &&
                (loader ? (
                  <Spinner size="sm" />
                ) : (
                  <CloseLineIcon
                    color="red"
                    onClick={() => deleteMember(item.uuid)}
                  />
                ))}
              <label>{`${item?.name} ${
                item.user_id && memberData?.id
                  ? "(Owner)"
                  : item.user_id
                  ? "(You)"
                  : ""
              }`}</label>
              {!item.user_id &&
                (item.status ? (
                  <Badge color="primary">Choosing...</Badge>
                ) : (
                  <Badge color="success">Done</Badge>
                ))}
            </li>
            <hr />
          </>
        ))}
      </ul>
    </div>
  );
};

export default OrderMember;
