import { Box, Grid, TextField } from '@mui/material'

const BecomSellerFormStep2 = ({formik}:any) => {
  return (
    <Box >
        <p className='text-xl font-bold text-center'>Pickup Details</p>
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
                <Grid size={{xs:12}}> 
                    <TextField
                        fullWidth
                        name="pickupAddress.name" // SỬA: thêm prefix pickupAddress.
                        label="Name"
                        value={formik.values.pickupAddress.name} // SỬA: truy cập vào object con
                        onChange={formik.handleChange}
                        error={formik.touched.pickupAddress?.name && Boolean(formik.errors.pickupAddress?.name)}
                        helperText={formik.touched.pickupAddress?.name && formik.errors.pickupAddress?.name}
                    />
                </Grid>
                <Grid size={{xs:6}}>
                    <TextField
                        fullWidth
                        name="pickupAddress.mobile" // SỬA
                        label="Mobile Number"
                        value={formik.values.pickupAddress.mobile} // SỬA
                        onChange={formik.handleChange}
                        error={formik.touched.pickupAddress?.mobile && Boolean(formik.errors.pickupAddress?.mobile)}
                        helperText={formik.touched.pickupAddress?.mobile && formik.errors.pickupAddress?.mobile}
                    />
                </Grid>

                <Grid size={{xs:6}}>
                    <TextField
                        fullWidth
                        name="pickupAddress.pinCode" // SỬA
                        label="Pin Code"
                        value={formik.values.pickupAddress.pinCode} // SỬA
                        onChange={formik.handleChange}
                        error={formik.touched.pickupAddress?.pinCode && Boolean(formik.errors.pickupAddress?.pinCode)}
                        helperText={formik.touched.pickupAddress?.pinCode && formik.errors.pickupAddress?.pinCode}
                    />
                </Grid>

                <Grid size={{xs:12}}>
                    <TextField
                        fullWidth
                        name="pickupAddress.address" // SỬA
                        label="Address (House No, Building, Street)"
                        value={formik.values.pickupAddress.address} // SỬA
                        onChange={formik.handleChange}
                        error={formik.touched.pickupAddress?.address && Boolean(formik.errors.pickupAddress?.address)}
                        helperText={formik.touched.pickupAddress?.address && formik.errors.pickupAddress?.address}
                    />
                </Grid>

                <Grid size={{xs:12}}>
                    <TextField
                        fullWidth
                        name="pickupAddress.locality" // SỬA
                        label="Locality/Town"
                        value={formik.values.pickupAddress.locality} // SỬA
                        onChange={formik.handleChange}
                        error={formik.touched.pickupAddress?.locality && Boolean(formik.errors.pickupAddress?.locality)}
                        helperText={formik.touched.pickupAddress?.locality && formik.errors.pickupAddress?.locality}
                    />
                </Grid>

                <Grid size={{xs:6}}>
                    <TextField
                        fullWidth
                        name="pickupAddress.city" // SỬA
                        label="City"
                        value={formik.values.pickupAddress.city} // SỬA
                        onChange={formik.handleChange}
                        error={formik.touched.pickupAddress?.city && Boolean(formik.errors.pickupAddress?.city)}
                        helperText={formik.touched.pickupAddress?.city && formik.errors.pickupAddress?.city}
                    />
                </Grid>

                <Grid size={{xs:6}}>
                    <TextField
                        fullWidth
                        name="pickupAddress.ward" // SỬA
                        label="State/Ward"
                        value={formik.values.pickupAddress.ward} // SỬA
                        onChange={formik.handleChange}
                        error={formik.touched.pickupAddress?.ward && Boolean(formik.errors.pickupAddress?.ward)}
                        helperText={formik.touched.pickupAddress?.state && formik.errors.pickupAddress?.state}
                    />
                </Grid>
            </Grid>
        </form>
    </Box>
  )
}

export default BecomSellerFormStep2