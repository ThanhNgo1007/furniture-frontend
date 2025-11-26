import { Avatar, Box, Button, Chip, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../../State/Store';
// Giả sử bạn đã có hàm này, nếu chưa hãy xem mục 3 bên dưới
import { formatVND } from '../../../Util/formatCurrency';

// Custom style cho Header bảng
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0f172a", // Màu tối hiện đại (Slate 900)
    color: theme.palette.common.white,
    fontWeight: 'bold',
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

const orderStatusColor: { [key: string]: { color: string; label: string } } = {
  PENDING: { color: "#FFA500", label: "Chờ xác nhận" },
  CONFIRMED: { color: "#F5BCBA", label: "Đã xác nhận" },
  PLACED: { color: "#c26e1f", label: "Đang chuẩn bị" },
  SHIPPED: { color: "#1E90FF", label: "Đang vận chuyển" },
  DELIVERED: { color: "#32CD32", label: "Đã giao" },
  CANCELLED: { color: "#FF0000", label: "Đã hủy" },
};

// Thêm props
interface TransactionTableProps {
    data?: any[]; // Hoặc Type Transaction[]
}

export default function TransactionTable({data}: TransactionTableProps) {
  const { transactions: storeTransactions } = useAppSelector(store => store.transactions);
  const transactions = data || storeTransactions;

  // State cho bộ lọc
  const [filterType, setFilterType] = useState<'all' | 'day' | 'month' | 'year'>('all');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Lọc transactions dựa trên filter
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date || Date.now());
      const transactionDay = transactionDate.getDate();
      const transactionMonth = transactionDate.getMonth() + 1; // 0-indexed
      const transactionYear = transactionDate.getFullYear();

      if (filterType === 'day' && selectedDay) {
        const [year, month, day] = selectedDay.split('-').map(Number);
        return transactionDay === day && transactionMonth === month && transactionYear === year;
      }

      if (filterType === 'month' && selectedMonth) {
        const [year, month] = selectedMonth.split('-').map(Number);
        return transactionMonth === month && transactionYear === year;
      }

      if (filterType === 'year' && selectedYear) {
        return transactionYear === Number(selectedYear);
      }

      return true;
    });
  }, [transactions, filterType, selectedDay, selectedMonth, selectedYear]);

  // Reset filters
  const handleResetFilters = () => {
    setFilterType('all');
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
  };

  return (
    <Box>
      {/* Filter Controls */}
      <Paper className="p-4 mb-4 shadow-md">
        <Typography variant="h6" className="mb-3 font-bold">
          Bộ lọc giao dịch
        </Typography>
        <Box className="flex flex-wrap gap-4 items-end">
          {/* Filter Type Selector */}
          <TextField
            select
            label="Lọc theo"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as any);
              // Reset các giá trị filter khi đổi loại
              setSelectedDay('');
              setSelectedMonth('');
              setSelectedYear('');
            }}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="day">Theo ngày</MenuItem>
            <MenuItem value="month">Theo tháng</MenuItem>
            <MenuItem value="year">Theo năm</MenuItem>
          </TextField>

          {/* Day Picker */}
          {filterType === 'day' && (
            <TextField
              type="date"
              label="Chọn ngày"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 200 }}
            />
          )}

          {/* Month Picker */}
          {filterType === 'month' && (
            <TextField
              type="month"
              label="Chọn tháng"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 200 }}
            />
          )}

          {/* Year Picker */}
          {filterType === 'year' && (
            <TextField
              type="number"
              label="Chọn năm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              placeholder="VD: 2024"
              size="small"
              sx={{ minWidth: 150 }}
              inputProps={{ min: 2000, max: 2100 }}
            />
          )}

          {/* Reset Button */}
          {filterType !== 'all' && (
            <Button 
              variant="outlined" 
              onClick={handleResetFilters}
              size="small"
            >
              Đặt lại
            </Button>
          )}

          {/* Results Count */}
          <Typography variant="body2" color="text.secondary" className="ml-auto">
            Hiển thị {filteredTransactions.length} / {transactions.length} giao dịch
          </Typography>
        </Box>
      </Paper>

      {/* Transaction Table */}
      <TableContainer component={Paper} className="shadow-lg rounded-lg overflow-hidden">
        <Table sx={{ minWidth: 700 }} aria-label="transaction table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Mã giao dịch</StyledTableCell>
              <StyledTableCell>Khách hàng</StyledTableCell>
              <StyledTableCell>Mã đơn hàng</StyledTableCell>
              <StyledTableCell align="right">Tổng tiền</StyledTableCell>
              <StyledTableCell align="right">Trạng thái</StyledTableCell>
              <StyledTableCell align="right">Ngày giao dịch</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((item) => (
              <StyledTableRow key={item.id} hover>
                <StyledTableCell component="th" scope="row">
                  #{item.id}
                </StyledTableCell>
                
                {/* Cột Khách Hàng */}
                <StyledTableCell>
                  <div className="flex items-center gap-3">
                      <Avatar sx={{ bgcolor: 'teal' }}>
                          {item.customer.fullName?.[0]?.toUpperCase()}
                      </Avatar>
                      <div>
                          <Typography variant="subtitle2" fontWeight="bold">
                              {item.customer.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                              {item.customer.email}
                          </Typography>
                      </div>
                  </div>
                </StyledTableCell>

                {/* Cột Đơn Hàng */}
                <StyledTableCell>
                   <span className="font-medium text-teal-600">Order #{item.order.id}</span>
                </StyledTableCell>

                {/* Cột Tổng Tiền (Sửa lỗi hiển thị Order ID thành Tiền) */}
                <StyledTableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                      {/* Cần đảm bảo object Order có field totalSellingPrice hoặc totalPrice */}
                      {formatVND(item.order.totalSellingPrice || 0)} 
                  </Typography>
                </StyledTableCell>

                {/* Cột Trạng Thái */}
                <StyledTableCell align="right">
                  <Chip 
                      label={item.paid ? "Đã quyết toán" : "Chưa quyết toán"} 
                      sx={{
                          color: "white",
                          backgroundColor: item.paid ? "green" : "red",
                          fontWeight: "bold",
                      }}
                      size="medium"
                      variant="outlined"
                  />
                </StyledTableCell>

                {/* Cột Ngày */}
                <StyledTableCell align="right">
                   {new Date(item.date || Date.now()).toLocaleDateString('vi-VN')}
                </StyledTableCell>
              </StyledTableRow>
            ))) : (
               <StyledTableRow>
                   <StyledTableCell colSpan={6} align="center" className="py-10 text-gray-500">
                       {filterType === 'all' ? 'Chưa có giao dịch nào.' : 'Không tìm thấy giao dịch nào phù hợp với bộ lọc.'}
                   </StyledTableCell>
               </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}