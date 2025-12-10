/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Snackbar,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCoupon, fetchAllCoupons, toggleCouponActive } from '../../../State/admin/adminCouponSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import type { Coupon as CouponType } from '../../../types/couponTypes';
import EditCouponDialog from './EditCouponDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// Helper to format date
const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// Helper to get status
const getCouponStatus = (coupon: CouponType) => {
    const now = new Date();
    const endDate = new Date(coupon.validityEndDate);
    const startDate = new Date(coupon.validityStartDate);

    if (!coupon.active) {
        return { label: 'Đã hủy', color: 'error' as const };
    }
    if (endDate < now) {
        return { label: 'Hết hạn', color: 'default' as const };
    }
    if (startDate > now) {
        return { label: 'Chưa bắt đầu', color: 'warning' as const };
    }
    return { label: 'Hoạt động', color: 'success' as const };
};

const Coupon = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { coupons, loading, error } = useAppSelector(state => state.adminCoupon);
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            dispatch(fetchAllCoupons(jwt));
        }
    }, [dispatch]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleToggleActive = async (coupon: CouponType) => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return;
        
        try {
            await dispatch(toggleCouponActive({ id: coupon.id, jwt })).unwrap();
            setSnackbar({
                open: true,
                message: coupon.active ? 'Đã hủy mã giảm giá' : 'Đã kích hoạt mã giảm giá',
                severity: 'success'
            });
        } catch (err: any) {
            setSnackbar({
                open: true,
                message: err || 'Thao tác thất bại',
                severity: 'error'
            });
        }
    };

    const handleDeleteClick = (coupon: CouponType) => {
        setSelectedCoupon(coupon);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCoupon) return;
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return;
        
        try {
            await dispatch(deleteCoupon({ id: selectedCoupon.id, jwt })).unwrap();
            setSnackbar({
                open: true,
                message: 'Đã xóa mã giảm giá',
                severity: 'success'
            });
        } catch (err: any) {
            setSnackbar({
                open: true,
                message: err || 'Xóa thất bại',
                severity: 'error'
            });
        }
        setDeleteDialogOpen(false);
        setSelectedCoupon(null);
    };

    const handleEditClick = (coupon: CouponType) => {
        setSelectedCoupon(coupon);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedCoupon(null);
    };

    const handleEditSuccess = () => {
        setSnackbar({
            open: true,
            message: 'Cập nhật mã giảm giá thành công',
            severity: 'success'
        });
    };

    const paginatedCoupons = coupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (loading && coupons.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    Quản lý mã giảm giá
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/add-coupon')}
                    sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' } }}
                >
                    Thêm mã giảm giá
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="coupon table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Mã giảm giá</StyledTableCell>
                            <StyledTableCell>Giảm giá</StyledTableCell>
                            <StyledTableCell>Ngày bắt đầu</StyledTableCell>
                            <StyledTableCell>Ngày kết thúc</StyledTableCell>
                            <StyledTableCell align="right">Đơn tối thiểu</StyledTableCell>
                            <StyledTableCell align="center">Trạng thái</StyledTableCell>
                            <StyledTableCell align="center">Thao tác</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCoupons.length === 0 ? (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7} align="center">
                                    <Typography color="text.secondary" py={3}>
                                        Chưa có mã giảm giá nào
                                    </Typography>
                                </StyledTableCell>
                            </StyledTableRow>
                        ) : (
                            paginatedCoupons.map((coupon) => {
                                const status = getCouponStatus(coupon);
                                return (
                                    <StyledTableRow key={coupon.id}>
                                        <StyledTableCell component="th" scope="row">
                                            <Typography fontWeight="bold" color="primary">
                                                {coupon.code}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Chip 
                                                label={`${coupon.discountPercentage}%`} 
                                                color="primary" 
                                                size="small" 
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>{formatDate(coupon.validityStartDate)}</StyledTableCell>
                                        <StyledTableCell>{formatDate(coupon.validityEndDate)}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            {coupon.minimumOrderValue?.toLocaleString('vi-VN')}đ
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Chip 
                                                label={status.label} 
                                                color={status.color} 
                                                size="small" 
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Tooltip title="Chỉnh sửa">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => handleEditClick(coupon)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={coupon.active ? 'Hủy' : 'Kích hoạt'}>
                                                <IconButton 
                                                    size="small" 
                                                    color={coupon.active ? 'warning' : 'success'}
                                                    onClick={() => handleToggleActive(coupon)}
                                                >
                                                    {coupon.active ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDeleteClick(coupon)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={coupons.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Số mã mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
                />
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    Bạn có chắc muốn xóa mã <strong>{selectedCoupon?.code}</strong>? 
                    Hành động này không thể hoàn tác.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <EditCouponDialog
                open={editDialogOpen}
                coupon={selectedCoupon}
                onClose={handleEditClose}
                onSuccess={handleEditSuccess}
            />

            {/* Snackbar */}
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
        </>
    );
};

export default Coupon;