/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../config/Api';
import type { Product } from '../../types/ProductTypes';

const API_URL = '/products'

// Định nghĩa kiểu dữ liệu trả về cho phân trang (khớp với Page<Product> của Spring Boot)
interface ProductsResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}

export const fetchProductById = createAsyncThunk<Product, any>(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${productId}`)
      console.log('Product details data', response.data)
      return response.data
    } catch (error: any) {
      console.log('error:', error)
      // SỬA LỖI: Phải có return rejectWithValue
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const searchProduct = createAsyncThunk<Product[], string>(
  'products/searchProduct',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/search`, {
        params: { query }
      })
      console.log('search product data:', response.data)
      return response.data
    } catch (error: any) {
      console.log('error:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchAllProducts = createAsyncThunk<ProductsResponse, any>(
  'products/fetchAllProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}`, {
        params: {
          ...params,
          pageNumber: params.pageNumber || 0
        }
      })
      console.log('All product data:', response.data)
      return response.data
    } catch (error: any) {
      console.log('error:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

interface ProductState {
  product: Product | null
  products: Product[]
  totalPages: number
  loading: boolean
  error: string | null
  searchProduct: Product[]
  bestSellerIds: number[] // Track best seller product IDs
}

const initialState: ProductState = {
  product: null,
  products: [],
  totalPages: 1,
  loading: false,
  error: null,
  searchProduct: [],
  bestSellerIds: []
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setBestSellers: (state, action: PayloadAction<number[]>) => {
      state.bestSellerIds = action.payload;
      // Persist to localStorage
      localStorage.setItem('bestSellerIds', JSON.stringify(action.payload));
    },
    loadBestSellers: (state) => {
      // Load from localStorage on app init
      const stored = localStorage.getItem('bestSellerIds');
      if (stored) {
        state.bestSellerIds = JSON.parse(stored);
      }
    }
  },
  extraReducers: builder => {
    // Fetch Product By ID
    builder.addCase(fetchProductById.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false
      state.product = action.payload
    })
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch All Products
    builder.addCase(fetchAllProducts.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<ProductsResponse>) => {
      state.loading = false
      // Cập nhật danh sách sản phẩm
      state.products = action.payload.content
      // SỬA LỖI: Cập nhật tổng số trang để Pagination hoạt động
      state.totalPages = action.payload.totalPages
    })
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Search Product
    builder.addCase(searchProduct.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(searchProduct.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.loading = false
      state.searchProduct = action.payload
    })
    builder.addCase(searchProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export const { setBestSellers, loadBestSellers } = productSlice.actions
export default productSlice.reducer