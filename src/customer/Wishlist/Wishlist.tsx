import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
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
import { addItemToCart } from '../../State/customer/cartSlice';
import { getWishlistByUserId, removeProductFromWishlist } from '../../State/customer/wishlistSlice';
import { useAppDispatch, useAppSelector } from '../../State/Store';
import type { Product } from '../../types/ProductTypes';
import WishlistItemRow from './WishlistItemRow';

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
      dispatch(getWishlistByUserId())
    } else {
      navigate('/login');
    }

  }, [dispatch, navigate]);

  // --- 1. HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG ---
  const handleAddToCart = (product: Product) => {
    if (!product.id) return;

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (dựa trên cart state hiện tại)
    const isProductInCart = cart?.cartItemsInBag?.some(
        (cartItem) => cartItem.product?.id === product.id
    );

    if (isProductInCart) {
        setSnackbarMessage("Sản phẩm này đã có trong giỏ hàng!");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
    }

    const jwt = localStorage.getItem("jwt");
    if (jwt) {
        dispatch(addItemToCart({
            jwt: jwt,
            request: {
                productId: product.id,
                quantity: 1
            }
        })).then((action) => {
            if (addItemToCart.fulfilled.match(action)) {
                setSnackbarMessage("Đã thêm vào giỏ hàng thành công!");
                setSnackbarSeverity("success");
            } else {
                setSnackbarMessage("Không thể thêm vào giỏ hàng.");
                setSnackbarSeverity("error");
            }
            setOpenSnackbar(true);
        });
    } else {
        navigate("/login");
    }
  };

  // --- 2. HÀM XỬ LÝ XÓA KHỎI WISHLIST ---
  const handleRemove = (productId: number) => {
    const jwt = localStorage.getItem("jwt");
    if(jwt && productId) {
        dispatch(removeProductFromWishlist({
            productId: productId
        })).then((action) => {
             if (removeProductFromWishlist.fulfilled.match(action)) {
                 // Có thể hiện thông báo xóa thành công nếu muốn
                 console.log("Removed item", productId);
             }
        });
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  if (loading && !wishlist) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Lấy danh sách sản phẩm, nếu null thì trả về mảng rỗng
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
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="wishlist table">
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', width: '60px' }}>Remove</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold', width: '100px' }}>Image</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {wishlistItems.map((product) => (
                <WishlistItemRow item={product} onRemove={handleRemove} onAddToCart={handleAddToCart} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Giao diện khi trống
        <Box sx={{ textAlign: 'center', mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#f5f5f5', p: 4, borderRadius: '50%', mb: 2 }}>
             <FavoriteBorderIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />
          </Box>
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first wishlist request today.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ bgcolor: 'teal', px: 4, py: 1 }}>
            Continue Shopping
          </Button>
        </Box>
      )}

      {/* Thông báo Snackbar */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Wishlist;