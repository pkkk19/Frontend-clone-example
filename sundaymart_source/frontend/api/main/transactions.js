import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class TransactionsApi {
  static endpoint = "/payments/order/";

  static create(id, data) {
    return mainCaller(
      `${this.endpoint}${id}/transactions`,
      HTTPMethods.POST,
      data
    );
  }
}
