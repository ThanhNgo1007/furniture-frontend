import { ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import CustomerLayout from './admin/components/Layout'
import ManagementLayout from './admin/components/ManagementLayout'
import AdminDashboard from './admin/Pages/Dashboard/AdminDashboard'
import BackToTopButton from './customer/components/BackToTopButton'
import Account from './customer/pages/Account/Account'
import Auth from './customer/pages/Auth/Auth'
import BecomeSeller from './customer/pages/Become Seller/BecomeSeller'
import Cart from './customer/pages/Cart/Cart'
import Checkout from './customer/pages/Checkout/Checkout'
import OrderSuccess from './customer/pages/CheckoutSuccess/OrderSuccess'
import PaymentFailed from './customer/pages/CheckoutSuccess/PaymentFailed'
import PaymentSuccess from './customer/pages/CheckoutSuccess/PaymentSuccess'
import Home from './customer/pages/Home/Home'
import ProductDetails from './customer/pages/Page Details/ProductDetails'
import Product from './customer/pages/Product/Product'
import Wishlist from './customer/Wishlist/Wishlist'
import './index.css'
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard'
import { fetchUserProfile } from './State/AuthSlice'
import { fetchSellerProfile } from './State/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from './State/Store'
import customTheme from './theme/customTheme'

// --- HÀM GIẢI MÃ JWT (Không cần thư viện ngoài) ---
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function App() {
  const dispatch = useAppDispatch()
  const { auth } = useAppSelector(store => store)
  const navigate = useNavigate()

  // --- LOGIC MỚI: CHỈ GỌI 1 API DỰA TRÊN ROLE TRONG TOKEN ---
  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || auth.jwt;

    if (jwt) {
      const decodedJwt = parseJwt(jwt);
      // Lấy role từ claim "authorities" (Do JwtProvider.java cấu hình)
      // Cấu trúc thường là: authorities: [{authority: "ROLE_SELLER"}]
      const role = decodedJwt?.authorities?.[0]?.authority;

      if (role === "ROLE_SELLER") {
        dispatch(fetchSellerProfile(jwt));
        // Nếu đang ở trang chủ khách hàng, có thể redirect sang seller dashboard (Tuỳ chọn)
        // navigate('/seller'); 
      } 
      else if (role === "ROLE_ADMIN") {
        // Nếu có action fetchAdminProfile thì gọi ở đây
        // navigate('/admin');
      } 
      else {
        // Mặc định là Customer
        dispatch(fetchUserProfile({ jwt }));
      }
    }
  }, [auth.jwt, dispatch]); // Chỉ chạy lại khi jwt thay đổi
  // -----------------------------------------------------------

  return (
    <ThemeProvider theme={customTheme}>
      <div>
        <Routes>
          
          {/* 1. NHÓM KHÁCH HÀNG (Bao gồm cả Login/Checkout) -> Full Navbar + Footer */}
          <Route element={<CustomerLayout />}>
             <Route path="/" element={<Home />} />
             <Route path="/login" element={<Auth />} />
             <Route path="/checkout" element={<Checkout />} />
             <Route path="/payment/success" element={<PaymentSuccess />} />
             <Route path="/payment/failed" element={<PaymentFailed />} />
             <Route path="/products/:category" element={<Product />} />
             <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
             <Route path="/cart" element={<Cart />} />
             <Route path="/wishlist" element={<Wishlist />} />
             <Route path="/account/*" element={<Account />} />
             <Route path="/become-seller" element={<BecomeSeller />} />
             <Route path="/order-success" element={<OrderSuccess />} />
             {/* ... các route khách hàng khác */}
          </Route>

          {/* 2. NHÓM QUẢN LÝ (Seller & Admin) -> Navbar Rút gọn + KHÔNG Footer */}
          <Route element={<ManagementLayout />}>
             <Route path="/seller/*" element={<SellerDashboard />} />
             <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

        </Routes>
        <BackToTopButton />
      </div>
    </ThemeProvider>
  )
}

export default App
