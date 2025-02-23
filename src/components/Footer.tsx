import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Stack,
  IconButton,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Browse Venues', path: '/venues' },
    { label: 'Become a Host', path: '/register' }
  ];

  const supportLinks = [
    { label: 'Help Center', path: '#' },
    { label: 'Safety Information', path: '#' },
    { label: 'Cancellation Options', path: '#' },
    { label: 'Terms of Service', path: '#' }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, label: 'Facebook', url: '#' },
    { icon: <TwitterIcon />, label: 'Twitter', url: '#' },
    { icon: <InstagramIcon />, label: 'Instagram', url: '#' },
    { icon: <LinkedInIcon />, label: 'LinkedIn', url: '#' }
  ];

  return (
    <Box 
      component="footer" 
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Brand Column */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    component={RouterLink}
                    to="/"
                    variant="h5"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                      mb: 2
                    }}
                  >
                    <HomeIcon sx={{ mr: 1, fontSize: 28 }} />
                    Holidaze
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Discover and book unique accommodations around the world. 
                    Whether you're looking for a cozy cabin or a luxury villa, 
                    find your perfect stay with Holidaze.
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      123 Booking Street, 0150 Oslo, Norway
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      +47 123 45 678
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      contact@holidaze.com
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    component={RouterLink}
                    to={link.path}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Support */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Support
              </Typography>
              <Stack spacing={1}>
                {supportLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.path}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Connect With Us
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Follow us on social media for travel inspiration, exclusive deals, 
                and updates about new venues.
              </Typography>
              <Stack 
                direction="row" 
                spacing={1}
                sx={{
                  '& .MuiIconButton-root': {
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }
                }}
              >
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    sx={{
                      color: 'text.secondary',
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: 'primary.main'
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Bottom Bar */}
        <Box 
          sx={{ 
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © {year} Holidaze. All rights reserved.
          </Typography>
          <Stack 
            direction="row" 
            spacing={3}
            divider={
              <Box 
                component="span" 
                sx={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  bgcolor: 'text.disabled',
                  alignSelf: 'center'
                }} 
              />
            }
          >
            <Link
              href="#"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Terms of Use
            </Link>
            <Link
              href="#"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Cookie Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;