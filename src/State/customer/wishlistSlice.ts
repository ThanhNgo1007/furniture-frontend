import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Wishlist, WishlistState } from "../../types/wishlistTypes";

const initialState: WishlistState = {
  wishlist: null,
  loading: false,
  error: null
};

export const getWishlistByUserId = createAsyncThunk(
  "wishlist/getWishlistByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/wishlist`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
      });
      console.log("wishlist fetch", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      return rejectWithValue(error.response?.data.message || "Failed to fetch wishlist");
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  "wishlist/addProductToWishlist",
  async (req: { jwt: string; productId: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/wishlist/add-product/${req.productId}`, {}, {
        headers: {
          Authorization: `Bearer ${req.jwt}`
        },
      });
      console.log("product added to wishlist", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      return rejectWithValue(error.response?.data.message || "Failed to add product to wishlist");
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk(
  "wishlist/removeProductFromWishlist",
  async ({ productId }: { productId: number }, { rejectWithValue }) => {
    try {
      // Gọi endpoint remove-product mới tạo
      const response = await api.put(`/api/wishlist/remove-product/${productId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
      });
      console.log("product removed from wishlist", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      return rejectWithValue(error.response?.data.message || "Failed to remove product");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      state.wishlist = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getWishlistByUserId.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(getWishlistByUserId.fulfilled, (state, action: PayloadAction<Wishlist>) => {
        state.wishlist = action.payload;
        state.loading = false;

      })
      .addCase(getWishlistByUserId.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProductToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action: PayloadAction<Wishlist>) => {
        state.wishlist = action.payload;
        state.loading = false;
      })
      .addCase(addProductToWishlist.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeProductFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action: PayloadAction<Wishlist>) => {
        state.wishlist = action.payload;
        state.loading = false;
      })
      .addCase(removeProductFromWishlist.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export default wishlistSlice.reducer;
export const { resetWishlistState } = wishlistSlice.actions;
