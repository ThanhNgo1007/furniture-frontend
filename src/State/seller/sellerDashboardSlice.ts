import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../config/Api';

interface DashboardState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialState: DashboardState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchSellerDashboard = createAsyncThunk(
  'sellerDashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/seller/dashboard');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const sellerDashboardSlice = createSlice({
  name: 'sellerDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSellerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sellerDashboardSlice.reducer;
