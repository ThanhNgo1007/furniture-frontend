/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import { sendLoginSignupOtp } from '../../../State/AuthSlice'
import { useAppDispatch } from '../../../State/Store'

const RegisterForm = () => {
  const dispatch = useAppDispatch()
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      otp: '',
      fullName: ''
    },
    onSubmit: values => {
      console.log('form data', values)
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
    } catch (error: any) {
      console.error('Failed to send OTP:', error)
      formik.setFieldError('email', 'Wrong OTP or Email')
    } finally {
      setIsSendingOtp(false)
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-xl text-[#E27E6A] pb-8">Sign Up</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
        {!isOtpSent ? (
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
              disabled={isSendingOtp}
            />

            <Button
              variant="contained"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full flex justify-center rounded-lg text-white py-4"
              sx={{
                py: '11px', // Tăng chiều cao
                color: 'white' // Màu chữ trắng
              }}
            >
              {isSendingOtp ? <CircularProgress size={28} color="inherit" /> : 'Send OTP'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">An OTP has been sent to</p>
              <p className="font-semibold text-gray-800">{formik.values.email}</p>
              <Button
                variant="text"
                className="text-sm text-white hover:text-indigo-500 mt-1 normal-case"
                onClick={() => {
                  setIsOtpSent(false)
                  formik.setFieldValue('otp', '')
                }}
                disabled={formik.isSubmitting}
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
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              disabled={isSendingOtp}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              className="w-full flex justify-center py-3 rounded-lg"
              sx={{ py: '11px' }} // Tăng chiều cao
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
