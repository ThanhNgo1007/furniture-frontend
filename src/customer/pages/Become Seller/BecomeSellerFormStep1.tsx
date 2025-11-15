import { Box, TextField } from '@mui/material'
import React from 'react'

const BecomSellerFormStep1 = ({formik}:any) => {
  return (
    <Box>
        <p className='text-xl font-bold text-center pb-9'>
            Contact Details
        </p>
      <div className='space-y-9 '>

        <TextField
                    fullWidth
                    name="mobile"
                    label="Mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                    sx={{mb:4}}

        />
        <TextField
                    fullWidth
                    name="MST"
                    label="MST"
                    value={formik.values.MST}
                    onChange={formik.handleChange}
                    error={formik.touched.MST && Boolean(formik.errors.MST)}
                    helperText={formik.touched.MST && formik.errors.MST}

        />
        </div>
    </Box>
  )
}

export default BecomSellerFormStep1