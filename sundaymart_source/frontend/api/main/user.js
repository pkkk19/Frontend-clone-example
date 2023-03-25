import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";
export class UserApi {
  static endpoint = "/dashboard/user";

  static get(params) {
    return mainCaller(
      `${this.endpoint}/profile/show`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static update(data) {
    return mainCaller(`${this.endpoint}/profile/update`, HTTPMethods.PUT, data);
  }
  static passwordUpdate(data) {
    return mainCaller(
      `${this.endpoint}/profile/password/update`,
      HTTPMethods.POST,
      data
    );
  }
  static getWallet(params = {}) {
    return mainCaller(
      `${this.endpoint}/wallet/histories`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static firebaseTokenUpdate(data) {
    return mainCaller(
      `${this.endpoint}/profile/firebase/token/update`,
      HTTPMethods.POST,
      data
    );
  }
}
