/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { furnituresLevelThree } from '../../../data/category/levelthree/furnituresLevelThree'
import { furnituresLevelTwo } from '../../../data/category/leveltwo/furnituresLevelTwo'
import { lightingLevelTwo } from '../../../data/category/leveltwo/lightingLevelTwo'
import { outdoorLevelTwo } from '../../../data/category/leveltwo/outdoorLevelTwo'
import { rugsLevelTwo } from '../../../data/category/leveltwo/rugsLevelTwo'

// Các key này đã chính xác, khớp với categoryId trong Navbar.tsx
const categoryTwo: { [key: string]: any[] } = {
  furnitures: furnituresLevelTwo,
  rugs: rugsLevelTwo,
  lighting: lightingLevelTwo,
  'outdoor-garden': outdoorLevelTwo
}

const categoryThree: { [key: string]: any[] } = {
  furnitures: furnituresLevelThree
}

const CategorySheet = ({ selectedCategory }: any) => {
  const navigate = useNavigate()

  // Helper function
  const childCategory = (category: any, parentCategoryId: any): any[] => {
    if (!category) return [] // Bảo vệ nếu không có level 3
    return category.filter((child: any) => child.parentCategoryId == parentCategoryId)
  }

  // Lấy data của category hiện tại
  const currentData = categoryTwo[selectedCategory]

  // Nếu category được chọn không có dữ liệu (ví dụ: Guides), không render gì cả
  if (!currentData) return null

  return (
    <Box
      sx={{ zIndex: 2 }}
      className="bg-white shadow-lg lg:h-[500px] overflow-y-auto border-t border-gray-200"
    >
      {/* Căn chỉnh lề cho khớp với Navbar */}
      <div className="flex text-sm flex-wrap px-20 py-10 max-w-7xl mx-auto">
        {currentData.map(
          (
            item // 'item' là category cấp 2
          ) => (
            <div
              key={item.categoryId}
              className={`p-8 lg:w-[20%] ${
                item.name.length % 2 !== 0 ? '' : 'bg-slate-50'
              }`}
            >
              <p className="mb-5 font-bold text-lg">{item.name}</p>
              <ul className="space-y-3">
                {childCategory(categoryThree[selectedCategory], item.categoryId).map(
                  (
                    childItem: any // 'childItem' là category cấp 3
                  ) => (
                    <div key={childItem.categoryId}>
                      {/* ✅ SỬA LỖI Ở ĐÂY:
                                          Thay item.categoryId bằng childItem.categoryId
                                        */}
                      <li
                        onClick={() => navigate(`/products/${childItem.categoryId}`)}
                        className="hover:text-[#E27E6A] cursor-pointer text-gray-600 transition-colors"
                      >
                        {childItem.name}
                      </li>
                    </div>
                  )
                )}
              </ul>
            </div>
          )
        )}
      </div>
    </Box>
  )
}

export default CategorySheet
