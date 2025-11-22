import { Favorite, FavoriteBorder, ModeComment } from '@mui/icons-material'; // Thêm FavoriteBorder
import { Button } from '@mui/material'
import { teal } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addProductToWishlist } from '../../../State/customer/wishlistSlice'
import { useAppDispatch } from '../../../State/Store'
import type { Product } from '../../../types/ProductTypes'
import { formatVND } from '../../../Util/formatCurrency'
import './ProductCard.css'

const ProductCard = ({ item }: { item: Product }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  
  // State quản lý trạng thái yêu thích (trong thực tế nên check từ store xem ID này có chưa)
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentImage(prevImage => (prevImage + 1) % item.images.length)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    // KIỂM TRA: Chỉ thực hiện nếu item.id tồn tại (không phải undefined)
    if (item.id) {
        dispatch(addProductToWishlist({ productId: item.id }));
        setIsWishlisted(!isWishlisted);
        console.log("Added to wishlist:", item.id);
    } else {
        console.error("Cannot add to wishlist: Product ID is missing");
    }
  };

  return (
    <>
      <div
        onClick={() =>
          navigate(
            `/product-details/${item.category?.categoryId}/${item.title}/${item.id}`
          )
        }
        className="group p-4 relative cursor-pointer"
      >
        <div
          className="card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setCurrentImage(0); // Reset về ảnh đầu khi bỏ chuột ra
          }}
        >
          {item.images.map((img, index) => (
            <img
              key={index}
              className="card-media"
              src={img}
              style={{ transform: `translateX(${(index - currentImage) * 100}%)` }}
              alt={item.title}
            />
          ))}
          
          {/* Lớp phủ khi Hover */}
          {isHovered && (
            <div className="indicator flex flex-col items-center space-y-2">
              <div className="flex gap-3">
                {/* --- NÚT WISHLIST ĐÃ SỬA --- */}
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleAddToWishlist} // Gắn hàm xử lý
                    sx={{ minWidth: '40px', width: '40px', height: '40px', borderRadius: '50%', p: 0 }} // Style tròn
                >
                  {isWishlisted ? (
                    <Favorite sx={{ color: 'red' }} />
                  ) : (
                    <FavoriteBorder sx={{ color: teal[300] }} />
                  )}
                </Button>

                {/* Nút Comment/Review */}
                <Button 
                    variant="contained" 
                    color="secondary"
                    sx={{ minWidth: '40px', width: '40px', height: '40px', borderRadius: '50%', p: 0 }}
                >
                  <ModeComment sx={{ color: teal[300] }} />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 space-y-2 group-hover-effect rounded-md">
          {/* Phần tên và mô tả */}
          <div className="name">
            <h1 className="text-sm text-gray-500">
              Sold by
              <span className="text-[#E27E6A] ml-1 font-medium">
                {item.seller?.bussinessDetails?.bussinessName}
              </span>
            </h1>
            <p className="text-lg font-bold line-clamp-1">{item.title}</p>
          </div>

          {/* Phần giá */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* Giá bán */}
              <div className="price font-bold text-xl">
                {formatVND(item.sellingPrice)}
              </div>

              {/* Giá gốc (nếu có giảm giá) */}
              {item.msrpPrice > item.sellingPrice && (
                  <>
                    <div className="original-price text-sm text-gray-400 line-through">
                        {formatVND(item.msrpPrice)}
                    </div>
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">
                        -{item.discountPercent}%
                    </span>
                  </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard