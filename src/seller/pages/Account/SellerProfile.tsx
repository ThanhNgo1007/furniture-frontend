import { Edit } from '@mui/icons-material'
import { Avatar, Button, Divider } from '@mui/material'
import React from 'react'
import ProfileFieldCard from '../../../component/ProfileFieldCard'

const SellerProfile = () => {
  return (
    <div className='lg:px-20 pt-5 pb-20 space-y-20'>
      <div className='w-full lg:w-[70%]'>
        <div className='flex items-center pb-3 justify-between'>
            <h1 className='font-bold text-2xl'>Seller Details</h1>
            <div>
                <Button className="w-16 h-16">
                    <Edit/>
                </Button>
            </div>

        </div>

        <div>
          <Avatar sx={{width: "10rem", height: "10rem", mb: "30px"}} 
          src='https://avatar.iran.liara.run/public/boy'/>
          <div>
            <ProfileFieldCard keys={"Seller Name"} value='Ngo Huu Thanh' />
            <Divider />
            <ProfileFieldCard keys={"Seller Email"} value='nhthanh1007@gmail.com' />
            <Divider />
            <ProfileFieldCard keys={"Seller Mobile"} value='0907941448' />
          </div>
        </div>
        
      </div>

      <div className='w-full lg:w-[70%]'>
        <div className='flex items-center pb-3 justify-between'>
            <h1 className='font-bold text-2xl'>Business Details</h1>
            <div>
                <Button className="w-16 h-16">
                    <Edit />
                </Button>
            </div>

        </div>
          <div>
            <ProfileFieldCard keys={"Business Name/Brand Name"} value='ABC' />
            <Divider />
            <ProfileFieldCard keys={"MST"} value='1i90421803asadn' />
            <Divider />
            <ProfileFieldCard keys={"Account Status"} value='PENDING_VERIFICATION' />
          </div>
        
      </div>

      <div className='w-full lg:w-[70%]'>
        <div className='flex items-center pb-3 justify-between'>
            <h1 className='font-bold text-2xl'>Pickup Address</h1>
            <div>
                <Button className="w-16 h-16">
                    <Edit/>
                </Button>
            </div>

        </div>
          <div>
            <ProfileFieldCard keys={"Address"} value='Ngo Huu Thanh' />
            <Divider />
            <ProfileFieldCard keys={"City"} value='nhthanh1007@gmail.com' />
            <Divider />
            <ProfileFieldCard keys={"Ward"} value='0907941448' />
            <Divider />
            <ProfileFieldCard keys={"Mobile"} value='0907941448' />
          </div>
        
      </div>

      <div className='w-full lg:w-[70%]'>
        <div className='flex items-center pb-3 justify-between'>
            <h1 className='font-bold text-2xl'>Bank Details</h1>
            <div>
                <Button className="w-16 h-16">
                    <Edit/>
                </Button>
            </div>

        </div>
          <div>
            <ProfileFieldCard keys={"Account Holder Name"} value='Ngo Huu Thanh' />
            <Divider />
            <ProfileFieldCard keys={"Account Number"} value='nhthanh1007@gmail.com' />
            <Divider />
            <ProfileFieldCard keys={"Swift Code"} value='0907941448' />
          </div>
        
      </div>


      
        

    </div>
  )
}

export default SellerProfile