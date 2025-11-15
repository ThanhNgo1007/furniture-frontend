import { Box, Button, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup' 

const AddressFormSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    mobile: Yup.string().required("Mobile number is required").matches(/^[0]\d{9}$/,
        "Invalid mobile number"
    ),
    pinCode: Yup.string().required("Pin code is required").matches(/^[1-9][0-9]{5}$/,
        "Invalid pin code"
    ),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    locality: Yup.string().required("Locallity is required"),
})

const AddressForm = () => {
    const formik = useFormik({
        initialValues: {
            name: '',
            mobile: "",
            pinCode: "",
            address: "",
            city: "",
            state: "",
            locality: ""
        },
        validationSchema: AddressFormSchema,
        onSubmit: (values) => {
            console.log(values)
        },
    });
  return (
    <Box sx={{max:"auto",}}>
        <p className='text-xl font-bold text-center pb-5'>Contact Details</p>
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
                <Grid size={{xs:12}}>
                    <TextField
                    fullWidth
                    name="name"
                    label="name"
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
                    label="mobile"
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
                    label="address"
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
                    label="locality"
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
                    label="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}>

                    </TextField>
                </Grid>

                <Grid size={{xs:6}}>
                    <TextField
                    fullWidth
                    name="state"
                    label="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}>

                    </TextField>
                </Grid>
                <Grid size={{xs:12}}>
                    <Button fullWidth type='submit' variant='contained' sx={{py:"14px", bgcolor: "teal"}}>
                        ADD ADDRESS
                    </Button>
                </Grid>
                
            </Grid>
        </form>

    </Box>
  )
}

export default AddressForm