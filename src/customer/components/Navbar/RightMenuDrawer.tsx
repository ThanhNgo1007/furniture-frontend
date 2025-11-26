import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import Storefront from '@mui/icons-material/Storefront';
import { Avatar, Button, Divider, Drawer, IconButton } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../State/Store';

const RightMenuDrawer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAppSelector(store => store);

  const isAuthenticated = auth.isLoggedIn && auth.user !== null;

  const handleClose = () => {
    setOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      {/* Menu Icon Button */}
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon className="text-gray-700" sx={{ fontSize: 29 }} />
      </IconButton>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            padding: 2,
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Divider sx={{ mb: 2 }} />

        {/* User Section */}
        {isAuthenticated ? (
          <div 
            onClick={() => handleNavigate('/account/orders')}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors mb-2"
          >
            <Avatar 
              src="https://avatar.iran.liara.run/public/boy" 
              sx={{ width: 40, height: 40 }}
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{auth.user?.fullName}</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => handleNavigate('/login')}
            fullWidth
            variant="outlined"
            startIcon={<AccountCircleIcon />}
            sx={{
              mb: 2,
              textTransform: 'none',
              borderColor: '#E27E6A',
              color: '#E27E6A',
              '&:hover': {
                borderColor: '#E27E6A',
                backgroundColor: '#FFF5F3',
              }
            }}
          >
            Login / Sign Up
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Menu Items */}
        <div className="space-y-2">
          {/* Wishlist */}
          <div
            onClick={() => handleNavigate('/wishlist')}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <FavoriteBorder className="text-gray-700" />
            <span className="font-medium text-sm">Wishlist</span>
          </div>

          {/* Cart */}
          <div
            onClick={() => handleNavigate('/cart')}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <ShoppingBasketOutlinedIcon className="text-gray-700" />
            <span className="font-medium text-sm">Shopping Cart</span>
          </div>

          <Divider sx={{ my: 2 }} />

          {/* Become Seller */}
          <div
            onClick={() => handleNavigate('/become-seller')}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 cursor-pointer transition-colors border border-teal-200"
          >
            <Storefront className="text-teal-600" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-teal-600">Become a Seller</p>
              <p className="text-xs text-gray-500">Start selling today</p>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default RightMenuDrawer;
