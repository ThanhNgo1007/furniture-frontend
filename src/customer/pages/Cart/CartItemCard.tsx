import { Add, Close, Remove } from '@mui/icons-material';
import { Button, Divider, IconButton, Typography } from '@mui/material';
// 1. Import thêm deleteCartItem
import { useState } from 'react';
import { deleteCartItem, updateCartItem } from '../../../State/customer/cartSlice';
import { useAppDispatch } from '../../../State/Store';
import { type CartItem } from '../../../types/cartTypes';
import { formatVND } from '../../../Util/formatCurrency';

const CartItemCard = ({item}: {item: CartItem}) => {

  const dispatch = useAppDispatch();

  // --- STATE THÔNG BÁO LỖI ---
  const [errorMessage, setErrorMessage] = useState<string>("");

  const stockQuantity = item.product.quantity;

  const handleUpdateQuantity = (value: number) => () => {
      // Trường hợp TĂNG số lượng
      if (value > 0) {
          if (item.quantity + value > (stockQuantity || 0)) {
              setErrorMessage(`Kho chỉ còn ${stockQuantity} sp`);
              return; // Chặn không cho dispatch
          }
      }
      
      // Trường hợp GIẢM hoặc TĂNG hợp lệ
      setErrorMessage(""); // Xóa lỗi cũ
      dispatch(updateCartItem({
          jwt: localStorage.getItem("jwt"), 
          cartItemId: item.id, 
          cartItem: { quantity: item.quantity + value }
      }));
  }

  const handleRemoveCartItem = () => {
      if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
          dispatch(deleteCartItem({
              jwt: localStorage.getItem("jwt") || "",
              cartItemId: item.id
          }));
      }
  }

  return (
    <div className='border border-gray-200 rounded-md relative'>

        <div className='p-5 flex gap-3'>
            <div>
                <img className="w-[150px] rounded-md" src={item.product.images[0]} alt="" />
            </div>
            <div className="space-y-2">
                <h1 className='font-semibold text-lg'>{item.product.title}</h1>
                <p className='text-gray-600 font-medium text-sm line-clamp-1'>{item.product.description}</p>
                <p className='text-gray-400 text-xs'><strong>Sold by: </strong>{item.product.seller?.bussinessDetails.bussinessName}</p>
                <p className='text-sm'>7 days replacement available</p>
                <p className='text-sm text-gray-500'><strong>quantity: </strong>{item.quantity}</p>
            </div>
        </div>

        <Divider/>

        <div className='justify-between flex items-center '>
            <div className='px-5 py-2 flex flex-col'> {/* Sửa flex để chứa thông báo lỗi */}
                <div className="flex items-center gap-2 w-[140px] justify-between">
                     <Button 
                          variant="text"
                          disabled={item.quantity <= 1}
                          sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '10px' }}
                          onClick={handleUpdateQuantity(-1)}
                      >
                        <Remove fontSize="small" />
                      </Button>
                      
                      <Button 
                        variant="text"
                        disabled
                        sx={{ 
                          fontWeight: 'bold',
                          '&.Mui-disabled': { color: 'text.primary' },
                          minWidth: '30px'
                        }}
                      >
                        {item.quantity}
                      </Button>
                      
                      <Button 
                        variant="text"
                        // BỎ DISABLED CHECK STOCK Ở ĐÂY để cho phép click và hiện lỗi
                        sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '40px' }}
                        onClick={handleUpdateQuantity(1)}
                      >
                        <Add fontSize="small" />
                      </Button>
                </div>

                {/* --- THÔNG BÁO LỖI --- */}
                {errorMessage && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, fontSize: '0.7rem', width: 'max-content' }}>
                        {errorMessage}
                    </Typography>
                )}
            </div>
            
            <div className='flex items-center gap-2 pr-5'>
              <p className='text-gray-700 font-medium line-through'>{formatVND(item.msrpPrice)}</p>
              <p className='text-gray-700 font-medium'>{formatVND(item.sellingPrice)}</p>
            </div>
        </div>

        <div className='absolute top-1 right-1'>
            <IconButton 
                color='error' 
                onClick={handleRemoveCartItem}
            >
                <Close/>
            </IconButton>
        </div>

    </div>
  )
}

export default CartItemCard