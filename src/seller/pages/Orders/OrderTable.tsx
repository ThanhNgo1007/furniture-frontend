import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, Checkbox, CircularProgress, Collapse, FormControl, IconButton, InputLabel, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import React, { useState } from 'react';
import { fetchSellerOrdersPaginated, resetOrders, updateOrderStatus } from '../../../State/seller/sellerOrderSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { formatVND } from '../../../Util/formatCurrency';

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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const orderStatusOptions = [
  { status: "PENDING", label: "Đang chờ" },
  { status: "CONFIRMED", label: "Đã xác nhận" },
  { status: "PLACED", label: "Đang chuẩn bị" },
  { status: "SHIPPED", label: "Đang vận chuyển" },
  { status: "DELIVERED", label: "Đã giao" },
  { status: "CANCELLED", label: "Đã hủy" },
];

const orderStatusColor: { [key: string]: { color: string; label: string } } = {
  PENDING: { color: "#FFA500", label: "Chờ xác nhận" },
  CONFIRMED: { color: "#F5BCBA", label: "Đã xác nhận" },
  PLACED: { color: "#c26e1f", label: "Đang chuẩn bị" },
  SHIPPED: { color: "#1E90FF", label: "Đang vận chuyển" },
  DELIVERED: { color: "#32CD32", label: "Đã giao" },
  CANCELLED: { color: "#FF0000", label: "Đã hủy" },
};

// Status Constraint Logic
const isStatusRevertible = (currentStatus: string, newStatus: string) => {
  if (currentStatus === "CANCELLED") return false;

  const statusOrder = ["PENDING", "CONFIRMED", "PLACED", "SHIPPED", "DELIVERED"];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const newIndex = statusOrder.indexOf(newStatus);

  // Allow cancelling from any status (except maybe DELIVERED, but keeping it simple for now)
  if (newStatus === "CANCELLED") return true;

  // Prevent reverting to any lower status
  if (newIndex < currentIndex) {
    return false;
  }
  return true;
};

interface RowProps {
  row: any;
  isSelected: boolean;
  handleClickSelect: (event: React.MouseEvent<unknown>, id: number) => void;
  handleUpdateOrderStatus: (orderId: number, orderStatus: string) => void;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>, orderId: number) => void;
  anchorEl: any;
  handleClose: (orderId: number) => void;

}

