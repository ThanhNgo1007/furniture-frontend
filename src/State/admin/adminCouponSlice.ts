import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/Api";
import type { Coupon } from "../../types/couponTypes";

const API_URL = "/api/coupons"

export const createCoupon = createAsyncThunk<
  Coupon,
  { coupon: any; jwt: string },
  { rejectValue: string }
>(
  "coupon/createCoupon",
  async ({ coupon, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/admin/create`, coupon, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      console.log("create coupon", response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create coupon")
    }
  }
)