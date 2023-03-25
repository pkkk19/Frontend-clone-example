import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class PaymentApi {
  static endpoint = "/rest/payments";

  static get(params) {
    return mainCaller(this.endpoint, HTTPMethods.GET, null, null, params);
  }
}
