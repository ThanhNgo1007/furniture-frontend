import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined'
import Storefront from '@mui/icons-material/Storefront'
import { Avatar, Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../State/Store'
import CategorySheet from './CategorySheet'

// ✅ BƯỚC 1: ĐỊNH NGHĨA mainCategory MỚI TẠI ĐÂY
// (Tôi đã sửa "Guilde" thành "Guide" và giữ các categoryId để logic hoạt động)
const mainCategory = [
  { name: 'Furniture', categoryId: 'furnitures' },
  { name: 'Rugs', categoryId: 'rugs' },
  { name: 'Lighting', categoryId: 'lighting' },
  { name: 'Outdoor & Garden', categoryId: 'outdoor-garden' },
  { name: "Seller's Guide", categoryId: 'guides' },
  { name: 'How It Works', categoryId: 'informations' }
]

const Navbar = () => {
  const theme = useTheme()
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'))

  // State để theo dõi category đang được hover
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

  // State để theo dõi scroll navbar
  const [isSticky, setIsSticky] = useState(false)

  const navigate = useNavigate()

  const { auth } = useAppSelector(store => store)

  // Khi hover vào 1 item trên menu -> Set ID
  const handleMouseEnter = (categoryId: string) => {
    setActiveCategoryId(categoryId)
  }

  // Khi chuột rời khỏi toàn bộ khu vực Navbar (bao gồm cả Sheet) -> Reset ID
  const handleMouseLeave = () => {
    setActiveCategoryId(null)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Box
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ${
        isSticky ? 'fixed top-0 left-0 w-full z-50 shadow-md' : 'relative'
      }`}
    >
      {/* Div chứa Navbar */}
      <div className="flex justify-between items-center px-5 lg:px-20 h-[70px] border-b border-gray-300 bg-white relative z-20">
        <div className="flex items-center gap-2">
          <div className="cursor-pointer flex items-center gap-2 pr-4">
            {!isLarge && (
              <IconButton>
                <MenuIcon />
              </IconButton>
            )}
            <h1
              onClick={() => navigate('/')}
              className="logo cursor-pointer text-2xl md:text-4xl text-[#E27E6A]"
            >
              AptDeco
            </h1>
          </div>

          {/* ✅ BƯỚC 2: Code .map() này sẽ tự động dùng mảng mainCategory mới */}
          <ul className="flex items-center font-bold">
            {mainCategory.map(category => (
              <li
                key={category.categoryId}
                onMouseEnter={() => handleMouseEnter(category.categoryId)}
                className="mainCategory cursor-pointer h-[70px] px-4 flex items-center hover:border-b-2 border-[#E27E6A]"
              >
                <span
                  className={`${
                    activeCategoryId === category.categoryId ? 'text-[#E27E6A]' : ''
                  }`}
                >
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-1 lg:gap-6">
          {/* ... (Phần code còn lại giữ nguyên) ... */}
          <IconButton>
            <SearchIcon className="text-gray-700" sx={{ fontSize: 29 }}></SearchIcon>
          </IconButton>
          {auth.isLoggedIn ? (
            <Button
              onClick={() => navigate('/account/orders')}
              className="gap-2 flex items-center"
            >
              <Avatar src="https://avatar.iran.liara.run/public/boy" />
              <h1 className="font-semibold hidden lg:block ml-2">
                {auth.user?.fullName}
              </h1>
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                px: 3,
                borderRadius: '16px',
                '&:hover': { backgroundColor: '#e0e0e0' },
                fontSize: 12
              }}
              className="gap-2"
            >
              <AccountCircleIcon />
              Hej! Log in or Sign up
            </Button>
          )}
          <IconButton>
            <FavoriteBorder className="text-gray-700" sx={{ fontSize: 29 }} />
          </IconButton>
          <IconButton onClick={() => navigate('/cart')}>
            <ShoppingBasketOutlinedIcon className="text-gray-700" sx={{ fontSize: 29 }} />
          </IconButton>
          {isLarge && (
            <Button
              onClick={() => navigate('/become-seller')}
              startIcon={<Storefront />}
              variant="outlined"
            >
              Become Seller
            </Button>
          )}
        </div>
      </div>

      {/* Logic hiển thị CategorySheet (giữ nguyên) */}
      {activeCategoryId && (
        <div className="categorySheet absolute top-[69px] left-0 right-0 z-10">
          <CategorySheet selectedCategory={activeCategoryId} />
        </div>
      )}
    </Box>
  )
}

export default Navbar
