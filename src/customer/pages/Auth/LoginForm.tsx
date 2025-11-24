/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom';
import { resetAuth, sendLoginSignupOtp, signing } from '../../../State/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { auth } = useAppSelector(store => store)
  const [timer, setTimer] = useState(0) // State bộ đếm

  // 1. Tự động chuyển hướng khi isLoggedIn = true
  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/')
    }
  }, [auth.isLoggedIn, navigate])

  // 2. Reset state
  useEffect(() => {
    return () => {
      dispatch(resetAuth())
    }
  }, [dispatch])

  // 3. Logic đếm ngược
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
    onSubmit: values => {
      dispatch(signing(values))
    }
  })

  const handleSendOtp = async () => {
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!formik.values.email || !emailRegex.test(formik.values.email)) {
      formik.setFieldError('email', 'Please enter a valid email address.')
      return
    }
    
    // Gọi action gửi OTP
    try {
        await dispatch(sendLoginSignupOtp({ email: formik.values.email })).unwrap()
        setTimer(60) // Set 60 giây sau khi gửi thành công
    } catch (error) {
        console.error("Lỗi gửi OTP", error)
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary pb-5">
        Login
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

        {/* Kiểm tra logic hiển thị nút Send OTP */}
        {!auth.otpSent || timer > 0 ? (
            <Button
                onClick={handleSendOtp}
                fullWidth
                variant="contained"
                disabled={auth.loading || timer > 0} // Disable khi loading hoặc đang đếm
                sx={{ py: '11px' }}
            >
                {auth.loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : timer > 0 ? (
                    `Resend OTP in ${timer}s`
                ) : (
                    'Send OTP'
                )}
            </Button>
        ) : null}

        {auth.otpSent && (
          <div className="space-y-3">
             {/* Nút gửi lại OTP nhỏ */}
             {timer === 0 && (
                <div className='text-right'>
                    <Button size='small' onClick={handleSendOtp} disabled={auth.loading}>
                        Resend OTP
                    </Button>
                </div>
             )}

            <p className="font-medium text-sm opacity-60">
              Enter OTP sent to your email !
            </p>

            <TextField
              fullWidth
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
              type="submit"
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