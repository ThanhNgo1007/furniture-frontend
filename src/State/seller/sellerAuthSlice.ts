/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../config/Api'

// Action Đăng ký Seller
export const registerSeller = createAsyncThunk<any, any>(
  '/sellerAuth/registerSeller',
  async (sellerData, { rejectWithValue }) => {
    try {
      // Gọi endpoint POST /sellers
      const response = await api.post('/sellers', sellerData)
      console.log('Seller registered:', response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Registration failed')
    }
  }
)

// Action Xác thực Email (Verify)
export const verifySellerEmail = createAsyncThunk<any, string>(
  '/sellerAuth/verifySellerEmail',
  async (otp, { rejectWithValue }) => {
    try {
      // Gọi endpoint PATCH /sellers/verify/{otp}
      const response = await api.patch(`/sellers/verify/${otp}`)
      console.log('Email verified:', response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Verification failed')
    }
  }
)

// Action kiểm tra trạng thái xác thực (Polling)
export const checkSellerStatus = createAsyncThunk<any, string>(
  '/sellerAuth/checkStatus',
  async (email, { rejectWithValue }) => {
    try {
      // Gọi API GET /sellers/account-status?email=...
      const response = await api.get(`/sellers/account-status?email=${email}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Check status failed');
    }
  }
);


export const sellerLogin = createAsyncThunk<any, any>(
  '/sellerAuth/sellerLogin',
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/sellers/login', loginRequest)

      if (!response.data.jwt) {
        // Nếu server không trả jwt → coi như login thất bại
        return rejectWithValue('Invalid OTP or Email')
      }

      const jwt = response.data.jwt
      localStorage.setItem('jwt', jwt)

      // ✅ THÊM: Lưu refreshToken giống như user login
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to login")
    }
  }
)
