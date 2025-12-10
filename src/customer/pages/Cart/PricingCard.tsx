import { Divider } from '@mui/material'
import { useAppSelector } from '../../../State/Store'
import { formatVND } from '../../../Util/formatCurrency'
// 1. Import các hàm tính toán
import { useMemo } from 'react'
import { sumCartItemMsrpPrice, sumCartItemSellingPrice } from '../../../Util/sumCartItemMsrpPrice'

const PricingCard = () => {
  const { cart } = useAppSelector(store => store.cart)

  const { subtotal, totalDiscount, couponDiscount, finalTotal } = useMemo(() => {
      if (!cart) return { subtotal: 0, totalDiscount: 0, couponDiscount: 0, finalTotal: 0 };

      const allItems = cart.cartItemsInBag || [];
      
      // Filter only available items for price calculation
      const availableItems = allItems.filter(item => {
          const product = item.product;
          // Unavailable if: isActive is false OR quantity is 0 or less
          const isUnavailable = product.isActive === false || (product.quantity !== undefined && product.quantity <= 0);
          return !isUnavailable;
      });
      
      // Giá gốc (MSRP) - chỉ tính sản phẩm available
      const sub = sumCartItemMsrpPrice(availableItems);
      // Tổng sau discount sản phẩm (chưa có coupon)
      const totalBeforeCoupon = sumCartItemSellingPrice(availableItems);
      // Discount từ sản phẩm
      const productDiscount = sub - totalBeforeCoupon;
      
      // Coupon discount: tính từ percentage × totalBeforeCoupon / 100
      // cart.discount stores PERCENTAGE (e.g., 10 for 10%)
      const discountPercent = cart.discount || 0;
      const couponD = Math.round(totalBeforeCoupon * discountPercent / 100);
      
      // Final total = totalBeforeCoupon - couponDiscount (recalculated from available items)
      const final = totalBeforeCoupon - couponD;
      
      return {
          subtotal: sub,
          totalDiscount: productDiscount,
          couponDiscount: couponD,
          finalTotal: final
      };
  }, [cart]);

  if (!cart) return null;

  return (
    <div className='space-y-3 p-5 text-lg'>
        <div className='flex justify-between items-center'>
            <span>Subtotal</span>
            <span className="font-medium">{formatVND(subtotal)}</span>
        </div>

        <div className='flex justify-between items-center'>
            <span>Product Discount</span>
            <span className="text-green-600 font-medium">
                - {formatVND(totalDiscount)}
            </span>
        </div>

        {/* Hiển thị Coupon discount nếu có */}
        {cart.couponCode && couponDiscount > 0 && (
             <div className='flex justify-between items-center'>
                <span className="text-sm">Coupon ({cart.couponCode})</span>
                <span className="text-green-600 font-medium">
                    - {formatVND(couponDiscount)}
                </span>
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
            <span>{formatVND(finalTotal)}</span>
        </div>
    </div>
  )
}

export default PricingCard