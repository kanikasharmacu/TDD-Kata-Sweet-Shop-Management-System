import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sweet } from '../../types/sweet';

interface CartItem extends Sweet {
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const initialState: CartState = {
  cartItems: [],
  shippingAddress: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  paymentMethod: 'PayPal',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: Sweet; qty: number }>) => {
      const { item, qty } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        state.cartItems = [...state.cartItems, { ...item, qty }];
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
    },
    saveShippingAddress: (state, action: PayloadAction<CartState['shippingAddress']>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    calculatePrices: (state) => {
      const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      
      state.itemsPrice = itemsPrice;
      state.shippingPrice = itemsPrice > 100 ? 0 : 10;
      state.taxPrice = Number((0.15 * itemsPrice).toFixed(2));
      state.totalPrice = Number(
        (itemsPrice + state.shippingPrice + state.taxPrice).toFixed(2)
      );
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    loadCart: (state) => {
      const cartItems = localStorage.getItem('cartItems');
      const shippingAddress = localStorage.getItem('shippingAddress');
      const paymentMethod = localStorage.getItem('paymentMethod');
      
      if (cartItems) {
        state.cartItems = JSON.parse(cartItems);
      }
      
      if (shippingAddress) {
        state.shippingAddress = JSON.parse(shippingAddress);
      }
      
      if (paymentMethod) {
        state.paymentMethod = paymentMethod;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  calculatePrices,
  clearCart,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;
