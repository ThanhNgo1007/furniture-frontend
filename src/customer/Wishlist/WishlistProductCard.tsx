import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Button, Card, CardContent, CardMedia, IconButton, Rating, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../State/Store';


interface WishlistProductCardProps {
  item: any;
}

const WishlistProductCard = ({ item }: WishlistProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Remove item:", item.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Add to cart:", item.id);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', // Flexbox để dàn ngang
        width: '100%', 
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
        borderRadius: '8px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      onClick={() => navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)}
    >
      {/* 1. Phần Ảnh (Bên trái) */}
      <Box sx={{ width: { xs: 120, sm: 180 }, height: '100%', flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            minHeight: { xs: 140, sm: 180 } // Đảm bảo chiều cao tối thiểu
          }}
          image={item.images?.[0] || "https://via.placeholder.com/180"}
          alt={item.title}
        />
      </Box>

      {/* 2. Phần Thông tin (Ở giữa) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2, justifyContent: 'space-between' }}>
        <CardContent sx={{ p: 0, pb: 1, '&:last-child': { pb: 0 } }}>
          {/* Tên & Danh mục */}
          <Box sx={{ pr: 4 }}> {/* Padding phải để tránh nút X */}
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.3, mb: 0.5 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {item.category?.name}
            </Typography>
          </Box>

          {/* Rating (Tuỳ chọn) */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
             <Rating value={4.5} precision={0.5} size="small" readOnly />
             <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>(34 reviews)</Typography>
          </Box>

          {/* Giá */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 1.5 }}>
            <Typography variant="h6" sx={{ color: '#E27E6A', fontWeight: 'bold' }}>
              ${item.sellingPrice}
            </Typography>
            {item.msrpPrice > item.sellingPrice && (
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                ${item.msrpPrice}
              </Typography>
            )}
            {item.discountPercent > 0 && (
                <Typography variant="caption" sx={{ color: 'green', bgcolor: '#e6fffa', px: 1, py: 0.5, borderRadius: 1 }}>
                    {item.discountPercent}% Off
                </Typography>
            )}
          </Box>
        </CardContent>

        {/* Nút Add to Cart (Nằm dưới cùng của phần thông tin) */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                    bgcolor: 'teal',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#0d9488' },
                    px: 3
                }}
            >
                Add to Cart
            </Button>
        </Box>
      </Box>

      {/* 3. Nút Xóa (Góc trên bên phải tuyệt đối) */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
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