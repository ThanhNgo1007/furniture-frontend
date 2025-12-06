import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../config/Api';
import type { User } from '../types/userTypes';

// Các action giữ nguyên như cũ
export const sendLoginSignupOtp = createAsyncThunk(
  '/auth/sendLoginSignupOtp',
  async ({ email, role }: { email: string; role?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/sent/login-signup-otp', { email, role })
      console.log('login otp', response)
      return response.data
    } catch (error: any) {
      console.log('error', error)
      return rejectWithValue(error.response?.data || "Failed to send OTP")
    }
  }
)

export const signing = createAsyncThunk<any, any>(
  '/auth/signing',
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signing', loginRequest)
      console.log('login success', response.data)

      localStorage.setItem('jwt', response.data.jwt)

      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }

      return response.data.jwt
    } catch (error: any) {
      console.log('error', error)
      const errorData = error.response?.data;
      // Extract message string from error object if it exists
      const errorMessage = typeof errorData === 'object' && errorData?.message
        ? errorData.message
        : (typeof errorData === 'string' ? errorData : "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
      return rejectWithValue(errorMessage)
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
      // ⚠️ QUAN TRỌNG: Không truyền headers thủ công
      // Interceptor sẽ tự động thêm từ localStorage
      const response = await api.get('/api/users/profile');

      console.log('✅ User profile fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message || "Unknown error");
    }
  }
)

export const logout = createAsyncThunk<any, any>(
  '/auth/logout',
  async (navigate, { rejectWithValue }) => {
    try {
      // Clear tất cả storage
      localStorage.removeItem('jwt')
      localStorage.removeItem('refreshToken')

      console.log('logout success')

      // Chỉ navigate nếu không ở trang login
      if (navigate && window.location.pathname !== '/login') {
        navigate('/')
      }

      return 'Logout success'
    } catch (error) {
      console.log('error - - - ', error)
      return rejectWithValue(error)
    }
  }
)

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

export const updateUserRole = createAsyncThunk<User, { userId: number, role: string }>(
  "auth/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}/role`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        params: { role }
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add address");
    }
  }
);

export const updateUserAddress = createAsyncThunk<User, { jwt: string, addressId: number, address: any }>(
  "auth/updateUserAddress",
  async ({ jwt, addressId, address }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/users/address/${addressId}`, address, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      console.log("Address updated:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update address");
    }
  }
);

export const deleteUserAddress = createAsyncThunk<User, { jwt: string, addressId: number }>(
  "auth/deleteUserAddress",
  async ({ jwt, addressId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/users/address/${addressId}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      console.log("Address deleted:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete address");
    }
  }
);

export const setDefaultAddress = createAsyncThunk<User, { jwt: string, addressId: number }>(
  "auth/setDefaultAddress",
  async ({ jwt, addressId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/users/address/${addressId}/default`, {}, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      console.log("Default address set:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to set default address");
    }
  }
);

interface AuthState {
  jwt: string | null
  otpSent: boolean
  isLoggedIn: boolean
  user: User | null
  loading: boolean
  error: string | null
  users: User[]
}

const initialState: AuthState = {
  jwt: localStorage.getItem('jwt'),
  otpSent: false,
  isLoggedIn: !!localStorage.getItem('jwt'),
  user: null,
  loading: false,
  error: null,
  users: []
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
    // Logout đồng bộ để clear state ngay lập tức
    logoutSync: (state) => {
      state.jwt = null
      state.isLoggedIn = false
      state.user = null
      state.users = []
      localStorage.removeItem('jwt')
      localStorage.removeItem('refreshToken')
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

    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    })
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      // Nếu fetch profile thất bại, kiểm tra lý do
      state.loading = false;
      console.error("Fetch profile rejected:", action.payload);
      // Không logout ngay, để interceptor xử lý refresh token
    })

    builder.addCase(logout.fulfilled, state => {
      state.jwt = null
      state.isLoggedIn = false
      state.user = null
      state.users = []
    })

    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateUserRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addUserAddress.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(addUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Address
    builder.addCase(updateUserAddress.pending, (state) => { state.loading = true; });
    builder.addCase(updateUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(updateUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Address
    builder.addCase(deleteUserAddress.pending, (state) => { state.loading = true; });
    builder.addCase(deleteUserAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(deleteUserAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Set Default Address
    builder.addCase(setDefaultAddress.pending, (state) => { state.loading = true; });
    builder.addCase(setDefaultAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(setDefaultAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
})

export const { resetAuth, logoutSync } = authSlice.actions
export default authSlice.reducer