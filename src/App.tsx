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

function App() {
  const dispatch = useAppDispatch()
  const { seller, auth } = useAppSelector(store => store)
  const navigate = useNavigate()

  //Fetch seller profile
  useEffect(() => {
    if (auth.jwt) {
      dispatch(fetchSellerProfile(localStorage.getItem('jwt') || ''))
    }
  }, [])

  //When seller is logged in navigate to seller dashboard
  useEffect(() => {
    if (seller.profile) {
      navigate('/seller')
    }
  }, [seller.profile])

  useEffect(() => {
    if (auth.jwt) {
      dispatch(fetchUserProfile({ jwt: auth.jwt || localStorage.getItem('jwt') }))
    }
  }, [auth.jwt])

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
