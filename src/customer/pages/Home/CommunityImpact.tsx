import { Box, Container, Grid, Typography, Stack, Divider } from '@mui/material';
import { CarIcon, CheckIcon, FactoryIcon, TreeIcon } from '../../components/Footer/icons';

const CommunityImpact = () => {
    const stats = [
        {
            icon: <FactoryIcon />,
            value: 21560254,
            label: 'LBS OF CO2 OFFSET',
        },
        {
            icon: <CarIcon />,
            value: 7839509,
            label: 'CARS REMOVED',
        },
        {
            icon: <TreeIcon />,
            value: 1709703,
            label: 'TREES PLANTED',
        },
    ];

    const formatNumber = (num) => {
        return new Intl.NumberFormat('de-DE').format(num);
    };

    return (
        <Box>
            {/* Top Section */}
            <Box sx={{ backgroundColor: 'secondary.main', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        We're AptDeco
                    </Typography>
                    <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, maxWidth: '750px', mx: 'auto' }}>
                        A community reshaping how people buy and sell used furniture
                    </Typography>
                    <Divider sx={{
                        borderColor: 'warning.main',
                        borderWidth: '1px',
                        width: '50px',
                        mx: 'auto',
                        mb: 4
                    }} />
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 2, sm: 4 }}
                        justifyContent="center"
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CheckIcon className="text-apt-orange" />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>ONLINE TRANSACTIONS</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                             <CheckIcon className="text-apt-orange" />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>PROFESSIONAL PICKUP & DELIVERY</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CheckIcon className="text-apt-orange" />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>VERIFIED BUYERS & SELLERS</Typography>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Bottom Section */}
            <Box sx={{ backgroundColor: 'background.default', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Sustainability impact
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                            Sustainability is at the heart of what we do. We believe that pre-loved furniture should be the first consideration before new. Over 12 million tons of used furniture get landfilled each year. We're on a mission to change that by making furniture circular. Traditionally, the use of furniture is linear. We buy it, we live with it—and then we dispose of it. Instead of ending the lifecycle at one use, we've created a platform where furniture can continue to stay in circulation for years to come.
                        </Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {stats.map((stat) => (
                            // Fix: Removed 'item' prop from Grid component as it is redundant with 'xs' and 'sm' and was causing a type error.
                            <Grid size={{xs:12, sm:4}} key={stat.label} sx={{ textAlign: 'center' }}>
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', color: '#a0d3e8' }}>
                                    {stat.icon}
                                </Box>
                                <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
                                    {formatNumber(stat.value)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>
                                    {stat.label}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default CommunityImpact;