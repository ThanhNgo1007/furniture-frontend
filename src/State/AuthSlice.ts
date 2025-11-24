/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../config/Api'; // Lưu ý kiểm tra đường dẫn import api cho đúng với cấu trúc thư mục của bạn
import type { User } from '../types/userTypes';

// --- CÁC ACTION CŨ GIỮ NGUYÊN ---

export const sendLoginSignupOtp = createAsyncThunk(
  '/sellers/sendLoginSignupOtp',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/sent/login-signup-otp', { email })
      console.log('login otp', response)
    } catch (error: any) {
      console.log('error', error)
      return rejectWithValue(error.response?.data || "Failed to send OTP") // Thêm return lỗi để bắt ở rejected
    }
  }
)

export const signing = createAsyncThunk<any, any>(
  '/auth/signing',
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signing', loginRequest)
      console.log('login success', response.data)

      // 1. Lưu Access Token
      localStorage.setItem('jwt', response.data.jwt)

      // 2. Lưu Refresh Token (QUAN TRỌNG)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }

      return response.data.jwt
    } catch (error: any) {
      console.log('error', error)
      return rejectWithValue(error.response?.data || "Failed to login")
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
    } catch (error: any) {
      console.log('error', error)
      return rejectWithValue(error.response?.data || "Failed to sign up")
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
      return rejectWithValue(error)
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
      return 'Logout success'
    } catch (error) {
      console.log('error - - - ', error)
      return rejectWithValue(error)
    }
  }
)

// --- CÁC ACTION MỚI CHO ADMIN (QUẢN LÝ USER) ---

// 1. Lấy danh sách tất cả user
export const getAllUsers = createAsyncThunk<User[], string>(
  "auth/getAllUsers",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      console.log("all users", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

// 2. Cập nhật quyền (Role) của user
export const updateUserRole = createAsyncThunk<User, { userId: number, role: string }>(
  "auth/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}/role`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        params: { role } // Gửi role qua query param
      });
      console.log("updated role", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update role");
    }
  }
);

export const addUserAddress = createAsyncThunk<User, { jwt: string, address: any }>(
  "auth/addUserAddress",
  async ({ jwt, address }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/users/address/add", address, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      console.log("Address added:", response.data);
      return response.data; // Trả về User object mới (đã có địa chỉ)
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add address");
    }
  }
);

// --- CẬP NHẬT STATE ---

interface AuthState {
  jwt: string | null
  otpSent: boolean
  isLoggedIn: boolean
  user: User | null
  loading: boolean
  error: string | null
  users: User[] // <-- Thêm danh sách users vào state
}

const initialState: AuthState = {
  jwt: localStorage.getItem('jwt'),
  otpSent: false,
  isLoggedIn: !!localStorage.getItem('jwt'),
  user: null,
  loading: false,
  error: null,
  users: [] // <-- Khởi tạo mảng rỗng
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: state => {
      state.error = null
      state.loading = false
      state.otpSent = false
    },
    logout: (state) => { // Nên có reducer logout đồng bộ để clear state ngay
      state.jwt = null
      state.isLoggedIn = false
      state.user = null
      state.users = []
      localStorage.clear()
    }
  },
  extraReducers: builder => {
    // ... Các case cũ (Login, Signup, Profile, Logout)
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
      state.error = action.payload as string
    })
    builder.addCase(signup.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signup.fulfilled, (state, action) => {
      state.jwt = action.payload
      state.isLoggedIn = true
      state.loading = false
      state.user = null
    })
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false
      state.isLoggedIn = false
      state.error = action.payload as string
    })
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
    })
    builder.addCase(logout.fulfilled, state => {
      state.jwt = null
      state.isLoggedIn = false
      state.user = null
      state.users = [] // Xóa danh sách user khi logout
    })

    // --- XỬ LÝ CÁC CASE MỚI (ADMIN) ---

    // getAllUsers
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload; // Lưu danh sách user vào state
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateUserRole
    builder.addCase(updateUserRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      state.loading = false;
      // Tìm và cập nhật user vừa đổi quyền trong danh sách
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // addUserAddress
    builder.addCase(addUserAddress.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // Cập nhật user mới có địa chỉ
    });
    builder.addCase(addUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer