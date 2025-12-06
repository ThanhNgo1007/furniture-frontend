import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, Card, CardContent, Chip, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchSellerDashboard } from '../../../State/seller/sellerDashboardSlice';
import { formatVND } from '../../../Util/formatCurrency';
import { formatDateTime, formatRelativeTime } from '../../../Util/formatDateTime';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.sellerDashboard);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchSellerDashboard());
  }, [dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'red' }}>
        <Typography variant="h6">Error loading dashboard: {error}</Typography>
      </Box>
    );
  }

  if (!data) return null;

  const { summary, dailyRevenue, finance, products, customers } = data;

  // Chart Data Preparation
  const revenueDates = dailyRevenue ? Object.keys(dailyRevenue) : [];
  const revenueValues = dailyRevenue ? Object.values(dailyRevenue) as number[] : [];

  const revenueChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'area', height: 350, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { 
      categories: revenueDates, 
      type: 'category', 
      labels: { 
        formatter: (value) => {
          if (!value) return '';
          const strValue = String(value);
          const parts = strValue.split('-');
          if (parts.length === 3) {
             return `${parts[2]}/${parts[1]}`;
          }
          return strValue;
        }
      } 
    },
    yaxis: { labels: { formatter: (value) => formatVND(value) } },
    tooltip: { y: { formatter: (value) => formatVND(value) } },
    colors: ['#00E396'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 90, 100] } }
  };

  const revenueSeries = [{ name: 'Revenue', data: revenueValues }];

  const orderStatusSeries = [
    summary.pendingOrders || 0,
    summary.shippingOrders || 0,
    summary.deliveredOrders || 0,
    summary.cancelledOrders || 0
  ];

  const orderStatusOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut' },
    labels: ['Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'],
    colors: ['#FEB019', '#008FFB', '#00E396', '#FF4560'],
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, label: 'Tổng đơn hàng', formatter: () => summary.totalOrders.toString() } } } } }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Tổng quan Người bán
        </Typography>
        {summary.lastUpdated && (
          <Chip 
            icon={<UpdateIcon />}
            label={`Cập nhật: ${formatRelativeTime(summary.lastUpdated)}`}
            size="small"
            sx={{ 
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 500
            }}
          />
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Tổng quan" />
          <Tab label="Doanh thu & Tài chính" />
          <Tab label="Đơn hàng" />
          <Tab label="Sản phẩm & Khách hàng" />
        </Tabs>
      </Box>

      {/* Tab 0: Overview */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <StatsCard title="Tổng doanh thu" value={formatVND(summary.totalRevenue)} icon={<AttachMoneyIcon sx={{ fontSize: 40, color: '#00E396' }} />} color="#e6fffa" />
          <StatsCard title="Tổng đơn hàng" value={summary.totalOrders} icon={<ShoppingBagIcon sx={{ fontSize: 40, color: '#008FFB' }} />} color="#e3f2fd" />
          <StatsCard title="Lợi nhuận ròng (Ước tính)" value={formatVND(finance?.netProfit || 0)} icon={<AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#775DD0' }} />} color="#f3e5f5" />
          <StatsCard title="Khách hàng" value={customers?.totalCustomers || 0} icon={<PeopleIcon sx={{ fontSize: 40, color: '#FF4560' }} />} color="#ffebee" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Phân tích doanh thu (30 ngày qua)</Typography>
              <ReactApexChart options={revenueChartOptions} series={revenueSeries} type="area" height={350} />
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Trạng thái đơn hàng</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
                <ReactApexChart options={orderStatusOptions} series={orderStatusSeries} type="donut" width={380} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      {/* Tab 1: Revenue & Finance */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <StatsCard title="Tổng doanh thu" value={formatVND(summary.totalRevenue)} icon={<AttachMoneyIcon sx={{ fontSize: 40, color: '#00E396' }} />} color="#e6fffa" />
          <StatsCard title="Phí nền tảng (5%)" value={formatVND(finance?.platformFee || 0)} icon={<AttachMoneyIcon sx={{ fontSize: 40, color: '#FF4560' }} />} color="#ffebee" />
          <StatsCard title="Lợi nhuận ròng" value={formatVND(finance?.netProfit || 0)} icon={<AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#775DD0' }} />} color="#f3e5f5" />
        </Box>
        {finance?.lastUpdated && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <UpdateIcon sx={{ color: '#757575', fontSize: 20 }} />
            <Typography variant="body2" color="textSecondary">
              Dữ liệu tài chính được cập nhật lần cuối: <strong>{formatDateTime(finance.lastUpdated)}</strong>
            </Typography>
          </Box>
        )}
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Biểu đồ doanh thu chi tiết</Typography>
            <ReactApexChart options={revenueChartOptions} series={revenueSeries} type="bar" height={350} />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab 2: Orders */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <StatsCard title="Chờ xử lý" value={summary.pendingOrders} icon={<ShoppingBagIcon sx={{ fontSize: 40, color: '#FEB019' }} />} color="#fff8e1" />
          <StatsCard title="Đang giao" value={summary.shippingOrders} icon={<LocalShippingIcon sx={{ fontSize: 40, color: '#008FFB' }} />} color="#e3f2fd" />
          <StatsCard title="Đã giao" value={summary.deliveredOrders} icon={<InventoryIcon sx={{ fontSize: 40, color: '#00E396' }} />} color="#e6fffa" />
          <StatsCard title="Đã hủy" value={summary.cancelledOrders} icon={<CancelIcon sx={{ fontSize: 40, color: '#FF4560' }} />} color="#ffebee" />
        </Box>
      </TabPanel>

      {/* Tab 3: Products & Customers */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <StatsCard title="Tổng sản phẩm" value={products?.totalProducts || 0} icon={<InventoryIcon sx={{ fontSize: 40, color: '#008FFB' }} />} color="#e3f2fd" />
          <StatsCard title="Sắp hết hàng (<10)" value={products?.lowStockProducts || 0} icon={<InventoryIcon sx={{ fontSize: 40, color: '#FF4560' }} />} color="#ffebee" />
          <StatsCard title="Tổng khách hàng" value={customers?.totalCustomers || 0} icon={<PeopleIcon sx={{ fontSize: 40, color: '#775DD0' }} />} color="#f3e5f5" />
        </Box>
      </TabPanel>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StatsCard = ({ title, value, icon, color }: any) => (
  <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
      <Box>
        <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
      </Box>
      <Box sx={{ width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: color }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

export default Dashboard;