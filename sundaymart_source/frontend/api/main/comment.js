import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class CommentApi {
  static endpoint = "/rest/products/review";

  static create(data, uuid) {
    return mainCaller(`${this.endpoint}/${uuid}`, HTTPMethods.POST, data);
  }
}
