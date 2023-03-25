import cart from "./slices/cart";
import stores from "./slices/stores";
import banners from "./slices/banner";
import category from "./slices/category";
import savedProduct from "./slices/savedProduct";
import savedStore from "./slices/savedStore";
import viewedProduct from "./slices/viewed-product";
import notification from "./slices/viewed-notification";
import savedAddress from "./slices/savedAddress";
import user from "./slices/user";
import chat from "./slices/chat";
import settings from "./slices/settings";
import mainState from "./slices/mainState";
const rootReducer = {
  user,
  cart,
  stores,
  savedProduct,
  savedStore,
  viewedProduct,
  savedAddress,
  category,
  banners,
  notification,
  chat,
  settings,
  mainState,
};

export default rootReducer;
