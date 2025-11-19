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
import { Box, Button, Divider } from '@mui/material'
import { orange, teal } from '@mui/material/colors'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../../../State/customer/ProductSlice'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import ReviewCard from '../Product/Review/ReviewCard'
import SimilarProduct from './SimilarProduct'

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useAppDispatch()
  const { productId } = useParams()
  const { product } = useAppSelector(store => store)
  const [activeImage, setActiveImage] = useState(0)

  const formatUSD = (price: any) => {
    return `$` + new Intl.NumberFormat('en-US').format(price)
  }

  useEffect(() => {
    if (!productId) return
    // fetchProductById's typed parameter doesn't accept number in current slice typing;
    // cast to any to call the thunk with the numeric id and include dispatch in deps.
    dispatch(fetchProductById(Number(productId) as any))
  }, [productId, dispatch])

  const handleActiveImage = (value: number) => () => {
    setActiveImage(value)
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
            <FavoriteBorderIcon sx={{ bgcolor: 'white' }} />
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
              <span>{formatUSD(product.product?.sellingPrice)}</span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded ">
                {product.product?.discountPercent}% OFF
              </span>
              <div className="original-price text-base text-gray-500 line-through">
                {formatUSD(product.product?.msrpPrice)}
              </div>
            </div>
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
            {/* THAY THẾ BẰNG CODE BÊN DƯỚI */}

            {/* 1. Dùng Box làm khung bo tròn bên ngoài */}
            <div className="flex items-center gap-2 justify-between">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'grey.400',
                  borderRadius: '30px',
                  py: 1 // Bo tròn thành viên thuốc
                }}
              >
                {/* Nút Trừ */}
                <Button
                  variant="text"
                  disabled={quantity === 1}
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '10px' }}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  <Remove fontSize="small" />
                </Button>

                {/* Nút hiển thị số lượng */}
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

                {/* Nút Cộng */}
                <Button
                  variant="text"
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '40px' }}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Add fontSize="small" />
                </Button>
              </Box>
              <Button
                variant="contained"
                sx={{
                  flexGrow: 1, // Tự động co giãn lấp đầy không gian
                  borderRadius: '30px', // Bo tròn
                  bgcolor: '#0D47A1', // Màu xanh dương (hoặc #mã_màu của bạn)
                  color: 'white',
                  fontWeight: 'semi-bold',
                  textTransform: 'uppercase', // Chữ "Add to bag" không bị VIẾT HOA
                  fontSize: '1rem',
                  py: 1.5 // Tăng độ cao của nút,
                }}
              >
                <ShoppingBag sx={{ mr: 1 }} />
                Add to Bag
              </Button>
              <Button
                variant="outlined"
                sx={{
                  flexGrow: 1, // Tự động co giãn lấp đầy không gian
                  borderRadius: '30px', // Bo tròn
                  borderColor: '#0D47A1',
                  color: '#0D47A1', // Màu xanh dương (hoặc #mã_màu của baise
                  fontWeight: 'semi-bold',
                  textTransform: 'uppercase', // Chữ "Add to bag" không bị VIẾT HOA
                  fontSize: '1rem',
                  py: 1.5 // Tăng độ cao của nút,
                }}
              >
                <FavoriteBorderIcon sx={{ mr: 1 }} />
                WISHLIST
              </Button>
            </div>
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
