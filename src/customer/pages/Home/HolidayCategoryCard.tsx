import React from 'react'
import treeImage from '@/assets/tree-ornaments-accessories-49155.jpeg';

const HolidayCategoryCard = () => {
  return (
    <div className="cursor-pointer rounded-lg bg-gray-100 p-4 group 
    border border-transparent transition-all 
    hover:border-black text-center hover:underline ">
        <img className="object-contain h-10 mb-4 h-32 w-32" src={treeImage} alt=" " />
        <h2 className='text-sm font-semi'>Holiday decor</h2>
    </div>
  )
}

export default HolidayCategoryCard