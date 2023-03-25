import nookies from "nookies";
export const setCookieSSR = ({ ctx, name, value }) => {
  nookies.set(ctx, name, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};
