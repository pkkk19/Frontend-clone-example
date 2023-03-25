import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class InviteApi {
  static endpoint = "/dashboard/user/shop/invitation/";
  static get(params) {
    return mainCaller(
      `/dashboard/user/invites/paginate`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static create(uuid) {
    return mainCaller(`${this.endpoint}${uuid}/link`, HTTPMethods.POST, {});
  }
}
