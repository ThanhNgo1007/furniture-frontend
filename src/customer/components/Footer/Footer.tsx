import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Container, Divider, Grid, IconButton, Link, Switch, Typography, styled } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const footerLinks = [
    "about", "howItWorks", "reviews", "blog", "sustainability",
    "selling", "moneyBack", "pickupDelivery",
    "deliveryTeam", "designTrade", "partner", "locations",
    "press", "careers", "contact", "faq"
];

// --- START: Custom Switch (Style phẳng, hiện đại) ---
const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 40, // Độ rộng tổng
    height: 20, // Chiều cao tổng
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.success.main // Màu khi chọn (Teal)
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 16,
        height: 16,
        borderRadius: 8,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));
// --- END: Custom Switch ---

const Footer = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    // Ẩn Footer nếu là trang Seller/Admin
    if (location.pathname.startsWith("/seller") || location.pathname.startsWith("/admin")) {
        return null;
    }

    // Xử lý đổi ngôn ngữ
    const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLang = event.target.checked ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    // Helper để đổi ngôn ngữ khi bấm vào chữ
    const setLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    // Kiểm tra trạng thái hiện tại
    const isVietnamese = i18n.language === 'vi';

    return (
        <Box component="footer" sx={{ color: 'text.primary', position: 'relative' }}>

            {/* Main footer content */}
            <Box sx={{ backgroundColor: 'background.paper', py: 8, mt: 8, position: 'relative' }}>
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'warning.main',
                            fontFamily: 'Playfair Display, serif',
                            fontWeight: 700,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            mb: 2,
                        }}
                    >
                        AptDeco
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                        <IconButton href="#" aria-label="Instagram" sx={{ color: 'warning.main' }}><InstagramIcon /></IconButton>
                        <IconButton href="#" aria-label="Twitter" sx={{ color: 'warning.main' }}><TwitterIcon /></IconButton>
                        <IconButton href="#" aria-label="Facebook" sx={{ color: 'warning.main' }}><FacebookIcon /></IconButton>
                        <IconButton href="#" aria-label="Pinterest" sx={{ color: 'warning.main' }}><PinterestIcon /></IconButton>
                    </Box>

                    <Divider sx={{ maxWidth: '900px', mx: 'auto' }} />

                    <Box sx={{ my: 5, maxWidth: '1000px', mx: 'auto' }}>
                        <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
                            {footerLinks.map((link) => (
                                <Grid key={link}>
                                    <Link
                                        href="#"
                                        underline="hover"
                                        sx={{
                                            color: 'text.primary',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            p: 0.5,
                                            '&:hover': { color: 'warning.main' }
                                        }}
                                    >
                                        {t(`footer.${link}`)}
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider sx={{ maxWidth: '700px', mx: 'auto' }} />

                    <Box sx={{ my: 4 }}>
                        <Link
                            href="#"
                            underline="hover"
                            sx={{
                                color: 'warning.main',
                                fontWeight: 'bold',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <span>{t('footer.sellOn')}</span>
                            <ArrowForwardIcon sx={{ fontSize: '1.2rem' }} />
                        </Link>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        © {new Date().getFullYear()} APTDECO, INC. {t('footer.rightsReserved')}
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> | </Box>
                        <Link href="#" underline="hover" color="inherit">{t('footer.privacy')}</Link>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> | </Box>
                        <Link href="#" underline="hover" color="inherit">{t('footer.terms')}</Link>
                    </Typography>
                </Container>

                {/* --- 2. CỤM NÚT CHUYỂN NGÔN NGỮ MỚI --- */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '20px', // Cách đáy
                        left: '20px',   // Cách trái
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,       // Khoảng cách giữa các phần tử
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền mờ nhẹ để dễ nhìn (tùy chọn)
                        padding: '8px 16px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Đổ bóng nhẹ
                    }}
                >
                    {/* Chữ EN */}
                    <Typography
                        variant="button"
                        onClick={() => setLanguage('en')}
                        sx={{
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            // Logic màu sắc: Nếu KHÔNG phải tiếng Việt (tức là EN) thì sáng, ngược lại thì mờ
                            color: !isVietnamese ? 'warning.main' : 'text.disabled',
                            opacity: !isVietnamese ? 1 : 0.5,
                            transform: !isVietnamese ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        EN
                    </Typography>

                    {/* Nút Switch ở giữa */}
                    <AntSwitch
                        checked={isVietnamese}
                        onChange={handleLanguageChange}
                        inputProps={{ 'aria-label': 'language switch' }}
                    />

                    {/* Chữ VI */}
                    <Typography
                        variant="button"
                        onClick={() => setLanguage('vi')}
                        sx={{
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            // Logic màu sắc: Nếu là tiếng Việt thì sáng, ngược lại thì mờ
                            color: isVietnamese ? 'warning.main' : 'text.disabled',
                            opacity: isVietnamese ? 1 : 0.5,
                            transform: isVietnamese ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        VI
                    </Typography>
                </Box>
                {/* --------------------------------------- */}

            </Box>
        </Box>
    );
};

export default Footer;