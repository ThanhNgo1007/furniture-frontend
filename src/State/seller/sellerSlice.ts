/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../config/Api';

export const fetchSellerProfile = createAsyncThunk(
  'seller/fetchSellerProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/sellers/profile');

      console.log('Seller profile fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching seller profile:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch seller profile');
    }
  }
);

interface SellerState {
  seller: any  // ✅ FIXED: Changed from any[] to any (seller profile is an object, not array)
  selectedSeller: any
  profile: any
  report: any
  loading: boolean
  error: any
}

const initialState: SellerState = {
  seller: null,  // ✅ FIXED: Changed from [] to null
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
    builder.addCase(fetchSellerProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(fetchSellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.seller = action.payload;
      state.error = null;
    })
    builder.addCase(fetchSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      console.error("Fetch seller profile failed:", action.payload);
      // Không clear seller data ngay, để interceptor có cơ hội refresh
    })
  }
})

export default sellerSlice.reducer
