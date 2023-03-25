import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class CheckCoupon {
  static endpoint = "/rest/coupons/check";

  static create(data) {
    return mainCaller(this.endpoint, HTTPMethods.POST, data);
  }
}
