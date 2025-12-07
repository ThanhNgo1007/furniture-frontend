/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../config/Api'
import type { Product } from '../../types/ProductTypes'

export const fetchSellerProducts = createAsyncThunk<Product[], any>(
  '/sellerProduct/fetchSellerProducts',
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get('/sellers/products', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      const data = response.data
      console.log('data', data)
      return data
    } catch (error) {
      console.log('error - - - ', error)
      //throw error
    }
  }
)

export const createProduct = createAsyncThunk<
  Product,
  { request: any; jwt: string | null }
>('/sellerProduct/createProduct', async (args, { rejectWithValue }) => {
  const { request, jwt } = args
  try {
    const response = await api.post('/sellers/products', request, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    const data = response.data
    console.log('data', data)
    return data
  } catch (error) {
    console.log('error - - - ', error)
    //throw error
  }
})

export const updateProduct = createAsyncThunk<
  Product,
  { productId: number; product: any; jwt: string | null }
>('/sellerProduct/updateProduct', async (args, { rejectWithValue }) => {
  const { productId, product, jwt } = args
  try {
    const response = await api.put(`/sellers/products/${productId}`, product, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    return response.data
  } catch (error: any) {
    console.log('error updating product', error)
    return rejectWithValue(error.response?.data?.message || 'Cập nhật sản phẩm thất bại')
  }
})

export const softDeleteProduct = createAsyncThunk<
  Product,
  { productId: number; jwt: string | null }
>('/sellerProduct/softDeleteProduct', async (args, { rejectWithValue }) => {
  const { productId, jwt } = args
  try {
    const response = await api.patch(`/sellers/products/${productId}/soft-delete`, {}, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    return response.data
  } catch (error: any) {
    console.log('error soft deleting product', error)
    return rejectWithValue(error.response?.data?.message || 'Xóa sản phẩm thất bại')
  }
})

export const markOutOfStock = createAsyncThunk<
  Product,
  { productId: number; jwt: string | null }
>('/sellerProduct/markOutOfStock', async (args, { rejectWithValue }) => {
  const { productId, jwt } = args
  try {
    const response = await api.patch(`/sellers/products/${productId}/out-of-stock`, {}, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    return response.data
  } catch (error: any) {
    console.log('error marking out of stock', error)
    return rejectWithValue(error.response?.data?.message || 'Đánh dấu hết hàng thất bại')
  }
})

export const fetchInactiveProducts = createAsyncThunk<Product[], any>(
  '/sellerProduct/fetchInactiveProducts',
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get('/sellers/products/inactive', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      return response.data
    } catch (error: any) {
      console.log('error fetching inactive products', error)
      return rejectWithValue(error.response?.data?.message || 'Lấy danh sách sản phẩm thất bại')
    }
  }
)

export const reactivateProduct = createAsyncThunk<
  Product,
  { productId: number; jwt: string | null }
>('/sellerProduct/reactivateProduct', async (args, { rejectWithValue }) => {
  const { productId, jwt } = args
  try {
    const response = await api.patch(`/sellers/products/${productId}/reactivate`, {}, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    return response.data
  } catch (error: any) {
    console.log('error reactivating product', error)
    return rejectWithValue(error.response?.data?.message || 'Đăng bán lại thất bại')
  }
})

interface SellerProductState {
  products: Product[]
  inactiveProducts: Product[]
  loading: boolean
  error: string | null | undefined
}

const initialState: SellerProductState = {
  products: [],
  inactiveProducts: [],
  loading: false,
  error: null
}

const sellerProductSlice = createSlice({
  name: 'sellerProduct',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSellerProducts.pending, state => {
      state.loading = true
    })

    builder.addCase(fetchSellerProducts.fulfilled, (state, action) => {
      state.loading = false
      state.products = action.payload
    })

    builder.addCase(fetchSellerProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })

    builder.addCase(createProduct.pending, state => {
      state.loading = true
    })

    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false
      state.products.push(action.payload)
    })

    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })

    // Update Product
    builder.addCase(updateProduct.pending, state => {
      state.loading = true
    })

    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    })

    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Soft Delete Product
    builder.addCase(softDeleteProduct.pending, state => {
      state.loading = true
    })

    builder.addCase(softDeleteProduct.fulfilled, (state, action) => {
      state.loading = false
      // Remove the product from the list (it's soft deleted)
      state.products = state.products.filter(p => p.id !== action.payload.id)
    })

    builder.addCase(softDeleteProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Mark Out of Stock
    builder.addCase(markOutOfStock.pending, state => {
      state.loading = true
    })

    builder.addCase(markOutOfStock.fulfilled, (state, action) => {
      state.loading = false
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    })

    builder.addCase(markOutOfStock.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Inactive Products
    builder.addCase(fetchInactiveProducts.pending, state => {
      state.loading = true
    })

    builder.addCase(fetchInactiveProducts.fulfilled, (state, action) => {
      state.loading = false
      state.inactiveProducts = action.payload
    })

    builder.addCase(fetchInactiveProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Reactivate Product
    builder.addCase(reactivateProduct.pending, state => {
      state.loading = true
    })

    builder.addCase(reactivateProduct.fulfilled, (state, action) => {
      state.loading = false
      // Remove from inactive and add to active
      state.inactiveProducts = state.inactiveProducts.filter(p => p.id !== action.payload.id)
      state.products.push(action.payload)
    })

    builder.addCase(reactivateProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export default sellerProductSlice.reducer
