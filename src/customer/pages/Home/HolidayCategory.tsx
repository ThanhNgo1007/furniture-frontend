import React from 'react'
import HolidayCategoryCard from './HolidayCategoryCard'

const HolidayCategory = () => {
  return (
    <div className='flex flex-wrap justify-center py-5 gap-4 lg:px-20 border-b'>
      {[1,1,1,1,1,1,1,].map((item) => <HolidayCategoryCard />)}
      
    </div>
  )
}

export default HolidayCategory