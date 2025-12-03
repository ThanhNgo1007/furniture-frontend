/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { furnituresLevelThree } from '../../../data/category/levelthree/furnituresLevelThree'
import { lightingLevelThree } from '../../../data/category/levelthree/lightingLevelThree'
import { outdoorLevelThree } from '../../../data/category/levelthree/outdoorLevelThree'
import { rugsLevelThree } from '../../../data/category/levelthree/rugsLevelThree'
import { furnituresLevelTwo } from '../../../data/category/leveltwo/furnituresLevelTwo'
import { lightingLevelTwo } from '../../../data/category/leveltwo/lightingLevelTwo'
import { outdoorLevelTwo } from '../../../data/category/leveltwo/outdoorLevelTwo'
import { rugsLevelTwo } from '../../../data/category/leveltwo/rugsLevelTwo'

// Các key này đã chính xác, khớp với categoryId trong Navbar.tsx
const categoryTwo: { [key: string]: any[] } = {
  furnitures: furnituresLevelTwo,
  rugs: rugsLevelTwo,
  lighting: lightingLevelTwo,
  "outdoor-garden": outdoorLevelTwo
}

const categoryThree: { [key: string]: any[] } = {
  furnitures: furnituresLevelThree,
  lighting: lightingLevelThree,
  "outdoor-garden": outdoorLevelThree,
  rugs: rugsLevelThree
}

const CategorySheet = ({ selectedCategory, handleClose }: any) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
      <div className="flex text-sm flex-wrap px-10 py-10 max-w-8xl mx-auto">
        {currentData.map((item, index) => (
            <div
              key={item.categoryId}
              className={`p-8 lg:w-[20%] ${
                index % 2 === 1 ? 'bg-slate-50' : 'bg-white'
              }`}
            >
              <p className="mb-5 font-bold text-lg">{t(`category.level2.${item.categoryId}`)}</p>
              <ul className="space-y-3">
                {childCategory(categoryThree[selectedCategory], item.categoryId).map(
                  (childItem: any) => (
                    <div key={childItem.categoryId}>
                      <li
                        onClick={() => {
                            // 1. Điều hướng đến trang sản phẩm
                            navigate(`/products/${childItem.parentCategoryId}/${childItem.categoryId}`)
                            // 2. Đóng CategorySheet
                            if (handleClose) handleClose();
                        }}
                        className="hover:text-[#E27E6A] cursor-pointer text-gray-600 transition-colors"
                      >
                        {t(`category.level3.${childItem.categoryId}`)}
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
