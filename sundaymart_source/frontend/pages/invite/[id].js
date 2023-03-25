import React, { useContext, useEffect, useState } from "react";
import { InviteApi } from "../../api/main/invite";
import ShopStatus from "../../components/be-seller/shop-status";
import Breadcrumb from "../../components/breadcrumb";
import { useRouter } from "next/router";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import CheckDoubleLineIcon from "remixicon-react/CheckDoubleLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import SEO from "../../components/seo";
import { MainContext } from "../../context/MainContext";
const Invite = () => {
  const router = useRouter();
  const cookies = parseCookies();
  const uuid = router.query.id;
  const [data, setData] = useState();
  const { handleAuth } = useContext(MainContext);
  useEffect(() => {
    if (uuid)
      if (cookies.access_token) {
        InviteApi.create(uuid)
          .then((res) => {
            setData(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        toast.error("Please register first");
        handleAuth("login");
      }
  }, [uuid, cookies.access_token]);

  return (
    <>
      <SEO />
      <div className="container">
        <Breadcrumb />
        <>
          {data?.status === "new" && (
            <ShopStatus
              icon={<TimeFillIcon color="#FFB800" size={70} />}
              title="Your invite is currently under review"
              text="Go to home"
              className="new"
              href="/"
            />
          )}
          {data?.status === "rejected" && (
            <ShopStatus
              icon={<CloseLineIcon color="#EF233C" size={70} />}
              title="Your invite has been rejected"
              text="Go to home"
              className="rejected"
              href="/"
            />
          )}
          {data?.status === "excepted" && (
            <ShopStatus
              icon={<CheckDoubleLineIcon color="#61DC00" size={70} />}
              title="Your invite has been accepted"
              text="Go to home"
              className="approved"
              href="/"
            />
          )}
        </>
      </div>
    </>
  );
};

export default Invite;
