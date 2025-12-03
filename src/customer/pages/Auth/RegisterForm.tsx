/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'; // Thêm useEffect
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signup } from '../../../State/AuthSlice';
import { useAppDispatch } from '../../../State/Store';

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
      <div className="mb-5">
        <h1 className="text-center font-bold text-2xl text-teal-600 pb-2">
          Sign Up
        </h1>
        <p className="text-center text-gray-500 text-sm">Create a new account to get started</p>
      </div>

      <form className="space-y-5" onSubmit={formik.handleSubmit}>
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
            style: { borderRadius: '8px' }
          }}
        />
        
        {/* Hiển thị nút Send OTP nếu chưa gửi hoặc muốn gửi lại */}
        {/* Nút này sẽ bị disable khi timer > 0 */}
        {!isOtpSent || timer > 0 ? (
           <div className="pt-6">
             <Button
               onClick={handleSendOtp}
               fullWidth
               variant="contained"
               disabled={isSendingOtp || timer > 0} // Disable khi đang gửi hoặc đang đếm ngược
               sx={{ 
                  py: '12px', 
                  bgcolor: '#0d9488', 
                  '&:hover': { bgcolor: '#0f766e' },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.4)'
               }}
             >
               {isSendingOtp ? (
                 <CircularProgress size={24} color="inherit" />
               ) : timer > 0 ? (
                 `Resend OTP in ${timer}s` // Hiển thị thời gian đếm ngược
               ) : (
                 'Send OTP'
               )}
             </Button>
           </div>
        ) : null}

        {isOtpSent && (
          <div className="space-y-4 animate-fade-in">
            {timer > 0 ? (
                <>
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 text-center">
                    <p className="font-medium text-sm text-teal-800">
                        Enter the 6-digit OTP sent to your email
                    </p>
                    </div>

                    <TextField
                    fullWidth
                    name="otp"
                    label="OTP Code"
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                    helperText={formik.touched.otp && formik.errors.otp}
                    InputProps={{
                        style: { borderRadius: '8px' }
                    }}
                    inputProps={{
                        maxLength: 6,
                        style: {
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5em',
                        fontWeight: 'bold'
                        }
                    }}
                    />
                    <TextField
                    fullWidth
                    name="fullName"
                    label="Full Name"
                    variant="outlined"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                    helperText={formik.touched.fullName && formik.errors.fullName}
                    InputProps={{
                        style: { borderRadius: '8px' }
                    }}
                    />

                    <div className="pt-6">
                        <Button
                        type="submit"
                        variant="contained"
                        disabled={formik.isSubmitting}
                        fullWidth
                        sx={{ 
                            py: '12px', 
                            bgcolor: '#0d9488', 
                            '&:hover': { bgcolor: '#0f766e' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.4)'
                        }}
                        >
                        {formik.isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Sign Up'
                        )}
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-3 pt-4">
                    <div className="text-center text-red-500 text-sm font-medium mb-2">
                        OTP has expired. Please resend or change email.
                    </div>
                    <Button
                        onClick={handleSendOtp}
                        fullWidth
                        variant="contained"
                        sx={{ 
                            py: '12px', 
                            bgcolor: '#0d9488', 
                            '&:hover': { bgcolor: '#0f766e' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1rem',
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
                            py: '12px', 
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1rem',
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

export default RegisterForm