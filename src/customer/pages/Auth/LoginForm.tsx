/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, CircularProgress, Snackbar, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom';
import { resetAuth, sendLoginSignupOtp, signing } from '../../../State/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = useAppSelector(store => store.auth)
  const [timer, setTimer] = useState(0) // State bộ đếm
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

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

  // 4. Listen for auth errors
  useEffect(() => {
    if (auth.error) {
        // Defensive: ensure error is always a string
        const errorMsg = typeof auth.error === 'object' 
          ? (auth.error as any).message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.'
          : String(auth.error);
        setSnackbarMessage(errorMsg);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    }
  }, [auth.error]);

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
      setSnackbarMessage("Invalid email format. Please check your email.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return
    }
    
    // Gọi action gửi OTP
    try {
        await dispatch(sendLoginSignupOtp({ email: formik.values.email })).unwrap()
        setTimer(60) // Set 60 giây sau khi gửi thành công
        setSnackbarMessage("OTP sent successfully! Please check your email.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    } catch (error) {
        console.error("Lỗi gửi OTP", error)
        // Error is handled by auth.error effect usually, but if unwrap fails here we can also show it
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-center font-bold text-2xl text-teal-600 pb-2">
          Login
        </h1>
        <p className="text-center text-gray-500 text-sm">Enter your details to access your account</p>
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
          disabled={auth.otpSent} // Disable email input when OTP is sent
          InputProps={{
            style: { borderRadius: '8px' }
          }}
        />

        {/* Kiểm tra logic hiển thị nút Send OTP */}
        {!auth.otpSent || timer > 0 ? (
            <div className="pt-6">
                <Button
                    onClick={handleSendOtp}
                    fullWidth
                    variant="contained"
                    disabled={auth.loading || timer > 0} // Disable khi loading hoặc đang đếm
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
                    {auth.loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : timer > 0 ? (
                        `Resend OTP in ${timer}s`
                    ) : (
                        'Send OTP'
                    )}
                </Button>
            </div>
        ) : null}

        {auth.otpSent && (
          <div className="space-y-4 animate-fade-in">
            {/* Khi timer > 0: Hiển thị Input OTP và Nút Verify */}
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
                    disabled={auth.loading}
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

                    <div className="pt-6">
                        <Button
                        type="submit"
                        variant="contained"
                        disabled={auth.loading}
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
                        {auth.loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Verify & Login'
                        )}
                        </Button>
                    </div>
                </>
            ) : (
                // Khi timer === 0: Hiển thị nút Resend và Change Email
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
                        onClick={() => dispatch(resetAuth())}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default LoginForm