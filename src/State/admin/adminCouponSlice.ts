import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../config/Api";
import type { Coupon, CouponState } from "../../types/couponTypes";

const API_URL = "/api/coupons"

// Fetch all coupons
export const fetchAllCoupons = createAsyncThunk<
  Coupon[],
  string,
  { rejectValue: string }
>(
  "coupon/fetchAllCoupons",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch coupons")
    }
  }
)

// Create coupon
export const createCoupon = createAsyncThunk<
  Coupon,
  { coupon: any; jwt: string },
  { rejectValue: string }
>(
  "coupon/createCoupon",
  async ({ coupon, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/admin/create`, coupon, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create coupon")
    }
  }
)

// Update coupon
export const updateCoupon = createAsyncThunk<
  Coupon,
  { id: number; coupon: any; jwt: string },
  { rejectValue: string }
>(
  "coupon/updateCoupon",
  async ({ id, coupon, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/admin/update/${id}`, coupon, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update coupon")
    }
  }
)

// Toggle coupon active status
export const toggleCouponActive = createAsyncThunk<
  Coupon,
  { id: number; jwt: string },
  { rejectValue: string }
>(
  "coupon/toggleCouponActive",
  async ({ id, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/admin/${id}/toggle-active`, null, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to toggle coupon status")
    }
  }
)

// Delete coupon
export const deleteCoupon = createAsyncThunk<
  number,
  { id: number; jwt: string },
  { rejectValue: string }
>(
  "coupon/deleteCoupon",
  async ({ id, jwt }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete coupon")
    }
  }
)

const initialState: CouponState = {
  coupons: [],
  cart: null,
  loading: false,
  error: null,
  couponCreated: false,
  couponApplied: false
}

const adminCouponSlice = createSlice({
  name: "adminCoupon",
  initialState,
  reducers: {
    resetCouponState: (state) => {
      state.couponCreated = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch all coupons
    builder.addCase(fetchAllCoupons.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchAllCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
      state.loading = false
      state.coupons = action.payload
    })
    builder.addCase(fetchAllCoupons.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to fetch coupons"
    })

    // Create coupon
    builder.addCase(createCoupon.pending, (state) => {
      state.loading = true
      state.error = null
      state.couponCreated = false
    })
    builder.addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
      state.loading = false
      state.coupons.push(action.payload)
      state.couponCreated = true
    })
    builder.addCase(createCoupon.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to create coupon"
    })

    // Update coupon
    builder.addCase(updateCoupon.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
      state.loading = false
      const index = state.coupons.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.coupons[index] = action.payload
      }
    })
    builder.addCase(updateCoupon.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to update coupon"
    })

    // Toggle active
    builder.addCase(toggleCouponActive.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(toggleCouponActive.fulfilled, (state, action: PayloadAction<Coupon>) => {
      state.loading = false
      const index = state.coupons.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.coupons[index] = action.payload
      }
    })
    builder.addCase(toggleCouponActive.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to toggle coupon status"
    })

    // Delete coupon
    builder.addCase(deleteCoupon.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false
      state.coupons = state.coupons.filter(c => c.id !== action.payload)
    })
    builder.addCase(deleteCoupon.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || "Failed to delete coupon"
    })
  }
})

export const { resetCouponState } = adminCouponSlice.actions
export default adminCouponSlice.reducer