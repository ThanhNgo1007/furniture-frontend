/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import Storefront from '@mui/icons-material/Storefront';
import {
    Avatar, Box, Button, Collapse, Drawer, IconButton, List, ListItemButton, ListItemText,
    Menu, MenuItem, useMediaQuery, useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import AdminDrawerList from '../../../admin/components/AdminDrawerList';
import { navigation } from '../../../data/navigation';
import SellerDrawerList from '../../../seller/components/SellerDrawerList/SellerDrawerList';
import { useAppSelector } from '../../../State/Store';
import CategorySheet from './CategorySheet';

// IMPORT DỮ LIỆU LEVEL 2
import { furnituresLevelTwo } from '../../../data/category/leveltwo/furnituresLevelTwo';
import { lightingLevelTwo } from '../../../data/category/leveltwo/lightingLevelTwo';
import { outdoorLevelTwo } from '../../../data/category/leveltwo/outdoorLevelTwo';
import { rugsLevelTwo } from '../../../data/category/leveltwo/rugsLevelTwo';

// 1. IMPORT DỮ LIỆU LEVEL 3
import { furnituresLevelThree } from '../../../data/category/levelthree/furnituresLevelThree';
import { lightingLevelThree } from '../../../data/category/levelthree/lightingLevelThree';
import { outdoorLevelThree } from '../../../data/category/levelthree/outdoorLevelThree';
import { rugsLevelThree } from '../../../data/category/levelthree/rugsLevelThree';

// MAPPING DỮ LIỆU LEVEL 2
const mobileCategoryData: { [key: string]: any[] } = {
    furnitures: furnituresLevelTwo,
    rugs: rugsLevelTwo,
    lighting: lightingLevelTwo,
    "outdoor-garden": outdoorLevelTwo
};

// 2. MAPPING DỮ LIỆU LEVEL 3
const mobileLevelThreeData: { [key: string]: any[] } = {
    furnitures: furnituresLevelThree,
    rugs: rugsLevelThree,
    lighting: lightingLevelThree,
    "outdoor-garden": outdoorLevelThree
};

const Navbar = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAppSelector(store => store);

    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openServices = Boolean(anchorEl);
    const [isSticky, setIsSticky] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    
    // State cho Mobile Menu
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null); // Level 1 -> 2
    const [expandedLevel2, setExpandedLevel2] = useState<string | null>(null); // Level 2 -> 3 (MỚI)

    const mainCategory = navigation.map((item) => ({
        ...item,
        name: t(item.key),
        subItems: item.subItems?.map((sub) => ({ ...sub, name: t(sub.key) }))
    }));

    // --- HANDLERS ---
    const handleToggleMobileCategory = (categoryId: string) => {
        setExpandedMobileCategory(prev => prev === categoryId ? null : categoryId);
        setExpandedLevel2(null); // Reset level 2 khi đóng/mở level 1
    };

    const handleToggleLevel2 = (categoryId: string) => {
        setExpandedLevel2(prev => prev === categoryId ? null : categoryId);
    };

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

    // --- 3. CẬP NHẬT GIAO DIỆN MOBILE MENU (3 CẤP) ---
    const MobileMenuContent = () => (
        <Box sx={{ width: 280 }} role="presentation" className="pt-5 h-full bg-gray-50 overflow-y-auto">
            <div className="flex justify-center mb-5 border-b pb-4">
                <h1 className="logo text-2xl text-[#E27E6A] font-bold">AptDeco</h1>
            </div>
            <List>
                {mainCategory.map((item) => {
                    // Data cho Level 2
                    const subCategories = mobileCategoryData[item.categoryId] || item.subItems;
                    const hasSubItems = subCategories && subCategories.length > 0;
                    const isExpanded = expandedMobileCategory === item.categoryId;

                    return (
                        <div key={item.categoryId}>
                            {/* --- LEVEL 1 ITEM --- */}
                            <ListItemButton onClick={() => {
                                if (hasSubItems) handleToggleMobileCategory(item.categoryId);
                                else {
                                    navigate(`/products/${item.categoryId}`);
                                    setOpenMobileMenu(false);
                                }
                            }}>
                                <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 'bold' }} />
                                {hasSubItems ? (isExpanded ? <ExpandLess /> : <ExpandMore />) : null}
                            </ListItemButton>

                            {/* --- LEVEL 2 LIST --- */}
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {subCategories?.map((sub: any) => {
                                        // Lọc Data cho Level 3 (Dựa vào parentCategoryId)
                                        // Lưu ý: Chỉ lọc nếu không phải mục Support (vì Support không có data 3 cấp)
                                        const level3Items = item.categoryId !== 'support' 
                                            ? mobileLevelThreeData[item.categoryId]?.filter((l3: any) => l3.parentCategoryId === sub.categoryId)
                                            : [];
                                        
                                        const hasLevel3 = level3Items && level3Items.length > 0;
                                        const isLevel2Expanded = expandedLevel2 === sub.categoryId;

                                        return (
                                            <div key={sub.categoryId}>
                                                {/* --- LEVEL 2 ITEM --- */}
                                                <ListItemButton
                                                    sx={{ pl: 4, bgcolor: '#f9f9f9', borderLeft: isLevel2Expanded ? '3px solid teal' : '3px solid transparent' }}
                                                    onClick={() => {
                                                        if (hasLevel3) {
                                                            handleToggleLevel2(sub.categoryId);
                                                        } else {
                                                            // Nếu không có con (hoặc là mục Support), chuyển trang luôn
                                                            const path = item.categoryId === 'support' 
                                                                ? `/support/${sub.categoryId}` 
                                                                : `/products/${sub.categoryId}`;
                                                            navigate(path);
                                                            setOpenMobileMenu(false);
                                                        }
                                                    }}
                                                >
                                                    <ListItemText 
                                                        primary={sub.name} 
                                                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'medium', color: '#444' }} 
                                                    />
                                                    {hasLevel3 ? (isLevel2Expanded ? <ExpandLess fontSize='small'/> : <ExpandMore fontSize='small' />) : null}
                                                </ListItemButton>

                                                {/* --- LEVEL 3 LIST --- */}
                                                {hasLevel3 && (
                                                    <Collapse in={isLevel2Expanded} timeout="auto" unmountOnExit>
                                                        <List component="div" disablePadding>
                                                            {level3Items.map((l3: any) => (
                                                                <ListItemButton
                                                                    key={l3.categoryId}
                                                                    sx={{ pl: 8, bgcolor: '#fff' }} // Thụt đầu dòng sâu hơn
                                                                    onClick={() => {
                                                                        navigate(`/products/${l3.categoryId}`);
                                                                        setOpenMobileMenu(false);
                                                                    }}
                                                                >
                                                                    <ListItemText 
                                                                        primary={l3.name} 
                                                                        primaryTypographyProps={{ fontSize: '0.85rem', color: '#666' }} 
                                                                    />
                                                                </ListItemButton>
                                                            ))}
                                                        </List>
                                                    </Collapse>
                                                )}
                                            </div>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </div>
                    );
                })}
            </List>
            <div className="p-5 border-t mt-auto bg-gray-50">
            <Button 
                onClick={() => {
                    navigate('/become-seller');
                    setOpenMobileMenu(false);
                }}
                fullWidth
                startIcon={<Storefront />} 
                variant="outlined" // Hoặc "contained" nếu muốn nổi bật
                sx={{ 
                    borderRadius: '20px', 
                    textTransform: 'none', 
                    borderColor: 'black', 
                    color: 'black', 
                    bgcolor: 'white',
                    py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': { borderColor: '#E27E6A', color: '#E27E6A', bgcolor: 'white' }
                }}
            >
                {t('navbar.becomeSeller')}
            </Button>
        </div>
            
        </Box>
    );
    

    // --- Logic Seller/Admin & Render Desktop (Giữ nguyên) ---
    const isSeller = location.pathname.startsWith("/seller");
    const isAdmin = location.pathname.startsWith("/admin");
    
    if (isSeller || isAdmin) {
        // ... (Code Navbar quản lý)
        return (
             <div className="shadow-sm bg-white sticky top-0 z-50 h-[70px] flex items-center px-5 justify-between border-b border-gray-200 relative">
                <div className="flex items-center gap-3">
                    <IconButton onClick={() => setOpenDrawer(true)}>
                        <MenuIcon sx={{ fontSize: 30, color: "teal" }} />
                    </IconButton>
                    <h1 onClick={() => navigate('/')} className="logo cursor-pointer text-2xl md:text-4xl text-[#E27E6A] pl-2">
                        AptDeco
                    </h1>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span onClick={() => navigate(isSeller ? '/seller' : '/admin')} className="font-bold text-xl text-gray-600 cursor-pointer hover:text-teal-600 transition-colors">
                        {isSeller ? "Seller Center" : "Admin Dashboard"}
                    </span>
                </div>
                <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="left">
                    <Box sx={{ width: 250 }} role="presentation">
                        {isSeller ? <SellerDrawerList toggleDrawer={() => setOpenDrawer(false)} /> : <AdminDrawerList toggleDrawer={() => setOpenDrawer(false)} />}
                    </Box>
                </Drawer>
            </div>
        );
    }

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
                        <h1 onClick={() => navigate('/')} className="logo cursor-pointer text-2xl md:text-4xl text-[#E27E6A]">
                            AptDeco
                        </h1>
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
                <div className="flex items-center gap-1 lg:gap-6">
                    <IconButton><SearchIcon className="text-gray-700" sx={{ fontSize: 29 }} /></IconButton>
                    {auth.isLoggedIn ? (
                        <Button onClick={() => navigate('/account/orders')} className="gap-2 flex items-center" sx={{textTransform: 'none', color: 'black'}}>
                            <Avatar src="https://avatar.iran.liara.run/public/boy" sx={{width: 32, height: 32}}/>
                            <span className="font-semibold hidden lg:block ml-2 text-sm">{auth.user?.fullName}</span>
                        </Button>
                    ) : (
                        <Button onClick={() => navigate('/login')} sx={{ textTransform: 'none', px: 2, borderRadius: '20px', '&:hover': { backgroundColor: '#f5f5f5' }, fontSize: 13, color: '#333', border: '1px solid #ddd' }} startIcon={<AccountCircleIcon />}>
                            {t('navbar.login')}
                        </Button>
                    )}
                    <IconButton onClick={() => navigate('/wishlist')}><FavoriteBorder className="text-gray-700" sx={{ fontSize: 29 }} /></IconButton>
                    <IconButton onClick={() => navigate('/cart')}><ShoppingBasketOutlinedIcon className="text-gray-700" sx={{ fontSize: 29 }} /></IconButton>
                    {isLarge && (
                        <Button onClick={() => navigate('/become-seller')} startIcon={<Storefront />} variant="outlined" sx={{ borderRadius: '20px', textTransform: 'none', borderColor: 'black', color: 'black', '&:hover': { borderColor: '#E27E6A', color: '#E27E6A' }}}>
                            {t('navbar.becomeSeller')}
                        </Button>
                    )}
                </div>
            </div>

            <Drawer anchor="left" open={openMobileMenu} onClose={() => setOpenMobileMenu(false)}>
                <MobileMenuContent />
            </Drawer>

            {/* MEGA MENU SHEET DESKTOP */}
            {activeCategoryId && !activeCategoryId.includes('support') && (
                <div className="categorySheet absolute top-[70px] left-0 right-0 z-10 border-t border-gray-100 shadow-lg" onMouseLeave={() => setActiveCategoryId(null)}>
                    <CategorySheet selectedCategory={activeCategoryId} handleClose={() => setActiveCategoryId(null)} />
                </div>
            )}
        </Box>
    );
};

export default Navbar;