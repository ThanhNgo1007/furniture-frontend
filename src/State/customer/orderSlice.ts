import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { api } from "../../config/Api"
import type { Order, OrderItem, OrderState } from "../../types/orderTypes"
import type { Address } from "../../types/userTypes"

const initialState: OrderState = {
  orders: [],
  orderItem: null,
  currentOrder: null,
  paymentOrder: null,
  loading: false,
  error: null,
  orderCanceled: false,
}

const API_URL = "/api/orders"

//Fetch user order history
export const fetchUserOrderHistory = createAsyncThunk<Order[], string>(
  "orders/fetchUserOrderHistory",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get<Order[]>(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error || "Failed to fetch user order history");
    }
  }
)

export const fetchOrderById = createAsyncThunk<Order, { orderId: number, jwt: string }
>(
  "orders/fetchOrderById",
  async ({ orderId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get<Order>(`${API_URL}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("order fetch", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue("Failed to fetch order by id");
    }
  }
)

export const createOrder = createAsyncThunk<
  any,
  { address: Address, jwt: string, paymentGateway: string }
>(
  "orders/createOrder",
  async ({ address, jwt, paymentGateway }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL,
        address,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            paymentMethod: paymentGateway,
          }
        });
      console.log("order created", response.data);
      if (response.data.payment_link_url) {
        window.location.href = response.data.payment_link_url;
      }
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue("Failed to create order");
    }
  }
)

export const fetchOrderItemById = createAsyncThunk<OrderItem,
  { orderItemId: number, jwt: string }
>(
  "orders/fetchOrderItemById",
  async ({ orderItemId, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get<OrderItem>(`${API_URL}/item/${orderItemId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("order item fetch", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue("Failed to fetch order item by id");
    }
  }
)

//Payment success
export const paymentSuccess = createAsyncThunk<any,
  // Thêm vnp_ResponseCode và vnp_TransactionStatus vào payload
  { paymentId: string, jwt: string, paymentLinkId: string, vnp_ResponseCode?: string, vnp_TransactionStatus?: string },
  { rejectValue: string }
>(
  "orders/paymentSuccess",
  async ({ paymentId, jwt, paymentLinkId, vnp_ResponseCode, vnp_TransactionStatus }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payment/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            paymentLinkId,
            // QUAN TRỌNG: Gửi mã phản hồi xuống server
            vnp_ResponseCode: vnp_ResponseCode,
            vnp_TransactionStatus: vnp_TransactionStatus
          }
        });
      console.log("payment processed", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      return rejectWithValue("Failed to payment success");
    }
  }
)

export const cancelOrder = createAsyncThunk<Order, any
>(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        }
      });
      console.log("order canceled", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error", error.response);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to cancel order");
    }
  }
)

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserOrderHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.orderCanceled = false;
    })
    builder.addCase(fetchUserOrderHistory.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
    })
    builder.addCase(fetchUserOrderHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    //Fetch order by id
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
      state.loading = false;
    })
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    //Create new order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
      state.paymentOrder = action.payload;
      state.loading = false;
    })
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    //Fetch order item by id
    builder.addCase(fetchOrderItemById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(fetchOrderItemById.fulfilled, (state, action) => {
      state.loading = false;
      state.orderItem = action.payload;
    })
    builder.addCase(fetchOrderItemById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    //Payment success
    builder.addCase(paymentSuccess.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(paymentSuccess.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      console.log("payment success", action.payload);
    })
    builder.addCase(paymentSuccess.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    //Cancel order
    builder.addCase(cancelOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.orderCanceled = false;
    })
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = state.orders.map(order => order.id === action.payload.id ? action.payload : order);
      state.orderCanceled = true;
      state.currentOrder = action.payload;
    })
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
  },
})

export default orderSlice.reducer;











