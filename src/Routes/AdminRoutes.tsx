import { Route, Routes } from 'react-router-dom'
import AdminAccount from '../admin/Pages/Account/AdminAccount'
import AddNewCouponForm from '../admin/Pages/Coupon/AddNewCouponForm'
import Coupon from '../admin/Pages/Coupon/Coupon'
import DashboardOverview from '../admin/Pages/Dashboard/DashboardOverview'
import Deal from '../admin/Pages/HomePage/Deal'
import DealManagement from '../admin/Pages/HomePage/DealManagement'
import GridTable from '../admin/Pages/HomePage/GridTable'
import SellersTable from '../admin/Pages/Sellers/SellersTable'
import UsersTable from '../admin/Pages/Users/UsersTable'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>
            {/* Dashboard as default landing page */}
            <Route path="/" element={<DashboardOverview/>}/>
            <Route path="/dashboard" element={<DashboardOverview/>}/>
            
            <Route path="/sellers" element={<SellersTable/>}/>
            <Route path="/users" element={<UsersTable/>}/>
            <Route path="/coupon" element={<Coupon/>}/>
            <Route path="/add-coupon" element={<AddNewCouponForm/>}/>
            <Route path="/home-grid" element={<GridTable/>}/>
            <Route path="/deals" element={<Deal/>}/>
            <Route path="/deal-management" element={<DealManagement/>}/>
            <Route path="/account" element={<AdminAccount/>}/>
            
        </Routes>
    </div>
  )
}

export default AdminRoutes