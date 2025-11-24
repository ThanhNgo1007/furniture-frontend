import { Divider } from '@mui/material'
import { useAppSelector } from '../../../State/Store'
import { formatVND } from '../../../Util/formatCurrency'
// 1. Import các hàm tính toán
import { useMemo } from 'react'
import { sumCartItemMsrpPrice, sumCartItemSellingPrice } from '../../../Util/sumCartItemMsrpPrice'

const PricingCard = () => {
  const { cart } = useAppSelector(store => store.cart)

  const { subtotal, total, totalDiscount } = useMemo(() => {
      if (!cart) return { subtotal: 0, total: 0, totalDiscount: 0 };

      const items = cart.cartItemsInBag || [];
      // Giả sử bạn import đúng hàm tính tổng
      const sub = sumCartItemMsrpPrice(items);
      const tot = sumCartItemSellingPrice(items);
      
      return {
          subtotal: sub,
          total: tot,
          totalDiscount: sub - tot
      };
  }, [cart]); // Chỉ tính lại khi object cart thay đổi

  if (!cart) return null;

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

        {/* Hiển thị Coupon nếu có */}
        {cart.couponCode && (
             <div className='flex justify-between items-center text-sm text-gray-500'>
                <span>(Coupon applied: {cart.couponCode})</span>
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