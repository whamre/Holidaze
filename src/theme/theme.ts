import { createTheme, alpha } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#1a1a1a' : '#ffffff',
      secondary: mode === 'light' ? '#64748b' : '#a0aec0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          maxWidth: '1400px !important',
          '@media (min-width: 1600px)': {
            maxWidth: '1600px !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: mode === 'dark' ? '#64b5f6' : '#2196f3',
          color: '#fff',
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
        },
        outlinedPrimary: {
          borderColor: mode === 'dark' ? '#64b5f6' : '#2196f3',
          color: mode === 'dark' ? '#64b5f6' : '#2196f3',
          '&:hover': {
            borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
            backgroundColor: alpha(mode === 'dark' ? '#64b5f6' : '#2196f3', 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 4px 6px rgba(0,0,0,0.05)'
            : '0 4px 6px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0 4px 6px rgba(0,0,0,0.05)'
            : '0 4px 6px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : alpha('#1e1e1e', 0.9),
          backdropFilter: 'blur(8px)',
          boxShadow: mode === 'light'
            ? '0 1px 3px rgba(0,0,0,0.05)'
            : '0 1px 3px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});