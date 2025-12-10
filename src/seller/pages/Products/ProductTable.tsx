import { Edit } from '@mui/icons-material'
import { IconButton, TablePagination } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from 'react'
import { fetchSellerProducts } from '../../../State/seller/sellerProductSlice'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import type { Product } from '../../../types/ProductTypes'
import EditProductDialog from './EditProductDialog'

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    dispatch(fetchSellerProducts(localStorage.getItem('jwt')))
  }, [dispatch])

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setEditDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setEditDialogOpen(false)
    setSelectedProduct(null)
    // Refresh products after edit
    dispatch(fetchSellerProducts(localStorage.getItem('jwt')))
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get current page products
  const products = sellerProduct.products || []
  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
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
            {paginatedProducts.map((item: Product) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell component="th" scope="row">
                  <div className="flex gap-1 flex-wrap">
                    {item.images.slice(0, 2).map((image, idx) => (
                      <img key={idx} className="w-16 h-16 object-cover rounded-md" src={image} alt="" />
                    ))}
                    {item.images.length > 2 && (
                      <span className="text-xs text-gray-500">+{item.images.length - 2}</span>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="center">{item.title}</StyledTableCell>
                <StyledTableCell align="right">{item.msrpPrice?.toLocaleString()}đ</StyledTableCell>
                <StyledTableCell align="right">{item.sellingPrice?.toLocaleString()}đ</StyledTableCell>
                <StyledTableCell align="right">{item.color}</StyledTableCell>
                <StyledTableCell align="right">
                  <span className={item.quantity === 0 ? 'text-red-500 font-semibold' : ''}>
                    {item.quantity === 0 ? 'Hết hàng' : item.quantity}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton 
                    color="primary" 
                    size="small"
                    onClick={() => handleEditClick(item)}
                  >
                    <Edit />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Số sản phẩm mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
        />
      </TableContainer>

      <EditProductDialog
        key={selectedProduct?.id ?? 'empty'}
        open={editDialogOpen}
        product={selectedProduct}
        onClose={handleCloseDialog}
      />
    </>
  )
}
