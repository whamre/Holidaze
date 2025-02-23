import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import HandshakeIcon from '@mui/icons-material/Handshake';

const About = () => {
  const theme = useTheme();

  const values = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Trust & Safety',
      description: 'We prioritize the safety and security of our guests and hosts through rigorous verification processes.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Our dedicated support team is always available to assist you with any questions or concerns.'
    },
    {
      icon: <HomeWorkIcon sx={{ fontSize: 40 }} />,
      title: 'Quality Venues',
      description: 'We carefully curate and verify all venues to ensure they meet our high standards of quality and comfort.'
    },
    {
      icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
      title: 'Community',
      description: 'We foster a strong community of travelers and hosts, built on trust and shared experiences.'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
              About Holidaze
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Transforming the way people experience travel through unique and memorable stays
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Founded in 2023, Holidaze has grown from a small startup to a trusted platform 
              connecting travelers with exceptional venues worldwide. Our mission is to make 
              unique travel experiences accessible to everyone while ensuring the highest 
              standards of quality and service.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
              alt="About Holidaze"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 4,
                boxShadow: theme.shadows[8]
              }}
            />
          </Grid>
        </Grid>

        {/* Our Values */}
        <Box>
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Our Values
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
          >
            These core values guide everything we do and help us deliver exceptional 
            experiences to our community
          </Typography>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;