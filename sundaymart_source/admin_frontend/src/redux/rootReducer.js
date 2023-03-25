import cart from './slices/cart';
import formLang from './slices/formLang';
import menu from './slices/menu';
import order from './slices/order';
import category from './slices/category';
import brand from './slices/brand';
import banner from './slices/banner';
import product from './slices/product';
import shop from './slices/shop';
import unit from './slices/unit';
import orders from './slices/orders';
import currency from './slices/currency';
import discount from './slices/discount';
import delivery from './slices/delivery';
import blog from './slices/blog';
import notification from './slices/notification';
import deliveryman from './slices/deliveryman';
import user from './slices/user';
import extraGroup from './slices/extraGroup';
import extraValue from './slices/extraValue';
import payment from './slices/payment';
import invite from './slices/invite';
import faq from './slices/faq';
import client from './slices/client';
import transaction from './slices/transaction';
import allShops from './slices/allShops';
import auth from './slices/auth';
import backup from './slices/backup';
import productReview from './slices/productReview';
import orderReview from './slices/orderReview';
import globalSettings from './slices/globalSettings';
import chat from './slices/chat';
import statisticsCount from './slices/statistics/count';
import statisticsSum from './slices/statistics/sum';
import topCustomers from './slices/statistics/topCustomers';
import topProducts from './slices/statistics/topProducts';
import orderCounts from './slices/statistics/orderCounts';
import orderSales from './slices/statistics/orderSales';
import myShop from './slices/myShop';
import wallet from './slices/wallet';
import payoutRequests from './slices/payoutRequests';
import look from './slices/look';
import theme from './slices/theme';
import point from './slices/point';
import role from './slices/role';
import recipeCategory from './slices/recipeCategory';
import recipe from './slices/recipe';
import branch from './slices/branch';
import group from './slices/group';
import bonus from './slices/product-bonus';
import shopBonus from './slices/shop-bonus';
import languages from './slices/languages';

const rootReducer = {
  languages,
  cart,
  menu,
  formLang,
  order,
  category,
  brand,
  banner,
  product,
  shop,
  unit,
  orders,
  currency,
  discount,
  delivery,
  blog,
  notification,
  deliveryman,
  user,
  extraGroup,
  extraValue,
  payment,
  invite,
  faq,
  client,
  transaction,
  allShops,
  auth,
  backup,
  productReview,
  orderReview,
  globalSettings,
  chat,
  statisticsCount,
  statisticsSum,
  topProducts,
  topCustomers,
  orderCounts,
  orderSales,
  myShop,
  wallet,
  payoutRequests,
  look,
  theme,
  point,
  role,
  recipeCategory,
  recipe,
  branch,
  group,
  bonus,
  shopBonus,
};

export default rootReducer;
