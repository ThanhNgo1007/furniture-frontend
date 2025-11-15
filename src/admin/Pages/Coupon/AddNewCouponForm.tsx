import { useFormik } from 'formik'
import { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material';

interface CouponFormValue {
    code: string,
    discountPercentage: number,
    validityStartDate: Dayjs | null,
    validityEndDate: Dayjs | null,
    minimumOrderValue: number


}
const AddNewCouponForm = () => {
    const formik = useFormik<CouponFormValue>({
        initialValues: {
            code: "",
            discountPercentage: 0,
            validityStartDate: null,
            validityEndDate: null,
            minimumOrderValue: 0
        },
        onSubmit: (values) => {
            const formatedValues = {
                ...values,
                validityStartDate: values.validityStartDate?.toISOString(),
                validityEndDate: values.validityEndDate?.toISOString()
            }
            console.log("Form Submitted", values, formatedValues)
        }
    })
    return (
        <div>
            <h1 className='text-2xl font-bold text-primary-color pb-5 text-center'></h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>

                <Box component={"form"} onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                name="code"
                                label="code"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                name="discountPercentage"
                                label="Discount Percentage"
                                value={formik.values.discountPercentage}
                                onChange={formik.handleChange}
                                error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                                helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker 
                            sx={{width:'100%'}}
                            label="Validity Start Date"
                            name='validityStartDate'
                            onChange={formik.handleChange}
                            value={formik.values.validityStartDate}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker 
                            sx={{width:'100%'}}
                            label="Validity End Date"
                            name='validityEndDate'
                            onChange={formik.handleChange}
                            value={formik.values.validityEndDate}
                            />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <TextField
                                fullWidth
                                name="minimumOrderValue"
                                label="Minimum Order Value"
                                value={formik.values.minimumOrderValue}
                                onChange={formik.handleChange}
                                error={formik.touched.minimumOrderValue && Boolean(formik.errors.minimumOrderValue)}
                                helperText={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue}>
                            </TextField>
                        </Grid>
                        <Grid size={{xs:12}}>
                            <Button variant='contained' fullWidth sx={{py:".8rem"}}>
                                Create Coupon
                            </Button>

                        </Grid>

                    </Grid>

                </Box>

            </LocalizationProvider>
        </div>
    )
}

export default AddNewCouponForm