import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../config/Api"
import type { Transaction } from "../../types/transactionTypes"

interface TransactionState {
  transactions: Transaction[]
  transaction: Transaction | null
  loading: boolean
  error: string | null
}

const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  loading: false,
  error: null
}

export const fetchTransactionsBySeler = createAsyncThunk<Transaction[], string, { rejectValue: string }>(
  'transactions/fetchTransactionsBySeler',
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/transactions/seller`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      console.log(response.data)
      return response.data
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue("Failed to fetch transactions")
    }
  }
)

export const payoutSeller = createAsyncThunk<any, string>(
  'transactions/payoutSeller',
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/transactions/payout`, {}, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Payout failed");
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactionsBySeler.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchTransactionsBySeler.fulfilled, (state, action) => {
      state.loading = false
      state.transactions = action.payload
    })
    builder.addCase(fetchTransactionsBySeler.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    builder.addCase(payoutSeller.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(payoutSeller.fulfilled, (state, action) => {
      state.loading = false
      state.transactions = action.payload
    })
    builder.addCase(payoutSeller.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
}
)

export default transactionSlice.reducer


