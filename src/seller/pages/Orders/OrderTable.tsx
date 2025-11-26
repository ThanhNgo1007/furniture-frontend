import { Button, Menu, MenuItem } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';
import { fetchSellerOrders, updateOrderStatus } from '../../../State/seller/sellerOrderSlice';
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

// Thay thế mảng orderStatus cũ bằng cái này
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


export default function OrderTable() {
  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector(store => store);

  React.useEffect(() => {
    dispatch(fetchSellerOrders(localStorage.getItem("jwt") || ""));
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | any>({});
  const open = Boolean(anchorEl);
  const handleClick = (event: any, orderId: number) => {
    setAnchorEl((prev:any) => ({...prev, [orderId]:event.currentTarget}));
  };
  const handleClose = (orderId: number) => {
    setAnchorEl((prev:any) => ({...prev, [orderId]:null}));
  };

  const handleUpdateOrderStatus = (orderId: number, orderStatus: any) => {
    dispatch(updateOrderStatus({jwt: localStorage.getItem("jwt") || "", orderId, orderStatus}))
  }
  
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Mã đơn hàng</StyledTableCell>
            <StyledTableCell>Sản phẩm</StyledTableCell>
            <StyledTableCell align="right">Địa chỉ giao hàng</StyledTableCell>
            <StyledTableCell align="right">Trạng thái đơn hàng</StyledTableCell>
            <StyledTableCell align="right">Cập nhật</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerOrder.orders.map((item) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                Đơn hàng #{item.id}
              </StyledTableCell>
              <StyledTableCell>
                <div className='flex gap1 flex-wrap'>
                  {
                    item.orderItems.map((orderItem) =>
                      <div className='flex gap-5'>
                        <img  className="w-20 rounded-md" src={orderItem.product.images[0]} alt="" />
                        <div className='flex flex-col justify-between py-2'>
                          <h1>Tên sản phẩm: {orderItem.product.title}</h1>
                          <h1>Đơn giá: {formatVND(orderItem.product.sellingPrice)}</h1>
                          <h1>Màu: {orderItem.product.color}</h1>
                          <h1>Số lượng: {orderItem.quantity}</h1>
                        </div>
                        
                      </div>
                    )
                  }

                </div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div>
                  <h1>Tên khách hàng: {item.shippingAddress.name}</h1>
                  <h1>Địa chỉ: {item.shippingAddress.address}, {item.shippingAddress.ward}, {item.shippingAddress.locality}, {item.shippingAddress.city} - {item.shippingAddress.pinCode}</h1>
                  <h1><strong>Số điện thoại:</strong> {item.shippingAddress.mobile}</h1>
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <span
                  className="px-5 py-2 text-white rounded-full text-xs font-bold whitespace-nowrap"
                  style={{
                    backgroundColor: orderStatusColor[item.orderStatus]?.color || "gray"
                  }}
                >
                  {orderStatusColor[item.orderStatus]?.label || item.orderStatus}
                </span>
              </StyledTableCell>
              <StyledTableCell align="right">
                <Button size='small' color='success'
        onClick={(event) => handleClick(event, item.id)}
      >
        Cập nhật trạng thái
      </Button>
      <Menu
        id={`status-menu-${item.id}`} // Sửa ID cho chuẩn HTML (không có dấu cách)
        anchorEl={anchorEl && anchorEl[item.id]}
        open={Boolean(anchorEl && anchorEl[item.id])}
        onClose={() => handleClose(item.id)}
        MenuListProps={{
            'aria-labelledby': `status-menu-${item.id}`,
        }}
      >
       {/* Duyệt qua orderStatusOptions thay vì orderStatus cũ */}
       {orderStatusOptions.map((option) => (
         <MenuItem 
            key={option.status} 
            // QUAN TRỌNG: Gửi option.status (tiếng Anh) thay vì option.label
            onClick={() => handleUpdateOrderStatus(item.id, option.status)}
         >
            {option.label}
         </MenuItem>
       ))}
      </Menu>

              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  }