/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Add,
  LocalShipping,
  Remove,
  Shield,
  ShoppingBag,
  Wallet,
  WorkspacePremium
} from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Import thêm icon tim đầy
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { Box, Button, Divider, Typography } from '@mui/material';
import { orange, teal } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addItemToCart } from '../../../State/customer/cartSlice';
import { fetchProductById } from '../../../State/customer/ProductSlice';
import { addProductToWishlist, getWishlistByUserId } from '../../../State/customer/wishlistSlice'; // Import action Wishlist
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { formatVND } from '../../../Util/formatCurrency';
import ReviewCard from '../Product/Review/ReviewCard';
import SimilarProduct from './SimilarProduct';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1)
  const [quantityError, setQuantityError] = useState<string>('')
  const dispatch = useAppDispatch()
  const { productId } = useParams()
  
  // Lấy product và wishlist, cart từ store
  const { product } = useAppSelector(store => store)
  const { wishlist } = useAppSelector(store => store.wishlist)
  const { cart } = useAppSelector(store => store.cart)

  const [activeImage, setActiveImage] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!productId) return
    dispatch(fetchProductById(Number(productId) as any))
    
    // --- THÊM ĐOẠN NÀY: Lấy Wishlist khi vào trang chi tiết ---
    if(localStorage.getItem("jwt")) {
        dispatch(getWishlistByUserId())
    }
  }, [productId, dispatch])

  const handleActiveImage = (value: number) => () => {
    setActiveImage(value)
  }

  // --- LOGIC KIỂM TRA TỒN KHO ---
  const stockQuantity = product.product?.quantity || 0;
  const isOutOfStock = stockQuantity === 0;
  const jwt = localStorage.getItem("jwt");

  // --- LOGIC CHECK WISHLIST ---
  const isWishlisted = product.product && wishlist?.products?.some((p) => p.id === product.product?.id);

  const handleIncreaseQuantity = () => {
    if (quantity < stockQuantity) {
        setQuantity(quantity + 1);
        setQuantityError("");
    } else {
        setQuantityError(`Sản phẩm chỉ còn lại ${stockQuantity} món`);
    }
  }
  
  const handleDecreaseQuantity = () => {
      if(quantity > 1) {
          setQuantity(quantity - 1);
          setQuantityError("");
      }
  }

  // --- CHỨC NĂNG ADD TO CART ---
  const handleAddToCart = () => {
    if (!jwt) {
        navigate("/login");
        return;
    }

    if (product.product?.id) {
        // Kiểm tra xem trong giỏ đã có chưa (để cảnh báo nếu cần, hoặc cứ thêm cộng dồn)
        // Logic backend addCartItem đã xử lý cộng dồn hoặc update
        dispatch(addItemToCart({
            jwt,
            request: {
                productId: product.product.id,
                quantity: quantity
            }
        }));
        // Optional: navigate("/cart") hoặc hiện thông báo thành công
    }
  }

  // --- CHỨC NĂNG WISHLIST (TOGGLE) ---
  const handleAddToWishlist = () => {
      if (!jwt) {
          navigate("/login");
          return;
      }
      if (product.product?.id) {
          dispatch(addProductToWishlist({ productId: product.product.id, jwt }));
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
              <StarIcon sx={{ color: orange[500], fontSize: '17px' }} />
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
            <p className="text-md font-semibold text-gray-500 mt-2">
                {isOutOfStock ? <span className="text-red-600 font-bold">HẾT HÀNG</span> : `Quantity Available: ${stockQuantity}`}
            </p>
            <p className="text-xs mt-1">Designed to meet the US Federal Stability Standard</p>
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
            <div className="flex items-center gap-2 justify-between">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: quantityError ? 'red' : 'grey.400',
                  borderRadius: '30px',
                  py: 1,
                  opacity: isOutOfStock ? 0.5 : 1
                }}
              >
                <Button
                  variant="text"
                  disabled={quantity === 1 || isOutOfStock}
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '10px' }}
                  onClick={handleDecreaseQuantity}
                >
                  <Remove fontSize="small" />
                </Button>

                <Button variant="text" disabled sx={{ fontWeight: 'bold', minWidth: '30px' }}>
                  {quantity}
                </Button>

                <Button
                  variant="text"
                  disabled={isOutOfStock}
                  sx={{ color: 'text.primary', borderRadius: '30px', minWidth: '40px' }}
                  onClick={handleIncreaseQuantity}
                >
                  <Add fontSize="small" />
                </Button>
              </Box>
              
              {/* NÚT ADD TO BAG */}
              <Button
                variant="contained"
                onClick={handleAddToCart}
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

              {/* NÚT WISHLIST */}
              <Button
                variant={isWishlisted ? "contained" : "outlined"} // Đổi kiểu nút nếu đã thích
                onClick={handleAddToWishlist}
                sx={{
                  flexGrow: 1,
                  borderRadius: '30px',
                  // Nếu đã thích: nền trắng (hoặc đỏ nhạt), viền đỏ, icon đỏ
                  // Nếu chưa thích: viền xanh, chữ xanh
                  borderColor: isWishlisted ? 'red' : '#0D47A1',
                  bgcolor: isWishlisted ? '#ffebee' : 'transparent',
                  color: isWishlisted ? 'red' : '#0D47A1',
                  fontWeight: 'semi-bold',
                  textTransform: 'uppercase',
                  fontSize: '1rem',
                  py: 1.5,
                  '&:hover': {
                      borderColor: isWishlisted ? 'red' : '#0D47A1',
                      bgcolor: isWishlisted ? '#ffcdd2' : 'rgba(13, 71, 161, 0.04)'
                  }
                }}
              >
                {isWishlisted ? <FavoriteIcon sx={{ mr: 1, color: 'red' }} /> : <FavoriteBorderIcon sx={{ mr: 1 }} />}
                {isWishlisted ? "WISHLISTED" : "WISHLIST"}
              </Button>
            </div>

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