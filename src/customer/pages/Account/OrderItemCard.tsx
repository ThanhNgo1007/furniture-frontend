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

  // --- THÊM HÀM XỬ LÝ CLICK ---
  const handleOrderDetails = () => {
    // Điều hướng theo cấu trúc route đã định nghĩa trong Account.tsx
    // /account (Parent) + /order/:orderId/:orderItemId (Child)
    navigate(`/account/order/${order.id}/${item.id}`);
  }

  return (
    <div 
      onClick={handleOrderDetails} // <--- THÊM SỰ KIỆN ONCLICK VÀO ĐÂY
      className='text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer hover:shadow-md transition-shadow duration-300' // Thêm hover effect cho đẹp
    >
      <div className='flex items-center gap-5'>
        <div>
          <Avatar sizes='small'
          sx={{ bgcolor: '#2dd4bf', color: 'white' }}>
            <ElectricBolt/>
          </Avatar>
        </div>
        <div>
          <h1 className="font-bold text-teal-400">{order.orderStatus}</h1>
          <p>Arriving Latest By {formatDate(order.deliveryDate)}</p>
        </div>
      </div>
      <div className="p-5 bg-teal-50 flex gap-3">
        <div>
          <img className="w-[70px]" src={item.product.images[0]}
           alt="" />
        </div>
        <div className='w-full space-y-2'>
          <h1 className='font-bold'>{item.product.seller?.bussinessDetails.bussinessName}</h1>
          <p>{item.product.title}</p>
        </div>
      </div>

    </div>
  )
}

export default OrderItemCard