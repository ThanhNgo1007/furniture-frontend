import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../State/Store';
import { addItemToCart } from '../../State/customer/cartSlice';
import { getWishlistByUserId } from '../../State/customer/wishlistSlice';
import type { Product } from '../../types/ProductTypes';


const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { wishlist, loading, error } = useAppSelector(store => store.wishlist);
  const { cart } = useAppSelector(store => store.cart);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "warning" | "error">("success");

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(getWishlistByUserId());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  // --- SỬA HÀM NÀY ---
  const handleAddToCart = (product: Product) => {
    // 1. Kiểm tra ID tồn tại
    if (!product.id) {
        console.error("Product ID is missing");
        return;
    }

    // 2. Kiểm tra trùng lặp (Thêm optional chaining ?. để tránh lỗi null)
    const isProductInCart = cart?.cartItemsInBag?.some(
        (cartItem) => cartItem.product?.id === product.id
    );

    if (isProductInCart) {
        setSnackbarMessage("Sản phẩm này đã tồn tại trong giỏ hàng!");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
    }

    dispatch(addItemToCart({
        jwt: localStorage.getItem("jwt") || "",
        request: {  // <--- THÊM DÒNG NÀY
            productId: product.id,
            quantity: 1
        }
    })).then((action) => {
        if (addItemToCart.fulfilled.match(action)) {
            setSnackbarMessage("Đã thêm sản phẩm vào giỏ hàng!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } else {
            setSnackbarMessage("Thêm vào giỏ thất bại.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    });
  };

  // --- SỬA HÀM NÀY ---
  const handleRemove = (itemId?: number) => {
    if (!itemId) return; // Nếu không có ID thì thoát luôn
    console.log("Remove item:", itemId);
    // dispatch(removeProductFromWishlist({ productId: itemId })); 
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const wishlistItems = wishlist?.products || [];

  return (
    <Container maxWidth="xl" sx={{ py: 5, minHeight: '80vh' }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>My Wishlist</Typography>
        <Typography variant="body1" color="text.secondary">
          {wishlistItems.length} items
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
      </Box>

      {wishlistItems.length > 0 ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 650 }} aria-label="wishlist table">
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                {/* Header columns... */}
                <TableCell align="center" sx={{ fontWeight: 'bold', width: '50px' }}></TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold', width: '120px' }}>Image</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {wishlistItems.map((product) => (
                <TableRow
                  key={product.id || Math.random()} // Fallback key nếu id null
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#fafafa' } }}
                >
                  <TableCell align="center">
                    {/* Gọi hàm remove với product.id */}
                    <IconButton onClick={() => handleRemove(product.id)} color="error" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell align="left">
                    <Avatar
                      variant="rounded"
                      src={product.images && product.images.length > 0 ? product.images[0] : ""}
                      alt={product.title}
                      sx={{ width: 80, height: 80, cursor: 'pointer', border: '1px solid #eee' }}
                      onClick={() => product.id && navigate(`/product-details/${product.category?.categoryId}/${product.title}/${product.id}`)}
                    />
                  </TableCell>

                  <TableCell align="left">
                    <Typography 
                      variant="subtitle1" 
                      sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: 'teal' } }}
                      onClick={() => product.id && navigate(`/product-details/${product.category?.categoryId}/${product.title}/${product.id}`)}
                    >
                      {product.title}
                    </Typography>
                  </TableCell>

                  <TableCell align="left">
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                      ${product.sellingPrice}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <span 
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: (product.quantity && product.quantity > 0) ? '#e6fffa' : '#fff5f5',
                        color: (product.quantity && product.quantity > 0) ? '#047857' : '#c53030',
                        border: `1px solid ${(product.quantity && product.quantity > 0) ? '#047857' : '#c53030'}`
                      }}
                    >
                      {(product.quantity && product.quantity > 0) ? "In Stock" : "Out of Stock"}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      // Disable nếu hết hàng hoặc không có ID
                      disabled={!product.quantity || product.quantity <= 0 || !product.id}
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleAddToCart(product)}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <FavoriteBorderIcon sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2, bgcolor: 'teal' }}>
            Continue Shopping
          </Button>
        </Box>
      )}

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Wishlist;