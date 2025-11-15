import React from 'react'
import HolidayCategory from './HolidayCategory'
import CategoryGrid from './CategoryGrid/CategoryGrid'
import Deal from './Deal/Deal'
import Introduction from './Introduction'
import RoomCategory from './ShopByCategory/ShopByCategory'
import banner from '@/assets/seller.jpg'
import Button from '@mui/material/Button'
import CommunityImpact from './CommunityImpact'

const Home = () => {
  return (
    <>
        <div className='space-y-5 lg:space-y-10 relative'>
            <HolidayCategory/>
            <Introduction/>
            <CategoryGrid/>
            <Deal/>
            <CommunityImpact/>
            <RoomCategory/>
        </div>
        <section 
  className='mt-20 relative h-[600px] lg:h-[1100px] overflow-hidden text-white'
>
  {/* SỬA 2: Thêm 'object-top'
    'object-top' sẽ căn 'object-cover' lên trên cùng thay vì ở giữa
  */}
  <img 
    className='absolute top-0 left-0 w-full h-full object-cover object-top z-0 px-4' 
    src={banner}
    alt="Start selling on FurniShop"
  />

  {/* Phần chữ và nút giữ nguyên, vẫn dùng clamp() để responsive */}
  <div 
    className='absolute z-10 top-1/3 right-4 lg:right-[15rem] 
               -translate-y-1/2 font-semibold space-y-3 text-right'
  >
    <h1 className='text-[clamp(2rem,5vw,3.75rem)] leading-tight'>
      Sell your product
    </h1>
    <h1 className='text-[clamp(1.125rem,3vw,1.5rem)]'>
      on FurniShop
    </h1>
    
    <div className='pt-5 flex justify-end'>
      <Button 
        variant='contained' 
        color='warning' 
        sx={{ 
          fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
          padding: 'clamp(10px, 2vw, 15px) clamp(20px, 4vw, 30px)'
        }}
      >
        Start selling
      </Button>
    </div>
  </div>
</section>
          </>
      
          
          )
          }

          export default Home