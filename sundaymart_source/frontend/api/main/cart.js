import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class CartApi {
  static endpoint = "/dashboard/user/cart";
  static get(params) {
    return mainCaller(this.endpoint, HTTPMethods.GET, null, null, params);
  }
  static getMember(params) {
    return mainCaller(
      `/rest/cart/${params.id}`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static create(data) {
    return mainCaller(this.endpoint, HTTPMethods.POST, data);
  }
  static calculate(id) {
    return mainCaller(this.endpoint + `/calculate/${id}`, HTTPMethods.POST);
  }
  static memberCreate(data) {
    return mainCaller(`/rest/cart`, HTTPMethods.POST, data);
  }
  static update(id, data) {
    return mainCaller(this.endpoint + `/${id}`, HTTPMethods.PATCH, data);
  }
  static delete(id) {
    return mainCaller(this.endpoint + `/${id}`, HTTPMethods.DELETE);
  }
  static deleteMember({ member_id, cart_id }) {
    return mainCaller(
      `/rest/cart/member/${member_id}?cart_id=${cart_id}`,
      HTTPMethods.DELETE
    );
  }
  static deleteProduct(id) {
    return mainCaller(`/rest/cart/product/${id}`, HTTPMethods.DELETE);
  }
  static open(data) {
    return mainCaller(this.endpoint + `/open`, HTTPMethods.POST, data);
  }
  static join(data) {
    return mainCaller(`/rest/cart/open`, HTTPMethods.POST, data);
  }
  static statusChange(data) {
    return mainCaller(`/rest/cart/status/${data.uuid}`, HTTPMethods.POST, data);
  }
  static insertProduct(data) {
    return mainCaller(
      this.endpoint + `/insert-product`,
      HTTPMethods.POST,
      data
    );
  }
}
