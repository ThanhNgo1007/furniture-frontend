import { Route, Routes } from 'react-router-dom'
import AddNewCouponForm from '../admin/Pages/Coupon/AddNewCouponForm'
import Coupon from '../admin/Pages/Coupon/Coupon'
import Deal from '../admin/Pages/HomePage/Deal'
import DealManagement from '../admin/Pages/HomePage/DealManagement'
import GridTable from '../admin/Pages/HomePage/GridTable'
import SellersTable from '../admin/Pages/Sellers/SellersTable'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>

            <Route path="/" element={<SellersTable/>}/>
            <Route path="/coupon" element={<Coupon/>}/>
            <Route path="/add-coupon" element={<AddNewCouponForm/>}/>
            <Route path="/home-grid" element={<GridTable/>}/>
            <Route path="/deals" element={<Deal/>}/>
            <Route path="/deal-management" element={<DealManagement/>}/>
            
        </Routes>
    </div>
  )
}

export default AdminRoutes