import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/Api";
import type { HomeCategory, HomeData } from "../../types/homeCategoryTypes";

export const createHomeCategories = createAsyncThunk<HomeData, HomeCategory[]>(
  "home/createHomeCategories",
  async (homeCategories, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/home/categories", homeCategories);
      console.log("home data", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
)

export const fetchHomeCategories = createAsyncThunk<HomeCategory[]>(
  "home/fetchHomeCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/home-categories");
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch home categories";
      return rejectWithValue(errorMessage);
    }
  }
)

interface HomeState {
  homePageData: HomeData | null;
  gridCategories: HomeCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  homePageData: null,
  gridCategories: [],
  loading: false,
  error: null,
}

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createHomeCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(createHomeCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.homePageData = action.payload;
    })
    builder.addCase(createHomeCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create home categories";
    })

    // Fetch all home categories
    builder.addCase(fetchHomeCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    builder.addCase(fetchHomeCategories.fulfilled, (state, action) => {
      state.loading = false;
      // Filter only GRID categories
      state.gridCategories = action.payload.filter(cat => cat.section === 'GRID');
    })
    builder.addCase(fetchHomeCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch home categories";
    })
  },
})

export default homeSlice.reducer;
