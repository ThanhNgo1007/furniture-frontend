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
      <div className="mb-8">
        <h1 className="text-center font-bold text-3xl text-teal-600 pb-3">
          Seller Login
        </h1>
        <p className="text-center text-gray-500 text-base">Access your seller dashboard</p>
      </div>

      <form className="space-y-8" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          name="email"
          label="Email Address"
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          disabled={isOtpSent}
          InputProps={{
            style: { borderRadius: '8px', fontSize: '1.1rem' }
          }}
          InputLabelProps={{ style: { fontSize: '1.1rem' } }}
        />

        {/* 4. Logic hiển thị nút Send OTP / Resend countdown */}
        {!isOtpSent || timer > 0 ? (
            <div className="pt-8"> {/* Increased padding top container */}
                <Button
                    onClick={handleSendOtp}
                    fullWidth
                    variant="contained"
                    disabled={isSendingOtp || timer > 0} // Disable khi đang gửi hoặc đang đếm
                    sx={{ 
                    py: '14px', 
                    bgcolor: '#0d9488', 
                    '&:hover': { bgcolor: '#0f766e' },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.4)',
                    }}
                >
                    {isSendingOtp ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : timer > 0 ? (
                        `Resend OTP in ${timer}s`
                    ) : (
                        'Send OTP'
                    )}
                </Button>
            </div>
        ) : null}

        {isOtpSent && (
          <div className="space-y-6 animate-fade-in">
            {timer > 0 ? (
                <>
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 text-center">
                    <p className="font-medium text-base text-teal-800">
                        Enter the 6-digit OTP sent to your email
                    </p>
                    </div>

                    <TextField
                    fullWidth
                    id="otp"
                    name="otp"
                    label="OTP Code"
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                    helperText={formik.touched.otp && formik.errors.otp}
                    disabled={formik.isSubmitting}
                    InputProps={{
                        style: { borderRadius: '8px', fontSize: '1.1rem' }
                    }}
                    InputLabelProps={{ style: { fontSize: '1.1rem' } }}
                    inputProps={{
                        maxLength: 6,
                        style: {
                        textAlign: 'center',
                        fontSize: '1.8rem',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5em',
                        fontWeight: 'bold'
                        }
                    }}
                    />

                    <div className="pt-6">
                        <Button
                        type="submit"
                        variant="contained"
                        disabled={formik.isSubmitting}
                        fullWidth
                        sx={{ 
                            py: '14px', 
                            bgcolor: '#0d9488', 
                            '&:hover': { bgcolor: '#0f766e' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.4)'
                        }}
                        >
                        {formik.isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Verify & Login'
                        )}
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-4 pt-4">
                    <div className="text-center text-red-500 text-base font-medium mb-2">
                        OTP has expired. Please resend or change email.
                    </div>
                    <Button
                        onClick={handleSendOtp}
                        fullWidth
                        variant="contained"
                        sx={{ 
                            py: '14px', 
                            bgcolor: '#0d9488', 
                            '&:hover': { bgcolor: '#0f766e' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600
                        }}
                    >
                        Resend OTP
                    </Button>
                    <Button
                        onClick={() => {
                            setIsOtpSent(false);
                            setTimer(0);
                        }}
                        fullWidth
                        variant="outlined"
                        sx={{ 
                            py: '14px', 
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: '#0d9488',
                            borderColor: '#0d9488',
                            '&:hover': { borderColor: '#0f766e', bgcolor: 'rgba(13, 148, 136, 0.04)' }
                        }}
                    >
                        Change Email
                    </Button>
                </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default SellerLoginForm