/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../config/Api';

// Types
export interface AdminDashboardData {
  summary: {
    totalRevenue: number;
    platformCommission: number;
    totalOrders: number;
    totalCustomers: number;
    totalSellers: number;
    totalProducts: number;
    ordersToday: number;
    revenueToday: number;
  };
  orderStats: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalProcessed: number;
    cancelRate: number;
    successRate: number;
    avgOrderValue: number;
  };
  dailyRevenue: Record<string, number>;
  dailyOrders: Record<string, number>;
  topSellers: Array<{
    rank: number;
    sellerId: number;
    sellerName: string;
    revenue: number;
    orderCount: number;
  }>;
  paymentBreakdown: {
    vnpay: { count: number; amount: number };
    cod: { count: number; amount: number };
    vnpayPercent: number;
    codPercent: number;
  };
  userActivity: {
    pendingSellers: number;
    newCustomersThisMonth: number;
    newSellersThisMonth: number;
  };
}

interface AdminDashboardState {
  data: AdminDashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminDashboardState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk
export const fetchAdminDashboard = createAsyncThunk(
  'adminDashboard/fetchAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/admin/dashboard');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin dashboard:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin dashboard');
    }
  }
);

// Slice
const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    clearAdminDashboard: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
