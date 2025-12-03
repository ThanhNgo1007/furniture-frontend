/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FormControl,
    MenuItem,
    Paper,
    Select,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material'
import { useEffect } from 'react'
import { getAllUsers, updateUserRole } from '../../../State/AuthSlice'
import { useAppDispatch, useAppSelector } from '../../../State/Store'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const roles = [
  { value: 'ROLE_CUSTOMER', label: 'Customer' },
  { value: 'ROLE_ADMIN', label: 'Admin' },
]

const UsersTable = () => {
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector((store) => store.auth)

  useEffect(() => {
    dispatch(getAllUsers(''))
  }, [dispatch])

  const handleRoleChange = (userId: number, role: string) => {
    dispatch(updateUserRole({ userId, role }))
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="users table">
        <TableHead>
          <TableRow>
            <StyledTableCell>User ID</StyledTableCell>
            <StyledTableCell>Full Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Mobile</StyledTableCell>
            <StyledTableCell>Current Role</StyledTableCell>
            <StyledTableCell align="right">Role Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : users && users.length > 0 ? (
            users.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.id}
                </StyledTableCell>
                <StyledTableCell>{row.fullName}</StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>
                <StyledTableCell>{row.mobile || 'N/A'}</StyledTableCell>
                <StyledTableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      row.role === 'ROLE_ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {row.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={row.role}
                      onChange={(e) => handleRoleChange(row.id, e.target.value)}
                      disabled={loading}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UsersTable
