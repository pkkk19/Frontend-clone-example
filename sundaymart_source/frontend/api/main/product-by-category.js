import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";
export class ProductByCategoryApi {
  static endpoint = "/rest/categories/product/paginate";
  static get(params) {
    return mainCaller(this.endpoint, HTTPMethods.GET, null, null, params);
  }
  static getId(id) {
    return mainCaller(this.endpoint + `/${id}`, HTTPMethods.GET, null, null);
  }
}
