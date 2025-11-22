import { Divider } from '@mui/material'
import { useAppSelector } from '../../../State/Store'
import { formatVND } from '../../../Util/formatCurrency'

const PricingCard = () => {
  const { cart } = useAppSelector(store => store.cart)


  if (!cart) return null;

  const subtotal = cart.totalMsrpPrice || 0;
  const total = cart.totalSellingPrice || 0;
  
  // Tổng số tiền giảm (Sản phẩm + Coupon)
  const totalDiscount = subtotal - total;

  return (
    <div className='space-y-3 p-5 text-lg'>
        <div className='flex justify-between items-center'>
            <span>Subtotal</span>
            <span className="font-medium">{formatVND(subtotal)}</span>
        </div>

        <div className='flex justify-between items-center'>
            <span>Discount</span>
            <span className="text-green-600 font-medium">
                - {formatVND(totalDiscount)}
            </span>
        </div>

        {/* Nếu có coupon, hiển thị thêm dòng chú thích (Tùy chọn) */}
        {cart.couponCode && (
             <div className='flex justify-between items-center text-sm text-gray-500'>
                <span>(Coupon applied)</span>
            </div>
        )}

        <div className='flex justify-between items-center'>
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
        </div>

        <div className='flex justify-between items-center'>
            <span>Platform fee</span>
            <span className="text-green-600">Free</span>
        </div>

        <Divider/>

        <div className='flex justify-between items-center text-teal-600 py-2 font-bold text-xl'>
            <span>Total</span>
            <span>{formatVND(total)}</span>
        </div>
    </div>
  )
}

export default PricingCard