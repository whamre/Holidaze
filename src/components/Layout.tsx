import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Navbar />
      <Container 
        component="main" 
        sx={{ 
          flex: 1, 
          py: 4,
          mt: 10, // Add margin top to account for fixed navbar
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout