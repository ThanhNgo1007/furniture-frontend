import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { type ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchAdminDashboard } from '../../../State/admin/adminDashboardSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { formatVND } from '../../../Util/formatCurrency';

// TabPanel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// StatsCard Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon, color, subtitle }: StatsCardProps) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'translateY(-4px)' },
    }}
  >
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          backgroundColor: color,
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

const DashboardOverview = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.adminDashboard);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Lỗi: {error}
        </Typography>
      </Box>
    );
  }

  if (!data) return null;

  const { summary, orderStats, dailyRevenue, dailyOrders, topSellers, paymentBreakdown } = data;

  // Chart configs
  const revenueChartOptions: ApexOptions = {
    chart: { type: 'area', height: 350, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: Object.keys(dailyRevenue || {}),
      labels: {
        formatter: (value) => {
          if (!value) return '';
          const parts = String(value).split('-');
          return parts.length === 3 ? `${parts[2]}/${parts[1]}` : String(value);
        },
      },
    },
    yaxis: { labels: { formatter: (value) => formatVND(value) } },
    tooltip: { y: { formatter: (value) => formatVND(value) } },
    colors: ['#00E396'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 90, 100] },
    },
  };

  const ordersChartOptions: ApexOptions = {
    chart: { type: 'line', height: 300, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: Object.keys(dailyOrders || {}),
      labels: {
        formatter: (value) => {
          if (!value) return '';
          const parts = String(value).split('-');
          return parts.length === 3 ? `${parts[2]}/${parts[1]}` : String(value);
        },
      },
    },
    colors: ['#008FFB'],
  };

  const orderStatusOptions: ApexOptions = {
    chart: { type: 'donut' },
    labels: ['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
    colors: ['#FEB019', '#00E396', '#008FFB', '#775DD0', '#FF4560'],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Tổng đơn',
              formatter: () => String(orderStats?.totalProcessed || 0),
            },
          },
        },
      },
    },
  };

  const paymentPieOptions: ApexOptions = {
    chart: { type: 'pie' },
    labels: ['VNPay', 'COD'],
    colors: ['#008FFB', '#00E396'],
    legend: { position: 'bottom' },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        📊 Admin Dashboard
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="📊 Tổng Quan" />
        <Tab label="📦 Đơn Hàng" />
        <Tab label="👥 Users & Sellers" />
        <Tab label="💰 Doanh Thu" />
      </Tabs>

      {/* Tab 0: Overview */}
      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <StatsCard
            title="Tổng Doanh Thu"
            value={formatVND(summary?.totalRevenue || 0)}
            icon={<AttachMoneyIcon sx={{ fontSize: 32, color: '#00E396' }} />}
            color="#e6fffa"
          />
          <StatsCard
            title="Phí Sàn (5%)"
            value={formatVND(summary?.platformCommission || 0)}
            icon={<AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#775DD0' }} />}
            color="#f3e5f5"
          />
          <StatsCard
            title="Tổng Đơn Hàng"
            value={summary?.totalOrders || 0}
            icon={<ShoppingCartIcon sx={{ fontSize: 32, color: '#008FFB' }} />}
            color="#e3f2fd"
          />
          <StatsCard
            title="Khách Hàng"
            value={summary?.totalCustomers || 0}
            icon={<GroupIcon sx={{ fontSize: 32, color: '#FF4560' }} />}
            color="#ffebee"
          />
          <StatsCard
            title="Sellers"
            value={summary?.totalSellers || 0}
            icon={<StoreIcon sx={{ fontSize: 32, color: '#FEB019' }} />}
            color="#fff8e1"
          />
          <StatsCard
            title="Sản Phẩm"
            value={summary?.totalProducts || 0}
            icon={<InventoryIcon sx={{ fontSize: 32, color: '#00BCD4' }} />}
            color="#e0f7fa"
          />
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', p: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📈 Thống kê hôm nay
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography color="textSecondary">Đơn hàng hôm nay</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {summary?.ordersToday || 0}
              </Typography>
            </Box>
            <Box>
              <Typography color="textSecondary">Doanh thu hôm nay</Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {formatVND(summary?.revenueToday || 0)}
              </Typography>
            </Box>
          </Box>
        </Card>
      </TabPanel>

      {/* Tab 1: Orders */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                🍩 Trạng thái đơn hàng
              </Typography>
              <ReactApexChart
                options={orderStatusOptions}
                series={[
                  orderStats?.pending || 0,
                  orderStats?.confirmed || 0,
                  orderStats?.shipped || 0,
                  orderStats?.delivered || 0,
                  orderStats?.cancelled || 0,
                ]}
                type="donut"
                height={300}
              />
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                📊 Chỉ số quan trọng
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <StatsCard
                  title="Tỷ lệ hoàn thành"
                  value={`${orderStats?.successRate || 0}%`}
                  icon={<CheckCircleIcon sx={{ fontSize: 28, color: '#00E396' }} />}
                  color="#e6fffa"
                />
                <StatsCard
                  title="Tỷ lệ hủy"
                  value={`${orderStats?.cancelRate || 0}%`}
                  icon={<CancelIcon sx={{ fontSize: 28, color: '#FF4560' }} />}
                  color="#ffebee"
                />
                <StatsCard
                  title="Đang giao"
                  value={orderStats?.shipped || 0}
                  icon={<LocalShippingIcon sx={{ fontSize: 28, color: '#008FFB' }} />}
                  color="#e3f2fd"
                />
                <StatsCard
                  title="Chờ xử lý"
                  value={orderStats?.pending || 0}
                  icon={<PendingIcon sx={{ fontSize: 28, color: '#FEB019' }} />}
                  color="#fff8e1"
                />
              </Box>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Giá trị đơn hàng trung bình (AOV)
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {formatVND(orderStats?.avgOrderValue || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              📈 Đơn hàng 30 ngày qua
            </Typography>
            <ReactApexChart
              options={ordersChartOptions}
              series={[{ name: 'Đơn hàng', data: Object.values(dailyOrders || {}) }]}
              type="line"
              height={300}
            />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab 2: Users & Sellers */}
      <TabPanel value={tabValue} index={2}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <StatsCard
            title="Tổng khách hàng"
            value={summary?.totalCustomers || 0}
            icon={<GroupIcon sx={{ fontSize: 32, color: '#008FFB' }} />}
            color="#e3f2fd"
          />
          <StatsCard
            title="Sellers đang hoạt động"
            value={summary?.totalSellers || 0}
            icon={<StoreIcon sx={{ fontSize: 32, color: '#00E396' }} />}
            color="#e6fffa"
          />
          <StatsCard
            title="Chờ duyệt"
            value={data.userActivity?.pendingSellers || 0}
            icon={<PendingIcon sx={{ fontSize: 32, color: '#FEB019' }} />}
            color="#fff8e1"
          />
          <StatsCard
            title="Tổng sản phẩm"
            value={summary?.totalProducts || 0}
            icon={<InventoryIcon sx={{ fontSize: 32, color: '#775DD0' }} />}
            color="#f3e5f5"
          />
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              🏆 Top 5 Sellers theo doanh thu
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Tên Seller</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Doanh thu</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Đơn hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellers?.map((seller, index) => (
                    <tr key={seller.sellerId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 12,
                          }}
                        >
                          {seller.rank}
                        </Box>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 500 }}>{seller.sellerName}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#00E396', fontWeight: 'bold' }}>
                        {formatVND(seller.revenue)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{seller.orderCount}</td>
                    </tr>
                  ))}
                  {(!topSellers || topSellers.length === 0) && (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab 3: Revenue */}
      <TabPanel value={tabValue} index={3}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 2,
            mb: 4,
          }}
        >
          <StatsCard
            title="Tổng GMV"
            value={formatVND(summary?.totalRevenue || 0)}
            icon={<TrendingUpIcon sx={{ fontSize: 32, color: '#00E396' }} />}
            color="#e6fffa"
          />
          <StatsCard
            title="Phí sàn (5%)"
            value={formatVND(summary?.platformCommission || 0)}
            icon={<AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#FF4560' }} />}
            color="#ffebee"
          />
          <StatsCard
            title="Seller Payout"
            value={formatVND((summary?.totalRevenue || 0) - (summary?.platformCommission || 0))}
            icon={<AttachMoneyIcon sx={{ fontSize: 32, color: '#008FFB' }} />}
            color="#e3f2fd"
          />
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              📈 Doanh thu 30 ngày qua
            </Typography>
            <ReactApexChart
              options={revenueChartOptions}
              series={[{ name: 'Doanh thu', data: Object.values(dailyRevenue || {}) }]}
              type="area"
              height={350}
            />
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                💳 Phương thức thanh toán
              </Typography>
              <ReactApexChart
                options={paymentPieOptions}
                series={[paymentBreakdown?.vnpayPercent || 0, paymentBreakdown?.codPercent || 0]}
                type="pie"
                height={250}
              />
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                📊 Chi tiết thanh toán
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    VNPay
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {paymentBreakdown?.vnpay?.count || 0} đơn • {formatVND(paymentBreakdown?.vnpay?.amount || 0)}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, backgroundColor: '#e6fffa', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    COD
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {paymentBreakdown?.cod?.count || 0} đơn • {formatVND(paymentBreakdown?.cod?.amount || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default DashboardOverview;
