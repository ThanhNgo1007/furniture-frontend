/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { TextField } from "@mui/material"
import { useFormik } from "formik"
import { use } from "react"

    
const SellerLoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      otp: ""
    },
    onSubmit: (values) => {
      console.log("Form Data", values);
    }
  });
  
  return (
    <div>
      <h1 className="text-center font-bold text-2xl  pb-5">
        Login as Seller
        </h1>
      <div className="space-y-5 flex flex-col gap-6">
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
              {true && 
         <div className="space-y-2">
          <p className="font-medium text-sm opacity-60">Enter OTP sent to your email !</p>
               <TextField
                fullWidth
                name="otp"
                label="OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
              />
      </div>
      }
        </div>
    </div>
  )
}

export default SellerLoginForm