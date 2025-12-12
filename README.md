# Furniture Multi-vendor E-commerce Frontend 🛋️

## Giới thiệu

**Furniture Multi-vendor E-commerce Frontend** là ứng dụng web nền tảng thương mại điện tử mua bán nội thất với thiết kế hiện đại sử dụng ReactJS, TypeScript, TailwindCSS và MUI hiện đại. Đây là phần giao diện Client-side của hệ thống.
---

## 🌐 Live Demo

Trải nghiệm trực tiếp sản phẩm tại đây:
👉 **[Furniture Multi-vendor E-commerce Demo](furniture-frontend.nhthanh1007.workers.dev)**  
*(Lưu ý: Backend được deploy trên Railway nên có thể mất khoảng 1 phút để khởi động trong lần truy cập đầu tiên)*

---

## 🚀 Tính năng nổi bật

### 🛒 Dành cho Khách hàng (Customer)
- **Trải nghiệm mua sắm**: Tìm kiếm, lọc và xem chi tiết sản phẩm với giao diện trực quan.
- **Giỏ hàng & Thanh toán**: Quy trình đặt hàng đơn giản, hỗ trợ quản lý giỏ hàng thông minh.
- **Chat trực tuyến (Real-time)**: Tích hợp Widget chat (WebSocket) giúp khách hàng liên hệ trực tiếp với nhân viên hỗ trợ.
- **Tài khoản cá nhân**: Quản lý hồ sơ, lịch sử đơn hàng và danh sách yêu thích.

### 💼 Dành cho Quản trị viên & Nhà bán hàng (Admin/Seller)
- **Dashboard quản trị**: Biểu đồ thống kê doanh thu, đơn hàng theo thời gian thực.
- **Quản lý sản phẩm**: Thêm, sửa, xóa và cập nhật trạng thái kho hàng.
- **Quản lý Deal & Coupon**: Tạo các chương trình khuyến mãi, mã giảm giá.
- **Hệ thống tin nhắn**: Phản hồi tin nhắn từ khách hàng ngay trong trang quản trị.

---

## 📸 Hình ảnh minh họa (Screenshots)

<details>
<summary><b>1. Trang chủ (Home Page)</b></summary>

![Trang chủ](./screenshots/home-page.png)
*(Thêm ảnh trang chủ vào đây)*
</details>

<details>
<summary><b>2. Chi tiết sản phẩm (Product Detail)</b></summary>

![Chi tiết sản phẩm](./screenshots/product-detail.png)
*(Thêm ảnh chi tiết sản phẩm vào đây)*
</details>

<details>
<summary><b>3. Giỏ hàng & Thanh toán (Cart & Checkout)</b></summary>

![Giỏ hàng](./screenshots/cart.png)
</details>

<details>
<summary><b>4. Admin Dashboard</b></summary>

![Admin Dashboard](./screenshots/admin-dashboard.png)
</details>

<details>
<summary><b>5. Chat Real-time</b></summary>

![Chat Feature](./screenshots/chat-widget.png)
</details>

---

## 🛠️ Công nghệ sử dụng

Dự án sử dụng các công nghệ tiên tiến nhất trong hệ sinh thái React:

- **Core**: React 18, TypeScript, Vite (Build tool siêu tốc).
- **State Management**: Redux Toolkit & Axios (Quản lý trạng thái và data fetching).
- **Styling**: TailwindCSS (Tùy biến giao diện cao cấp), kết hợp Material UI.
- **Real-time**: WebSocket (Chat thời gian thực).
- **Routing**: React Router v6.
- **Deployment**: Cloudflare Workers (CI/CD tự động).
- **Code Quality**: ESLint, Prettier.

---

## ⚙️ Cài đặt và Chạy dự án

Để chạy dự án trên máy cục bộ, hãy làm theo các bước sau:

### 1. Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

### 2. Clone dự án

```bash
git clone https://github.com/thanhngo1007/furniture-frontend.git
cd furniture-frontend
```

### 3. Cài đặt thư viện

```bash
npm install
# hoặc
yarn install
```

### 4. Cấu hình quy biến môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án (tham khảo `.env.example`) và điền các thông tin cần thiết:

```env
VITE_API_BASE_URL=http://localhost:5454
VITE_SOCKET_URL=http://localhost:5454
# Các key khác nếu có (Google Maps API, Cloudinary...)
```

### 5. Chạy môi trường phát triển (Development)

```bash
npm run dev
```
Truy cập `http://localhost:5173` để xem ứng dụng.

### 6. Build production

```bash
npm run build
```

---

## 📂 Cấu trúc thư mục

Cấu trúc dự án được tổ chức rõ ràng, dễ bảo trì và mở rộng:

```
src/
├── admin/               # Module dành cho trang quản trị (Admin/Seller)
│   ├── Components/      # Các component dùng chung trong admin
│   └── Pages/           # Các trang chính (Dashboard, Product, Deals...)
├── customer/            # Module dành cho khách hàng
│   ├── components/      # Component UI (Navbar, ProductCard, ChatWidget...)
│   └── pages/           # Các trang (Home, Product Detail, Cart...)
├── store/               # Redux Store và các Slices (Auth, Product, Cart...)
├── config/              # Cấu hình API, Theme, Constants
├── utils/               # Các hàm tiện ích (Format tiền tệ, Date time...)
├── assets/              # Hình ảnh, Font chữ, Global Styles
├── App.tsx              # Component gốc và định tuyến (Routing)
└── main.tsx             # Entry point
```

---

## 🤝 Đóng góp (Contributing)

Nếu bạn muốn đóng góp cho dự án:
1. Fork repository này.
2. Tạo branch mới (`git checkout -b feature/tinh-nang-moi`).
3. Commit thay đổi của bạn (`git commit -m 'Thêm tính năng mới'`).
4. Push lên branch (`git push origin feature/tinh-nang-moi`).
5. Tạo Pull Request.

---

## 📞 Liên hệ

- **Tác giả**: Thanh Ngo
- **Email**: [Email của bạn]
- **LinkedIn/Portfolio**: [Link Profile của bạn]

---
*Dự án được thực hiện nhằm mục đích học tập và phát triển kỹ năng lập trình Fullstack.*
