import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const purpleTheme = createTheme({
    palette: {
        primary: {
            main: '#1a1a2e',
            light: '#2d2d5e',
            dark: '#0f0f1a',
        },
        secondary: {
            main: '#c9a96e',
            light: '#d4bc8e',
            dark: '#8b5e3c',
        },
        error: {
            main: red.A400
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: `'Montserrat', 'Coral Pixels', sans-serif`,
        h4: {
            fontSize: '1.75rem',
            '@media (max-width:600px)': {
                fontSize: '1.25rem',
            },
        },
        h5: {
            fontSize: '1.5rem',
            '@media (max-width:600px)': {
                fontSize: '1.1rem',
            },
        },
        h6: {
            fontSize: '1.25rem',
            '@media (max-width:600px)': {
                fontSize: '1rem',
            },
        },
        body1: {
            fontSize: '1rem',
            '@media (max-width:600px)': {
                fontSize: '0.875rem',
            },
        },
        body2: {
            fontSize: '0.875rem',
            '@media (max-width:600px)': {
                fontSize: '0.8rem',
            },
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    minHeight: 40,
                    '@media (max-width:600px)': {
                        minHeight: 44,
                        fontSize: '0.85rem',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        padding: 10,
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    '@media (max-width:600px)': {
                        margin: 16,
                        width: 'calc(100% - 32px)',
                        maxWidth: 'none',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 0,
                    borderRadius: 12,
                    '@media (max-width:600px)': {
                        fontSize: '0.8rem',
                        '& .MuiDataGrid-columnHeaders': {
                            fontSize: '0.8rem',
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '0.8rem',
                            padding: '4px 8px',
                        },
                    },
                },
            },
        },
    },
})