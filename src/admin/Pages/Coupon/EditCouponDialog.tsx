import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { updateCoupon } from '../../../State/admin/adminCouponSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import type { Coupon } from '../../../types/couponTypes';

interface EditCouponDialogProps {
    open: boolean;
    coupon: Coupon | null;
    onClose: () => void;
    onSuccess: () => void;
}

interface CouponFormValue {
    code: string;
    discountPercentage: string;
    validityStartDate: Dayjs | null;
    validityEndDate: Dayjs | null;
    minimumOrderValue: string;
}

const EditCouponDialog = ({ open, coupon, onClose, onSuccess }: EditCouponDialogProps) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.adminCoupon);

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
            if (!coupon) return;
            const jwt = localStorage.getItem('jwt');
            if (!jwt) return;

            const formattedValues = {
                code: values.code.trim(),
                discountPercentage: Number(values.discountPercentage),
                validityStartDate: values.validityStartDate?.format('YYYY-MM-DD'),
                validityEndDate: values.validityEndDate?.format('YYYY-MM-DD'),
                minimumOrderValue: Number(values.minimumOrderValue)
            };

            try {
                await dispatch(updateCoupon({ id: coupon.id, coupon: formattedValues, jwt })).unwrap();
                onSuccess();
                onClose();
            } catch (error) {
                console.error('Failed to update coupon:', error);
            }
        }
    });

    // Reset form when coupon changes
    useEffect(() => {
        if (coupon && open) {
            formik.setValues({
                code: coupon.code,
                discountPercentage: String(coupon.discountPercentage),
                validityStartDate: dayjs(coupon.validityStartDate),
                validityEndDate: dayjs(coupon.validityEndDate),
                minimumOrderValue: String(coupon.minimumOrderValue)
            });
        }
    }, [coupon, open]);

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <DialogContent>
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
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={loading}
                            sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' } }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
                        </Button>
                    </DialogActions>
                </Box>
            </LocalizationProvider>
        </Dialog>
    );
};

export default EditCouponDialog;
