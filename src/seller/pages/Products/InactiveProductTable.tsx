import { Edit, RestoreFromTrash } from '@mui/icons-material'
import { Alert, IconButton, Snackbar } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from 'react'
import { fetchInactiveProducts, reactivateProduct } from '../../../State/seller/sellerProductSlice'
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
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

export default function InactiveProductTable() {
  const dispatch = useAppDispatch()
  const { inactiveProducts, loading } = useAppSelector(store => store.sellerProduct)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })

  useEffect(() => {
    dispatch(fetchInactiveProducts(localStorage.getItem('jwt')))
  }, [dispatch])

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product)
    setEditDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setEditDialogOpen(false)
    setSelectedProduct(null)
    dispatch(fetchInactiveProducts(localStorage.getItem('jwt')))
  }

  const handleReactivate = async (product: Product) => {
    if (window.confirm('Bạn có muốn đăng bán lại sản phẩm này không?')) {
      try {
        await dispatch(reactivateProduct({
          productId: product.id!,
          jwt: localStorage.getItem('jwt')
        })).unwrap()
        setSnackbar({ open: true, message: 'Đã đăng bán lại sản phẩm!', severity: 'success' })
      } catch (error: any) {
        setSnackbar({ open: true, message: error || 'Thao tác thất bại', severity: 'error' })
      }
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="inactive products table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Ảnh</StyledTableCell>
              <StyledTableCell align="center">Tên sản phẩm</StyledTableCell>
              <StyledTableCell align="right">Giá gốc</StyledTableCell>
              <StyledTableCell align="right">Giá bán</StyledTableCell>
              <StyledTableCell align="right">Màu</StyledTableCell>
              <StyledTableCell align="right">Số lượng</StyledTableCell>
              <StyledTableCell align="right">Thao tác</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inactiveProducts?.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  Không có sản phẩm ngưng bán
                </StyledTableCell>
              </StyledTableRow>
            )}
            {inactiveProducts?.map((item: Product) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell component="th" scope="row">
                  <div className="flex gap-1 flex-wrap">
                    {item.images?.slice(0, 2).map((image, idx) => (
                      <img key={idx} className="w-16 h-16 object-cover rounded-md" src={image} alt="" />
                    ))}
                    {item.images?.length > 2 && (
                      <span className="text-xs text-gray-500">+{item.images.length - 2}</span>
                    )}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="center">{item.title}</StyledTableCell>
                <StyledTableCell align="right">{item.msrpPrice?.toLocaleString()}đ</StyledTableCell>
                <StyledTableCell align="right">{item.sellingPrice?.toLocaleString()}đ</StyledTableCell>
                <StyledTableCell align="right">{item.color}</StyledTableCell>
                <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                <StyledTableCell align="right">
                  <div className="flex gap-1 justify-end">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleEditClick(item)}
                      title="Chỉnh sửa"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="success" 
                      size="small"
                      onClick={() => handleReactivate(item)}
                      disabled={loading}
                      title="Đăng bán lại"
                    >
                      <RestoreFromTrash />
                    </IconButton>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditProductDialog
        open={editDialogOpen}
        product={selectedProduct}
        onClose={handleCloseDialog}
        isInactive={true}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
