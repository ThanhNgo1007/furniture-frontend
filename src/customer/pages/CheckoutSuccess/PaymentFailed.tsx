// File: web_fe/src/customer/pages/CheckoutSuccess/PaymentFailed.tsx

import { Error, Home, ShoppingCart } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>('Giao dịch thất bại');
  const [responseCode, setResponseCode] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('vnp_ResponseCode');
    const message = searchParams.get('message');
    const error = searchParams.get('error');

    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
    
    if (code) {
      setResponseCode(code);
    }

    if (error === 'checksum_failed') {
      setErrorMessage('Xác thực giao dịch thất bại. Vui lòng thử lại.');
    }
  }, [location]);

  const getErrorDetails = () => {
    switch (responseCode) {
      case '24':
        return {
          title: 'Giao dịch đã bị hủy',
          description: 'Bạn đã hủy giao dịch thanh toán trên cổng VNPay.',
          iconColor: '#f59e0b' // Amber/Yellow for cancellation
        };
      case '51':
        return {
          title: 'Số dư không đủ',
          description: 'Tài khoản của bạn không đủ số dư để thực hiện giao dịch.',
          iconColor: '#ef4444' // Red for error
        };
      case '65':
        return {
          title: 'Vượt quá hạn mức',
          description: 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
          iconColor: '#ef4444'
        };
      case '75':
        return {
          title: 'Ngân hàng bảo trì',
          description: 'Ngân hàng thanh toán đang trong thời gian bảo trì. Vui lòng thử lại sau.',
          iconColor: '#6b7280' // Gray for maintenance
        };
      case '79':
        return {
          title: 'Giao dịch hết hạn',
          description: 'Giao dịch đã hết thời gian xử lý. Vui lòng thử lại.',
          iconColor: '#f59e0b'
        };
      default:
        return {
          title: 'Thanh toán thất bại',
          description: errorMessage,
          iconColor: '#ef4444'
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-5 bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full flex flex-col items-center gap-6">
        
        {/* Icon lỗi */}
        <Error sx={{ fontSize: 80, color: errorDetails.iconColor }} />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">{errorDetails.title}</h1>
          <p className="text-gray-600">
            {errorDetails.description}
          </p>
          {responseCode && (
            <p className="text-sm text-gray-400 mt-2">
              Mã lỗi: {responseCode}
            </p>
          )}
        </div>

        {/* Các nút điều hướng */}
        <div className="flex flex-col w-full gap-3 mt-4">
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<ShoppingCart />}
            sx={{ bgcolor: 'teal', py: 1.5 }}
            onClick={() => navigate('/checkout')}
          >
            Thử thanh toán lại
          </Button>
          
          <Button 
            variant="outlined" 
            color="inherit"
            fullWidth
            startIcon={<Home />}
            sx={{ py: 1.5 }}
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
        </div>

        {/* Thông tin hỗ trợ */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
          <p className="text-xs text-gray-600">
            <strong>Cần hỗ trợ?</strong><br />
            Liên hệ: 1900-xxxx hoặc support@furniture.com
          </p>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;