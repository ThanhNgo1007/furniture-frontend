import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5454';


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Biến để tránh gọi refresh nhiều lần đồng thời
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- 1. REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// --- 2. RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Chặn redirect nếu đang ở trang Login (để Form hiển thị lỗi đỏ)
    if (originalRequest && (
      originalRequest.url?.includes('/auth/signing') ||
      originalRequest.url?.includes('/sellers/login') ||
      originalRequest.url?.includes('/auth/sent/login-signup-otp') ||
      originalRequest.url?.includes('/auth/refresh') // Thêm: Không retry refresh endpoint
    )) {
      console.error('[API] Auth endpoint failed:', error.response?.status);
      return Promise.reject(error);
    }

    // 2. Xử lý Token hết hạn (401/403)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      // Nếu đang refresh, đợi kết quả
      if (isRefreshing) {
        console.log('[API] Waiting for token refresh...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Không có refresh token, logout ngay
        console.error('[API] No refresh token found. Logging out...');
        isRefreshing = false;
        handleLogout();
        return Promise.reject(new Error("No refresh token available"));
      }

      console.log('[API] Attempting to refresh access token...');

      try {
        // Gọi API Refresh (không dùng instance api để tránh loop)
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        const { jwt: newAccessToken, refreshToken: newRefreshToken } = response.data;

        console.log('[API] ✅ Token refreshed successfully');

        // Lưu token mới
        localStorage.setItem("jwt", newAccessToken);

        // Nếu backend trả về refresh token mới thì cập nhật
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Cập nhật header mặc định
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Xử lý các request đang chờ
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry request gốc
        console.log('[API] 🔄 Retrying original request with new token');
        return api(originalRequest);

      } catch (refreshError: any) {
        // Refresh thất bại - Token hết hạn hoàn toàn
        processQueue(refreshError, null);
        isRefreshing = false;

        console.error('[API] ❌ Token refresh failed:', refreshError.response?.status, refreshError.response?.data);
        handleLogout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Hàm logout tự động
const handleLogout = () => {
  // 1. Xóa toàn bộ storage
  localStorage.clear();

  // 2. Dispatch event để Redux Store nhận biết
  window.dispatchEvent(new CustomEvent('auth:logout'));

  // 3. Redirect về home nếu đang ở seller/admin routes
  const currentPath = window.location.pathname;

  // Chỉ redirect nếu KHÔNG phải đang ở trang home
  if (currentPath !== '/' && (currentPath.startsWith('/seller') || currentPath.startsWith('/admin'))) {
    window.location.href = "/";
  }
  // Nếu đã ở trang home hoặc customer routes, không cần redirect
};

export default api;