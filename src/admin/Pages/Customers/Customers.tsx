import {
  Avatar, Box, Card, CardHeader, FormControl,
  MenuItem, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { useEffect } from 'react';
import { getAllUsers, updateUserRole } from '../../../State/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

const Customers = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector(store => store);

  useEffect(() => {
    dispatch(getAllUsers(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  const handleChangeRole = (userId: number, newRole: string) => {
    dispatch(updateUserRole({ userId, role: newRole }));
  };

  return (
    <Box>
      <Card>
        <CardHeader title="All Users & Permissions" sx={{ pt: 2, alignItems: "center" }} />
        <TableContainer>
          <Table sx={{ minWidth: 390 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role (Permission)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auth.users.map((user) => (
                // Thêm dấu ! hoặc fallback key để tránh lỗi nếu id null
                <TableRow hover key={user.id} sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Avatar alt={user.fullName} src="https://avatar.iran.liara.run/public" />
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl fullWidth size='small'>
                        <Select
                            value={user.role}
                            // SỬA LỖI TẠI ĐÂY: Thêm dấu !
                            onChange={(e) => handleChangeRole(user.id!, e.target.value)}
                            sx={{
                                color: user.role === 'ROLE_ADMIN' ? 'red' : 'inherit',
                                fontWeight: user.role === 'ROLE_ADMIN' ? 'bold' : 'normal'
                            }}
                        >
                            <MenuItem value="ROLE_CUSTOMER">CUSTOMER</MenuItem>
                            <MenuItem value="ROLE_SELLER">SELLER</MenuItem>
                            <MenuItem value="ROLE_ADMIN">ADMIN</MenuItem>
                        </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default Customers;