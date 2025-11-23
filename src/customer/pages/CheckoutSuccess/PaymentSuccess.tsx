import { CheckCircle, Error } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetCartState } from '../../../State/customer/cartSlice'; // --- IMPORT ---
import { paymentSuccess } from '../../../State/customer/orderSlice';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const paymentId = searchParams.get('paymentId');
    const paymentLinkId = searchParams.get('paymentLinkId');
    const responseCode = searchParams.get('vnp_ResponseCode');
    const error = searchParams.get('error');

    if (paymentId && responseCode === '00' && !error) {
      const data = {
        paymentId: paymentId,
        paymentLinkId: paymentLinkId || paymentId,
        jwt: localStorage.getItem('jwt') || ""
      };

      dispatch(paymentSuccess(data))
        .then((res: any) => {
          if (res.payload && res.payload.message === "Payment successful") {
            setStatus('success');
            
            // --- XÓA GIỎ HÀNG TRÊN FRONTEND ---
            // Reset Redux state để làm mới giỏ hàng
            dispatch(resetCartState());
          } else {
            setStatus('success');
            console.error("Payment verified but backend reported issue:", res);
          }
        })
        .catch((err: any) => {
          console.error("Error dispatching payment success:", err);
          setStatus('failed');
        });
    } else {
      setStatus('failed');
    }
  }, [location, dispatch]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-5 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <CircularProgress color="success" />
            <h2 className="text-xl font-semibold text-gray-700">Đang xử lý thanh toán...</h2>
            <p className="text-gray-500">Vui lòng không tắt trình duyệt.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle sx={{ fontSize: 60, color: 'green' }} />
            <h2 className="text-2xl font-bold text-green-600">Thanh toán thành công!</h2>
            <p className="text-gray-600">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
            
            <div className="flex gap-3 mt-4 w-full">
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/')}
              >
                Trang chủ
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                color="success" 
                onClick={() => navigate('/account/orders')}
              >
                Đơn hàng
              </Button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center gap-4">
            <Error sx={{ fontSize: 60, color: 'red' }} />
            <h2 className="text-2xl font-bold text-red-600">Thanh toán thất bại</h2>
            <p className="text-gray-600">Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình xử lý.</p>
            
            <Button 
              fullWidth 
              variant="contained" 
              color="error" 
              onClick={() => navigate('/checkout')}
              className="mt-4"
            >
              Thử thanh toán lại
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;