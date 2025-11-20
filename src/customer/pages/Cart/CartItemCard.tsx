import { Add, Close, Remove } from '@mui/icons-material';
import { Button, Divider, IconButton } from '@mui/material';
import { useAppDispatch } from '../../../State/Store';
import { updateCartItem } from '../../../State/customer/cartSlice';
import { type CartItem } from '../../../types/cartTypes';

const CartItemCard = ({item}: {item: CartItem}) => {

  const dispatch=useAppDispatch();

    const handleUpdateQuantity=(value:number) => () =>{
        //update cart quantity
        dispatch(updateCartItem({jwt: localStorage.getItem("jwt"), cartItemId: item.id, cartItem: {quantity: item.quantity+value}}));
    }

    const formatUSD = (price: number) => {
    return `$` + new Intl.NumberFormat('en-US').format(price)
  }
  return (
    <div className='border border-gray-200 rounded-md relative'>

        <div className='p-5 flex gap-3'>

            <div>
                <img className="w-[150px] rounded-md" src={item.product.images[0]} 
                alt="" />
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
            <div className='px-5 py-2 flex justify-between items-center'>

                <div className="flex items-center gap-2 w-[140px] justify-between">
                     <Button 
                                      variant="text"
                                      disabled={item.quantity<=1}
                                      sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '10px' }}
                                      onClick={handleUpdateQuantity(-1)}
                                      
                                    >
                                      <Remove fontSize="small" />
                                    </Button>
                                    
                                    {/* Nút hiển thị số lượng */}
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
                                    
                                    {/* Nút Cộng */}
                                    <Button 
                                      variant="text"
                                      sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '40px' }}
                                      onClick={handleUpdateQuantity(1)}
                                    >
                                      <Add fontSize="small" />
                                    </Button>
                </div>

            </div>
            
            <div className='flex items-center gap-2 pr-5'>
              <p className='text-gray-700 font-medium line-through'>{formatUSD(item.msrpPrice)}</p>
              <p className='text-gray-700 font-medium'>{formatUSD(item.sellingPrice)}</p>
              
            </div>
        </div>
        <div className='absolute top-1 right-1'>
            <IconButton color='warning'>
                <Close/>
            </IconButton>
        </div>

    </div>
  )
}

export default CartItemCard