import { createTheme, alpha } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#14b8a6',
      light: '#2dd4bf',
      dark: '#0f766e',
    },
    error: {
      main: '#f43f5e',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#10b981',
    },
    background: {
      default: '#0a0f1e',
      paper: '#0f172a',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    divider: alpha('#6366f1', 0.15),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(99, 102, 241, 0.12)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#0f172a',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#1e293b',
          fontWeight: 600,
          color: '#94a3b8',
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
  },
})

export default theme
