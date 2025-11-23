/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Add,
  LocalShipping,
  Remove,
  Shield,
  ShoppingBag,
  Wallet,
  WorkspacePremium
} from '@mui/icons-material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StarIcon from '@mui/icons-material/Star'
import { Box, Button, Divider, Typography } from '@mui/material'
import { orange, teal } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../../../State/customer/ProductSlice'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { formatVND } from '../../../Util/formatCurrency'
import ReviewCard from '../Product/Review/ReviewCard'
import SimilarProduct from './SimilarProduct'

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1)
  const [quantityError, setQuantityError] = useState<string>('')
  const dispatch = useAppDispatch()
  const { productId } = useParams()
  const { product } = useAppSelector(store => store)
  const [activeImage, setActiveImage] = useState(0)


  useEffect(() => {
    if (!productId) return
    dispatch(fetchProductById(Number(productId) as any))
  }, [productId, dispatch])

  const handleActiveImage = (value: number) => () => {
    setActiveImage(value)
  }

  // Lấy số lượng tồn kho
  const stockQuantity = product.product?.quantity || 0;
  const isOutOfStock = stockQuantity === 0;

  // --- HÀM TĂNG SỐ LƯỢNG ---
  const handleIncreaseQuantity = () => {
    // Kiểm tra nếu tăng lên 1 đơn vị có vượt quá kho không
    if (quantity < stockQuantity) {
        setQuantity(quantity + 1);
        setQuantityError(""); // Xóa lỗi nếu hợp lệ
    } else {
        setQuantityError(`Sản phẩm chỉ còn lại ${stockQuantity} món`); // Hiện thông báo
    }
  }
  
  // --- HÀM GIẢM SỐ LƯỢNG ---
  const handleDecreaseQuantity = () => {
      if(quantity > 1) {
          setQuantity(quantity - 1);
          setQuantityError(""); // Xóa lỗi khi giảm
      }
  }

  return (
    <div className="px-5 lg:px-20 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="w-full lg:w-[15%] flex flex-wrap lg:flex-col gap-3">
            {product.product?.images.map((item, index) => (
              <img
                onClick={handleActiveImage(index)}
                className="lg:w-full w-[50px] cursor-pointer rounded-md"
                src={item}
                alt=""
              />
            ))}
          </div>
          <div className="w-full lg:w-[85%]">
            <img
              className="w-full rounded-md"
              src={product.product?.images[activeImage]}
              alt=""
            />
          </div>
        </section>
        <section className="">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">
              Sold by{' '}
              <span className="text-[#E27E6A]">
                {product.product?.seller?.bussinessDetails.bussinessName}
              </span>
            </h1>
          </div>

          <p className="text-gray-500 font-semibold">{product.product?.title}</p>
          <div className="flex justify-between items-center py-2 border w-[180px] px-3 mt-5">
            <div className="flex gap-1 items-center">
              <span>4</span>
              <StarIcon
                sx={{
                  color: orange[500],
                  fontSize: '17px'
                }}
              />
            </div>
            <Divider orientation="vertical" flexItem />
            <span>123 Ratings</span>
          </div>
          <div>
            <div className="price font-bold text-3xl mt-5 space-x-6">
              <span>{formatVND(product.product?.sellingPrice || 0)}</span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded ">
                {product.product?.discountPercent}% OFF
              </span>
              <div className="original-price text-base text-gray-500 line-through">
                {formatVND(product.product?.msrpPrice || 0)}
              </div>
            </div>
            <p className="text-md font-semibold text-gray-500">
            {isOutOfStock ? <span className="text-red-600">Hết hàng</span> : `Quantity Available: ${stockQuantity}`}
        </p>
            <p className="text-xs">Designed to meet the US Federal Stability Standard</p>
          </div>
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-4">
              <Shield sx={{ color: teal[500] }} />
              <p>Quality Assured</p>
            </div>
            <div className="flex items-center gap-4">
              <WorkspacePremium sx={{ color: teal[500] }} />
              <p>100% money back guarantee</p>
            </div>
            <div className="flex items-center gap-4">
              <LocalShipping sx={{ color: teal[500] }} />
              <p>Nationwide Shipping</p>
            </div>
            <div className="flex items-center gap-4">
              <Wallet sx={{ color: teal[500] }} />
              <p>Cash On Delivery available</p>
            </div>
          </div>
          <div className="mt-7 space-y-2">
            <h1>QUANTITY</h1>
            
            {/* Box chứa nút bấm */}
            <div className="flex items-center gap-2 justify-between">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: quantityError ? 'red' : 'grey.400', // Đổi màu viền nếu lỗi
                  borderRadius: '30px',
                  py: 1,
                  opacity: isOutOfStock ? 0.5 : 1
                }}
              >
                <Button
                  variant="text"
                  disabled={quantity === 1 || isOutOfStock}
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '10px' }}
                  onClick={handleDecreaseQuantity} // Dùng hàm mới
                >
                  <Remove fontSize="small" />
                </Button>

                <Button
                  variant="text"
                  disabled
                  sx={{
                    fontWeight: 'bold',
                    '&.Mui-disabled': { color: 'text.primary' },
                    minWidth: '30px'
                  }}
                >
                  {quantity}
                </Button>

                <Button
                  variant="text"
                  // KHÔNG disable nút cộng trừ khi hết sạch hàng
                  disabled={isOutOfStock} 
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '40px' }}
                  onClick={handleIncreaseQuantity} // Dùng hàm mới
                >
                  <Add fontSize="small" />
                </Button>
              </Box>

              {/* ... Nút Add to Bag và Wishlist giữ nguyên ... */}
              <Button
                variant="contained"
                disabled={isOutOfStock}
                sx={{
                  flexGrow: 1,
                  borderRadius: '30px',
                  bgcolor: isOutOfStock ? 'grey' : '#0D47A1',
                  color: 'white',
                  fontWeight: 'semi-bold',
                  textTransform: 'uppercase',
                  fontSize: '1rem',
                  py: 1.5
                }}
              >
                <ShoppingBag sx={{ mr: 1 }} />
                {isOutOfStock ? "Out of Stock" : "Add to Bag"}
              </Button>
               <Button
                variant="outlined"
                sx={{
                  flexGrow: 1, 
                  borderRadius: '30px', 
                  borderColor: '#0D47A1',
                  color: '#0D47A1', 
                  fontWeight: 'semi-bold',
                  textTransform: 'uppercase', 
                  fontSize: '1rem',
                  py: 1.5 
                }}
              >
                <FavoriteBorderIcon sx={{ mr: 1 }} />
                WISHLIST
              </Button>
            </div>

            {/* --- HIỂN THỊ THÔNG BÁO LỖI BÊN DƯỚI --- */}
            {quantityError && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, ml: 1, fontWeight: 'bold' }}>
                    {quantityError}
                </Typography>
            )}
          </div>

          <div className="mt-5">
            <p>{product.product?.description}</p>
          </div>
          <div className="mt-7 space-y-5">
            <ReviewCard />
            <Divider />
          </div>
        </section>
      </div>
      <div className="mt-20">
        <h1 className="text-lg font-bold">Similar Product</h1>
        <div className="pt-5">
          <SimilarProduct />
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
