import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import type { Order } from "../../types/orderTypes";

// Cursor pagination response type
interface CursorPageResponse<T> {
  content: T[];
  nextCursor: number | null;
  hasMore: boolean;
  size: number;
  totalElements: number;
}

interface SellerOrderState {
  orders: Order[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  nextCursor: number | null;
  hasMore: boolean;
  totalElements: number;
  currentStatus: string | null;
}

const initialState: SellerOrderState = {
  orders: [],
  loading: false,
  loadingMore: false,
  error: null,
  nextCursor: null,
  hasMore: false,
  totalElements: 0,
  currentStatus: null,
};

// Legacy fetch (for backward compatibility)
export const fetchSellerOrders = createAsyncThunk<Order[], string>(
  "sellerOrders/fetchSellerOrders",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/seller/orders', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      console.log("fetch seller orders", response.data)
      return response.data
    } catch (error: any) {
      console.error("Error fetching seller orders:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
)

// New cursor-based pagination fetch
export const fetchSellerOrdersPaginated = createAsyncThunk<
  CursorPageResponse<Order>,
  { jwt: string; cursor?: number | null; size?: number; status?: string | null }
>(
  "sellerOrders/fetchSellerOrdersPaginated",
  async ({ jwt, cursor, size = 20, status }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor.toString());
      params.append('size', size.toString());
      if (status) params.append('status', status);

      const response = await api.get(`/api/seller/orders/paginated?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("fetch seller orders paginated", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching seller orders:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

export const updateOrderStatus = createAsyncThunk<Order,
  {
    jwt: string,
    orderId: number,
    orderStatus: any
  }>(
    "sellerOrders/updateOrderStatus",
    async ({ jwt, orderId, orderStatus }, { rejectWithValue }) => {
      try {
        const response = await api.patch(`/api/seller/orders/${orderId}/status/${orderStatus}`, null, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        console.log("update order status", response.data)
        return response.data
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  )

export const deleteOrder = createAsyncThunk<any, { jwt: string, orderId: number }>(
  "sellerOrders/deleteOrder",
  async ({ jwt, orderId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/seller/orders/${orderId}/delete`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      console.log("delete order", response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orders = [];
      state.nextCursor = null;
      state.hasMore = false;
      state.currentStatus = null;
    },
    setCurrentStatus: (state, action: PayloadAction<string | null>) => {
      state.currentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Legacy fetch
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cursor pagination fetch
      .addCase(fetchSellerOrdersPaginated.pending, (state, action) => {
        // If cursor is null, it's a fresh fetch; otherwise it's loading more
        if (!action.meta.arg.cursor) {
          state.loading = true;
          state.orders = [];
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchSellerOrdersPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;

        // Append or replace based on whether it's first load
        if (action.meta.arg.cursor) {
          state.orders = [...state.orders, ...action.payload.content];
        } else {
          state.orders = action.payload.content;
        }

        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchSellerOrdersPaginated.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.id !== action.meta.arg.orderId
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetOrders, setCurrentStatus } = sellerOrderSlice.actions;
export default sellerOrderSlice.reducer;
