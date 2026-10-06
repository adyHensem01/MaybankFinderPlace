import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1f2937', contrastText: '#ffffff' },
    secondary: { main: '#ffc72c', contrastText: '#1f2937' },
    background: { default: '#f5f6f8' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});

export default theme;
