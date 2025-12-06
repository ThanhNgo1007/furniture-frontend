import { ElectricBolt, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../../types/orderTypes';

const OrderCard = ({ order }: { order: Order }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const locale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US';
    return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Logic kiểm tra trạng thái lỗi/hủy
  const isError = order.orderStatus === 'CANCELLED' || order.orderStatus === 'FAILED' || order.paymentDetails?.status === 'FAILED';

  // Màu sắc theo trạng thái
  const getStatusColor = () => {
    if (isError) return { bg: '#ef4444', text: 'text-red-500' };
    switch (order.orderStatus) {
      case 'DELIVERED': return { bg: '#10b981', text: 'text-green-500' };
      case 'SHIPPED': return { bg: '#3b82f6', text: 'text-blue-500' };
      case 'CONFIRMED': return { bg: '#f59e0b', text: 'text-amber-500' };
      case 'PENDING': return { bg: '#f0f13f', text: 'text-yellow-300' };
      default: return { bg: '#2dd4bf', text: 'text-teal-400' };
    }
  };

  const statusColor = getStatusColor();

  // Navigate to order details with first item
  const handleOrderClick = () => {
    if (order.orderItems && order.orderItems.length > 0) {
      navigate(`/account/order/${order.id}/${order.orderItems[0].id}`);
    }
  };

  return (
    <Accordion 
      className="border rounded-md"
      sx={{
        '&:before': { display: 'none' },
        boxShadow: 'none',
        border: isError ? '1px solid #fecaca' : '1px solid #e5e7eb',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{ 
          '&:hover': { bgcolor: '#f9fafb' },
          padding: '16px 20px'
        }}
      >
        <div className="flex items-center gap-5 w-full">
          <div>
            <Avatar 
              sizes='small'
              sx={{ 
                bgcolor: statusColor.bg,
                color: 'white' 
              }}
            >
              <ElectricBolt/>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className={`font-bold ${statusColor.text}`}>
                {t(`orders.${order.orderStatus.toLowerCase()}`)}
              </h1>
              <Chip 
                label={`${order.orderItems?.length || 0} ${t('orders.items')}`} 
                size="small" 
                variant="outlined"
              />
            </div>
            <p className="text-gray-500 text-sm">
              {t('orders.orderId')}{order.id} • {formatDate(order.orderDate)}
            </p>
            <p className="text-gray-500 text-xs">
              {t('orders.arrivingBy')} {formatDate(order.deliveryDate)}
            </p>
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: '0 20px 20px 20px' }}>
        <div className="space-y-2">
          {order.orderItems?.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-teal-50 flex gap-3 rounded-md"
            >
              <div>
                <img 
                  className="w-[70px] h-[70px] object-cover rounded" 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                />
              </div>
              <div className='w-full space-y-1'>
                <h1 className='font-bold text-sm'>
                  {item.product.seller?.businessDetails.businessName}
                </h1>
                <p className='line-clamp-2 text-sm text-gray-700'>
                  {item.product.title}
                </p>
                <p className='text-xs text-gray-500'>
                  {t('product.quantity')}: {item.quantity}
                </p>
              </div>
            </div>
          ))}
          
          {/* View Details Button */}
          <button
            onClick={handleOrderClick}
            className="w-full mt-3 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
          >
            {t('orders.viewDetails')}
          </button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderCard;

