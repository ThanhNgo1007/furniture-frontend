import { Favorite, FavoriteBorder, Message } from '@mui/icons-material';
import { Button } from '@mui/material';
import { teal } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createConversation } from '../../../State/chatSlice';
import { addProductToWishlist } from '../../../State/customer/wishlistSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import type { Product } from '../../../types/ProductTypes';
import { formatVND } from '../../../Util/formatCurrency';
import './ProductCard.css';

const ProductCard = ({ item, isBestSeller }: { item: Product; isBestSeller?: boolean }) => {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  
  // Check if this product is a best seller from Redux - OPTIMIZED SELECTOR
  const bestSellerIds = useAppSelector(store => store.product.bestSellerIds);
  const isProductBestSeller = isBestSeller || (item.id !== undefined && bestSellerIds.includes(item.id));
  // 1. LẤY DANH SÁCH WISHLIST TỪ STORE (Thay vì dùng useState)
  const { wishlist } = useAppSelector(store => store.wishlist);

  // 2. KIỂM TRA XEM SẢN PHẨM NÀY CÓ TRONG WISHLIST KHÔNG
  // (Dùng optional chaining ?. để tránh lỗi nếu wishlist null)
  const isWishlisted = wishlist?.products?.some((p) => p.id === item.id);

  // Hiệu ứng chuyển ảnh khi hover
  useEffect(() => {
    let interval: any;
    if (isHovered && item.images && item.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImage(prevImage => (prevImage + 1) % item.images.length)
      }, 1000)
    } else {
        setCurrentImage(0); // Reset về ảnh đầu
    }
    return () => clearInterval(interval)
  }, [isHovered, item.images])

  // 3. HÀM XỬ LÝ THÊM/XÓA WISHLIST
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha (không navigate)
    
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
        if (item.id) {
            // Logic Backend: Có rồi thì xóa, chưa có thì thêm
            dispatch(addProductToWishlist({ productId: item.id, jwt }));
        }
    } else {
        // Chưa đăng nhập thì chuyển hướng
        navigate("/login");
    }
  };

  // Handle message seller - Create conversation and open chat
  const handleMessageSeller = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/login");
      return;
    }

    if (item.seller?.id) {
      try {
        // Create or get conversation with this seller about this product
        // The createConversation thunk will automatically fetch chat history (including product card)
        await dispatch(createConversation({ 
          sellerId: item.seller.id, 
          productId: item.id,  // Link to this product
          jwt 
        })).unwrap();
        
        // Chat widget will automatically open and show the conversation with product card
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    }
  };

  const handleNavigate = () => {
     if(item.id) {
         navigate(`/product-details/${item.category?.parentCategory?.categoryId}/${item.category?.categoryId}/${encodeURIComponent(item.title)}/${item.id}`)
     }
  }

  return (
    <>
      <div
        onClick={handleNavigate}
        className="group p-4 relative cursor-pointer"
      >
        {/* Best Seller Badge - First element for proper z-index */}
        {isProductBestSeller && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg z-1">
            {t('product.bestSeller')}
          </div>
        )}

        <div
          className="card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {item.images && item.images.map((img, index) => (
            <img
              key={index}
              className="card-media"
              src={img}
              // Hiệu ứng trượt ảnh hoặc hiện/ẩn tùy CSS của bạn
              style={{ 
                  transform: `translateX(${(index - currentImage) * 100}%)`,
                  opacity: index === currentImage ? 1 : 0 // Fallback nếu CSS transform không hoạt động như ý
              }}
              alt={item.title}
            />
          ))}
          
          {/* Lớp phủ khi Hover - CHỈ HIỆN KHI HOVER */}
          {isHovered && (
            <div className="indicator flex flex-col items-center space-y-2">
              <div className="flex gap-3">
                {/* --- NÚT WISHLIST --- */}
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleAddToWishlist}
                    sx={{ 
                        minWidth: '40px', 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        p: 0,
                        bgcolor: 'white',
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }} 
                >
                  {isWishlisted ? (
                    <Favorite sx={{ color: 'red' }} /> // Đỏ nếu đã thích
                  ) : (
                    <FavoriteBorder sx={{ color: teal[300] }} /> // Viền xanh nếu chưa thích
                  )}
                </Button>

                {/* Message Seller Button */}
                <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={handleMessageSeller}
                    sx={{ 
                        minWidth: '40px', 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        p: 0,
                        bgcolor: 'white',
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                  <Message sx={{ color: teal[300] }} />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 space-y-2 group-hover-effect rounded-md">
          {/* Phần tên và mô tả */}
          <div className="name">
            <h1 className="text-sm text-gray-500">
              {t('product.soldBy')}
              <span className="text-[#E27E6A] ml-1 font-medium">
                {item.seller?.businessDetails?.businessName}
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
            </div>
            {/* Giá gốc (nếu có giảm giá) */}
              {item.msrpPrice > item.sellingPrice && (
                  <div className="flex items-center gap-2">
                    <div className="original-price text-sm text-gray-400 line-through">
                        {formatVND(item.msrpPrice)}
                    </div>
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">
                        -{item.discountPercent}%
                    </span>
                  </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard