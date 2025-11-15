/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeProvider } from '@mui/material';
import Navbar from './customer/components/Navbar/Navbar';
import customTheme from './theme/customTheme';
import './index.css';
import Product from './customer/pages/Product/Product';
import ProductDetails from './customer/pages/Page Details/ProductDetails';
import Review from './customer/pages/Product/Review/Review';
import BackToTopButton from './customer/components/BackToTopButton';
import Footer from './customer/components/Footer/Footer';
import Cart from './customer/pages/Cart/Cart';
import Checkout from './customer/pages/Checkout/Checkout';
import Account from './customer/pages/Account/Account';
import { Route, Routes } from 'react-router-dom';
import Home from './customer/pages/Home/Home';
import BecomeSeller from './customer/pages/Become Seller/BecomeSeller';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import AdminDashboard from './admin/Pages/Dashboard/AdminDashboard';

function App() {
  return (
      <ThemeProvider theme={customTheme}>
        <div>
          {/*Thanh navbar, menu cua web */}
            <Navbar />
            {/*Noi dung trang */}
            {/*<Home />*/}
            {/*<Product />*/}
            {/*<ProductDetails />*/}
            {/*<Review/>*/}
            {/*<Cart/>*/}
            {/*<Checkout/>*/}
            {/* <Account/> */}
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/products/:category" element={<Product/>}/>
              <Route path="/reviews/:productId" element={<Review/>}/>
              <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/checkout" element={<Checkout/>}/>
              <Route path="/become-seller" element={<BecomeSeller/>}/>
              <Route path="/account/*" element={<Account/>}/>
              <Route path="/seller/*" element={<SellerDashboard/>}/>
              <Route path="/admin/*" element={<AdminDashboard/>}/>

              
            </Routes>
            {/*Footer cua web */}
             <Footer/>

           {/* Back to top of page */}
      <BackToTopButton />
        </div>

      </ThemeProvider>
  );
}

export default App
