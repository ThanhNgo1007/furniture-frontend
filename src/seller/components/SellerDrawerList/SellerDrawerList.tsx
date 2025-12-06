/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountBalanceWallet, AccountBox, Add, Dashboard, Inventory, Logout, Message, Receipt, ShoppingBag } from '@mui/icons-material';
import { Badge } from '@mui/material';
import { useEffect } from 'react';
import DrawerList from '../../../component/DrawerList';
import { fetchUnreadCount } from '../../../State/chatSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';


const SellerDrawerList = ({toggleDrawer}:{toggleDrawer:any}) => {
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector((state) => state.chat);

  // Fetch unread count on mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchUnreadCount(jwt));
    }
  }, [dispatch]);

  const menu = [
    {
        name: 'Tổng quan',
        path: "/seller",
        icon: <Dashboard className='text-teal-600'/>,
        activeIcon: <Dashboard className='text-white'/>
    },
     {
        name: 'Đơn hàng',
        path: "/seller/orders",
        icon: <ShoppingBag className='text-teal-600'/>,
        activeIcon: <ShoppingBag className='text-white'/>
    },
     {
        name: 'Sản phẩm',
        path: "/seller/products",
        icon: <Inventory className='text-teal-600'/>,
        activeIcon: <Inventory className='text-white'/>
    },
     {
        name: 'Thêm sản phẩm',
        path: "/seller/add-product",
        icon: <Add className='text-teal-600'/>,
        activeIcon: <Add className='text-white'/>
    },
    {
        name: 'Tin nhắn',
        path: "/seller/messages",
        icon: (
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <Message className='text-teal-600'/>
          </Badge>
        ),
        activeIcon: (
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <Message className='text-white'/>
          </Badge>
        )
    },
    {
        name: 'Thanh toán',
        path: "/seller/payment",
        icon: <AccountBalanceWallet className='text-teal-600'/>,
        activeIcon: <AccountBalanceWallet className='text-white'/>
    },
    {
        name: 'Giao dịch',
        path: "/seller/transaction",
        icon: <Receipt className='text-teal-600'/>,
        activeIcon: <Receipt className='text-white'/>
    },
  ];

  const menu2 = [
      {
          name: 'Tài khoản',
          path: "/seller/account",
          icon: <AccountBox className='text-teal-600'/>,
          activeIcon: <AccountBox className='text-white'/>
      },
      {
          name: "Đăng xuất",
          path: "/",
          icon: <Logout className='text-teal-600'/>,
          activeIcon: <Logout className='text-white'/>
      },
  ];

  return (
        <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer}/>
  )
}

export default SellerDrawerList