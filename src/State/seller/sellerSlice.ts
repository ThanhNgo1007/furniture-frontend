/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../config/Api'

export const fetchSellerProfile = createAsyncThunk(
  '/sellers/fetchSellerProfile',
  async (jwt: string, { rejectWithValue }) => {
    try {
      const response = await api.get('/sellers/profile', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      console.log('fetch seller profile', response.data)
      return response.data
    } catch (error: any) {
      console.log('error', error)
      // ✅ THÊM DÒNG NÀY: Báo cho Redux biết là có lỗi để nó chạy vào case .rejected
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

interface SellerState {
  seller: any[]
  selectedSeller: any
  profile: any
  report: any
  loading: boolean
  error: any
}

const initialState: SellerState = {
  seller: [],
  selectedSeller: null,
  profile: null,
  report: null,
  loading: false,
  error: null
}

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSellerProfile.pending, state => {
        state.loading = true
        // Không nên reset profile về null ở đây để tránh UI bị giật khi đang fetch lại
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null // Xóa lỗi nếu thành công
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload // Lưu thông tin lỗi
        // Có thể set profile = null ở đây nếu muốn logout khi token hết hạn
      })
  }
})

export default sellerSlice.reducer
