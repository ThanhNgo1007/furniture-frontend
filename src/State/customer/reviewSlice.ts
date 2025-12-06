import { createAsyncThunk, createSlice, type PayloadAction, } from '@reduxjs/toolkit';
import { api } from '../../config/Api';

export interface Review {
  id: number;
  reviewText: string;
  rating: number;
  productImages: string[];
  user: {
    id: number;
    fullName: string;
  };
  product: {
    id: number;
  };
  orderId?: number;
  createdAt: string;
}

export interface CreateReviewRequest {
  reviewText: string;
  reviewRating: number;
  productImages?: string[];
  orderId?: number;
}

interface ReviewState {
  reviews: Review[];
  productReviews: Record<number, Review[]>; // Store reviews by product ID
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReviewState = {
  reviews: [],
  productReviews: {},
  loading: false,
  error: null,
  success: false,
};

// Create review
export const createReview = createAsyncThunk<Review, { productId: number; request: CreateReviewRequest }>(
  'review/createReview',
  async ({ productId, request }, { rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const response = await api.post(`/api/products/${productId}/reviews`, request, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

// Fetch product reviews
export const fetchProductReviews = createAsyncThunk<
  { productId: number; reviews: Review[] }, // Return object with productId
  number
>(
  'review/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${productId}/reviews`);
      return { productId, reviews: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.success = true;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action: PayloadAction<{ productId: number; reviews: Review[] }>) => {
        state.loading = false;
        state.reviews = action.payload.reviews; // Keep for backward compatibility
        state.productReviews[action.payload.productId] = action.payload.reviews; // Store by ID
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
