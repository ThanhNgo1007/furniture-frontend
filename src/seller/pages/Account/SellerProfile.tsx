import { AccountBalance, Business, LocationOn, Person } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card, CardContent,
    CircularProgress,
    Grid,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from '../../../config/Api';
import { fetchSellerProfile } from '../../../State/seller/sellerSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

// Seller type definition
interface Seller {
  id?: number;
  sellerName?: string;
  mobile?: string;
  email?: string;
  MST?: string;
  bussinessDetails?: {
    bussinessName?: string;
    bussinessEmail?: string;
    bussinessMobile?: string;
  };
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    swiftCode?: string;
  };
  pickupAddress?: {
    address?: string;
    city?: string;
    ward?: string;
    locality?: string;
    pinCode?: string;
    mobile?: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SellerProfile = () => {
  // The seller data from store is stored directly, not in a nested property
  const seller = useAppSelector(store => store.seller.seller) as Seller | null;
  const dispatch = useAppDispatch();
  
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(false);

  // Personal Info  
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  // Business Details
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessMobile, setBusinessMobile] = useState("");
  const [mst, setMst] = useState("");

  // Bank Details
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  // Pickup Address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [ward, setWard] = useState("");
  const [locality, setLocality] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [addressMobile, setAddressMobile] = useState("");

  const [errors, setErrors] = useState<any>({});

  // Load seller data on mount
  useEffect(() => {
    if (!seller) {
      dispatch(fetchSellerProfile());
    }
  }, [dispatch, seller]);

  // Update form fields when seller data changes
  useEffect(() => {
    if (seller && typeof seller === 'object' && !Array.isArray(seller)) {
      setFullName(seller.sellerName || "");
      setMobile(seller.mobile || "");
      setBusinessName(seller.bussinessDetails?.bussinessName || "");
      setBusinessEmail(seller.bussinessDetails?.bussinessEmail || "");
      setBusinessMobile(seller.bussinessDetails?.bussinessMobile || "");
      setMst(seller.MST || "");
      setAccountHolder(seller.bankDetails?.accountHolderName || "");
      setAccountNumber(seller.bankDetails?.accountNumber || "");
      setSwiftCode(seller.bankDetails?.swiftCode || "");
      setAddress(seller.pickupAddress?.address || "");
      setCity(seller.pickupAddress?.city || "");
      setWard(seller.pickupAddress?.ward || "");
      setLocality(seller.pickupAddress?.locality || "");
      setPinCode(seller.pickupAddress?.pinCode || "");
      setAddressMobile(seller.pickupAddress?.mobile || "");
    }
  }, [seller]);

  const validatePersonal = () => {
    const newErrors: any = {};
    if (!fullName.trim()) newErrors.fullName = "Họ tên không được để trống";
    else if (fullName.trim().length < 2) newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    if (!mobile.trim()) newErrors.mobile = "Số điện thoại không được để trống";
    else if (!/^0\d{9,10}$/.test(mobile)) newErrors.mobile = "SĐT không hợp lệ (10-11 số, bắt đầu 0)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusiness = () => {
    const newErrors: any = {};
    if (!businessName.trim()) newErrors.businessName = "Tên doanh nghiệp không được để trống";
    if (businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      newErrors.businessEmail = "Email không hợp lệ";
    }
    if (businessMobile && !/^0\d{9,10}$/.test(businessMobile)) {
      newErrors.businessMobile = "SĐT không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBank = () => {
    const newErrors: any = {};
    if (!accountHolder.trim()) newErrors.accountHolder = "Tên chủ tài khoản không được để trống";
    if (!accountNumber.trim()) newErrors.accountNumber = "Số tài khoản không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = () => {
    const newErrors: any = {};
    if (!address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!city.trim()) newErrors.city = "Thành phố không được để trống";
    if (addressMobile && !/^0\d{9,10}$/.test(addressMobile)) {
      newErrors.addressMobile = "SĐT không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (tab: number) => {
    let isValid = false;
    switch (tab) {
      case 0: isValid = validatePersonal(); break;
      case 1: isValid = validateBusiness(); break;
      case 2: isValid = validateBank(); break;
      case 3: isValid = validateAddress(); break;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const updatedSeller = {
        sellerName: fullName.trim(),
        mobile: mobile.trim(),
        bussinessDetails: {
          bussinessName: businessName.trim(),
          bussinessEmail: businessEmail.trim(),
          bussinessMobile: businessMobile.trim(),
        },
        bankDetails: {
          accountHolderName: accountHolder.trim(),
          accountNumber: accountNumber.trim(),
          swiftCode: swiftCode.trim(),
        },
        pickupAddress: {
          address: address.trim(),
          city: city.trim(),
          ward: ward.trim(),
          locality: locality.trim(),
          pinCode: pinCode.trim(),
          mobile: addressMobile.trim(),
        },
        MST: mst.trim(),
      };

      await api.patch("/sellers", updatedSeller);
      
      // Refresh seller data
      dispatch(fetchSellerProfile());
      
      setIsEditing({ ...isEditing, [tab]: false });
      setErrors({});
    } catch (error: any) {
      alert(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (tab: number) => {
    if (seller && typeof seller === 'object' && !Array.isArray(seller)) {
      setFullName(seller.sellerName || "");
      setMobile(seller.mobile || "");
      setBusinessName(seller.bussinessDetails?.bussinessName || "");
      setBusinessEmail(seller.bussinessDetails?.bussinessEmail || "");
      setBusinessMobile(seller.bussinessDetails?.bussinessMobile || "");
      setMst(seller.MST || "");
      setAccountHolder(seller.bankDetails?.accountHolderName || "");
      setAccountNumber(seller.bankDetails?.accountNumber || "");
      setSwiftCode(seller.bankDetails?.swiftCode || "");
      setAddress(seller.pickupAddress?.address || "");
      setCity(seller.pickupAddress?.city || "");
      setWard(seller.pickupAddress?.ward || "");
      setLocality(seller.pickupAddress?.locality || "");
      setPinCode(seller.pickupAddress?.pinCode || "");
      setAddressMobile(seller.pickupAddress?.mobile || "");
    }
    setIsEditing({ ...isEditing, [tab]: false });
    setErrors({});
  };

  const sellerData = seller && typeof seller === 'object' && !Array.isArray(seller) ? seller : null;

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar 
          sx={{ width: 120, height: 120, margin: '0 auto 16px', bgcolor: 'primary.main' }}
          src="https://avatar.iran.liara.run/public/boy"
        />
        <Typography variant="h4" fontWeight="bold">{sellerData?.sellerName || "Hồ sơ người bán"}</Typography>
        <Typography color="textSecondary">{sellerData?.email}</Typography>
      </Box>

      {/* Tabs */}
      <Card elevation={3}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label="Thông tin cá nhân" />
          <Tab icon={<Business />} label="Doanh nghiệp" />
          <Tab icon={<AccountBalance />} label="Ngân hàng" />
          <Tab icon={<LocationOn />} label="Địa chỉ lấy hàng" />
        </Tabs>

        {/* Tab 0: Personal Info */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Thông tin cá nhân</Typography>
              {!isEditing[0] && (
                <Button variant="outlined" size="small" onClick={() => setIsEditing({ ...isEditing, 0: true })}>
                  Chỉnh sửa
                </Button>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  fullWidth
                  disabled={!isEditing[0]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Số điện thoại"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  fullWidth
                  disabled={!isEditing[0]}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  value={sellerData?.email || ""}
                  fullWidth
                  disabled
                  helperText="Email không thể thay đổi"
                />
              </Grid>
            </Grid>
            {isEditing[0] && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => handleSave(0)} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : "Lưu"}
                </Button>
                <Button variant="outlined" onClick={() => handleCancel(0)} disabled={loading}>Hủy</Button>
              </Box>
            )}
          </CardContent>
        </TabPanel>

        {/* Tab 1: Business Details */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Thông tin doanh nghiệp</Typography>
              {!isEditing[1] && (
                <Button variant="outlined" size="small" onClick={() => setIsEditing({ ...isEditing, 1: true })}>
                  Chỉnh sửa
                </Button>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Tên doanh nghiệp"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  error={!!errors.businessName}
                  helperText={errors.businessName}
                  fullWidth
                  disabled={!isEditing[1]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Mã số thuế (MST)"
                  value={mst}
                  onChange={(e) => setMst(e.target.value)}
                  fullWidth
                  disabled={!isEditing[1]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email doanh nghiệp"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  error={!!errors.businessEmail}
                  helperText={errors.businessEmail}
                  fullWidth
                  disabled={!isEditing[1]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Số điện thoại doanh nghiệp"
                  value={businessMobile}
                  onChange={(e) => setBusinessMobile(e.target.value)}
                  error={!!errors.businessMobile}
                  helperText={errors.businessMobile}
                  fullWidth
                  disabled={!isEditing[1]}
                />
              </Grid>
            </Grid>
            {isEditing[1] && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => handleSave(1)} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : "Lưu"}
                </Button>
                <Button variant="outlined" onClick={() => handleCancel(1)} disabled={loading}>Hủy</Button>
              </Box>
            )}
          </CardContent>
        </TabPanel>

        {/* Tab 2: Bank Details */}
        <TabPanel value={tabValue} index={2}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Thông tin ngân hàng</Typography>
              {!isEditing[2] && (
                <Button variant="outlined" size="small" onClick={() => setIsEditing({ ...isEditing, 2: true })}>
                  Chỉnh sửa
                </Button>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Tên chủ tài khoản"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  error={!!errors.accountHolder}
                  helperText={errors.accountHolder}
                  fullWidth
                  disabled={!isEditing[2]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Số tài khoản"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                  fullWidth
                  disabled={!isEditing[2]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Mã Swift Code"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  fullWidth
                  disabled={!isEditing[2]}
                />
              </Grid>
            </Grid>
            {isEditing[2] && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => handleSave(2)} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : "Lưu"}
                </Button>
                <Button variant="outlined" onClick={() => handleCancel(2)} disabled={loading}>Hủy</Button>
              </Box>
            )}
          </CardContent>
        </TabPanel>

        {/* Tab 3: Pickup Address */}
        <TabPanel value={tabValue} index={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Địa chỉ lấy hàng</Typography>
              {!isEditing[3] && (
                <Button variant="outlined" size="small" onClick={() => setIsEditing({ ...isEditing, 3: true })}>
                  Chỉnh sửa
                </Button>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                  disabled={!isEditing[3]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Thành phố"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                  fullWidth
                  disabled={!isEditing[3]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Quận/Huyện"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  fullWidth
                  disabled={!isEditing[3]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Phường/Xã"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  fullWidth
                  disabled={!isEditing[3]}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Mã bưu điện"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  fullWidth
                  disabled={!isEditing[3]}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Số điện thoại liên hệ"
                  value={addressMobile}
                  onChange={(e) => setAddressMobile(e.target.value)}
                  error={!!errors.addressMobile}
                  helperText={errors.addressMobile}
                  fullWidth
                  disabled={!isEditing[3]}
                />
              </Grid>
            </Grid>
            {isEditing[3] && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => handleSave(3)} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : "Lưu"}
                </Button>
                <Button variant="outlined" onClick={() => handleCancel(3)} disabled={loading}>Hủy</Button>
              </Box>
            )}
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default SellerProfile;