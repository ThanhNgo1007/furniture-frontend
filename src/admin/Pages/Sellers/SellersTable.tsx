import {
    FormControl, InputLabel, MenuItem, Paper, Select, styled,
    Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchSellers, updateSellerStatus } from '../../../State/admin/adminSellerSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

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

const accountStatu = [
  { status: "PENDING_VERIFICATION", title: "Chờ xác thực" },
  { status: "ACTIVE", title: "Hoạt động" },
  { status: "SUSPENDED", title: "Tạm ngưng" },
  { status: "DEACTIVATED", title: "Vô hiệu hóa" },
  { status: "BANNED", title: "Bị cấm" },
  { status: "CLOSED", title: "Đã đóng" }
]

const SellersTable = () => {
  const dispatch = useAppDispatch()
  const { sellers, loading } = useAppSelector((store) => store.adminSeller)
  const [accountStatus, setAccountStatus] = useState<string>('ALL')

  useEffect(() => {
    // Fetch all sellers initially or when status changes
    const statusParam = accountStatus === 'ALL' ? null : accountStatus;
    dispatch(fetchSellers(statusParam))
  }, [dispatch, accountStatus])

  const handleStatusChange = (id: number, newStatus: string) => {
    dispatch(updateSellerStatus({ id, status: newStatus }))
  }

  return (
    <>
      <div className='pb-5 w-60'>
        <FormControl fullWidth>
          <InputLabel id="account-status-label">Trạng thái tài khoản</InputLabel>
          <Select
            labelId="account-status-label"
            id="account-status-select"
            value={accountStatus}
            label="Trạng thái tài khoản"
            onChange={(e) => setAccountStatus(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            {accountStatu.map((item) => (
              <MenuItem key={item.status} value={item.status}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="sellers table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên người bán</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell align="right">SĐT</StyledTableCell>
              <StyledTableCell align="right">MST</StyledTableCell>
              <StyledTableCell align="right">Tên doanh nghiệp</StyledTableCell>
              <StyledTableCell align="right">Trạng thái</StyledTableCell>
              <StyledTableCell align="right">Hành động</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : sellers && sellers.length > 0 ? (
              sellers.map((row: any) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.sellerName}
                  </StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell align="right">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="right">{row.MST}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row.businessDetails.businessName || 'N/A'}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        row.accountStatus === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : row.accountStatus === 'PENDING_VERIFICATION'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {accountStatu.find(s => s.status === row.accountStatus)?.title || row.accountStatus}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select
                        value={row.accountStatus}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        disabled={loading}
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {accountStatu.map((item) => (
                          <MenuItem key={item.status} value={item.status}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không tìm thấy người bán nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default SellersTable