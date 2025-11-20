import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Cart, CartItem } from "../../types/cartTypes";
import { sumCartItemMsrpPrice, sumCartItemSellingPrice } from "../../Util/sumCartItemMsrpPrice";
import { applyCoupon } from "./couponSlice";

interface CartState {
  cart: Cart | null,
  loading: boolean,
  error: string | null
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null
}

const API_URL = "/api/cart";

export const fetchUserCart = createAsyncThunk<Cart, string>(
  "cart/fetchUserCart",
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      console.log('Cart fetched', response.data)
      return response.data
    } catch (error: any) {
      console.log('Cart fetched error', error.response)
      return rejectWithValue("Failed to fetch user cart")
    }
  })

interface AddItemRequest {
  productId: number | undefined,
  quantity: number,
}

export const addItemToCart = createAsyncThunk<CartItem, {
  jwt: string | null,
  request: AddItemRequest
}>(
  "cart/addItemToCart",
  async ({ jwt, request }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/add`, request, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      console.log('Item added to cart', response.data)
      return response.data
    } catch (error: any) {
      console.log('Item added to cart error', error.response)
      return rejectWithValue("Failed to add item to cart")
    }
  })

export const deleteCartItem = createAsyncThunk<any, {
  jwt: string,
  cartItemId: number
}>(
  "cart/deleteCartItem",
  async ({ jwt, cartItemId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/item/${cartItemId}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      console.log('Item deleted from cart', response.data)
      return response.data
    } catch (error: any) {
      console.log('Item deleted from cart error', error.response)
      return rejectWithValue(error.response.data.message || "Failed to delete item from cart")
    }
  })

export const updateCartItem = createAsyncThunk<any, {
  jwt: string | null, cartItemId: number, cartItem: any
}>(
  "cart/updateCartItem",
  async ({ jwt, cartItemId, cartItem }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/item/${cartItemId}`, cartItem, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      console.log('Item updated in cart', response.data)
      return response.data
    } catch (error: any) {
      console.log('Item updated in cart error', error.response)
      return rejectWithValue(error.response.data.message || "Failed to update item in cart")
    }
  })

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.cart = action.payload
        state.loading = false
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // --- ADD ITEM ---
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        if (state.cart) {
          // ✅ Dùng cartItemsInBag
          if (!state.cart.cartItemsInBag) {
            state.cart.cartItemsInBag = [];
          }
          state.cart.cartItemsInBag.push(action.payload)
        }
        state.loading = false
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // --- DELETE ITEM ---
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          // ✅ Dùng cartItemsInBag
          state.cart.cartItemsInBag = state.cart.cartItemsInBag.filter(
            (item: CartItem) => item.id !== action.meta.arg.cartItemId
          )

          // Tính toán lại giá
          const msrpPricee = sumCartItemMsrpPrice(state.cart.cartItemsInBag || [])
          const sellingPrice = sumCartItemSellingPrice(state.cart.cartItemsInBag || [])
          state.cart.totalSellingPrice = sellingPrice
          state.cart.totalMsrpPrice = msrpPricee
        }
        state.loading = false
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // --- UPDATE ITEM ---
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          // ✅ Dùng cartItemsInBag
          const index = state.cart.cartItemsInBag.findIndex(
            (item: CartItem) => item.id === action.meta.arg.cartItemId
          )

          if (index !== -1) {
            // Cập nhật item
            state.cart.cartItemsInBag[index] = {
              ...state.cart.cartItemsInBag[index],
              ...action.payload
            }
          }

          // Tính toán lại giá
          const msrpPricee = sumCartItemMsrpPrice(state.cart.cartItemsInBag || [])
          const sellingPrice = sumCartItemSellingPrice(state.cart.cartItemsInBag || [])

          state.cart.totalSellingPrice = sellingPrice
          state.cart.totalMsrpPrice = msrpPricee
        }
        state.loading = false
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Apply Coupon
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
      })
  }
})

export default cartSlice.reducer
export const { resetCartState } = cartSlice.actions