import React from "react";
import { getPrice } from "../../utils/getPrice";
import Refund2LineIcon from "remixicon-react/Refund2LineIcon";
const ListItem = ({
  order,
  setVisible,
  setCurrentOrderId,
  activeTab,
  setModal,
}) => {
  const handleClick = (id) => {
    setVisible(true);
    setCurrentOrderId(id);
  };
  const handleRefund = (e) => {
    e.stopPropagation();
    setModal(true);
  };
  return (
    <div className="list-item" onClick={() => handleClick(order.id)}>
      <div className="item">{`#${order.id}`}</div>
      <div className="item">
        <div className="products">
          {/* <div className="product-img">
            <img src={images.Bath1} />
            <img src={images.Bath2} />
            <img src={images.Bath3} />
            <img src={images.Bath4} />
            <img src={images.Bath5} />
          </div> */}
          <div className="total-count">
            {`${order?.order_details_count} Products`}
          </div>
        </div>
      </div>
      <div className="item">
        <div className="amount">{getPrice(order?.price)}</div>
      </div>
      <div className="item">
        <div className="date-time">
          <span className="time">{order?.created_at?.slice(11, 16)}</span>
          <span className="date">{order?.created_at?.slice(0, 11)}</span>
        </div>
      </div>
      {/* {activeTab === "delivered" && (
        <div className="item refund" onClick={(e) => handleRefund(e)}>
          <Refund2LineIcon />
        </div>
      )} */}
    </div>
  );
};

export default ListItem;
