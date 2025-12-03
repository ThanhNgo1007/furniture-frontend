/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountBox, Add, Dashboard, Group, Home, IntegrationInstructions, LocalOffer, Logout } from '@mui/icons-material';
import DrawerList from '../../component/DrawerList';

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
        name: "Home Page Grid",
        path: "/admin/home-grid",
        icon: <Home className='text-teal-600'/>,
        activeIcon: <Home className='text-white'/>
    },
    {
        name: "Deal Management",
        path: "/admin/deal-management",
        icon: <LocalOffer className='text-teal-600'/>,
        activeIcon: <LocalOffer className='text-white'/>
    },
    {
        name: "Users Management",
        path: "/admin/users",
        icon: <Group className="text-teal-600" />,
        activeIcon: <Group className="text-white" />
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