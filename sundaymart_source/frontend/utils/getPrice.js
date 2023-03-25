import { parseCookies } from "nookies";

export const commafy = (num) => {
  var str = num.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(".");
};

export const getPrice = (price = 0) => {
  const cookies = parseCookies();
  if (price) {
    if (cookies.currency_symbol) {
      return `${decodeURI(cookies.currency_symbol)} ${commafy(
        parseFloat(price)?.toFixed(2)
      )}`;
    } else {
      return `$ ${commafy(price.toFixed(2))}`;
    }
  } else return "0.00";
};
