import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class TicketApi {
  static endpoint = "/dashboard/user/tickets";

  static get(params) {
    return mainCaller(
      `${this.endpoint}/paginate`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static getId(id) {
    return mainCaller(`${this.endpoint}/${id}`, HTTPMethods.GET);
  }
  static create(data) {
    return mainCaller(this.endpoint, HTTPMethods.POST, data);
  }
}
