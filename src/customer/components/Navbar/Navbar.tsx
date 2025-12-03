/* eslint-disable @typescript-eslint/no-explicit-any */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Box,
    Drawer, IconButton,
    Menu, MenuItem, useMediaQuery, useTheme
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import AdminDrawerList from '../../../admin/components/AdminDrawerList';
import { navigation } from '../../../data/navigation';
import SellerDrawerList from '../../../seller/components/SellerDrawerList/SellerDrawerList';
import { useAppSelector } from '../../../State/Store';
import CategorySheet from './CategorySheet';
import MobileNavbar from './MobileNavbar';
import RightMenuDrawer from './RightMenuDrawer';
import SearchBar from './SearchBar';

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  try {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const Navbar = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- SỬA LỖI REDUX TẠI ĐÂY ---
    // Chỉ lấy slice auth để tránh re-render toàn bộ và mất cảnh báo console
    const auth = useAppSelector(store => store.auth);

    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openServices = Boolean(anchorEl);
    const [isSticky, setIsSticky] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    
    // State cho Mobile Menu
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    
    const isAuthenticated = useMemo(() => {
        const jwt = localStorage.getItem('jwt');
        
        // Nếu không có JWT hoặc JWT hết hạn → Not authenticated
        if (!jwt || isTokenExpired(jwt)) {
            return false;
        }
        
        // Kiểm tra Redux state
        return auth.isLoggedIn && auth.user !== null;
    }, [auth.isLoggedIn, auth.user]);

    const mainCategory = useMemo(() => {
    return navigation.map((item) => ({
        ...item,
        name: t(item.key),
        subItems: item.subItems?.map((sub) => ({
            ...sub,
            name: t(sub.key)
        }))
    }));
}, [t]); 

    const handleClickServices = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
        setActiveCategoryId(null);
    };

    const handleCloseServices = (categoryId?: string) => {
        setAnchorEl(null);
        if (categoryId) navigate(`/support/${categoryId}`);
    };

    const handleMouseEnter = (categoryId: string) => {
        if (categoryId !== 'support') {
            setActiveCategoryId(categoryId);
            setAnchorEl(null);
        } else {
            setActiveCategoryId(null);
        }
    };

    const handleMouseLeave = () => {
        setActiveCategoryId(null);
    };

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 70);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    

    // --- Logic Seller/Admin ---
    const isSeller = location.pathname.startsWith("/seller");
    const isAdmin = location.pathname.startsWith("/admin");
    
    if (isSeller || isAdmin) {
        return (
             <div className="shadow-sm bg-white sticky top-0 z-50 h-[70px] flex items-center px-5 justify-between border-b border-gray-200 relative">
                <div className="flex items-center gap-3">
                    {/* --- SỬA LOGIC ẨN HAMBURGER --- */}
                    {/* Chỉ hiển thị nút Menu khi màn hình nhỏ (!isLarge) */}
                    {!isLarge && (
                        <IconButton onClick={() => setOpenDrawer(true)}>
                            <MenuIcon sx={{ fontSize: 30, color: "black" }} />
                        </IconButton>
                    )}
                    
                    <h1 className="logo text-2xl md:text-4xl text-[#E27E6A] pl-2">
                        AptDeco
                    </h1>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="font-bold text-xl text-gray-600">
                        {isSeller ? "QUẢN LÝ KINH DOANH" : "QUẢN TRỊ VIÊN"}
                    </span>
                </div>
                
                {/* Drawer cho Mobile */}
                <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="left">
                    <Box sx={{ width: 400 }} role="presentation">
                        {isSeller ? <SellerDrawerList toggleDrawer={() => setOpenDrawer(false)} /> : <AdminDrawerList toggleDrawer={() => setOpenDrawer(false)} />}
                    </Box>
                </Drawer>
            </div>
        );
    }

    // --- Logic Khách Hàng (Customer) ---
    return (
        <Box
            onMouseLeave={handleMouseLeave}
            className={`transition-all duration-300 bg-white ${isSticky ? 'fixed top-0 left-0 w-full z-50 shadow-md' : 'relative'}`}
        >
            <div className="flex justify-between items-center px-5 lg:px-20 h-[70px] border-b border-gray-300 bg-white relative z-20">
                <div className="flex items-center gap-2">
                    <div className="cursor-pointer flex items-center gap-2 pr-4">
                        {!isLarge && (
                            <IconButton onClick={() => setOpenMobileMenu(true)}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        {isLarge ? <h1 onClick={() => navigate('/')} className="logo cursor-pointer text-2xl md:text-4xl text-[#E27E6A]">
                            AptDeco
                        </h1> : ""}
                    </div>

                    {/* DESKTOP MENU */}
                    {isLarge && (
                        <ul className="flex items-center font-bold">
                            {mainCategory.map((category) => {
                                if (category.isDropdown) {
                                    return (
                                        <li key={category.categoryId} className="cursor-pointer h-[70px] px-4 flex items-center hover:text-[#E27E6A]">
                                            <div onClick={handleClickServices} className={`flex items-center gap-1 ${openServices ? 'text-[#E27E6A]' : ''}`}>
                                                {category.name}
                                                <KeyboardArrowDownIcon fontSize="small" className={`transition-transform ${openServices ? 'rotate-180' : ''}`} />
                                            </div>
                                            <Menu anchorEl={anchorEl} open={openServices} onClose={() => handleCloseServices()} sx={{ mt: 2 }}>
                                                {category.subItems?.map((sub) => (
                                                    <MenuItem key={sub.categoryId} onClick={() => handleCloseServices(sub.categoryId)} sx={{ minWidth: 180, fontWeight: 500 }}>
                                                        {sub.name}
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </li>
                                    );
                                }
                                return (
                                    <li
                                        key={category.categoryId}
                                        onMouseEnter={() => handleMouseEnter(category.categoryId)}
                                        className="mainCategory cursor-pointer h-[70px] px-4 flex items-center border-b-2 border-transparent hover:border-[#E27E6A] transition-all"
                                    >
                                        <span className={`${activeCategoryId === category.categoryId ? 'text-[#E27E6A]' : ''}`}>
                                            {category.name}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* RIGHT ICONS */}
                <div className="flex items-center gap-2">
                    <SearchBar />
                    {isLarge && <RightMenuDrawer />}
                </div>
            </div>

            <Drawer anchor="left" open={openMobileMenu} onClose={() => setOpenMobileMenu(false)}>
                <MobileNavbar handleClose={() => setOpenMobileMenu(false)} />
            </Drawer>

            {activeCategoryId && !activeCategoryId.includes('support') && (
                <div className="categorySheet absolute top-[70px] left-0 right-0 z-10 border-t border-gray-100 shadow-lg" onMouseLeave={() => setActiveCategoryId(null)}>
                    <CategorySheet selectedCategory={activeCategoryId} handleClose={() => setActiveCategoryId(null)} />
                </div>
            )}
        </Box>
    );
};

export default Navbar;