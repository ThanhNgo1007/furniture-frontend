import { Edit } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useEffect } from 'react'
import { fetchSellerProducts } from '../../../State/seller/sellerProductSlice'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import type { Product } from '../../../types/ProductTypes'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

export default function ProductTable() {
  const dispatch = useAppDispatch()
  const { sellerProduct } = useAppSelector(store => store)

  useEffect(() => {
    dispatch(fetchSellerProducts(localStorage.getItem('jwt')))
  }, [])
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Ảnh</StyledTableCell>
            <StyledTableCell align="center">Tên sản phẩm</StyledTableCell>
            <StyledTableCell align="right">Giá gốc</StyledTableCell>
            <StyledTableCell align="right">Giá bán</StyledTableCell>
            <StyledTableCell align="right">Màu</StyledTableCell>
            <StyledTableCell align="right">Số lượng</StyledTableCell>
            <StyledTableCell align="right">Cập nhật</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerProduct.products.map((item: Product) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                <div className="flex gap-1 flex-wrap">
                  {item.images.map(image => (
                    <img className="w-20 rounded-md" src={image} alt="" />
                  ))}
                </div>
              </StyledTableCell>
              <StyledTableCell align="center">{item.title}</StyledTableCell>
              <StyledTableCell align="right">{item.msrpPrice}</StyledTableCell>
              <StyledTableCell align="right">{item.sellingPrice}</StyledTableCell>
              <StyledTableCell align="right">{item.color}</StyledTableCell>
              <StyledTableCell align="right">
                {<Button size="small">{item.quantity}</Button>}
              </StyledTableCell>
              <StyledTableCell align="right">
                {
                  <IconButton color="primary" size="small">
                    <Edit />
                  </IconButton>
                }
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
