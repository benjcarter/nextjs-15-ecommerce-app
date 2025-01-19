import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "@/state/store";
import type { CartProduct } from "@/types";

interface CartState {
  items: CartProduct[];
}

const initialState: CartState = {
  items: []
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      state.items = [...state.items, action.payload];
    },
    removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
      const newCart = [...state.items];

      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index >= 0) {
        newCart.splice(index, 1);
      } else {
        console.warn(
          `Can't remove product (id: ${action.payload.id}) as it's not in the cart!`
        );
      }

      state.items = newCart;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index >= 0) {
        state.items[index].quantity = action.payload.quantity;
      } else {
        console.warn(
          `Can't update quantity for product (id: ${action.payload.id}) as it's not in the cart!`
        );
      }
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export const selectItems = (state: RootState) => state.cart.items;
export const selectTotal = (state: RootState) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

export default cartSlice.reducer;
