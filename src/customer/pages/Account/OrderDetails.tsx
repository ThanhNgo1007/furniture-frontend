/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PaymentsIcon from '@mui/icons-material/Payments';
import { Box, Button, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Import thêm action cancelOrder
import { useTranslation } from 'react-i18next';
import { cancelOrder, fetchOrderById, fetchOrderItemById } from '../../../State/customer/orderSlice';
import { fetchProductReviews } from '../../../State/customer/reviewSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { formatVND } from '../../../Util/formatCurrency';
import OrderStepper from './OrderStepper';

const OrderDetails = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, orderItemId } = useParams();
    const { currentOrder, orderItem: currentItem } = useAppSelector(store => store.order)
    const { productReviews } = useAppSelector(store => store.review)
    const { user } = useAppSelector(store => store.auth)
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchOrderById({ orderId: Number(orderId), jwt: localStorage.getItem('jwt') || '' }))
        dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt: localStorage.getItem('jwt') || '' }))
    }, [dispatch, orderId, orderItemId])

    // Fetch reviews for all products in the order
    // Re-fetch when location changes (e.g., navigating back from WriteReview)
    useEffect(() => {
        if (currentOrder?.orderItems) {
            currentOrder.orderItems.forEach(item => {
                if (item?.product?.id) {
                    dispatch(fetchProductReviews(item.product.id));
                }
            });
        }
    }, [dispatch, currentOrder?.orderItems, location.pathname]);

    // Check if user has already reviewed a product
    const hasUserReviewed = (productId: number) => {
        const reviews = productReviews[productId];
        if (!user?.id || !reviews || reviews.length === 0) {
            return false;
        }
        
        // Check if any review matches the current order ID
        return reviews.some(review => 
            review.user?.id === user.id && review.orderId === Number(orderId)
        );
    }

    // --- THÊM HÀM XỬ LÝ HỦY ĐƠN ---
    const handleCancelOrder = () => {
        dispatch(cancelOrder(Number(orderId)));
    }

    const shippingAddress = currentOrder?.shippingAddress;

    const msrpPrice = currentItem?.msrpPrice || 0;
    const sellingPrice = currentItem?.sellingPrice || 0;
    const savedAmount = msrpPrice - sellingPrice;

    const getPaymentMethodText = () => {
        const paymentMethod = currentOrder?.paymentDetails?.paymentMethod;
        const paymentStatus = currentOrder?.paymentStatus;
        const paymentDetailsStatus = currentOrder?.paymentDetails?.status;
        const orderStatus = currentOrder?.orderStatus;

        // Check cancelled first
        if (orderStatus === 'CANCELLED') {
            return t('orders.orderCancelled');
        }

        // Check payment method
        if (paymentMethod === 'VNPAY') {
            // VNPay payment - check status
            if (paymentStatus === 'COMPLETED' || paymentDetailsStatus === 'COMPLETED') {
                return t('orders.paidOnline');
            } else if (paymentStatus === 'FAILED' || paymentDetailsStatus === 'FAILED') {
                return t('orders.paymentFailed');
            } else {
                return t('orders.pendingPayment');
            }
        }
        
        // Default: COD
        return t('orders.cashOnDelivery');
    }

    return (
        <Box className="space-y-5">
            {/* Product List Section with Collapse/Expand */}
            <section className='border p-5'>
                <h1 className="font-bold pb-3">{t('orders.orderItems')} ({currentOrder?.orderItems?.length || 0})</h1>
                <div className="space-y-3">
                    {currentOrder?.orderItems?.map((item) => (
                        <div key={item.id} className='flex gap-3 p-3 bg-gray-50 rounded-md'>
                            <img className="w-[80px] h-[80px] object-cover rounded" src={item.product.images[0]} alt={item.product.title} />
                            <div className='flex-1 space-y-1'>
                                <h2 className='font-bold text-sm'>{item.product.title}</h2>
                                <div className="flex justify-between items-center">
                                    <p className='text-xs text-gray-600'>{t('product.quantity')}: {item.quantity}</p>
                                    <p className='font-medium text-sm'>{formatVND(item.sellingPrice)}</p>
                                </div>
                                
                                {/* Write Review Button - Only show for DELIVERED orders */}
                                {currentOrder?.orderStatus === 'DELIVERED' && item.product?.id && (
                                    hasUserReviewed(item.product.id) ? (
                                        <div className="flex flex-col items-start gap-1 mt-1">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                disabled
                                                sx={{ color: 'success.main', borderColor: 'success.main' }}
                                            >
                                                ✓ {t('review.reviewed')}
                                            </Button>
                                            <span 
                                                className="text-blue-600 text-xs cursor-pointer hover:underline"
                                                onClick={() => {
                                                    if (item.product?.id) {
                                                        const review = productReviews[item.product.id]?.find(r => 
                                                            r.user?.id === user?.id && r.orderId === Number(orderId)
                                                        );
                                                        if (review) {
                                                            navigate(`/reviews/${item.product.id}#review-${review.id}`);
                                                        }
                                                    }
                                                }}
                                            >
                                                {t('review.seeReviewDetails')}
                                            </span>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => navigate(`/write-review/${orderId}/${item.id}/${item.product.id}`)}
                                            sx={{ mt: 1 }}
                                        >
                                            {t('review.writeReview')}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
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
                <h1 className="font-bold pb-3">{t('orders.deliveryAddress')}</h1>
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
                        <p className='font-bold'>{t('orders.totalItemPrice')}</p>
                        <p>{t('orders.youSaved')} <span className='text-green-500 font-medium text-xs'>{formatVND(savedAmount)}</span> {t('orders.onThisItem')}</p>
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
                    <p className="text-xs"><strong>{t('orders.soldBy')}: </strong>{currentItem?.product.seller?.businessDetails.businessName}</p>
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
                            {t('orders.cancelOrder')}
                        </Button>
                    </div>
                )}

                {/* Nếu trạng thái là SHIPPED hoặc ARRIVING nhưng chưa DELIVERED */}
                { (currentOrder?.orderStatus === 'SHIPPED') && (
                    <div className='p-10 text-center text-gray-500 font-medium'>
                         {t('orders.cannotCancel')}
                    </div>
                )}

                {/* Hiển thị thông báo đã hủy */}
                {currentOrder?.orderStatus === 'CANCELLED' && (
                    <div className='p-10 text-center text-red-500 font-bold'>
                        {t('orders.orderCancelled')}
                        
                    </div>
                )}

            </div>
        </Box>
    )
}

export default OrderDetails