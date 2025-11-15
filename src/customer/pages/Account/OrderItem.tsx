import { ElectricBolt } from '@mui/icons-material'
import { Avatar } from '@mui/material'
import React from 'react'

const OrderItem = () => {
  return (
    <div className='text-sm bg-white p-5 space-y-4 border rounded-md cursor-pointer'>
      <div className='flex items-center gap-5'>
        <div>
          <Avatar sizes='small'>
            <ElectricBolt/>
          </Avatar>
        </div>
        <div>
          <h1 className="font-bold text-teal-400">PENDING</h1>
          <p>Arriving By Wed, 22 Oct</p>
        </div>
      </div>
      <div className="p-5 bg-teal-50 flex gap-3">
        <div>
          <img className="w-[70px]" src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storklinta-6-drawer-dresser-white-anchor-1_fkmzra.avif"
           alt="" />
        </div>
        <div className='w-full space-y-2'>
          <h1 className='font-bold'>Storklinta</h1>
          <p>6-drawer dresser, white/anchor/unlock function, 55 1/8x18 7/8x29 1/2 "</p>
        </div>
      </div>

    </div>
  )
}

export default OrderItem