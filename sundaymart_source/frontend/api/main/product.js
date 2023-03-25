import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";
export class ProductApi {
  static endpoint = "/rest/products";

  static get(params) {
    return mainCaller(
      this.endpoint + "/paginate",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static getDiscount(params) {
    return mainCaller(
      this.endpoint + "/discount",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static getMostSales(params) {
    return mainCaller(
      this.endpoint + "/most-sold",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static getId(id) {
    return mainCaller(this.endpoint + `/${id}`, HTTPMethods.GET, null, null);
  }
  static checkIds(params) {
    return mainCaller(
      this.endpoint + "/ids",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
}
