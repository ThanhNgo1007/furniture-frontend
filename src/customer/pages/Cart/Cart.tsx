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
        dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
    }, [dispatch]);

    const handleChange = (e: any) => {
        setCouponCode(e.target.value)
        setErrorMessage("") // Xóa lỗi khi người dùng nhập lại
    }

    // Hàm xử lý Apply Coupon
    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        
        const jwt = localStorage.getItem("jwt") || "";
        const orderValue = cart?.totalSellingPrice || 0;

        try {
             // Dispatch action applyCoupon
            const resultAction = await dispatch(applyCoupon({
                apply: "true",
                code: couponCode,
                orderValue: orderValue,
                jwt
            })).unwrap(); // unwrap để bắt lỗi ngay tại đây

            // Nếu thành công (không nhảy vào catch), clear input
            setErrorMessage("");
            
        } catch (error) {
            // Nếu thất bại, hiển thị lỗi
            setErrorMessage("Wrong Coupon Code");
            setCouponCode(""); // (Tùy chọn) Xóa mã sai
        }
    }

    // Hàm xử lý Gỡ bỏ Coupon
    const handleRemoveCoupon = async () => {
        const jwt = localStorage.getItem("jwt") || "";
        const orderValue = cart?.totalSellingPrice || 0;
        
        // Gọi applyCoupon với apply="false" để gỡ
        await dispatch(applyCoupon({
            apply: "false",
            code: cart?.couponCode || "",
            orderValue: orderValue,
            jwt
        }));
        setCouponCode("");
        setErrorMessage("");
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

    return (
        <div className='pt-10 px-5 sm:px-10 md:px-60 min-h-screen'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                <div className='cartItemSection lg:col-span-2 space-y-3'>
                    {cart.cartItemsInBag.map((item) => (
                        <CartItemCard key={item.id} item={item}/>
                    ))}
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