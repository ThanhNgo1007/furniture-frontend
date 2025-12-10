/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Close } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUserCart } from '../../../State/customer/cartSlice'
import { applyCoupon } from '../../../State/customer/couponSlice'; // Import action applyCoupon
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import CartItemCard from './CartItemCard'
import PricingCard from './PricingCard'

const Cart = () => {
    const [couponCode, setCouponCode] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>(""); // State lưu lỗi
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector(store => store.cart);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            dispatch(fetchUserCart(jwt));
        } else {
            navigate("/login");
        }
    }, [dispatch, navigate]);

    // Xóa error message khi user bắt đầu nhập mới
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponCode(e.target.value);
        if (errorMessage) {
            setErrorMessage(""); // Clear error when user starts typing
        }
    }

    // Hàm xử lý Apply Coupon
    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        
        const jwt = localStorage.getItem("jwt") || "";
        const orderValue = cart?.totalSellingPrice || 0;


        try {
            await dispatch(applyCoupon({
                apply: "true",
                code: couponCode,
                orderValue: orderValue,
                jwt
            })).unwrap();


            // Nếu thành công, clear input - KHÔNG cần fetchUserCart vì cartSlice đã update từ applyCoupon.fulfilled
            setErrorMessage("");
            setCouponCode("");
            // BỎ fetchUserCart - nó ghi đè data đúng bằng data cũ
            
        } catch (error: any) {
            // Nếu thất bại, hiển thị lỗi từ backend - KHÔNG clear couponCode
            setErrorMessage(error || "Mã giảm giá không hợp lệ");
        }
    }

    // Hàm xử lý Gỡ bỏ Coupon
    const handleRemoveCoupon = async () => {
        const jwt = localStorage.getItem("jwt") || "";
        const orderValue = cart?.totalSellingPrice || 0;
        
        try {
            await dispatch(applyCoupon({
                apply: "false",
                code: cart?.couponCode || "",
                orderValue: orderValue,
                jwt
            })).unwrap();
            
            setCouponCode("");
            setErrorMessage("");
        } catch (error: any) {
            setErrorMessage(error || "Failed to remove coupon");
        }
    }

    // ... (Logic kiểm tra giỏ hàng rỗng giữ nguyên)
    if (loading && !cart) {
        return <div className="h-[80vh] flex justify-center items-center">Loading cart...</div>
    }
    if (!cart || !cart.cartItemsInBag || cart.cartItemsInBag.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-[80vh]">
                <h1 className="text-2xl font-bold text-gray-500 mb-5">
                    Your Cart is empty. Add Product to buy
                </h1>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/')}
                    sx={{ bgcolor: '#E27E6A', padding: '10px 30px' }}
                >
                    Shop Now
                </Button>
            </div>
        )
    }

    // Helper function to check if a cart item is unavailable
    const isItemUnavailable = (item: typeof cart.cartItemsInBag[0]) => {
        return item.product.isActive === false || (item.product.quantity !== undefined && item.product.quantity <= 0);
    };

    // Split items into available and unavailable
    const availableItems = cart.cartItemsInBag.filter(item => !isItemUnavailable(item));
    const unavailableItems = cart.cartItemsInBag.filter(item => isItemUnavailable(item));

    return (
        <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                <div className='cartItemSection lg:col-span-2 space-y-3'>
                    {/* Available Items */}
                    {availableItems.map((item) => (
                        <CartItemCard key={item.id} item={item} isUnavailable={false}/>
                    ))}
                    
                    {/* Unavailable Items Section */}
                    {unavailableItems.length > 0 && (
                        <div className='mt-6 space-y-3'>
                            <div className='bg-gray-200 px-4 py-2 rounded-md'>
                                <h2 className='text-gray-700 font-semibold'>
                                    Sản phẩm không khả dụng ({unavailableItems.length})
                                </h2>
                                <p className='text-sm text-gray-500'>
                                    Những sản phẩm này đã hết hàng hoặc ngừng bán
                                </p>
                            </div>
                            {unavailableItems.map((item) => (
                                <CartItemCard key={item.id} item={item} isUnavailable={true}/>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className='col-span-1 text-sm space-y-3'>
                    {/* PHẦN COUPON */}
                    <div className='border rounded-md px-5 py-3 space-y-5 border-gray-200'>
                        <div className='flex gap-3 text-sm items-center'>
                             <div className='flex gap-3 text-sm items-center'>
                                <p className='font-bold min-w-[fit-content] text-lg'>Coupon</p>
                            </div>
                        </div>

                        {/* Hiển thị Input nếu chưa có coupon, hiển thị thẻ nếu đã có */}
                        { !cart.couponCode ? (
                            <div className='space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <TextField
                                        id="outlined-basic" 
                                        placeholder='COUPON CODE'
                                        size='small' 
                                        value={couponCode}
                                        onChange={handleChange} 
                                        fullWidth
                                        variant="outlined"
                                        error={!!errorMessage} // Hiển thị viền đỏ nếu có lỗi
                                    />
                                    <Button 
                                        size="medium" 
                                        sx={{ color: 'teal' }}
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode}
                                    >
                                        Apply
                                    </Button>
                                </div>
                                {/* Hiển thị dòng lỗi */}
                                {errorMessage && (
                                    <p className='text-xs text-red-600 font-medium pl-1'>{errorMessage}</p>
                                )}
                            </div>
                        ) : (
                            <div className='flex'>
                                <div className='p-1 pl-5 pr-3 border border-green-200 bg-green-50 rounded-md flex gap-2 items-center justify-between w-full'>
                                    <span className='text-green-700 font-medium'>
                                        {cart.couponCode} Applied
                                    </span>
                                    <IconButton size="small" onClick={handleRemoveCoupon}>
                                        <Close className='text-red-600'/>
                                    </IconButton>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PHẦN PRICING CARD */}
                    <div className='border rounded-md border-gray-200'>
                        <PricingCard/>
                        <div className='p-3'>
                            <Button
                                onClick={()=>navigate("/checkout")}
                                color='success'
                                fullWidth
                                variant='contained' 
                                sx={{py: "15px", fontSize: "16px"}}>
                                Buy now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart