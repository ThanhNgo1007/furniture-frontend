/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../config/Api'

export const sendLoginSignupOtp = createAsyncThunk(
  '/sellers/sendLoginSignupOtp',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/sent/login-signup-otp', { email })
      console.log('login otp', response)
    } catch (error) {
      console.log('error', error)
    }
  }
)

export const signing = createAsyncThunk<any, any>(
  '/auth/signing',
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signing', loginRequest)
      console.log('login otp', response.data)
      localStorage.setItem('jwt', response.data.jwt)
      return response.data.jwt
    } catch (error) {
      console.log('error', error)
    }
  }
)

export const signup = createAsyncThunk<any, any>(
  '/auth/signup',
  async (signupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', signupRequest)
      console.log('sign up otp', response.data)
      localStorage.setItem('jwt', response.data.jwt)
      return response.data.jwt
    } catch (error) {
      console.log('error', error)
    }
  }
)

export const fetchUserProfile = createAsyncThunk<any, any>(
  '/auth/fetchUserProfile',
  async ({ jwt }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      console.log('user profile', response.data)
      return response.data
    } catch (error) {
      console.log('error', error)
    }
  }
)

export const logout = createAsyncThunk<any, any>(
  '/auth/logout',
  async (navigate, { rejectWithValue }) => {
    try {
      localStorage.clear()
      console.log('logout success')
      navigate('/')
      return 'Logout success' // Trả về một giá trị để action được fulfilled
    } catch (error) {
      console.log('error - - - ', error)
      return rejectWithValue(error)
    }
  }
)

interface AuthState {
  jwt: string | null
  otpSent: boolean
  isLoggedIn: boolean
  user: any | null
  loading: boolean
  error: any // Thêm state error để hiển thị lỗi
}

const initialState: AuthState = {
  // 3. Khởi tạo từ localStorage để không mất login khi F5
  jwt: localStorage.getItem('jwt'),
  otpSent: false,
  isLoggedIn: !!localStorage.getItem('jwt'), // Nếu có jwt thì là đã login
  user: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: state => {
      state.error = null
      state.loading = false
      state.otpSent = false
    }
  },
  extraReducers: builder => {
    builder.addCase(sendLoginSignupOtp.pending, state => {
      state.loading = true
    })
    builder.addCase(sendLoginSignupOtp.fulfilled, state => {
      state.loading = false
      state.otpSent = true
    })
    builder.addCase(sendLoginSignupOtp.rejected, state => {
      state.loading = false
    })
    builder.addCase(signing.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signing.fulfilled, (state, action) => {
      state.loading = false
      state.jwt = action.payload
      state.isLoggedIn = true
      state.error = null
    })
    builder.addCase(signing.rejected, (state, action) => {
      state.loading = false
      state.isLoggedIn = false
      state.error = action.payload // Lưu lỗi để hiển thị
    })
    builder.addCase(signup.fulfilled, (state, action) => {
      state.jwt = action.payload
      state.isLoggedIn = true
    })
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
    })
    builder.addCase(logout.fulfilled, state => {
      state.jwt = null
      state.isLoggedIn = false
      state.user = null
    })
  }
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer
