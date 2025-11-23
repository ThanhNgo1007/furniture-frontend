/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../config/Api'

// export const sellerLogin = createAsyncThunk<any, any>(
//   '/sellerAuth/sellerLogin',
//   async (loginRequest, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/sellers/login', loginRequest)
//       console.log('login otp', response.data)
//       const jwt = response.data.jwt
//       localStorage.setItem('jwt', jwt)
//     } catch (error) {
//       console.log('error', error)
//     }
//   }
// )

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
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to login")
    }
  }
)
