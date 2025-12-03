import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../config/Api';

export const fetchSellers = createAsyncThunk(
  'adminSeller/fetchSellers',
  async (status: string | null, { rejectWithValue }) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/api/admin/sellers', { params });
      console.log('Admin Sellers fetched:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch sellers");
    }
  }
);

export const updateSellerStatus = createAsyncThunk(
  'adminSeller/updateSellerStatus',
  async ({ id, status }: { id: number, status: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/admin/sellers/${id}/status`, null, {
        params: { status }
      });
      console.log('Admin Seller status updated:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

interface AdminSellerState {
  sellers: any[]
  loading: boolean
  error: any
}

const initialState: AdminSellerState = {
  sellers: [],
  loading: false,
  error: null
}

const adminSellerSlice = createSlice({
  name: 'adminSeller',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSellers.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(fetchSellers.fulfilled, (state, action) => {
      state.loading = false;
      state.sellers = action.payload;
    })
    builder.addCase(fetchSellers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    builder.addCase(updateSellerStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(updateSellerStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.sellers = state.sellers.map((seller) =>
        seller.id === action.payload.id ? action.payload : seller
      );
    })
    builder.addCase(updateSellerStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
  }
})

export default adminSellerSlice.reducer;
