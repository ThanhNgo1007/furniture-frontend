// File: web_fe/src/seller/pages/Payment/Payment.tsx

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Button, Card, Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { fetchTransactionsBySeler, payoutSeller } from '../../../State/seller/transactionSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { formatVND } from '../../../Util/formatCurrency';
import TransactionTable from './Transaction';

const Payment = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector(store => store.transactions);
  const [filterType] = useState<'ALL' | 'DAY' | 'MONTH' | 'YEAR'>('ALL');

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

  // 4. Lịch sử Quyết toán (Đã paid)
  const payoutHistory = useMemo(() => {
    const paidTransactions = transactions.filter(t => t.paid);
    
    // Group by payoutDate (Day)
    const grouped = paidTransactions.reduce((acc, curr) => {
        const date = curr.payoutDate ? new Date(curr.payoutDate).toLocaleDateString('vi-VN') : 'Unknown';
        if (!acc[date]) {
            acc[date] = { date, totalAmount: 0, count: 0, transactions: [] };
        }
        acc[date].totalAmount += (curr.order.totalSellingPrice || 0);
        acc[date].count += 1;
        acc[date].transactions.push(curr);
        return acc;
    }, {} as Record<string, { date: string, totalAmount: number, count: number, transactions: any[] }>);

    return Object.values(grouped).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  // 5. Thống kê đã quyết toán (Tháng/Năm)
  const paidStats = useMemo(() => {
      const now = new Date();
      const paid = transactions.filter(t => t.paid);
      
      const thisMonth = paid.filter(t => t.payoutDate && new Date(t.payoutDate).getMonth() === now.getMonth() && new Date(t.payoutDate).getFullYear() === now.getFullYear())
                            .reduce((sum, t) => sum + (t.order.totalSellingPrice || 0), 0);
      
      const thisYear = paid.filter(t => t.payoutDate && new Date(t.payoutDate).getFullYear() === now.getFullYear())
                           .reduce((sum, t) => sum + (t.order.totalSellingPrice || 0), 0);
      
      return { thisMonth, thisYear };
  }, [transactions]);

  return (
    <div className='space-y-8'>
        <div className="flex justify-between items-center">
            <Typography variant="h4" fontWeight="bold" className="text-gray-800">
                Thanh Toán & Doanh Thu
            </Typography>
        </div>

        {/* Stats Cards */}
        <Grid container spacing={3}>
            {/* Card Tổng Doanh Thu (Chưa rút) */}
            <Grid size={{xs: 12, md: 4}}>
                <Card className='rounded-xl p-6 shadow-md bg-gradient-to-r from-teal-500 to-teal-600 text-white h-full'>
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="subtitle1" className="opacity-90">Doanh Thu (Chờ Rút)</Typography>
                            <Typography variant="h4" fontWeight="bold">
                                {formatVND(totalEarnings)}
                            </Typography>
                        </div>
                        <MonetizationOnIcon sx={{ fontSize: 50, opacity: 0.2 }} />
                    </div>
                </Card>
            </Grid>

            {/* Card Đã Quyết Toán (Tháng) */}
            <Grid size={{xs: 12, md: 4}}>
                <Card className='rounded-xl p-6 shadow-md bg-white border border-gray-200 h-full'>
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="subtitle1" color="text.secondary">Đã Quyết Toán (Tháng này)</Typography>
                            <Typography variant="h4" fontWeight="bold" color="primary">
                                {formatVND(paidStats.thisMonth)}
                            </Typography>
                        </div>
                        <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 50, opacity: 0.5 }} />
                    </div>
                </Card>
            </Grid>

            {/* Card Đã Quyết Toán (Năm) */}
            <Grid size={{xs: 12, md: 4}}>
                <Card className='rounded-xl p-6 shadow-md bg-white border border-gray-200 h-full'>
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="subtitle1" color="text.secondary">Đã Quyết Toán (Năm nay)</Typography>
                            <Typography variant="h4" fontWeight="bold" color="secondary">
                                {formatVND(paidStats.thisYear)}
                            </Typography>
                        </div>
                        <AccountBalanceWalletIcon color="secondary" sx={{ fontSize: 50, opacity: 0.5 }} />
                    </div>
                </Card>
            </Grid>
        </Grid>

        <Grid container spacing={3}>
            <Grid size={{xs: 12, md: 6}}>
                <Card className='rounded-xl p-6 shadow-md border border-gray-200'>
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="subtitle1" color="text.secondary">Lợi Nhuận Ước Tính (95%)</Typography>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                                {formatVND(totalEarnings * 0.95)} 
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                *Sau khi trừ 5% phí sàn
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
                    </div>
                </Card>
            </Grid>
        </Grid>

        <Grid container spacing={3}>
            {/* Cột Trái: Danh sách đơn chờ quyết toán */}
            <Grid size={{xs: 12, lg: 8}}>
                <Typography variant="h6" fontWeight="bold" className="mb-4 text-gray-700">
                    Đơn hàng chờ quyết toán ({filteredTransactions.length})
                </Typography>
                <TransactionTable data={filteredTransactions} mode="PENDING"/> 
            </Grid>

            {/* Cột Phải: Lịch sử quyết toán */}
            <Grid size={{xs: 12, lg: 4}}>
                <Typography variant="h6" fontWeight="bold" className="mb-4 text-gray-700">
                    Lịch sử quyết toán
                </Typography>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {payoutHistory.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Quyết Toán</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Đơn</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Tiền</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payoutHistory.map((payout, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{formatVND(payout.totalAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-6 text-center text-gray-500">Chưa có lịch sử quyết toán</div>
                    )}
                </div>
            </Grid>
        </Grid>
    </div>
  )
}

export default Payment