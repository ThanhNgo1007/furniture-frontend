/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../../State/AuthSlice'
import { useAppDispatch } from '../../../State/Store'
import Address from './Address'
import OrderDetails from './OrderDetails'
import Orders from './Orders'
import UserDetails from './UserDetails'

const Account = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const menu = [
    { name: t('account.orders'), path: '/account/orders' },
    { name: t('account.profile'), path: '/account' },
    { name: t('account.savedCard'), path: '/account/saved-card' },
    { name: t('account.addresses'), path: '/account/addresses' },
    { name: t('account.logout'), path: '/' }
  ]

  const handleClick = (item: any) => {
    if (item.path === '/') {
      dispatch(logout(navigate))
    }
    navigate(item.path)
  }
  return (
    <div className="px-5 lg:px-52 min-h-screen mt-10">
      <div>
        <h1 className="text-xl font-bold pb-5">Ngo Huu Thanh</h1>
      </div>
      <Divider />
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]">
        <section className="col-span-1 lg:border-r lg:pr-5 py-5 h-full ">
          {menu.map(item => (
            <div
              onClick={() => handleClick(item)}
              key={item.name}
              className={`${
                item.path === location.pathname ? 'bg-teal-600 text-white' : ''
              }
                py-5 cursor-pointer hover:text-white hover:bg-teal-600
              px-5 rounded-md border-b border-gray-200`}
            >
              <p>{item.name}</p>
            </div>
          ))}
        </section>
        <section className="right lg:col-span-2 lg:pl-5 py-5">
          <Routes>
            <Route path="/" element={<UserDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:orderId/:orderItemId" element={<OrderDetails />} />
            <Route path="/addresses" element={<Address />} />
          </Routes>
          {/* <Orders/> */}
          {/* <OrderDetails/> */}
          {/* <UserDetails/> */}
          {/* <Address/> */}
        </section>
      </div>
    </div>
  )
}

export default Account
