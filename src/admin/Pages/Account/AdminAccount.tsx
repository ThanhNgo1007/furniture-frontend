import {
    AccountCircle as AccountCircleIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Security as SecurityIcon
} from '@mui/icons-material'
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography
} from '@mui/material'
import { useAppSelector } from '../../../State/Store'

const AdminAccount = () => {
  const { auth } = useAppSelector((state) => state)
  const user = auth.user

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Thông tin tài khoản
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
                  bgcolor: '#1976d2',
                  fontSize: 48
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                {user?.fullName || 'Admin'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email || 'admin@furniture.com'}
              </Typography>
              <Chip
                icon={<SecurityIcon />}
                label="Quản trị viên"
                color="primary"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Account Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Chi tiết tài khoản
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Họ tên"
                  secondary={user?.fullName || 'Chưa cập nhật'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user?.email || 'Chưa cập nhật'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Số điện thoại"
                  secondary={user?.mobile || 'Chưa cập nhật'}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Vai trò"
                  secondary={
                    <Chip
                      label={user?.role === 'ROLE_ADMIN' ? 'Admin' : user?.role || 'Admin'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  }
                />
              </ListItem>
            </List>
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
                <Typography variant="body1">Xác thực hai yếu tố</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tài khoản được bảo vệ bằng OTP qua email
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminAccount
