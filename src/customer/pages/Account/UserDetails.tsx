import {
    AccountCircle as AccountCircleIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Save as SaveIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../../config/Api";
import { fetchUserProfile } from "../../../State/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../../State/Store";

const UserDetails = () => {
    const { user } = useAppSelector(store => store.auth);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [mobile, setMobile] = useState(user?.mobile || "");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ fullName: "", mobile: "" });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Sync state when user data changes
    useEffect(() => {
        setFullName(user?.fullName || "");
        setMobile(user?.mobile || "");
    }, [user]);

    const validateForm = () => {
        const newErrors = { fullName: "", mobile: "" };
        let isValid = true;

        if (!fullName.trim()) {
            newErrors.fullName = "Họ tên không được để trống";
            isValid = false;
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
            isValid = false;
        }

        if (!mobile.trim()) {
            newErrors.mobile = "Số điện thoại không được để trống";
            isValid = false;
        } else if (!/^0\d{9,10}$/.test(mobile)) {
            newErrors.mobile = "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await api.put("/api/users/profile", { fullName: fullName.trim(), mobile: mobile.trim() });
            
            if (response.status === 200) {
                const jwt = localStorage.getItem("jwt");
                if (jwt) {
                    dispatch(fetchUserProfile({ jwt }));
                }
                setIsEditing(false);
                setErrors({ fullName: "", mobile: "" });
                setSnackbar({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
            }
        } catch (error: any) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Cập nhật thất bại', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFullName(user?.fullName || "");
        setMobile(user?.mobile || "");
        setErrors({ fullName: "", mobile: "" });
        setIsEditing(false);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                {t('account.personalDetails')}
            </Typography>

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: '#0d9488',
                                    fontSize: 48
                                }}
                            >
                                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                                {user?.fullName || 'Người dùng'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {user?.email || 'email@example.com'}
                            </Typography>
                            <Chip
                                icon={<AccountCircleIcon />}
                                label="Khách hàng"
                                color="primary"
                                sx={{ mt: 2, bgcolor: '#0d9488' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Account Details */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Chi tiết tài khoản
                            </Typography>
                            {!isEditing && (
                                <IconButton color="primary" onClick={() => setIsEditing(true)}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <List>
                            {/* Full Name */}
                            <ListItem sx={{ py: 2 }}>
                                <ListItemIcon>
                                    <PersonIcon color="primary" sx={{ color: '#0d9488' }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label={t('account.name')}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName}
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary={t('account.name')}
                                        secondary={user?.fullName || 'Chưa cập nhật'}
                                    />
                                )}
                            </ListItem>

                            {/* Email - Read Only */}
                            <ListItem sx={{ py: 2 }}>
                                <ListItemIcon>
                                    <EmailIcon color="primary" sx={{ color: '#0d9488' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('account.email')}
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {user?.email || 'Chưa cập nhật'}
                                            <Chip label="Không thể thay đổi" size="small" variant="outlined" sx={{ fontSize: 10 }} />
                                        </Box>
                                    }
                                />
                            </ListItem>

                            {/* Phone */}
                            <ListItem sx={{ py: 2 }}>
                                <ListItemIcon>
                                    <PhoneIcon color="primary" sx={{ color: '#0d9488' }} />
                                </ListItemIcon>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        label={t('account.mobile')}
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        error={!!errors.mobile}
                                        helperText={errors.mobile}
                                        size="small"
                                    />
                                ) : (
                                    <ListItemText
                                        primary={t('account.mobile')}
                                        secondary={user?.mobile || 'Chưa cập nhật'}
                                    />
                                )}
                            </ListItem>
                        </List>

                        {/* Action Buttons */}
                        {isEditing && (
                            <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                                    Hủy
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                    onClick={handleSave}
                                    disabled={loading}
                                    sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' } }}
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    {/* Security Info */}
                    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Bảo mật
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <SecurityIcon color="success" />
                            <Box>
                                <Typography variant="body1">Xác thực qua Email</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tài khoản được bảo vệ bằng OTP gửi qua email
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

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
        </Box>
    );
};

export default UserDetails;