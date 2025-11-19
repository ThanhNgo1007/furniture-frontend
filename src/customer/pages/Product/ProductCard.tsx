import { Favorite, ModeComment } from '@mui/icons-material'
import { Button } from '@mui/material'
import { teal } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../../../types/ProductTypes'
import './ProductCard.css'

const ProductCard = ({ item }: { item: Product }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const formatUSD = (price: number) => {
    return `$` + new Intl.NumberFormat('en-US').format(price)
  }

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentImage(prevImage => (prevImage + 1) % item.images.length)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  return (
    <>
      <div
        onClick={() =>
          navigate(
            `/product-details/${item.category?.categoryId}/${item.title}/${item.id}`
          )
        }
        className="group p-4 relative"
      >
        <div
          className="card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            // setCurrentImage(0); // Optional
          }}
        >
          {item.images.map((item, index) => (
            <img
              key={index}
              className="card-media"
              src={item}
              style={{ transform: `translateX(${(index - currentImage) * 100}%)` }}
            />
          ))}
          {isHovered && (
            <div className="indicator flex flex-col items-center space-y-2">
              <div className="flex gap-5">
                <Button variant="contained" color="secondary">
                  <Favorite sx={{ color: teal[300] }} />
                </Button>
                <Button variant="contained" color="secondary">
                  <ModeComment sx={{ color: teal[300] }} />
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="pt-3 space-y-2 group-hover-effect rounded-md">
          {/* Phần tên và mô tả */}
          <div className="name">
            <h1 className="text-sm">
              Sold by
              <span className="text-[#E27E6A] ml-1">
                {item.seller?.bussinessDetails?.bussinessName}
              </span>
            </h1>
            <p className="text-lg font-bold">{item.title}</p>
          </div>

          {/* --- BƯỚC 2: Cập nhật JSX hiển thị giá --- */}
          <div className="space-y-1">
            {' '}
            {/* Bọc giá và % giảm giá trong 1 div */}
            {/* Hàng chứa giá bán và giá gốc */}
            <div className="flex items-baseline gap-3">
              {/* Giá bán (màu đỏ) */}
              <div className="price font-bold text-xl">
                {formatUSD(item.sellingPrice)}
              </div>

              {/* Giá gốc (bị gạch) */}
              <div className="original-price text-base text-gray-500 line-through">
                {formatUSD(item.msrpPrice)}
              </div>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                {item.discountPercent}% OFF
              </span>
            </div>
            {/* Hàng chứa % giảm giá */}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
