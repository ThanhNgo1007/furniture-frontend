import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/Pages/Sellers/SellersTable'
import Coupon from '../admin/Pages/Coupon/Coupon'
import AddNewCouponForm from '../admin/Pages/Coupon/AddNewCouponForm'
import GridTable from '../admin/Pages/HomePage/GridTable'
import DecorsTable from '../admin/Pages/HomePage/DecorsTable'
import ShopByCategoryTable from '../admin/Pages/HomePage/ShopByCategoryTable'
import Deal from '../admin/Pages/HomePage/Deal'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>

            <Route path="/" element={<SellersTable/>}/>
            <Route path="/coupon" element={<Coupon/>}/>
            <Route path="/add-coupon" element={<AddNewCouponForm/>}/>
            <Route path="/home-grid" element={<GridTable/>}/>
            <Route path="/decors-table" element={<DecorsTable/>}/>
            <Route path="/shop-by-category" element={<ShopByCategoryTable/>}/>
            <Route path="/deals" element={<Deal/>}/>
            

            
        </Routes>
    </div>
  )
}

export default AdminRoutes