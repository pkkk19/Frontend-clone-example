import { toast } from "react-toastify";
import { CartApi } from "../api/main/cart";

export const deteleOrderCart = (id) => {
  CartApi.delete(id)
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message);
    });
};
export const deleteOrderProduct = (id) => {
  CartApi.deleteProduct(id)
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message);
    });
};