function Row(props: RowProps) {
  const { row, isSelected, handleClickSelect, handleUpdateOrderStatus, handleClick, anchorEl, handleClose } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }} selected={isSelected} aria-checked={isSelected} role="checkbox">
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isSelected}
            onClick={(event) => handleClickSelect(event, row.id)}

          />
        </StyledTableCell>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          Order #{row.id}
        </StyledTableCell>
        <StyledTableCell>
           {new Date(row.orderDate).toLocaleDateString('vi-VN')}
        </StyledTableCell>
        <StyledTableCell>
          <div className='flex flex-col'>
              <span className='font-medium'>{row.shippingAddress.name}</span>
              <span className='text-xs text-gray-500'>{row.shippingAddress.mobile}</span>
          </div>
        </StyledTableCell>
        <StyledTableCell align="right">
          {formatVND(row.totalSellingPrice || row.totalMsrpPrice || 0)}
        </StyledTableCell>
        <StyledTableCell align="right">
          <span
            className="px-3 py-1 text-white rounded-full text-xs font-bold whitespace-nowrap"
            style={{
              backgroundColor: orderStatusColor[row.orderStatus]?.color || "gray"
            }}
          >
            {orderStatusColor[row.orderStatus]?.label || row.orderStatus}
          </span>
        </StyledTableCell>
        <StyledTableCell align="right">
           <Button size='small' onClick={(event) => handleClick(event, row.id)} disabled={row.orderStatus === "CANCELLED"}>
              Cập nhật
           </Button>
           <Menu
              id={`status-menu-${row.id}`}
              anchorEl={anchorEl && anchorEl[row.id]}
              open={Boolean(anchorEl && anchorEl[row.id])}
              onClose={() => handleClose(row.id)}
              MenuListProps={{ 'aria-labelledby': `status-menu-${row.id}` }}
            >
              {orderStatusOptions.map((option) => (
                <MenuItem 
                    key={option.status} 
                    onClick={() => handleUpdateOrderStatus(row.id, option.status)}
                    disabled={!isStatusRevertible(row.orderStatus, option.status)}
                >
                    {option.label}
                </MenuItem>
              ))}
            </Menu>
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{fontSize: '14px', fontWeight: 'bold'}}>
                Chi tiết sản phẩm
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Phân loại</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderItems.map((orderItem: any) => (
                    <TableRow key={orderItem.id}>
                      <TableCell component="th" scope="row">
                          <div className='flex items-center gap-3'>
                              <img src={orderItem.product.images[0]} alt="" className='w-10 h-10 rounded object-cover'/>
                              <span>{orderItem.product.title}</span>
                          </div>
                      </TableCell>
                      <TableCell>{orderItem.product.color}</TableCell>
                      <TableCell align="right">{orderItem.quantity}</TableCell>
                      <TableCell align="right">{formatVND(orderItem.product.sellingPrice)}</TableCell>
                      <TableCell align="right">
                        {formatVND(orderItem.quantity * orderItem.product.sellingPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>Địa chỉ giao hàng:</Typography>
                  <Typography variant="body2" color="text.secondary">
                      {row.shippingAddress.address}, {row.shippingAddress.ward}, {row.shippingAddress.locality}, {row.shippingAddress.city}
                  </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function OrderTable() {
  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector(store => store);

  const [activeFilter, setActiveFilter] = useState("PENDING");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | any>({});

  // Fetch orders with cursor pagination when filter changes
  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(resetOrders());
    dispatch(fetchSellerOrdersPaginated({ 
      jwt, 
      cursor: null, 
      size: 50,  // Fetch more per request for better UX
      status: activeFilter 
    }));
  }, [activeFilter, dispatch]);

  // Get unique years from orders
  const years = Array.from(new Set(sellerOrder.orders.map(o => new Date(o.orderDate).getFullYear()))).sort((a, b) => b - a);

  // Filter orders by month/year (status is already server-side filtered)
  const filteredOrders = sellerOrder.orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    const matchMonth = selectedMonth === "ALL" || (orderDate.getMonth() + 1).toString() === selectedMonth;
    const matchYear = selectedYear === "ALL" || orderDate.getFullYear().toString() === selectedYear;
    return matchMonth && matchYear;
  });

  const handleResetFilters = () => {
    setActiveFilter("PENDING");
    setSelectedMonth("ALL");
    setSelectedYear("ALL");
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Bulk Selection Logic
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredOrders.map((n) => n.id);
      setSelectedOrders(newSelecteds);
      return;
    }
    setSelectedOrders([]);
  };

  const handleClickSelect = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selectedOrders.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedOrders, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedOrders.slice(1));
    } else if (selectedIndex === selectedOrders.length - 1) {
      newSelected = newSelected.concat(selectedOrders.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedOrders.slice(0, selectedIndex),
        selectedOrders.slice(selectedIndex + 1),
      );
    }
    setSelectedOrders(newSelected);
  };

  const isSelected = (id: number) => selectedOrders.indexOf(id) !== -1;

  const handleBulkUpdateStatus = (status: string) => {
    // 1. Check if any orders are selected
    if (selectedOrders.length === 0) return;

    // 2. Check for homogeneous status
    const firstOrderId = selectedOrders[0];
    const firstOrder = sellerOrder.orders.find(o => o.id === firstOrderId);
    
    if (!firstOrder) return;

    const commonStatus = firstOrder.orderStatus;
    const isHomogeneous = selectedOrders.every(orderId => {
      const order = sellerOrder.orders.find(o => o.id === orderId);
      return order?.orderStatus === commonStatus;
    });

    if (!isHomogeneous) {
      alert("Chỉ có thể cập nhật hàng loạt cho các đơn hàng có cùng trạng thái hiện tại.");
      return;
    }

    // 3. Check status constraint for the common status
    if (!isStatusRevertible(commonStatus, status)) {
      alert("Không thể quay lại trạng thái cũ.");
      return;
    }

    // 4. Proceed with update
    selectedOrders.forEach(orderId => {
      dispatch(updateOrderStatus({jwt: localStorage.getItem("jwt") || "", orderId, orderStatus: status}));
    });
    setSelectedOrders([]);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, orderId: number) => {
    setAnchorEl((prev:any) => ({...prev, [orderId]:event.currentTarget}));
  };
  
  const handleClose = (orderId: number) => {
    setAnchorEl((prev:any) => ({...prev, [orderId]:null}));
  };

  const handleUpdateOrderStatus = (orderId: number, orderStatus: string) => {
    const order = sellerOrder.orders.find(o => o.id === orderId);
    if (order && !isStatusRevertible(order.orderStatus, orderStatus)) {
      alert("Không thể quay lại trạng thái trước đó khi đơn hàng đã ở trạng thái Đang chuẩn bị (PLACED) trở lên.");
      return;
    }
    dispatch(updateOrderStatus({jwt: localStorage.getItem("jwt") || "", orderId, orderStatus}))
    handleClose(orderId);
  }
  
  return (
    <div className='space-y-5 pb-10'>
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap pb-4 items-center">
        {orderStatusOptions.map((option) => (
          <Button
            key={option.status}
            variant={activeFilter === option.status ? "contained" : "outlined"}
            onClick={() => {
              setActiveFilter(option.status);
              setSelectedOrders([]); // Clear selection when switching tabs
            }}
            sx={{ 
              bgcolor: activeFilter === option.status ? orderStatusColor[option.status].color : 'transparent',
              borderColor: orderStatusColor[option.status].color,
              color: activeFilter === option.status ? 'white' : orderStatusColor[option.status].color,
              '&:hover': {
                bgcolor: activeFilter === option.status ? orderStatusColor[option.status].color : `${orderStatusColor[option.status].color}1a`
              }
            }}
          >
            {option.label}
          </Button>
        ))}

        <div className="flex gap-2 ml-auto">
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Tháng</InputLabel>
            <Select
              value={selectedMonth}
              label="Tháng"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <MenuItem key={month} value={month.toString()}>
                  Tháng {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Năm</InputLabel>
            <Select
              value={selectedYear}
              label="Năm"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" color="error" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* Bulk Action Toolbar - Floating at bottom */}
      {selectedOrders.length > 0 && (
        <Paper 
          elevation={3}
          sx={{ 
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            bgcolor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
            {selectedOrders.length} đã chọn
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Cập nhật trạng thái</InputLabel>
            <Select
              label="Cập nhật trạng thái"
              onChange={(e) => handleBulkUpdateStatus(e.target.value as string)}
              value=""
              sx={{ bgcolor: 'white' }}
            >
              {orderStatusOptions.map((option) => {
                // Determine if this option should be disabled based on selected orders
                let isDisabled = false;
                if (selectedOrders.length > 0) {
                  const firstOrderId = selectedOrders[0];
                  const firstOrder = sellerOrder.orders.find(o => o.id === firstOrderId);
                  if (firstOrder) {
                     isDisabled = !isStatusRevertible(firstOrder.orderStatus, option.status);
                  }
                }
                
                return (
                  <MenuItem key={option.status} value={option.status} disabled={isDisabled}>
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={() => setSelectedOrders([])}
          >
            Hủy chọn
          </Button>
        </Paper>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="collapsible table">
            <TableHead>
                <TableRow>
                <StyledTableCell padding="checkbox">
                    <Checkbox
                    color="primary"
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length}
                    checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    />
                </StyledTableCell>
                <StyledTableCell />
                <StyledTableCell>Mã đơn</StyledTableCell>
                <StyledTableCell>Ngày đặt</StyledTableCell>
                <StyledTableCell>Khách hàng</StyledTableCell>
                <StyledTableCell align="right">Tổng tiền</StyledTableCell>
                <StyledTableCell align="right">Trạng thái</StyledTableCell>
                <StyledTableCell align="right">Hành động</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                    <Row 
                        key={row.id} 
                        row={row} 
                        isSelected={isSelected(row.id)}
                        handleClickSelect={handleClickSelect}
                        handleUpdateOrderStatus={handleUpdateOrderStatus}
                        handleClick={handleClick}
                        anchorEl={anchorEl}
                        handleClose={handleClose}

                    />
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
        />
        
        {/* Load More Button */}
        {sellerOrder.hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2, gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Đã tải {sellerOrder.orders.length} / {sellerOrder.totalElements} đơn hàng
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                const jwt = localStorage.getItem("jwt") || "";
                dispatch(fetchSellerOrdersPaginated({
                  jwt,
                  cursor: sellerOrder.nextCursor,
                  size: 50,
                  status: activeFilter
                }));
              }}
              disabled={sellerOrder.loadingMore}
            >
              {sellerOrder.loadingMore ? (
                <CircularProgress size={20} />
              ) : (
                "Tải thêm"
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </div>
  );
}