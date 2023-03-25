import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartData: {},
  memberData: {},
  cartItems: [],
  generalData: [],
  orderedProduct: [],
  cartTotalAmount: 0,
  cartTotalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData(state, action) {
      state.cartData = action.payload;
    },
    setMember(state, action) {
      state.memberData = action.payload;
    },
    addToCart(state, action) {
      const findedIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (findedIndex >= 0) {
        state.cartItems[findedIndex] = {
          ...state.cartItems[findedIndex],
          qty: state.cartItems[findedIndex].qty + 1,
        };
      } else {
        let tempProductItem = {
          ...action.payload,
          qty: action.payload.min_qty,
        };
        state.cartItems.push(tempProductItem);
      }
    },
    setToCart(state, action) {
      state.cartItems = action.payload;
    },
    decreaseCart(state, action) {
      const findedIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.cartItems[findedIndex]?.qty > action.payload.min_qty) {
        state.cartItems[findedIndex].qty -= 1;
      } else if (state.cartItems[findedIndex].qty === action.payload.min_qty) {
        const nextCartItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
        state.cartItems = nextCartItems;
      }
    },
    removeFromCart(state, action) {
      state.cartItems.map((cartItem) => {
        if (cartItem.id === action.payload.id) {
          const nextCartItems = state.cartItems.filter(
            (item) => item.id !== action.payload.id
          );
          state.cartItems = nextCartItems;
        }
        return state;
      });
    },
    getTotals(state, action) {
      if (action.payload) {
        let { total, quantity } = state.cartItems
          .filter((item) => item.shop_id === action.payload)
          .reduce(
            (cartTotal, cartItem) => {
              const { qty, price, discount } = cartItem;
              let itemTotal = 0;
              if (discount) {
                itemTotal = (price - discount) * qty;
              } else {
                itemTotal = price * qty;
              }
              cartTotal.total += itemTotal;
              cartTotal.quantity += qty;
              return cartTotal;
            },
            {
              total: 0,
              quantity: 0,
            }
          );
        total = parseFloat(total.toFixed(2));
        state.cartTotalQuantity = quantity;
        state.cartTotalAmount = total;
      }
    },
    clearCart(state, action) {
      const newCartItems = state.cartItems.filter(
        (item) => item.shop_id !== action.payload
      );
      state.cartItems = newCartItems;
      state.generalData = [];
      state.orderedProduct = [];
      state.cartTotalAmount = 0;
      state.cartTotalQuantity = 0;
      state.cartData = {};
      state.memberData = {};
    },
    clearAllCart(state, action) {
      state.cartItems = [];
      state.generalData = [];
      state.orderedProduct = [];
      state.cartTotalAmount = 0;
      state.cartTotalQuantity = 0;
      state.cartData = {};
      state.memberData = {};
    },
    addToOrderedProduct(state, action) {
      const currentShopProduct = state.cartItems.filter(
        (item) => item.shop_id === action.payload
      );
      const nextArray = [];
      let total_price = 0;
      let total_tax = 0;
      currentShopProduct.forEach((element) => {
        if (element.discount) {
          total_price = (element.price - element.discount) * element.qty;
        } else {
          total_price = element.price * element.qty;
        }
        total_tax = (total_price * element.tax) / 100;
        nextArray.push({
          shop_product_id: element.id,
          price: element.price,
          qty: element.qty,
          tax: total_tax,
          discount: element.discount ? element.discount : 0,
          total_price,
        });
      });
      state.orderedProduct = nextArray;
    },
    addToGeneralData(state, action) {
      const findedIndex = state.generalData.findIndex(
        (item) => item.shop_id === action.payload.shop_id
      );
      if (findedIndex >= 0) {
        state.generalData[findedIndex] = action.payload;
      } else {
        state.generalData.push(action.payload);
      }
    },
  },
});
export const {
  addToCart,
  decreaseCart,
  removeFromCart,
  getTotals,
  clearCart,
  addToOrderedProduct,
  addToGeneralData,
  setCartData,
  setMember,
  setToCart,
  clearAllCart,
} = cartSlice.actions;

export default cartSlice.reducer;
