import { AccountCircle, ExpandLess, ExpandMore, Storefront } from '@mui/icons-material'; // Import AccountCircle
import { Avatar, Box, Button, Collapse, Divider, List, ListItemButton, ListItemText } from '@mui/material'; // Import Avatar, Divider
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../State/Store'; // Import hook lấy state

// ... (Giữ nguyên các import dữ liệu category)
import { furnituresLevelThree } from '../../../data/category/levelthree/furnituresLevelThree';
import { lightingLevelThree } from '../../../data/category/levelthree/lightingLevelThree';
import { outdoorLevelThree } from '../../../data/category/levelthree/outdoorLevelThree';
import { rugsLevelThree } from '../../../data/category/levelthree/rugsLevelThree';
import { furnituresLevelTwo } from '../../../data/category/leveltwo/furnituresLevelTwo';
import { lightingLevelTwo } from '../../../data/category/leveltwo/lightingLevelTwo';
import { outdoorLevelTwo } from '../../../data/category/leveltwo/outdoorLevelTwo';
import { rugsLevelTwo } from '../../../data/category/leveltwo/rugsLevelTwo';
import { navigation } from '../../../data/navigation';

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

interface MobileNavbarProps {
    handleClose: () => void;
}

const MobileNavbar = ({ handleClose }: MobileNavbarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // 1. Lấy trạng thái Auth từ Redux
    const { auth } = useAppSelector(store => store);

    const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null); 
    const [expandedLevel2, setExpandedLevel2] = useState<string | null>(null); 

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

    const handleToggleMobileCategory = (categoryId: string) => {
        setExpandedMobileCategory(prev => prev === categoryId ? null : categoryId);
        setExpandedLevel2(null); 
    };

    const handleToggleLevel2 = (categoryId: string) => {
        setExpandedLevel2(prev => prev === categoryId ? null : categoryId);
    };

    const handleLinkClick = (path: string) => {
        navigate(path);
        handleClose();
    };

    return (
        <div>
            <Box sx={{ width: 280 }} role="presentation" className="pt-5 h-full bg-gray-50 overflow-y-auto flex flex-col min-h-screen">
                
                {/* HEADER LOGO */}
                <div className="flex justify-center mb-2 border-b pb-4">
                    <h1 className="logo text-4xl text-[#E27E6A] font-bold">AptDeco</h1>
                </div>

                {/* 2. PHẦN LOGIN / USER PROFILE (MỚI THÊM) */}
                <div className="px-4 mb-4">
                    {auth.isLoggedIn ? (
                        // TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP: HIỆN AVATAR & TÊN
                        <div 
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-sm transition-all"
                            onClick={() => handleLinkClick('/account/orders')}
                        >
                            <Avatar src="https://avatar.iran.liara.run/public/boy" sx={{ width: 40, height: 40 }} />
                            <div className='overflow-hidden'>
                                <p className="text-xs text-gray-500 font-medium">Welcome back,</p>
                                <p className="font-bold text-teal-700 text-sm truncate">
                                    {auth.user?.fullName}
                                </p>
                            </div>
                        </div>
                    ) : (
                        // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP: HIỆN NÚT LOGIN
                        <Button 
                            onClick={() => handleLinkClick('/login')}
                            fullWidth
                            variant="contained" 
                            startIcon={<AccountCircle />}
                            sx={{ 
                                bgcolor: '#333', // Màu Teal
                                color: 'white', 
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                py: 1.2,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#E27E6A', boxShadow: 'none' }
                            }}
                        >
                            {t('navbar.login')}
                        </Button>
                    )}
                </div>
                
                <Divider sx={{ mb: 1 }} />

                {/* LIST MENU */}
                <div className="flex-grow">
                    <List>
                        {mainCategory.map((item) => {
                            const subCategories = mobileCategoryData[item.categoryId] || item.subItems;
                            const hasSubItems = subCategories && subCategories.length > 0;
                            const isExpanded = expandedMobileCategory === item.categoryId;

                            return (
                                <div key={item.categoryId}>
                                    {/* Level 1 */}
                                    <ListItemButton onClick={() => {
                                        if (hasSubItems) handleToggleMobileCategory(item.categoryId);
                                        else handleLinkClick(`/products/${item.categoryId}`);
                                    }}>
                                        <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 'bold', color: '#333' }} />
                                        {hasSubItems ? (isExpanded ? <ExpandLess /> : <ExpandMore />) : null}
                                    </ListItemButton>

                                    {/* Level 2 */}
                                    {hasSubItems && (
                                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {subCategories?.map((sub: any) => {
                                                    const level3Items = item.categoryId !== 'support' 
                                                        ? mobileLevelThreeData[item.categoryId]?.filter((l3: any) => l3.parentCategoryId === sub.categoryId)
                                                        : [];
                                                    const hasLevel3 = level3Items && level3Items.length > 0;
                                                    const isLevel2Expanded = expandedLevel2 === sub.categoryId;

                                                    return (
                                                        <div key={sub.categoryId}>
                                                            <ListItemButton
                                                                sx={{ pl: 4, bgcolor: '#f9f9f9', borderLeft: isLevel2Expanded ? '3px solid teal' : '3px solid transparent' }}
                                                                onClick={() => {
                                                                    if (hasLevel3) handleToggleLevel2(sub.categoryId);
                                                                    else {
                                                                        const path = item.categoryId === 'support' ? `/support/${sub.categoryId}` : `/products/${item.categoryId}/${sub.categoryId}`;
                                                                        handleLinkClick(path);
                                                                    }
                                                                }}
                                                            >
                                                                <ListItemText primary={sub.name} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'medium', color: '#444' }} />
                                                                {hasLevel3 ? (isLevel2Expanded ? <ExpandLess fontSize='small'/> : <ExpandMore fontSize='small' />) : null}
                                                            </ListItemButton>

                                                            {/* Level 3 */}
                                                            {hasLevel3 && (
                                                                <Collapse in={isLevel2Expanded} timeout="auto" unmountOnExit>
                                                                    <List component="div" disablePadding>
                                                                        {level3Items.map((l3: any) => (
                                                                            <ListItemButton
                                                                                key={l3.categoryId}
                                                                                sx={{ pl: 8, bgcolor: '#fff' }} 
                                                                                onClick={() => handleLinkClick(`/products/${l3.parentCategoryId}/${l3.categoryId}`)}
                                                                            >
                                                                                <ListItemText primary={l3.name} primaryTypographyProps={{ fontSize: '0.85rem', color: '#666' }} />
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
                                    )}
                                </div>
                            );
                        })}
                    </List>
                </div>
                
                {/* FOOTER: BECOME SELLER */}
                <div className="p-5 border-t bg-white mt-auto">
                    <Button 
                        onClick={() => handleLinkClick('/become-seller')}
                        fullWidth
                        startIcon={<Storefront />} 
                        variant="outlined" 
                        sx={{ 
                            borderRadius: '20px', 
                            textTransform: 'none', 
                            borderColor: '#333', 
                            color: '#333', 
                            py: 1,
                            fontWeight: 'bold',
                            '&:hover': { borderColor: '#E27E6A', color: '#E27E6A' }
                        }}
                    >
                        {t('navbar.becomeSeller')}
                    </Button>
                </div>
                
            </Box>
        </div>
    )
}

export default memo(MobileNavbar);