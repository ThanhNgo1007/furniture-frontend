/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp } from '../../../State/AuthSlice';
import { useAppDispatch } from '../../../State/Store';
import { sellerLogin } from '../../../State/seller/sellerAuthSlice';

const SellerLoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [timer, setTimer] = useState(0) // 1. Thêm state timer

  // 2. Logic đếm ngược (dùng any để tránh lỗi NodeJS.Timeout)
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => {
        if(interval) clearInterval(interval)
    }
  }, [timer])

  const formik = useFormik({
    initialValues: {
      email: '',
      otp: ''
    },
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true)
      try {
        await dispatch(sellerLogin(values)).unwrap()
        navigate('/seller')
      } catch (error: any) {
        // Hiển thị message từ backend (bao gồm cả thông báo chưa verify)
        const errorMsg = typeof error === 'string' ? error : (error?.message || 'Login Failed');
        setFieldError('otp', errorMsg) 
      } finally {
        setSubmitting(false)
      }
    }
  })

  const handleSendOtp = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!formik.values.email || !emailRegex.test(formik.values.email)) {
      formik.setFieldError('email', 'Please enter a valid email address.')
      return
    }

    setIsSendingOtp(true)
    try {
      // SỬA LỖI TẠI ĐÂY: Thêm role: 'ROLE_SELLER'
      await dispatch(sendLoginSignupOtp({ 
          email: formik.values.email, 
          role: 'ROLE_SELLER' 
      })).unwrap()
      
      // alert('OTP sent successfully')
      setIsOtpSent(true)
      setTimer(60) 
    } catch (error: any) {
      console.error('Failed to send OTP:', error)
      // Hiển thị lỗi từ server trả về nếu có
      const errorMsg = error?.message || 'Failed to send OTP. Try again.'
      formik.setFieldError('email', errorMsg)
    } finally {
      setIsSendingOtp(false)
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary pb-5">
        Login As Seller
      </h1>
      <form className="space-y-3" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {/* 4. Logic hiển thị nút Send OTP / Resend countdown */}
        {!isOtpSent || timer > 0 ? (
            <Button
                onClick={handleSendOtp}
                fullWidth
                variant="contained"
                disabled={isSendingOtp || timer > 0} // Disable khi đang gửi hoặc đang đếm
                sx={{ py: '11px' }}
            >
                {isSendingOtp ? (
                    <CircularProgress size={24} color="inherit" />
                ) : timer > 0 ? (
                    `Resend OTP in ${timer}s`
                ) : (
                    'Send OTP'
                )}
            </Button>
        ) : null}

        {isOtpSent && (
          <div className="space-y-3">
            {/* 5. Nút Resend nhỏ hiển thị khi hết giờ */}
             {timer === 0 && (
                <div className='text-right'>
                    <Button size='small' onClick={handleSendOtp}>
                         Resend OTP
                    </Button>
                </div>
             )}

            <p className="font-medium text-sm opacity-60">
              Enter OTP sent to your email !
            </p>
            <TextField
              fullWidth
              id="otp"
              name="otp"
              label="Enter OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
              disabled={formik.isSubmitting}
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.4em'
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              className="w-full flex justify-center py-3 rounded-lg"
              sx={{ py: '11px' }}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Verify & Login'
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default SellerLoginForm