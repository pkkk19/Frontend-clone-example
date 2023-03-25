import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class CashbackApi {
  static endpoint = "/rest/cashback/check";

  static create(data) {
    return mainCaller(this.endpoint, HTTPMethods.POST, data);
  }
}
