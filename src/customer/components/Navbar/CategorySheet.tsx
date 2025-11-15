/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { furnituresLevelTwo } from '../../../data/category/leveltwo/furnituresLevelTwo'
import { rugsLevelTwo } from '../../../data/category/leveltwo/rugsLevelTwo'
import { lightingLevelTwo } from '../../../data/category/leveltwo/lightingLevelTwo'
import { outdoorLevelTwo } from '../../../data/category/leveltwo/outdoorLevelTwo'
import { furnituresLevelThree } from '../../../data/category/levelthree/furnituresLevelThree'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

// QUAN TRỌNG: Key ở đây phải khớp với categoryId trong mainCategory.ts
const categoryTwo:{[key:string]:any[]} = {
    "furnitures": furnituresLevelTwo,      // Sửa từ furniture -> furnitures
    "rugs": rugsLevelTwo,
    "lighting": lightingLevelTwo,
    "outdoor-garden": outdoorLevelTwo      // Sửa từ outdoor -> outdoor-garden
}

const categoryThree:{[key:string]:any[]} = {
    "furnitures": furnituresLevelThree,    // Sửa từ furniture -> furnitures
}

const CategorySheet = ({selectedCategory}: any) => {

    const navigate = useNavigate();
    
    // Helper function
    const childCategory = (category:any, parentCategoryId:any)=>{
        if(!category) return []; // Bảo vệ nếu không có level 3
        return category.filter((child:any)=> child.parentCategoryId == parentCategoryId)
    }

    // Lấy data của category hiện tại
    const currentData = categoryTwo[selectedCategory];

    // Nếu category được chọn không có dữ liệu (ví dụ: Guides), không render gì cả
    if (!currentData) return null;

    return (
        <Box 
            sx={{zIndex:2}}
            className="bg-white shadow-lg lg:h-[500px] overflow-y-auto border-t border-gray-200"
        >
            <div className='flex text-sm flex-wrap px-20 py-10'>
                {
                    currentData.map((item, index) => (
                        <div key={index} className={`p-8 lg:w-[20%] ${index % 2 !== 0 ? "" : "bg-slate-50"}`}>
                            <p className='mb-5 font-bold text-lg'>{item.name}</p>
                            <ul className='space-y-3'>
                                {childCategory(categoryThree[selectedCategory], item.categoryId).map((childItem:any, childIndex: number) => (
                                    <div key={childIndex}>
                                        <li onClick={()=> navigate("/products/"+item.categoryId)} className='hover:text-[#E27E6A] cursor-pointer text-gray-600 transition-colors'>
                                            {childItem.name}
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    ))
                }
            </div>
        </Box>
    )
}

export default CategorySheet