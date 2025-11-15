import { Box, Grid, TextField } from '@mui/material'
import React from 'react'


const BecomSellerFormStep2 = ({formik}:any) => {
    
  return (
    <Box >
        <p className='text-xl font-bold text-center'>Pickup Details</p>
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
                <Grid size={{xs:12}}>
                    <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.errors.name}>

                    </TextField>
                </Grid>
                <Grid size={{xs:6}}>
                    <TextField
                    fullWidth
                    name="mobile"
                    label="Mobile Number"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}>

                    </TextField>
                </Grid>

                <Grid size={{xs:6}}>
                    <TextField
                    fullWidth
                    name="pinCode"
                    label="pinCode"
                    value={formik.values.pinCode}
                    onChange={formik.handleChange}
                    error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                    helperText={formik.touched.pinCode && formik.errors.pinCode}>

                    </TextField>
                </Grid>

                <Grid size={{xs:12}}>
                    <TextField
                    fullWidth
                    name="address"
                    label="Address (House No, Building, Street)"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}>

                    </TextField>
                </Grid>

                    <Grid size={{xs:12}}>
                    <TextField
                    fullWidth
                    name="locality"
                    label="Locality (Tỉnh)"
                    value={formik.values.locality}
                    onChange={formik.handleChange}
                    error={formik.touched.locality && Boolean(formik.errors.locality)}
                    helperText={formik.touched.locality && formik.errors.locality}>

                    </TextField>
                </Grid>

                <Grid size={{xs:5}}>
                    <TextField
                    fullWidth
                    name="city"
                    label="City (Thành phố)"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}>

                    </TextField>
                </Grid>

                <Grid size={{xs:7}}>
                    <TextField
                    fullWidth
                    name="state"
                    label="Ward (Phường/Xã)"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}>

                    </TextField>
                </Grid>
                
            </Grid>
        </form>

    </Box>
  )
}

export default BecomSellerFormStep2