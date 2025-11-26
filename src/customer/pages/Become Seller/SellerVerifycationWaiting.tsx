// File: web_fe/src/seller/pages/Auth/SellerVerificationWaiting.tsx

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../State/Store';
import { checkSellerStatus } from '../../../State/seller/sellerAuthSlice';

const SellerVerificationWaiting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const email = location.state?.email; // Lấy email từ trang đăng ký truyền sang

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!email) return;

    // Hàm kiểm tra trạng thái
    const checkStatus = async () => {
      try {
        const result = await dispatch(checkSellerStatus(email)).unwrap();
        // Kiểm tra trường emailVerified hoặc accountStatus từ Backend trả về
        if (result.emailVerified === true || result.accountStatus === 'ACTIVE') {
          setIsVerified(true);
        }
      } catch (error) {
        console.log("Polling error", error);
      }
    };

    // Gọi ngay lần đầu
    checkStatus();

    // Thiết lập Polling: Gọi lại mỗi 3 giây
    const intervalId = setInterval(checkStatus, 3000);

    // Clear interval khi component unmount hoặc đã verify xong
    return () => clearInterval(intervalId);
  }, [email, dispatch]);

  // --- GIAO DIỆN ---

  // 1. Nếu ĐÃ XÁC THỰC (Tự động phát hiện)
  if (isVerified) {
    return (
      <Box sx={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', height: '100vh', gap: 3, textAlign: 'center' 
      }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
        
        <Typography variant="h4" fontWeight="bold" color="success.main">
          Verified Successfully!
        </Typography>
        
        <Typography variant="body1">
          Your email has been verified. You can now login.
        </Typography>

        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/seller-login')} // Đưa về trang login
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  // 2. Nếu ĐANG CHỜ (Loading...)
  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', gap: 4, textAlign: 'center', p: 3
    }}>
      <CircularProgress size={60} thickness={4} sx={{ color: 'primary.main' }} />
      
      <div>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Waiting for Verification
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We sent a link to <b>{email}</b>. <br/>
          Please check your email and click the link. <br/>
          This page will refresh automatically once you verify.
        </Typography>
      </div>

      <Button variant="outlined" color="error" onClick={() => navigate('/')}>
        Cancel
      </Button>
    </Box>
  );
};

export default SellerVerificationWaiting;