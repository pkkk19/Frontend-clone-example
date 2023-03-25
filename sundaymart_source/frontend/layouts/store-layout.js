import dynamic from "next/dynamic";
import React, { useContext, useState } from "react";
import { DrawerConfig } from "../configs/drawer-config";
import { MainContext } from "../context/MainContext";
import { OrderContext } from "../context/OrderContext";
import Sider from "../components/store-layout/sider";
import { useSelector } from "react-redux";
const Checkout = dynamic(() => import("../components/checkout/checkout"));
const OrderList = dynamic(() => import("../components/checkout/order-list"));
const Payment = dynamic(() => import("../components/checkout/payment"));
const Drawer = dynamic(() => import("../components/drawer"));
const Notification = dynamic(() => import("../components/notification"));
const AddWallet = dynamic(() => import("../components/wallet/add-wallet"));
const ShareWallet = dynamic(() => import("../components/wallet/share-wallet"));
const Address = dynamic(() => import("../components/address-modal/Address"));
const CartLoader = dynamic(() => import("../components/loader/cart-loader"));
const CreatePayment = dynamic(() => import("../components/payment"));
const GroupOrder = dynamic(() => import("../components/group-order"));
const Confirm = dynamic(() => import("../components/group-order/confirm"));
const WalletHistory = dynamic(() =>
  import("../components/wallet/wallet-history")
);
const CartSummary = dynamic(() =>
  import("../components/checkout/cart-summary")
);
const MobileNav = dynamic(() =>
  import("../components/store-layout/mobile-navbar")
);
const FinalPayment = dynamic(() =>
  import("../components/checkout/final-payment")
);
const ConfirmChackout = dynamic(() =>
  import("../components/group-order/confirm/order")
);

function StoreLayout({ children }) {
  const dc = DrawerConfig;
  const { visible, setVisible } = useContext(MainContext);
  const drawerContent = useSelector((state) => state.mainState.drawerContent);
  const { cartLoader } = useContext(OrderContext);
  const [payment, setPayment] = useState();
  const [data, setData] = useState();
  const [calculated, setCalculated] = useState({});
  const [createdOrderData, setCreatedOrderData] = useState();

  return (
    <div className="wrapper-store-layout">
      <MobileNav />
      <div className="store-layout">
        <Sider />
        <div className="layout-content">{children}</div>
      </div>
      <GroupOrder />
      <Confirm />
      <ConfirmChackout />
      <Address />
      <Drawer title={drawerContent} setVisible={setVisible} visible={visible}>
        {cartLoader && <CartLoader />}
        {drawerContent === dc.notification && (
          <Notification setVisible={setVisible} />
        )}
        {drawerContent === dc.order_list && <OrderList />}
        {drawerContent === dc.cart_summary && (
          <CartSummary calculated={calculated} setCalculated={setCalculated} />
        )}
        {drawerContent === dc.checkout && <Checkout calculated={calculated} />}
        {drawerContent === dc.payment && <Payment setPayment={setPayment} />}
        {drawerContent === dc.final_payment && (
          <FinalPayment
            payment={payment}
            setVisible={setVisible}
            setData={setData}
            setCreatedOrderData={setCreatedOrderData}
            calculated={calculated}
          />
        )}
        {drawerContent === dc.add_wallet && <AddWallet />}
        {drawerContent === dc.wallet_history && <WalletHistory />}
        {drawerContent === dc.share_wallet && <ShareWallet />}
        {drawerContent === dc.create_payment && (
          <CreatePayment
            data={data}
            payment={payment}
            createdOrderData={createdOrderData}
          />
        )}
      </Drawer>
    </div>
  );
}

export default StoreLayout;
