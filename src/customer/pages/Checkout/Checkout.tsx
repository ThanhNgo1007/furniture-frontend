/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Add } from '@mui/icons-material';
import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/Store'; // Import useAppSelector
import { fetchUserCart } from '../../../State/customer/cartSlice';
import { createOrder } from '../../../State/customer/orderSlice'; // Import createOrder
import PricingCard from '../Cart/PricingCard';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const paymentGatewayList = [
    {
        value: "COD",
        image: "https://res.cloudinary.com/dtlxpw3eh/image/upload/v1760982183/cod_tgv7da.jpg",
        label: ""
    },
    {
        value: "VNPAY",
        image: "https://res.cloudinary.com/dtlxpw3eh/image/upload/v1763598428/channels4_profile_gzwdm5.webp",
        label: ""
    }
]

const Checkout = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    
    // State quản lý Payment Method
    const [paymentGateway, setPaymentGateway] = useState("COD");
    
    // State quản lý địa chỉ được chọn
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    const dispatch = useAppDispatch();
    // Lấy thông tin user (bao gồm danh sách địa chỉ) từ Redux Store
    const { auth } = useAppSelector(store => store); 

    const handlePaymentChange = (event: any) => {
        setPaymentGateway(event.target.value);
    }

    // Hàm xử lý khi bấm nút Check out
    const handleCheckout = () => {
        if (selectedAddress) {
            dispatch(createOrder({
                address: selectedAddress,
                jwt: localStorage.getItem("jwt") || "",
                paymentGateway: paymentGateway
            }))
            // --- THÊM ĐOẠN NÀY ---
            .then((action: any) => {
                // Nếu tạo đơn thành công và không có lỗi
                if (createOrder.fulfilled.match(action)) {
                    // Kiểm tra nếu là COD (không có link thanh toán trả về)
                    if (!action.payload.payment_link_url) {
                        // Chuyển hướng ngay lập tức về trang danh sách đơn hàng
                        navigate('/order-success'); 
                        // Hoặc trang thông báo thành công riêng nếu muốn
                    }
                    // Nếu là VNPay, logic trong slice đã tự redirect rồi
                }
            });
            // ---------------------
        } else {
            alert("Please select an address first!");
        }
    }

    useEffect(() => {
        dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
    }, [dispatch]);

    return (
        <>
            <div className='pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen'>
                <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
                    <div className="col-span-2 space-y-5">
                        <div className="flex justify-between items-center">
                            <h1 className='font-semibold text-lg'>Select Address</h1>
                            <Button variant='outlined' color='success' onClick={handleOpen}>
                                Add new address
                            </Button>
                        </div>
                        <div className='text-md font-medium space-y-5'>
                            <p>Saved Addresses</p>
                            <div className='space-y-3'>
                                {/* Hiển thị danh sách địa chỉ thực tế của User */}
                                {auth.user?.addresses?.map((item: any, index: number) => (
                                    <div 
                                        key={index}
                                        onClick={() => setSelectedAddress(item)}
                                        className={`p-3 border rounded-md cursor-pointer flex items-center gap-3 hover:bg-gray-50 
                                        ${selectedAddress?.id === item.id ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-600' : 'border-gray-200'}`}
                                    >   
                                        {/* Thêm Radio button để hiển thị trạng thái chọn */}
                                        <Radio 
                                            checked={selectedAddress?.id === item.id}
                                            value={item.id}
                                            name="address-radio"
                                            color="success"
                                        />
                                        <div className="w-full">
                                            <AddressCard address={item} />
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Fallback nếu chưa có địa chỉ nào */}
                                {(!auth.user?.addresses || auth.user?.addresses.length === 0) && (
                                    <p className="text-gray-500 text-center">No addresses found. Please add one.</p>
                                )}
                            </div>
                        </div>
                        <div className='py-4 px-6 rounded-md border border-gray-200'>
                            <Button onClick={handleOpen} color='success'>
                                <Add /> Add new address
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className='space-y-3 p-5 border border-gray-200 rounded-md'>
                                <h1 className='font-medium pb-2 text-center'>Choose Payment Gateway</h1>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    className='flex justify-center pl-6'
                                    onChange={handlePaymentChange}
                                    value={paymentGateway}
                                >
                                    {paymentGatewayList.map((item) => (
                                        <FormControlLabel
                                            key={item.value}
                                            value={item.value}
                                            control={<Radio />}
                                            className='border border-gray-100 w-[100px] p-2 rounded-md flex justify-center'
                                            label={
                                                <img className={`${item.value === "COD" ? "w-20" : ""} object-cover`} src={item.image} alt={item.label} />
                                            } 
                                        />
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                        <div className='border rounded-md border-gray-100'>
                            <PricingCard />
                            <div className='p-5'>
                                <Button
                                    onClick={handleCheckout} // Gắn sự kiện thanh toán vào đây
                                    color='success'
                                    fullWidth
                                    variant='contained'
                                    sx={{ py: "15px" }}
                                    disabled={!selectedAddress} // Disable nút nếu chưa chọn địa chỉ
                                >
                                    Check out
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* Truyền handleClose để đóng modal sau khi thêm xong */}
                    <AddressForm handleClose={handleClose} /> 
                </Box>
            </Modal>
        </>
    )
}

export default Checkout