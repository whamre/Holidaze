import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useScrollTrigger,
  Slide,
  Stack,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';

interface HideOnScrollProps {
  children: React.ReactElement;
  window?: () => Window;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 100
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setUserMenuAnchor(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Venues', path: '/venues' },
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactSupportIcon /> }
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed"
        sx={{
          bgcolor: mode === 'light' ? 'background.paper' : 'background.default',
          backdropFilter: 'blur(10px)',
          boxShadow: 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease'
                }
              }}
            >
              <HomeIcon sx={{ mr: 1, fontSize: 28 }} />
              Holidaze
            </Typography>

            <Box sx={{ ml: 'auto', display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleMobileMenu}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Stack 
              direction="row" 
              spacing={1}
              alignItems="center"
              sx={{ 
                ml: 'auto',
                display: { xs: 'none', md: 'flex' }
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    px: 2,
                    py: 1,
                    color: 'text.primary',
                    position: 'relative',
                    fontWeight: 500,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 8,
                      right: 8,
                      height: 2,
                      bgcolor: 'primary.main',
                      transform: isActive(item.path) ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.2s ease'
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton 
                  onClick={toggleTheme}
                  sx={{
                    ml: 1,
                    color: 'text.primary',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2)
                    }
                  }}
                >
                  {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Tooltip>

              {user ? (
                <>
                  <IconButton
                    onClick={handleUserMenu}
                    sx={{ 
                      ml: 1,
                      p: 0.5,
                      border: `2px solid ${theme.palette.primary.main}`,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Avatar 
                      src={user.avatar?.url} 
                      alt={user.name}
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: 'primary.main',
                        color: '#fff'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" noWrap>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate('/profile');
                    }}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate('/my-bookings');
                    }}>
                      My Bookings
                    </MenuItem>
                    {user.venueManager && (
                      <MenuItem onClick={() => {
                        handleClose();
                        navigate('/manage-venues');
                      }}>
                        Manage Venues
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/register"
                    startIcon={<PersonAddIcon />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Register
                  </Button>
                </Stack>
              )}
            </Stack>

            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: '100%',
                  maxWidth: '100%',
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    py: 2
                  }
                }
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    handleClose();
                    navigate(item.path);
                  }}
                  sx={{
                    bgcolor: isActive(item.path) 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent'
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {item.icon}
                    <Typography>{item.label}</Typography>
                  </Stack>
                </MenuItem>
              ))}
              <Divider />
              {user ? (
                <>
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate('/profile');
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate('/my-bookings');
                  }}>
                    My Bookings
                  </MenuItem>
                  {user.venueManager && (
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate('/manage-venues');
                    }}>
                      Manage Venues
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate('/login');
                  }}>
                    <LoginIcon sx={{ mr: 2 }} />
                    Login
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate('/register');
                  }}>
                    <PersonAddIcon sx={{ mr: 2 }} />
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;