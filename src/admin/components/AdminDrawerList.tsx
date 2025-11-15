/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import DrawerList from '../../component/DrawerList'
import { AccountBox, Add, Category, Chair, Dashboard, Home, IntegrationInstructions, LocalOffer, Logout } from '@mui/icons-material'

const menu = [
    {
        name: "Dashboard",
        path: "/admin",
        icon: <Dashboard className='text-teal-600'/>,
        activeIcon: <Dashboard className='text-white'/>
    },
    {
        name: "Coupons",
        path: "/admin/coupon",
        icon: <IntegrationInstructions className='text-teal-600'/>,
        activeIcon: <IntegrationInstructions className='text-white'/>
    },
    {
        name: "Add New Coupon",
        path: "/admin/add-coupon",
        icon: <Add className='text-teal-600'/>,
        activeIcon: <Add className='text-white'/>
    },
    {
        name: "Home Page",
        path: "/admin/home-grid",
        icon: <Home className='text-teal-600'/>,
        activeIcon: <Home className='text-white'/>
    },
    {
        name: "Decors Category",
        path: "/admin/decors-table",
        icon: <Chair className='text-teal-600'/>,
        activeIcon: <Chair className='text-white'/>
    },
    {
        name: "Shop By Category",
        path: "/admin/shop-by-category",
        icon: <Category className='text-teal-600'/>,
        activeIcon: <Category className='text-white'/>
    },
    {
        name: "Deals",
        path: "/admin/deals",
        icon: <LocalOffer className='text-teal-600'/>,
        activeIcon: <LocalOffer className='text-white'/>
    },
];

const menu2 = [
    {
        name: "Account",
        path: "/seller/account",
        icon: <AccountBox className='text-teal-600'/>,
        activeIcon: <AccountBox className='text-white' />
    },
    {
        name: "Logout",
        path: "/",
        icon: <Logout className='text-teal-600'/>,
        activeIcon: <Logout className='text-white' />
    }
];

const AdminDrawerList = ({toggleDrawer}:any) => {
  return (
    <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer}/>
  )
}

export default AdminDrawerList