import React from 'react'
import pic1 from '@/assets/pic8.jpg';
import pic2 from '@/assets/pic4.jpg';
import pic3 from '@/assets/pic7.jpg';
import pic4 from '@/assets/grid4.jpg';
import pic5 from '@/assets/grid5.jpg';

const CategoryGrid = () => {
  return (
    <div className='grid gap-4 grid-rows-16 grid-cols-12 lg:h-[600px] px-5 lg:px-40'>
        <div className='col-span-3 row-span-8 w-full h-full'>
            <img className='w-full h-full object rounded-md' 
            src={pic1} alt=''></img>
        </div>
        <div className='col-span-3 row-span-10 w-full h-full'>
            <img className='h-full w-full object-cover rounded-md'
             src={pic2} alt=''></img>
        </div>   
        <div className='col-span-6 row-span-18 w-full h-full'>
            <img className='h-full w-full object-cover rounded-md'
            src={pic3} alt=''></img>
        </div>
        <div className='col-span-3 row-span-10 w-full h-full'>
            <img className='w-full h-full object-cover rounded-md'
            src={pic4} alt=''></img>
        </div>
        <div className='col-span-3 row-span-8 w-full h-full'>
            <img className='w-full h-full object-cover rounded-md'
            src={pic5} alt=''></img>
        </div>
        
         
        
        
        
       
     
        
    </div>
  )
}

export default CategoryGrid