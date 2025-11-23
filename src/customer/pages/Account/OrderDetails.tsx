/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PaymentsIcon from '@mui/icons-material/Payments';
import { Box, Button, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Import thêm action cancelOrder
import { cancelOrder, fetchOrderById, fetchOrderItemById } from '../../../State/customer/orderSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import OrderStepper from './OrderStepper';

const OrderDetails = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orderId, orderItemId } = useParams();
    const { order } = useAppSelector(store => store)

    useEffect(() => {
        dispatch(fetchOrderById({ orderId: Number(orderId), jwt: localStorage.getItem('jwt') || '' }))
        dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt: localStorage.getItem('jwt') || '' }))

    }, [dispatch, orderId, orderItemId])

    const formatVND = (price: any) => {
        return new Intl.NumberFormat('vi-VN').format(price) + "đ"
    }

    // --- THÊM HÀM XỬ LÝ HỦY ĐƠN ---
    const handleCancelOrder = () => {
        dispatch(cancelOrder(Number(orderId)));
    }

    const currentOrder = order.currentOrder;
    const currentItem = order.orderItem;
    const shippingAddress = currentOrder?.shippingAddress;

    const msrpPrice = currentItem?.msrpPrice || 0;
    const sellingPrice = currentItem?.sellingPrice || 0;
    const savedAmount = msrpPrice - sellingPrice;

    const getPaymentMethodText = () => {
        const pStatus = currentOrder?.paymentDetails?.status;
        const oStatus = currentOrder?.orderStatus;

        // Nếu thanh toán thành công
        if (pStatus === 'COMPLETED') return "Paid Online (VNPay)";
        
        // Nếu thanh toán thất bại hoặc đơn đã hủy
        if (pStatus === 'FAILED' || oStatus === 'CANCELLED') return "Payment Failed / Cancelled";
        
        // Mặc định là COD (chỉ khi PENDING và chưa thanh toán)
        return "Cash On Delivery";
    }

    return (
        <Box className="space-y-5">
            {/* ... (Phần hiển thị thông tin sản phẩm giữ nguyên) ... */}
            <section className='flex flex-col gap-5 justify-center items-center'>
                <img className="w-[100px]" src={currentItem?.product.images[0]} alt="" />
                <div className='text-sm space-y-1 text-center'>
                    <h1 className='font-bold'>{currentItem?.product.title}</h1>
                    <p className='line-clamp-1 text-gray-500'>{currentItem?.product.description}</p>
                </div>
                <div>
                    <Button onClick={() => navigate(`/review/${currentItem?.product.id}/create`)}>Write Review</Button>
                </div>
            </section>

            <section className='border-p5'>
                <OrderStepper 
                    orderStatus={currentOrder?.orderStatus} 
                    orderDate={currentOrder?.orderDate}
                    deliveryDate={currentOrder?.deliveryDate}
                />
            </section>

            {/* ... (Phần địa chỉ giữ nguyên) ... */}
            <div className='border p-5'>
                <h1 className="font-bold pb-3">Delivery Address</h1>
                <div className="text-sm space-y-2">
                    <div className="flex gap-5 font-medium">
                        <p>{shippingAddress?.name}</p>
                        <Divider flexItem orientation='vertical' />
                        <p>{shippingAddress?.mobile}</p>
                    </div>
                    <p>
                        {shippingAddress?.address}, {shippingAddress?.ward}, {shippingAddress?.locality}, {shippingAddress?.city}
                        {shippingAddress?.pinCode ? ` - ${shippingAddress.pinCode}` : ""}
                    </p>
                </div>
            </div>

            <div className='border space-y-4'>
                {/* ... (Phần giá tiền giữ nguyên) ... */}
                <div className="flex justify-between text-sm pt-5 px-5">
                    <div className="space-y-1">
                        <p className='font-bold'>Total Item Price</p>
                        <p>You saved <span className='text-green-500 font-medium text-xs'>{formatVND(savedAmount)}</span> on this item</p>
                    </div>
                    <p className='font-medium text-lg'>{formatVND(currentOrder?.totalSellingPrice || 0)}</p>
                </div>
                <div className="px-5">
                    <div className={`px-5 py-2 text-xs font-medium flex items-center gap-3 rounded-md
                        ${currentOrder?.orderStatus === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-gray-700'}
                    `}>
                        <PaymentsIcon />
                        {/* SỬA Ở ĐÂY: Gọi hàm renderPaymentMethod */}
                        <p>{getPaymentMethodText()}</p>
                    </div>
                </div>
                <Divider />
                <div className='px-5 p-5'>
                    <p className="text-xs"><strong>Sold By: </strong>{currentItem?.product.seller?.bussinessDetails.bussinessName}</p>
                </div>
                
                {/* --- SỬA LOGIC HIỂN THỊ NÚT CANCEL TẠI ĐÂY --- */}
                
                {/* Chỉ cho phép hủy khi trạng thái là: PENDING, PLACED hoặc CONFIRMED */}
                { (currentOrder?.orderStatus === 'PENDING' || 
                   currentOrder?.orderStatus === 'PLACED' || 
                   currentOrder?.orderStatus === 'CONFIRMED') && (
                    <div className='p-10'>
                        <Button
                            onClick={handleCancelOrder} // Gọi hàm handleCancelOrder
                            color='error'
                            sx={{ py: "0.7rem" }}
                            variant='outlined'
                            fullWidth
                        >
                            Cancel Order
                        </Button>
                    </div>
                )}

                {/* Nếu trạng thái là SHIPPED hoặc ARRIVING nhưng chưa DELIVERED */}
                { (currentOrder?.orderStatus === 'SHIPPED' || currentOrder?.orderStatus === 'ARRIVING') && (
                    <div className='p-10 text-center text-gray-500 font-medium'>
                         Order cannot be cancelled as it has been shipped.
                    </div>
                )}

                {/* Hiển thị thông báo đã hủy */}
                {currentOrder?.orderStatus === 'CANCELLED' && (
                    <div className='p-10 text-center text-red-500 font-bold'>
                        Order Cancelled
                    </div>
                )}

            </div>
        </Box>
    )
}

export default OrderDetails