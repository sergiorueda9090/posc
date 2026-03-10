import React, { useState } from 'react';
import {
  AppBar, IconButton, Toolbar, Typography, Menu, MenuItem,
  Box, Divider, ListItemIcon, ListItemText
} from '@mui/material';
import { LogoutOutlined, MenuOutlined, ChevronLeft, PersonOutline } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authStore/authStore';
import { showAlert } from '../store/globalStore/globalStore';


export const NavBar = ({ drawerWidth = 240, nameModule = 'JournalApp', handleDrawerToggle, isSidebarOpen }) => {
    const dispatch = useDispatch();
    const { username, role } = useSelector((state) => state.authStore);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleMenuClose();
        dispatch(showAlert({
            type: 'warning',
            title: 'Cerrar sesion',
            text: 'Estas seguro de que deseas cerrar tu sesion?',
            confirmText: 'Si, cerrar sesion',
            cancelText: 'Cancelar',
            showCancel: true,
            action: () => {
                localStorage.removeItem('infoUser');
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                dispatch(logout());
            },
        }));
    };

    // Generar iniciales del usuario para el Avatar
    const getInitials = (name) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    return (
        <AppBar
            position='fixed'
            sx={{
                width: { sm: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
                ml: { sm: `${isSidebarOpen ? drawerWidth : 0}px` },
                transition: 'margin 0.3s ease-in-out, width 0.3s ease-in-out',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)',
            }}
        >
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
                <IconButton
                    color='inherit'
                    edge="start"
                    sx={{ mr: { xs: 1, sm: 2 }, minWidth: 44, minHeight: 44 }}
                    onClick={handleDrawerToggle}
                >
                    {isSidebarOpen ? <ChevronLeft /> : <MenuOutlined />}
                </IconButton>

                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                        variant='h6'
                        noWrap
                        sx={{
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            fontSize: { xs: '0.95rem', sm: '1.25rem' },
                        }}
                    >
                        {nameModule}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Nombre de usuario visible en desktop */}
                        <Typography
                            variant="body2"
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                color: 'rgba(255,255,255,0.85)',
                                fontWeight: 500,
                            }}
                        >
                            {username}
                        </Typography>

                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ minWidth: 44, minHeight: 44, p: 0.5 }}
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 32, sm: 38 },
                                    height: { xs: 32, sm: 38 },
                                    bgcolor: '#c9a96e',
                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                    fontWeight: 700,
                                }}
                            >
                                {getInitials(username)}
                            </Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        mt: 1,
                                        minWidth: 220,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                    }
                                }
                            }}
                        >
                            {/* Info del usuario en el menu */}
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    {username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {role === 'admin' ? 'Administrador' :
                                     role === 'vendedor' ? 'Vendedor' :
                                     role === 'contador' ? 'Contador' :
                                     role || 'Usuario'}
                                </Typography>
                            </Box>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ minHeight: 44, mt: 0.5 }}>
                                <ListItemIcon>
                                    <LogoutOutlined fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Cerrar sesion"
                                    primaryTypographyProps={{ fontSize: '0.875rem', color: 'error.main' }}
                                />
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
