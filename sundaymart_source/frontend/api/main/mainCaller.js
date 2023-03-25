import axios from "axios";
import HTTPMethods from "../HTTPMethods";
import { parseCookies } from "nookies";

export default function mainCaller(
  path,
  method = HTTPMethods.GET,
  data,
  headers,
  params = {}
) {
  const cookies = parseCookies();
  const access_token = cookies.access_token;
  const currency_id = cookies?.currency_id;
  const language_locale = cookies?.language_locale;

  const _headers = {
    Accept: "application/json; charset=utf-8",
    Authorization: `Bearer ${decodeURI(access_token)}`,
    ...headers,
  };
  const options = {
    method,
    url: process.env.NEXT_PUBLIC_API_URL + path,
    timeout: 16000,
  };
  if (method === "GET") {
    params.lang = language_locale;
    params.currency_id = params.currency_id ? params.currency_id : currency_id;
  }
  options.params = params;

  if (data) {
    options.data = data;
    if (data instanceof FormData) {
      _headers["Content-type"] = "multipart/form-data";
    } else {
      _headers["Content-type"] = "application/json; charset=utf-8";
    }
  }

  options.headers = _headers;

  return axios(options).then((r) => r.data);
}
