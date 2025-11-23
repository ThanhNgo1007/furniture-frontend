import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetCartState } from '../../../State/customer/cartSlice'; // --- IMPORT ---

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- XÓA GIỎ HÀNG KHI VÀO TRANG NÀY ---
  useEffect(() => {
    // Reset Redux cart state
    dispatch(resetCartState());
  }, [dispatch]);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-5 bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full flex flex-col items-center gap-6">
        
        <CheckCircleIcon sx={{ fontSize: 80, color: '#2dd4bf' }} />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Đặt hàng thành công!</h1>
          <p className="text-gray-500">
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn sẽ sớm được xử lý và giao đi.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-4">
          <Button 
            variant="contained" 
            fullWidth
            sx={{ bgcolor: 'teal', py: 1.5 }}
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </Button>
          
          <Button 
            variant="outlined" 
            color="success"
            fullWidth
            sx={{ py: 1.5 }}
            onClick={() => navigate('/account/orders')}
          >
            Xem đơn hàng của tôi
          </Button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;