/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// Nhớ import resetAuth từ slice
import { resetAuth, sendLoginSignupOtp, signing } from '../../../State/AuthSlice'
import { useAppDispatch, useAppSelector } from '../../../State/Store'

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { auth } = useAppSelector(store => store)

  // 1. Tự động chuyển hướng khi isLoggedIn = true
  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/')
    }
  }, [auth.isLoggedIn, navigate])

  // 2. Reset state (loading, error, otpSent) khi rời khỏi trang Login
  useEffect(() => {
    return () => {
      dispatch(resetAuth())
    }
  }, [dispatch])

  const formik = useFormik({
    initialValues: {
      email: '',
      otp: ''
    },
    onSubmit: values => {
      // Formik submit chỉ dùng để gọi hàm Login (Signing)
      dispatch(signing(values))
    }
  })

  const handleSendOtp = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!formik.values.email || !emailRegex.test(formik.values.email)) {
      formik.setFieldError('email', 'Please enter a valid email address.')
      return
    }

    // Không cần setIsSendingOtp, Redux sẽ tự set auth.loading = true khi action này chạy
    try {
      await dispatch(sendLoginSignupOtp({ email: formik.values.email })).unwrap()
    } catch (error: any) {
      console.error('Failed to send OTP:', error)
      formik.setFieldError('email', 'Failed to send OTP')
    }
  }

  // Hàm xử lý khi bấm "Change email"
  const handleChangeEmail = () => {
    dispatch(resetAuth()) // Reset otpSent về false thông qua Redux Action
    formik.setFieldValue('otp', '') // Xóa giá trị OTP trong form
  }

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-[#E27E6A] pb-8">Login</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
        {/* LOGIC HIỂN THỊ: Dựa hoàn toàn vào auth.otpSent */}
        {!auth.otpSent ? (
          <div className="space-y-6 flex flex-col gap-6">
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              // Disabled khi đang loading (gửi OTP hoặc Login)
              disabled={auth.loading}
            />

            <Button
              variant="contained"
              onClick={handleSendOtp} // Nút này gọi hàm gửi OTP riêng
              disabled={auth.loading} // Disable khi đang loading
              className="w-full flex justify-center rounded-lg text-white py-4"
              sx={{ py: '11px', color: 'white' }}
            >
              {auth.loading ? <CircularProgress size={28} color="inherit" /> : 'Send OTP'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">An OTP has been sent to</p>
              <p className="font-semibold text-gray-800">{formik.values.email}</p>

              <Button
                variant="text"
                className="text-sm text-primary hover:underline mt-1 normal-case"
                onClick={handleChangeEmail} // Gọi hàm reset thông qua Redux
                disabled={auth.loading}
              >
                (Change email)
              </Button>
            </div>

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
              disabled={auth.loading}
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
              type="submit" // Nút này kích hoạt formik.onSubmit (Login)
              variant="contained"
              disabled={auth.loading}
              className="w-full flex justify-center py-3 rounded-lg"
              sx={{ py: '11px' }}
            >
              {auth.loading ? (
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

export default LoginForm
