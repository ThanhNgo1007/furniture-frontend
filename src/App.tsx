import { Box, CircularProgress, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import CustomerLayout from './admin/components/Layout'
import ManagementLayout from './admin/components/ManagementLayout'
import AdminDashboard from './admin/Pages/Dashboard/AdminDashboard'
import BackToTopButton from './customer/components/BackToTopButton'
import Account from './customer/pages/Account/Account'
import Auth from './customer/pages/Auth/Auth'
import BecomeSeller from './customer/pages/Become Seller/BecomeSeller'
import SellerVerificationWaiting from './customer/pages/Become Seller/SellerVerifycationWaiting'
import VerifySeller from './customer/pages/Become Seller/VerifySellerEmail'
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
import { loadBestSellers } from './State/customer/ProductSlice'
import { fetchSellerProfile } from './State/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from './State/Store'
import customTheme from './theme/customTheme'
// import { useAuthChecker } from './hooks/useAuthChecker' // Uncomment nếu muốn dùng

// Debug component - Uncomment để debug
// import DebugTokenInfo from './components/DebugTokenInfo'

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  try {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  // Optional: Auto logout khi token hết hạn
  // useAuthChecker();
  
  // Redux state - OPTIMIZED SELECTORS
  const auth = useAppSelector(store => store.auth);
  const seller = useAppSelector(store => store.seller);
  
  const [isInitializing, setIsInitializing] = useState(true)

  // ===== LOAD BEST SELLERS FROM LOCALSTORAGE ON MOUNT =====
  useEffect(() => {
    dispatch(loadBestSellers());
  }, [dispatch]);

  // ===== 1. LẮNG NGHE AUTO LOGOUT TỪ INTERCEPTOR =====
  useEffect(() => {
    const handleAutoLogout = () => {
      dispatch({ type: 'auth/logoutSync' });
    };

    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, [dispatch]);

  // ===== 2. INIT AUTH - CHẠY KHI MOUNT VÀ KHI JWT THAY ĐỔI =====
  useEffect(() => {
    const initAuth = async () => {
      const jwt = localStorage.getItem('jwt');
      const refreshToken = localStorage.getItem('refreshToken');

      // Không có token → Not logged in
      if (!jwt && !refreshToken) {
        console.log("No tokens found - User not logged in");
        setIsInitializing(false);
        return;
      }

      // Có token nhưng không có JWT → Logout
      if (!jwt) {
        console.log("No JWT but has refresh token - Invalid state, logging out");
        dispatch({ type: 'auth/logoutSync' });
        setIsInitializing(false);
        return;
      }

      // Decode JWT để lấy role
      const decoded = parseJwt(jwt);
      if (!decoded) {
        console.error("Failed to decode JWT");
        dispatch({ type: 'auth/logoutSync' });
        setIsInitializing(false);
        return;
      }

      // Parse role
      let role = null;
      if (Array.isArray(decoded.authorities)) {
        role = decoded.authorities[0]?.authority;
      } else if (typeof decoded.authorities === 'string') {
        role = decoded.authorities.split(',')[0];
      }

      console.log("🔐 JWT Info:", { email: decoded.email, role });

      if (!role) {
        console.error("No role in JWT");
        dispatch({ type: 'auth/logoutSync' });
        setIsInitializing(false);
        return;
      }

      // ⚠️ KIỂM TRA TOKEN HẾT HẠN
      if (isTokenExpired(jwt)) {
        if (!refreshToken) {
          console.log("❌ Token expired and no refresh token - Logging out");
          dispatch({ type: 'auth/logoutSync' });
          setIsInitializing(false);
          return;
        }
        console.log("⚠️ Access token expired - Will refresh on first API call");
      }

      // ⚠️ FETCH PROFILE: Luôn fetch nếu chưa có data HOẶC token vừa thay đổi
      const hasUserData = auth.user !== null;
      const hasSellerData = seller.seller !== null;

      try {
        if (role === "ROLE_SELLER") {
          if (hasSellerData && !isTokenExpired(jwt)) {
            console.log("✅ Seller profile already in Redux with valid token");
          } else {
            console.log("🔄 Fetching seller profile...");
            await dispatch(fetchSellerProfile()).unwrap();
            console.log("✅ Seller profile loaded");
          }
        } 
        else if (role === "ROLE_CUSTOMER") {
          if (hasUserData && !isTokenExpired(jwt)) {
            console.log("✅ User profile already in Redux with valid token");
          } else {
            console.log("🔄 Fetching user profile...");
            await dispatch(fetchUserProfile({})).unwrap();
            console.log("✅ User profile loaded");
          }
        }
      } catch (error: any) {
        console.error("❌ Failed to fetch profile:", error);
        
        // Nếu lỗi 500 (user not found), logout
        if (error?.status === 500 || error?.message?.includes('not found')) {
          console.error("⚠️ Data mismatch - Logging out");
          dispatch({ type: 'auth/logoutSync' });
          navigate('/login');
        }
      }

      setIsInitializing(false);
    };

    initAuth();
  }, [auth.jwt]); // ⚠️ THÊM auth.jwt VÀO DEPS - CHẠY LẠI KHI JWT THAY ĐỔI!

  return (
    <ThemeProvider theme={customTheme}>
      <div>
        {/* Uncomment để debug */}
        {/* {import.meta.env.DEV && <DebugTokenInfo />} */}
        
        {isInitializing ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              backgroundColor: '#f5f5f5'
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Routes>
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
                 <Route path="/verify-seller/:otp" element={<VerifySeller />} />
              </Route>

              <Route element={<ManagementLayout />}>
                 <Route path="/seller/*" element={<SellerDashboard />} />
                 <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>
              
              <Route path="/seller-verification-waiting" element={<SellerVerificationWaiting />} />
            </Routes>
            <BackToTopButton />
          </>
        )}
      </div>
    </ThemeProvider>
  )
}

export default App