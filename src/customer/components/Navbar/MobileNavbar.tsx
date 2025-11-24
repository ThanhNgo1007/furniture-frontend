import { ExpandLess, ExpandMore, Storefront } from '@mui/icons-material';
import { Box, Button, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

const MobileNavbar = () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
    
    // State cho Mobile Menu
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null); // Level 1 -> 2
    const [expandedLevel2, setExpandedLevel2] = useState<string | null>(null); // Level 2 -> 3 (MỚI)

    const mainCategory = useMemo(() => {
    return navigation.map((item) => ({
        ...item,
        name: t(item.key),
        subItems: item.subItems?.map((sub) => ({
            ...sub,
            name: t(sub.key)
        }))
    }));
}, [t]); // Chỉ tính lại khi hàm dịch t thay đổi

    // --- HANDLERS ---
    const handleToggleMobileCategory = (categoryId: string) => {
        setExpandedMobileCategory(prev => prev === categoryId ? null : categoryId);
        setExpandedLevel2(null); // Reset level 2 khi đóng/mở level 1
    };

    const handleToggleLevel2 = (categoryId: string) => {
        setExpandedLevel2(prev => prev === categoryId ? null : categoryId);
    };
  return (
    <div>
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
    </div>
  )
}

export default memo(MobileNavbar)