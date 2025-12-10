import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Avatar, Button, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../../Util/formatCurrency';

// Nhận props và các hàm handler từ cha
const WishlistItemRow = ({ item, onRemove, onAddToCart }: any) => {
    const navigate = useNavigate();
    
    
    return (
        <TableRow hover>
             {/* ... Nội dung TableCell copy từ Wishlist.tsx sang ... */}
             {/* Cột Xóa */}
                  <TableCell align="center">
                    <IconButton 
                        onClick={() => item.id && onRemove(item.id)} 
                        color="error" 
                        size="small"
                        sx={{ bgcolor: '#fff5f5', '&:hover': { bgcolor: '#fed7d7' } }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </TableCell>

                  {/* Cột Ảnh */}
                  <TableCell align="left">
                    <Avatar
                      variant="rounded"
                      src={item.images?.[0] || ""}
                      alt={item.title}
                      sx={{ width: 70, height: 70, cursor: 'pointer', border: '1px solid #eee' }}
                      onClick={() => item.id && navigate(`/product-details/${item.category?.parentCategory?.categoryId}/${item.category?.categoryId}/${encodeURIComponent(item.title)}/${item.id}`)}
                    />
                  </TableCell>

                  {/* Cột Tên */}
                  <TableCell align="left">
                    <Typography 
                      variant="subtitle1" 
                      sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: 'teal' } }}
                      onClick={() => item.id && navigate(`/product-details/${item.category?.parentCategory?.categoryId}/${item.category?.categoryId}/${encodeURIComponent(item.title)}/${item.id}`)}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {item.category?.name}
                    </Typography>
                  </TableCell>

                  {/* Cột Giá */}
                  <TableCell align="left">
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {/* Dùng hàm formatVND nếu có, không thì hiển thị số thường */}
                      {formatVND(item.sellingPrice)}
                    </Typography>
                    {item.msrpPrice > item.sellingPrice && (
                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                            {formatVND(item.msrpPrice)}
                        </Typography>
                    )}
                  </TableCell>

                  {/* Cột Trạng thái kho */}
                  <TableCell align="center">
                    <span 
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: (item.quantity && item.quantity > 0) ? '#e6fffa' : '#fff5f5',
                        color: (item.quantity && item.quantity > 0) ? '#047857' : '#c53030',
                        border: `1px solid ${(item.quantity && item.quantity > 0) ? '#047857' : '#c53030'}`
                      }}
                    >
                      {(item.quantity && item.quantity > 0) ? "In Stock" : "Out of Stock"}
                    </span>
                  </TableCell>

                  {/* Cột Nút Mua */}
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      disabled={item.quantity && item.quantity <= 0 || !item.id}
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => onAddToCart(item)}
                      sx={{ 
                        bgcolor: 'teal', 
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#0d9488', boxShadow: 'none' } 
                      }}
                    >
                      Add to Cart
                    </Button>
                  </TableCell>
        </TableRow>
    )
}

export default memo(WishlistItemRow);