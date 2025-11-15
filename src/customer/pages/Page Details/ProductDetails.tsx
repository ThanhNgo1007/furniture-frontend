/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import StarIcon from '@mui/icons-material/Star'
import { orange, teal } from '@mui/material/colors'
import { Box, Button, Divider } from '@mui/material'
import { Add, LocalShipping, Remove, Shield, Wallet, WorkspacePremium } from '@mui/icons-material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SimilarProduct from './SimilarProduct'
import ReviewCard from '../Product/Review/ReviewCard'

const ProductDetails = () => {
  const [quantity,setQuantity] = useState(1);
  return (
    <div className='px-5 lg:px-20 pt-10'>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <section className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
            {[1,1,1,1,1].map((item)=><img className="lg:w-full w-[50px] cursor-pointer rounded-md" 
            src='https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storklinta-6-drawer-dresser-white-anchor-2_ct3ypt.avif' alt=''/>)}
          
          </div>
          <div className='w-full lg:w-[85%]'>
            <img
            className='w-full rounded-md' 
            src="https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760811578/storklinta-6-drawer-dresser-white-anchor-1_fkmzra.avif" 
            alt="" />

          </div>
        </section>
        <section className="">
          <div className='flex justify-between'>
            <h1 className='font-bold text-lg'>
              Stoklinta
          </h1>
          <FavoriteBorderIcon sx={{bgcolor: 'white'}} />

          </div>
          
          <p className='text-gray-500 font-semibold'>Dressers & storage drawers</p>
          <div className='flex justify-between items-center py-2 border w-[180px] px-3 mt-5'>
            <div className="flex gap-1 items-center">
              <span>4</span>
              <StarIcon sx={{
                color:orange[500],
                fontSize: "17px"
              }}/>
            </div>
            <Divider orientation='vertical' flexItem/>
            <span>
              123 Ratings
            </span>
          </div>
         <div>
           <div className='price font-bold text-3xl mt-5 space-x-6'>
          <span>
            $249<sup className='font-bold text-2xl'>.99</sup>
          </span>
            <span className='bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded '>
                  30% OFF
            </span>
            <div className='original-price text-base text-gray-500 line-through'>
              $399.00
            </div>
        </div>
         <p className='text-xs'>Designed to meet the US Federal Stability Standard
        </p>
         </div>
         <div className='mt-7 space-y-3'>
          <div className='flex items-center gap-4'>
            <Shield sx={{color:teal[500]}}/>
            <p>Quality Assured</p>
          </div>
          <div className='flex items-center gap-4'>
            <WorkspacePremium sx={{color:teal[500]}}/>
            <p>100% money back guarantee</p>
          </div>
          <div className='flex items-center gap-4'>
            <LocalShipping sx={{color:teal[500]}}/>
            <p>Shipping Worldwide</p>
          </div>
          <div className='flex items-center gap-4'>
            <Wallet sx={{color:teal[500]}}/>
            <p>Cash On Delivery available</p>
          </div>

         </div>
         <div className='mt-7 space-y-2'>
              <h1>
                QUANTITY
              </h1>
              {/* THAY THẾ BẰNG CODE BÊN DƯỚI */}
              
              {/* 1. Dùng Box làm khung bo tròn bên ngoài */}
              <div className='flex items-center gap-2 justify-between'>
                <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'grey.400',
                  borderRadius: '30px',
                  py: 1 // Bo tròn thành viên thuốc
                }}
              >
                
                {/* Nút Trừ */}
                <Button 
                  variant="text"
                  disabled={quantity === 1}
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '10px' }}
                  onClick={()=>setQuantity(quantity-1)}
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
                  {quantity}
                </Button>
                
                {/* Nút Cộng */}
                <Button 
                  variant="text"
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '40px' }}
                  onClick={()=>setQuantity(quantity+1)}
                >
                  <Add fontSize="small" />
                </Button>
              </Box>
              <Button
                  variant="contained"
                  sx={{
                    flexGrow: 1, // Tự động co giãn lấp đầy không gian
                    borderRadius: '30px', // Bo tròn
                    bgcolor: '#0D47A1', // Màu xanh dương (hoặc #mã_màu của bạn)
                    color: 'white',
                    fontWeight: 'semi-bold',
                    textTransform: 'none', // Chữ "Add to bag" không bị VIẾT HOA
                    fontSize: '1rem',
                    py: 1.5, // Tăng độ cao của nút
                  }}
                >
                  Add to Bag
                </Button>
                
              </div>

         </div>

         <div className='mt-5'>
          <p>
            The STORKLINTA series has a modern, simple design that is easy to live with. 
            The chest of drawers comes with Anchor and Unlock that helps to reduce the tip-over risk when combined with wall-anchoring.
            <br/>
            6-drawer dresser, white/anchor/unlock function, 55 1/8x18 7/8x29 1/2"
          </p>
         </div>
         <div className='mt-7 space-y-5'>
          <ReviewCard/>
          <Divider/>
         </div>
       
        </section>
      </div>
      <div className='mt-20'>
        <h1 className='text-lg font-bold'>
          Similar Product
        </h1>
        <div className="pt-5">
          <SimilarProduct/>
          </div>
      </div>

    </div>
  )
}

export default ProductDetails