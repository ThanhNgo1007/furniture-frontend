
import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const footerLinks = [
    "About Aptdeco", "How Aptdeco Works", "Reviews", "Blog", "Sustainability Focus",
    "Selling on Aptdeco", "Money Back Guarantee", "Pickup & Delivery Locations",
    "Meet Our Delivery Team", "Design Trade", "Partner with Aptdeco", "Locations",
    "Press", "Careers", "Contact Us", "FAQ"
];

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ color: 'text.primary' }}>

      {/* Main footer content */}
      <Box sx={{ backgroundColor: 'background.paper', py: 8, mt:8 }}>
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
                                {link}
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
                <span>Sell on AptDeco</span>
                <ArrowForwardIcon sx={{ fontSize: '1.2rem' }} />
              </Link>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              © {new Date().getFullYear()} APTDECO, INC. ALL RIGHTS RESERVED
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> | </Box>
              <Link href="#" underline="hover" color="inherit">PRIVACY</Link>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> | </Box>
              <Link href="#" underline="hover" color="inherit">TERMS AND CONDITIONS</Link>
            </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;