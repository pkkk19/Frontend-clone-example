import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class BrandApi {
  static endpoint = "/rest/brands/paginate";

  static get(params) {
    return mainCaller(this.endpoint, HTTPMethods.GET, null, null, params);
  }
  static getId(id) {
    return mainCaller(this.endpoint + `/${id}`, HTTPMethods.GET);
  }
  static create(data) {
    return mainCaller(this.endpoint, HTTPMethods.POST, data);
  }

  static update(id, data) {
    return mainCaller(this.endpoint + `${id}/`, HTTPMethods.PATCH, data);
  }

  static delete(id) {
    return mainCaller(this.endpoint + `${id}/`, HTTPMethods.DELETE);
  }
}
