import axios from 'axios';
// Import store và action logout để xử lý khi refresh thất bại

export const API_BASE_URL = 'http://localhost:5454';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- 1. REQUEST INTERCEPTOR: Luôn gắn Access Token mới nhất ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. RESPONSE INTERCEPTOR: Xử lý Refresh Token khi lỗi 401 ---
api.interceptors.response.use(
  (response) => response, // Nếu thành công thì trả về luôn
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi là 401 (Unauthorized) và chưa từng thử lại (để tránh lặp vô hạn)
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã thử lại

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Nếu không có refresh token thì chịu thua -> Logout
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Gọi API Refresh Token (Lưu ý: API này không dùng instance 'api' để tránh lặp interceptor)
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        const { jwt } = response.data;

        // 1. Lưu token mới vào localStorage
        localStorage.setItem("jwt", jwt);

        // 2. Cập nhật header cho request đang bị lỗi
        originalRequest.headers.Authorization = `Bearer ${jwt}`;

        // 3. Cập nhật header mặc định cho các request sau
        api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

        // 4. Gọi lại request ban đầu với token mới
        return api(originalRequest);

      } catch (refreshError) {
        // Nếu Refresh Token cũng hết hạn hoặc không hợp lệ -> Logout bắt buộc
        console.log("Session expired or Refresh failed. Logging out...");

        // Xóa dữ liệu local
        localStorage.clear();

        // Điều hướng về trang chủ hoặc login (dùng window.location để reload sạch sẽ)
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // Nếu lỗi không phải 401 hoặc đã thử refresh mà vẫn lỗi
    return Promise.reject(error);
  }
);