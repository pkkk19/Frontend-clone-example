import { setCookie } from "nookies";

export const setCurrency = (currency) => {
  setCookie(null, "currency_id", currency.id, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  setCookie(null, "currency_symbol", currency.symbol, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  setCookie(null, "currency_rate", currency.rate, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  setCookie(null, "currency_title", currency.title, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};
