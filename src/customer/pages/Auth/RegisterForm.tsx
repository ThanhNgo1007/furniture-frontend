/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'; // Thêm useEffect
import { useNavigate } from 'react-router-dom'
import { sendLoginSignupOtp, signup } from '../../../State/AuthSlice'
import { useAppDispatch } from '../../../State/Store'

const RegisterForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [timer, setTimer] = useState(0) // State cho bộ đếm

  // Logic đếm ngược
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
      otp: '',
      fullName: ''
    },
    onSubmit: (values) => {
      const loginRequest = {
        email: values.email,
        otp: values.otp,
        fullName: values.fullName
      }
      dispatch(signup(loginRequest))
        .unwrap()
        .then(() => {
             console.log("Đăng ký thành công")
             navigate("/")
        })
        .catch((error) => {
             console.error("Đăng ký thất bại", error)
        })
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
      await dispatch(sendLoginSignupOtp({ email: formik.values.email })).unwrap()
      setIsOtpSent(true)
      setTimer(60) // Bắt đầu đếm ngược 60s sau khi gửi thành công
    } catch (error: any) {
      console.error('Failed to send OTP:', error)
      formik.setFieldError('email', 'Failed to send OTP. Try again.')
    } finally {
      setIsSendingOtp(false)
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-primary pb-5">
        Sign Up
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
        
        {/* Hiển thị nút Send OTP nếu chưa gửi hoặc muốn gửi lại */}
        {/* Nút này sẽ bị disable khi timer > 0 */}
        {!isOtpSent || timer > 0 ? (
           <Button
             onClick={handleSendOtp}
             fullWidth
             variant="contained"
             disabled={isSendingOtp || timer > 0} // Disable khi đang gửi hoặc đang đếm ngược
             sx={{ py: '11px' }}
           >
             {isSendingOtp ? (
               <CircularProgress size={24} color="inherit" />
             ) : timer > 0 ? (
               `Resend OTP in ${timer}s` // Hiển thị thời gian đếm ngược
             ) : (
               'Send OTP'
             )}
           </Button>
        ) : null}

        {isOtpSent && (
          <div className="space-y-3">
             {/* Hiển thị nút Resend OTP nhỏ nếu người dùng muốn gửi lại khi hết giờ */}
             {timer === 0 && (
                <div className='text-right'>
                    <Button size='small' onClick={handleSendOtp}>Resend OTP</Button>
                </div>
             )}

            <TextField
              fullWidth
              name="otp"
              label="OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
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
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
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
                'Sign Up'
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default RegisterForm