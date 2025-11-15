import { Divider } from '@mui/material'
import React from 'react'

const PricingCard = () => {
  return (
    <div className='space-y-3 p-5 text-lg'>
        <div className='flex justify-between items-center'>
            <span>Subtotal</span>
            <span>$299.99</span>

        </div>
        <div className='flex justify-between items-center'>
            <span>Discount</span>
            <span></span>

        </div>
        <div className='flex justify-between items-center'>
            <span>Shipping</span>
            <span>Free</span>

        </div>
        <div className='flex justify-between items-center'>
            <span>Plateform fee</span>
            <span>Free</span>

        </div>
        <Divider/>
        <div className='flex justify-between items-center text-teal-500 py-2'>
            <span>Total</span>
            <span>$299.99</span>

        </div>
        
    </div>
  )
}

export default PricingCard