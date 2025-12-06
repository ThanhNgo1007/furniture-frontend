/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { fetchUserOrderHistory } from '../../../State/customer/orderSlice'
import OrderCard from './OrderCard'

const Orders = () => {
  const dispatch = useAppDispatch()
  const { orders } = useAppSelector(store => store.order)
  const [activeFilter, setActiveFilter] = useState("ALL")
  const { t, i18n } = useTranslation()

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""))
  },[])

  const filterOptions = [
    { label: t('orders.allOrders'), value: "ALL" },
    { label: t('orders.pending'), value: "PENDING" },
    { label: t('orders.confirmed'), value: "CONFIRMED" },
    { label: t('orders.placed'), value: "PLACED" },
    { label: t('orders.shipped'), value: "SHIPPED" },
    { label: t('orders.delivered'), value: "DELIVERED" },
    { label: t('orders.cancelled'), value: "CANCELLED" },
  ]

  const [visibleCount, setVisibleCount] = useState(5)

  const filteredOrders = activeFilter === "ALL" 
    ? orders 
    : orders.filter((order: any) => order.orderStatus === activeFilter)

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(5)
  }, [activeFilter])

  // Group orders by date
  const groupedOrders = filteredOrders.slice(0, visibleCount).reduce((groups: Record<string, any[]>, order: any) => {
    const locale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US'
    const date = new Date(order.orderDate).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(order)
    return groups
  }, {} as Record<string, any[]>)

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5)
  }
  
  return (
    <div className='text-sm min-h-screen'>
      <div className="pb-5">
        <h1 className='font-semibold'>{t('orders.allOrders')}</h1>
        <p>{t('orders.fromAnytime')}</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap pb-4">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${activeFilter === option.value 
                ? 'bg-primary-main text-white bg-teal-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className='space-y-6'>
        {Object.keys(groupedOrders).length > 0 ? (
          <>
            {Object.entries(groupedOrders).map(([date, orders]) => (
              <div key={date} className="space-y-3">
                <h3 className="font-medium text-gray-500 sticky top-0 bg-white py-2 z-10">
                  {date}
                </h3>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            ))}
            
            {visibleCount < filteredOrders.length && (
              <div className="text-center pt-4">
                <button 
                  onClick={handleShowMore}
                  className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('orders.showMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {t('orders.noOrders')} "{activeFilter}"
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders