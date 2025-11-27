import { ElectricBolt } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { Order, OrderItem } from '../../../types/orderTypes'

const OrderItemCard = ({item, order}: {item: OrderItem, order: Order}) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const handleOrderDetails = () => {
    navigate(`/account/order/${order.id}/${item.id}`);
  }

  // Logic kiểm tra trạng thái lỗi/hủy
  const isError = order.orderStatus === 'CANCELLED' || order.orderStatus === 'FAILED' || order.paymentDetails?.status === 'FAILED';

  return (
    <div 
      onClick={handleOrderDetails} 
      className={`text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer hover:shadow-md transition-shadow duration-300 
        ${isError ? 'border-red-200' : 'border-gray-200'} 
      `}
    >
      <div className='flex items-center gap-5'>
        <div>
          {/* Đổi màu Icon dựa trên trạng thái */}
          <Avatar sizes='small'
            sx={{ 
              bgcolor: isError ? '#ef4444' : '#2dd4bf', // Đỏ nếu lỗi, Xanh nếu bình thường
              color: 'white' 
            }}
          >
            <ElectricBolt/>
          </Avatar>
        </div>
        <div>
          {/* Đổi màu chữ trạng thái */}
          <h1 className={`font-bold ${isError ? 'text-red-500' : 'text-teal-400'}`}>
            {order.orderStatus}
          </h1>
          <p className="text-gray-500">Arriving Latest By {formatDate(order.deliveryDate)}</p>
        </div>
      </div>
      
      <div className="p-5 bg-teal-50 flex gap-3 rounded-md">
        <div>
          <img className="w-[70px] h-[70px] object-cover rounded" src={item.product.images[0]} alt="" />
        </div>
        <div className='w-full space-y-2'>
          <h1 className='font-bold'>{item.product.seller?.businessDetails.businessName}</h1>
          <p className='line-clamp-2'>{item.product.title}</p>
        </div>
      </div>

    </div>
  )
}

export default OrderItemCard