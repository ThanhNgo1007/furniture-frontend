import { ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import AdminDashboard from './admin/Pages/Dashboard/AdminDashboard'
import BackToTopButton from './customer/components/BackToTopButton'
import Footer from './customer/components/Footer/Footer'
import Navbar from './customer/components/Navbar/Navbar'
import Account from './customer/pages/Account/Account'
import Auth from './customer/pages/Auth/Auth'
import BecomeSeller from './customer/pages/Become Seller/BecomeSeller'
import Cart from './customer/pages/Cart/Cart'
import Checkout from './customer/pages/Checkout/Checkout'
import Home from './customer/pages/Home/Home'
import ProductDetails from './customer/pages/Page Details/ProductDetails'
import Product from './customer/pages/Product/Product'
import Review from './customer/pages/Product/Review/Review'
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
        {/*Thanh navbar, menu cua web */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/products/:category" element={<Product />} />
          <Route path="/reviews/:productId" element={<Review />} />
          <Route
            path="/product-details/:categoryId/:name/:productId"
            element={<ProductDetails />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/seller/*" element={<SellerDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
        {/*Footer cua web */}
        <Footer />

        {/* Back to top of page */}
        <BackToTopButton />
      </div>
    </ThemeProvider>
  )
}

export default App
