// File: web_fe/src/seller/pages/Payment/Payment.tsx

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { fetchTransactionsBySeler, payoutSeller } from '../../../State/seller/transactionSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { formatVND } from '../../../Util/formatCurrency';
import TransactionTable from './Transaction';

const Payment = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector(store => store.transactions);
  const [filterType, setFilterType] = useState('ALL'); // ALL, DAY, MONTH, YEAR

  useEffect(() => {
    // Gọi API lấy danh sách giao dịch mỗi khi vào trang Payment
    dispatch(fetchTransactionsBySeler(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

  // 1. Lọc Transaction (Chỉ lấy paid = false) & Theo thời gian
  const filteredTransactions = useMemo(() => {
    let data = transactions.filter(t => !t.paid); // Chỉ hiện chưa thanh toán

    const now = new Date();
    if (filterType === 'DAY') {
        data = data.filter(t => new Date(t.date).toDateString() === now.toDateString());
    } else if (filterType === 'MONTH') {
        data = data.filter(t => 
            new Date(t.date).getMonth() === now.getMonth() && 
            new Date(t.date).getFullYear() === now.getFullYear()
        );
    } else if (filterType === 'YEAR') {
        data = data.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
    }
    return data;
  }, [transactions, filterType]);

  // 2. Tính tổng tiền (Doanh thu chờ rút)
  const totalEarnings = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => acc + (curr.order.totalSellingPrice || 0), 0);
  }, [filteredTransactions]);

  // 3. Xử lý Rút tiền
  const handlePayout = async () => {
      if(totalEarnings === 0) return alert("Không có số dư để rút!");
      
      await dispatch(payoutSeller(localStorage.getItem('jwt') || '')).unwrap();
      alert("Yêu cầu thanh toán thành công!");
      // Load lại danh sách (lúc này danh sách sẽ rỗng hoặc chỉ còn đơn mới)
      dispatch(fetchTransactionsBySeler(localStorage.getItem('jwt') || ''));
  };

  return (
    <div className='space-y-8'>
        <div className="flex justify-between items-center">
            <Typography variant="h4" fontWeight="bold" className="text-gray-800">
                Thanh Toán & Doanh Thu
            </Typography>
            
            {/* Bộ lọc thời gian */}
            <FormControl size="small" sx={{minWidth: 120}}>
                <InputLabel>Lọc theo</InputLabel>
                <Select
                    value={filterType}
                    label="Lọc theo"
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <MenuItem value="ALL">Tất cả</MenuItem>
                    <MenuItem value="DAY">Hôm nay</MenuItem>
                    <MenuItem value="MONTH">Tháng này</MenuItem>
                    <MenuItem value="YEAR">Năm nay</MenuItem>
                </Select>
            </FormControl>
        </div>

        <Grid container spacing={3}>
            {/* Card Tổng Doanh Thu (Chưa rút) */}
            <Grid size={{xs: 12, md: 6}}>
                <Card className='rounded-xl p-6 shadow-md bg-gradient-to-r from-teal-500 to-teal-600 text-white'>
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="subtitle1" className="opacity-90">Doanh Thu (Chờ Rút)</Typography>
                            <Typography variant="h3" fontWeight="bold">
                                {formatVND(totalEarnings)}
                            </Typography>
                        </div>
                        <MonetizationOnIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                    </div>
                </Card>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
                <Card className='rounded-xl p-6 shadow-md border border-gray-200'>
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="subtitle1" color="text.secondary">Lợi Nhuận (Est. 90%)</Typography>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                                {formatVND(totalEarnings * 0.9)} 
                            </Typography>
                            <div className='mt-3'>
                                <Button 
                                    variant='contained' 
                                    color="success"
                                    onClick={handlePayout}
                                    disabled={totalEarnings === 0}
                                >
                                    Rút Tiền Về Ví
                                </Button>
                            </div>
                        </div>
                        <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 50 }} />
                    </div>
                </Card>
            </Grid>
        </Grid>

        <div>
            <Typography variant="h6" fontWeight="bold" className="mb-4 text-gray-700">
                Danh sách đơn hàng chưa quyết toán ({filteredTransactions.length})
            </Typography>
            {/* Truyền data đã lọc vào TransactionTable */}
            <TransactionTable data={filteredTransactions}/> 
        </div>
    </div>
  )
}

export default Payment