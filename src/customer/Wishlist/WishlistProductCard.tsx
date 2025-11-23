import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Button, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../State/Store';

interface WishlistProductCardProps {
  item: any;
}

const WishlistProductCard = ({ item }: WishlistProductCardProps) => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useAppDispatch();

  // Kiểm tra hết hàng
  const isOutOfStock = item.quantity <= 0;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Remove item:", item.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isOutOfStock) return; // Chặn click nếu hết hàng
    console.log("Add to cart:", item.id);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        width: '100%', 
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
        borderRadius: '8px',
        cursor: isOutOfStock ? 'not-allowed' : 'pointer', // Đổi con trỏ chuột
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        // Làm mờ toàn bộ thẻ nếu hết hàng
        opacity: isOutOfStock ? 0.6 : 1, 
        filter: isOutOfStock ? 'grayscale(100%)' : 'none',
        backgroundColor: isOutOfStock ? '#f5f5f5' : 'white'
      }}
      // Nếu hết hàng thì không cho navigate vào chi tiết (hoặc cho vào nhưng bên trong đã handle rồi)
      onClick={() => !isOutOfStock && navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)}
    >
      {/* --- OVERLAY HẾT HÀNG --- */}
      {isOutOfStock && (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10, // Nằm đè lên mọi thứ
                backgroundColor: 'rgba(255, 255, 255, 0.3)' // Lớp phủ nhẹ
            }}
        >
            <Typography 
                variant="h4" 
                sx={{ 
                    color: '#d32f2f', // Màu đỏ đậm
                    fontWeight: 'bold',
                    transform: 'rotate(-15deg)',
                    border: '4px solid #d32f2f',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.9)'
                }}
            >
                HẾT HÀNG
            </Typography>
        </Box>
      )}

      {/* 1. Phần Ảnh */}
      <Box sx={{ width: { xs: 120, sm: 180 }, height: '100%', flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            minHeight: { xs: 140, sm: 180 } 
          }}
          image={item.images?.[0] || "https://via.placeholder.com/180"}
          alt={item.title}
        />
      </Box>

      {/* 2. Phần Thông tin */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2, justifyContent: 'space-between' }}>
        <CardContent sx={{ p: 0, pb: 1, '&:last-child': { pb: 0 } }}>
          <Box sx={{ pr: 4 }}> 
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.3, mb: 0.5 }}>
              {item.title}
            </Typography>
            {/* ... category ... */}
          </Box>

          {/* ... rating ... */}

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1.5 }}>
            <Typography variant="h6" sx={{ color: '#E27E6A', fontWeight: 'bold' }}>
              ${item.sellingPrice}
            </Typography>
            {/* ... giá gốc ... */}
          </Box>
        </CardContent>

        {/* Nút Add to Cart */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={isOutOfStock} // Disable nút
                sx={{
                    bgcolor: 'teal',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#0d9488' },
                    px: 3,
                    // Cần set zIndex cao hơn overlay nếu muốn click được (nhưng ở đây ta muốn disable)
                    // Nếu muốn nút Xóa click được thì nút Xóa phải zIndex > 10
                }}
            >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
        </Box>
      </Box>

      {/* 3. Nút Xóa: Cần click được kể cả khi hết hàng để user xóa đi */}
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}> {/* zIndex 20 > overlay */}
        <IconButton 
          onClick={handleRemove}
          size="small"
          sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'red', bgcolor: 'rgba(255,0,0,0.05)' }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}

export default WishlistProductCard;