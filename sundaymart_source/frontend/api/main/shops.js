import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class ShopApi {
  static endpoint = "/rest/shops";

  static get(params) {
    params.perPage = 8;
    return mainCaller(
      this.endpoint + "/paginate",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static getId(id) {
    return mainCaller(this.endpoint + `/byId/${id}`, HTTPMethods.GET);
  }
  static getDelivery(params) {
    return mainCaller(
      this.endpoint + `/deliveries`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static getNearby(params = {}) {
    return mainCaller(
      this.endpoint + "/nearby",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static create(data) {
    return mainCaller(`/dashboard/user/shops`, HTTPMethods.POST, data);
  }
  static getShop() {
    return mainCaller(`/dashboard/user/shops`, HTTPMethods.GET);
  }
  static checkIds(params) {
    return mainCaller(this.endpoint, HTTPMethods.GET, null, null, params);
  }
  static search(params) {
    return mainCaller(
      this.endpoint + "/search",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static getCategory(params) {
    return mainCaller(`/rest/groups`, HTTPMethods.GET, null, null, params);
  }
}
