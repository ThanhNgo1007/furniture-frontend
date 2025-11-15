import { Add, Close, Remove } from '@mui/icons-material'
import { Button, Divider, IconButton } from '@mui/material'
import React from 'react'

const CartItem = () => {

    const handleUpdateQuantity=()=>{
        //update cart quantity
    }
  return (
    <div className='border rounded-md relative'>

        <div className='p-5 flex gap-3'>

            <div className="">
                <img className="w-[90px] rounded-md" src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storklinta-6-drawer-dresser-white-anchor-1_fkmzra.avif" 
                alt="" />
            </div>
            <div className="space-y-2">

                <h1 className='font-semibold text-lg'>Storklinta</h1>
                <p className='text-gray-600 font-medium text-sm'>6-drawer dresser, white/anchor/unlock function, 55 1/8x18 7/8x29 1/2 "</p>
                <p className='text-gray-400 text-xs'><strong>Sold by: </strong>IKEA</p>
                <p className='text-sm'>7 days replacement available</p>
                <p className='text-sm text-gray-500'><strong>quantity: </strong>5</p>

            </div>

        </div>

            <Divider/>

        <div className='justify-between flex items-center '>
            <div className='px-5 py-2 flex justify-between items-center'>

                <div className="flex items-center gap-2 w-[140px] justify-between">
                     <Button 
                                      variant="text"
                                      disabled={true}
                                      sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '10px' }}
                                      onClick={handleUpdateQuantity}
                                      
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
                                      {5}
                                    </Button>
                                    
                                    {/* Nút Cộng */}
                                    <Button 
                                      variant="text"
                                      sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '40px' }}
                                      onClick={handleUpdateQuantity}
                                    >
                                      <Add fontSize="small" />
                                    </Button>
                </div>

            </div>
            <div className='pr-5'>
                <p className='text-gray-700 font-medium'>$299.99    </p>
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

export default CartItem