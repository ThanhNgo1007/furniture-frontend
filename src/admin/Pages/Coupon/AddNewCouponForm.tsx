import { Alert, Box, Button, CircularProgress, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCoupon, resetCouponState } from '../../../State/admin/adminCouponSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

interface CouponFormValue {
    code: string;
    discountPercentage: string;
    validityStartDate: Dayjs | null;
    validityEndDate: Dayjs | null;
    minimumOrderValue: string;
}

const AddNewCouponForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, couponCreated } = useAppSelector(state => state.adminCoupon);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const formik = useFormik<CouponFormValue>({
        initialValues: {
            code: '',
            discountPercentage: '',
            validityStartDate: null,
            validityEndDate: null,
            minimumOrderValue: ''
        },
        validate: (values) => {
            const errors: any = {};
            
            if (!values.code.trim()) {
                errors.code = 'Mã giảm giá không được để trống';
            }
            
            const discount = Number(values.discountPercentage);
            if (!values.discountPercentage || isNaN(discount)) {
                errors.discountPercentage = 'Phần trăm giảm giá không hợp lệ';
            } else if (discount <= 0 || discount > 100) {
                errors.discountPercentage = 'Phần trăm giảm giá phải từ 1-100';
            }
            
            if (!values.validityStartDate) {
                errors.validityStartDate = 'Ngày bắt đầu không được để trống';
            }
            
            if (!values.validityEndDate) {
                errors.validityEndDate = 'Ngày kết thúc không được để trống';
            }
            
            if (values.validityStartDate && values.validityEndDate && 
                values.validityEndDate.isBefore(values.validityStartDate)) {
                errors.validityEndDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
            
            const minOrder = Number(values.minimumOrderValue);
            if (!values.minimumOrderValue || isNaN(minOrder)) {
                errors.minimumOrderValue = 'Giá trị đơn không hợp lệ';
            } else if (minOrder < 0) {
                errors.minimumOrderValue = 'Giá trị đơn phải lớn hơn 0';
            }
            
            return errors;
        },
        onSubmit: async (values) => {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                setSnackbar({ open: true, message: 'Vui lòng đăng nhập', severity: 'error' });
                return;
            }

            const formattedValues = {
                code: values.code.trim(),
                discountPercentage: Number(values.discountPercentage),
                validityStartDate: values.validityStartDate?.format('YYYY-MM-DD'),
                validityEndDate: values.validityEndDate?.format('YYYY-MM-DD'),
                minimumOrderValue: Number(values.minimumOrderValue)
            };

            try {
                await dispatch(createCoupon({ coupon: formattedValues, jwt })).unwrap();
                setSnackbar({ open: true, message: 'Tạo mã giảm giá thành công!', severity: 'success' });
                setTimeout(() => {
                    dispatch(resetCouponState());
                    navigate('/admin/coupon');
                }, 1500);
            } catch (err: any) {
                setSnackbar({ open: true, message: err || 'Tạo thất bại', severity: 'error' });
            }
        }
    });

    return (
        <div>
            <Typography variant="h5" fontWeight="bold" className='pb-5 text-center'>
                Tạo mã giảm giá mới
            </Typography>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, maxWidth: 800, mx: 'auto' }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                name="code"
                                label="Mã giảm giá"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                name="discountPercentage"
                                label="Phần trăm giảm giá (%)"
                                type="number"
                                value={formik.values.discountPercentage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                                helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label="Ngày bắt đầu"
                                value={formik.values.validityStartDate}
                                onChange={(value) => formik.setFieldValue('validityStartDate', value)}
                                slotProps={{
                                    textField: {
                                        error: formik.touched.validityStartDate && Boolean(formik.errors.validityStartDate),
                                        helperText: formik.touched.validityStartDate && formik.errors.validityStartDate
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label="Ngày kết thúc"
                                value={formik.values.validityEndDate}
                                onChange={(value) => formik.setFieldValue('validityEndDate', value)}
                                slotProps={{
                                    textField: {
                                        error: formik.touched.validityEndDate && Boolean(formik.errors.validityEndDate),
                                        helperText: formik.touched.validityEndDate && formik.errors.validityEndDate
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                name="minimumOrderValue"
                                label="Giá trị đơn tối thiểu (đ)"
                                type="number"
                                value={formik.values.minimumOrderValue}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.minimumOrderValue && Boolean(formik.errors.minimumOrderValue)}
                                helperText={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button 
                                type="submit"
                                variant='contained' 
                                fullWidth 
                                sx={{ py: '.8rem', bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' } }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo mã giảm giá'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </LocalizationProvider>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddNewCouponForm;