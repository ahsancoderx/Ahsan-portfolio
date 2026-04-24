'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#E05C40' },
    secondary: { main: '#ffffff' },
    background: { default: '#0a0a0a', paper: '#111111' },
    text: { primary: '#ffffff', secondary: '#aaaaaa' },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #E05C40 0%, #c0392b 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111111',
          border: '1px solid #222222',
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;