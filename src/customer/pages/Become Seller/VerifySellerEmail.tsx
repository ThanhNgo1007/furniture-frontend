// File: web_fe/src/seller/pages/Auth/VerifySeller.tsx

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../State/Store';
import { verifySellerEmail } from '../../../State/seller/sellerAuthSlice';

const VerifySeller = () => {
  const { otp } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    if (otp) {
      dispatch(verifySellerEmail(otp))
        .unwrap()
        .then(() => setStatus('success'))
        .catch(() => setStatus('failed'));
    }
  }, [otp, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 3 }}>
      
      {status === 'verifying' && (
        <>
          <CircularProgress />
          <Typography>Verifying verification link...</Typography>
        </>
      )}

      {status === 'success' && (
        <div className='text-center space-y-5'>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
          <Typography variant="h4" color="success.main">Verification Successful!</Typography>
          <Typography>You can close this tab or click below to login.</Typography>
          
          <Button 
            variant="contained" 
            onClick={() => navigate('/become-seller', { state: { login: true } })}
          >
            Go to Login Page
          </Button>
        </div>
      )}

      {status === 'failed' && (
        <>
          <Typography variant="h4" color="error.main">Verification Failed</Typography>
          <Button 
          variant="contained" 
          size="large"
          // SỬA: Chuyển về become-seller ở chế độ login
          onClick={() => navigate('/become-seller', { state: { login: true } })}
        >
          Go to Login
        </Button>
        </>
      )}
    </Box>
  );
};

export default VerifySeller;