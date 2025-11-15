/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import CartItem from './CartItem'
import { Close, LocalOffer } from '@mui/icons-material'
import { blue, orange } from '@mui/material/colors'
import { Button, IconButton, TextField } from '@mui/material'
import PricingCard from './PricingCard'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    
        const [couponCode, setCouponCode] = useState();
        const handleChange = (e: any) => {
            setCouponCode(e.target.value)
    }
    const navigate=useNavigate();
  return (
    <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
            <div className='cartItemSection lg:col-span-2 space-y-3'>
                {[1,1,1,1,1,1].map((item)=><CartItem/>)}

            </div>
            <div className='col-span-1 text-sm space-y-3'>
                <div className='border rounded-md px-5 py-5 space-y-5'>
                    
                        <div className='flex gap-3 text-sm items-center'>
                            <div className='flex gap-3 text-sm items-center'>
                            <LocalOffer sx={{color:blue[700], fontSize: "20px"}}/>
                        </div>
                        <span className='text-lg'>Apply Coupons</span>
                        </div>

                    { true ? <div className='flex justify-between items-center'>
                        <TextField id="outlined-basic" placeholder='COUPON CODE'
                        size='small' onChange={handleChange} fullWidth
                        variant="outlined"/>
                        <Button size="medium" sx={{ color: 'teal' }}>
                            Apply
                        </Button>
                    </div>
                    :<div className='flex '>
                        <div className='p-1 pl-5 pr-3 border border-gray-200 rounded-md flex gap-2 items-center'>
                            <span className=''>CHUCMUNG2010 Applied</span>
                            <IconButton size="small">
                                <Close className='text-red-600'/>
                            </IconButton>
                        </div>
                        </div>}
                </div>
                <div className='border rounded-md border-gray-200'>
                    <PricingCard/>
                    <div className='p-5'>
                        <Button
                        onClick={()=>navigate("/checkout")}
                        color='success'
                        fullWidth
                        variant='contained' 
                        sx={{py: "15px"}}>
                            Buy now
                        </Button>
                    </div>
                </div>

            </div>



        </div>
    </div>
  )
}

export default Cart