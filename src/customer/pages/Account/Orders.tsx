/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { fetchUserOrderHistory } from '../../../State/customer/orderSlice'
import OrderCard from './OrderCard'

const Orders = () => {
  const dispatch = useAppDispatch()
  const { order } = useAppSelector(store => store)

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""))
  },[])
  
  return (
    <div className='text-sm min-h-screen'>
      <div className="pb-5">
        <h1 className='font-semibold'>All Orders</h1>
        <p>from anytime</p>
      </div>
      <div className='space-y-3'>
        {order.orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

export default Orders