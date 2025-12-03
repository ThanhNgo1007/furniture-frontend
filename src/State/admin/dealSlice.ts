import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../config/Api";
import type { ApiResponse, Deal, DealState } from "../../types/dealTypes";

const initialState: DealState = {
  deals: [],
  loading: false,
  error: null,
  dealCreated: false,
  dealUpdated: false
}

export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/deals');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch deals");
    }
  }
);

export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (deal: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/deal`, deal, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      console.log("create deal", response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create deal")
    }
  }
)

export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async ({ id, deal }: { id: number; deal: any }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/deals/${id}`, deal, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update deal");
    }
  }
);

export const deleteDeal = createAsyncThunk<ApiResponse, number>(
  "deals/deleteDeal",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/deals/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      console.log("delete deal", response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete deal")
    }
  }
)

export const bulkDeleteDeals = createAsyncThunk(
  "deals/bulkDeleteDeals",
  async (ids: number[], { rejectWithValue }) => {
    try {
      const response = await api.delete('/admin/deals/bulk', {
        data: ids,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      console.log("bulk delete deals", response.data);
      return { ids, response: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to bulk delete deals");
    }
  }
)

const dealSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    resetDealStatus: (state) => {
      state.dealCreated = false;
      state.dealUpdated = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Deals
    builder.addCase(fetchDeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeals.fulfilled, (state, action) => {
      state.loading = false;
      state.deals = action.payload;
    });
    builder.addCase(fetchDeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Deal
    builder.addCase(createDeal.pending, (state) => {
      state.loading = true
      state.error = null
      state.dealCreated = false
    })
    builder.addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
      state.dealCreated = true
      state.loading = false
      state.deals.push(action.payload)
    })
    builder.addCase(createDeal.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Update Deal
    builder.addCase(updateDeal.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.dealUpdated = false;
    });
    builder.addCase(updateDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
      state.dealUpdated = true;
      state.loading = false;
      const index = state.deals.findIndex((deal) => deal.id === action.payload.id);
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    });
    builder.addCase(updateDeal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Deal
    builder.addCase(deleteDeal.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteDeal.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.status) {
        state.deals = state.deals.filter((deal) => deal.id !== action.meta.arg)
      }
    })
    builder.addCase(deleteDeal.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Bulk Delete Deals
    builder.addCase(bulkDeleteDeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(bulkDeleteDeals.fulfilled, (state, action) => {
      state.loading = false;
      state.deals = state.deals.filter((deal) => !action.payload.ids.includes(deal.id!));
    })
    builder.addCase(bulkDeleteDeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
  }
})

export const { resetDealStatus } = dealSlice.actions;
export default dealSlice.reducer
