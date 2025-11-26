import { Route, Routes } from 'react-router-dom'
import Account from '../seller/pages/Account/Account'
import Orders from '../seller/pages/Orders/Orders'
import Payment from '../seller/pages/Payment/Payment'
import Transaction from '../seller/pages/Payment/Transaction'
import AddProduct from '../seller/pages/Products/AddProduct'
import Products from '../seller/pages/Products/Products'
import Dashboard from '../seller/pages/SellerDashboard/Dashboard'

const SellerRoutes = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/account" element={<Account />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/transaction" element={<Transaction />} />
            </Routes>
        </div>
    )
}

export default SellerRoutes