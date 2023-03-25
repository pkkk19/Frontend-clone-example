import React from "react";
import nookies from "nookies";
import { setCookieSSR } from "../../utils/setCookieSSR";

function Together() {
  return <></>;
}
export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const cookies = nookies.get(ctx);
  const cart_id = cookies?.cart_id;
  const shop_id = cookies?.shop_id;
  if (cookies.group_id) {
    return {
      redirect: {
        destination: `/stores/${query.id}`,
        permanent: false,
      },
    };
  } else if (!shop_id && !cart_id && query.cart_id) {
    setCookieSSR({ ctx, name: "cart_id", value: query.cart_id });
    setCookieSSR({ ctx, name: "shop_id", value: query.id });
    return {
      redirect: {
        destination: `/stores/${query.id}`,
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: `/stores/${query.id}`,
        permanent: false,
      },
    };
  }
}
export default Together;
