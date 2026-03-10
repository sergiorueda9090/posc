import React, { useState } from 'react';
import { AppBar, Grid, IconButton, Toolbar, Typography, Menu, MenuItem, Box } from '@mui/material';
import { LogoutOutlined, MenuOutlined, ChevronLeft } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';

import { useDispatch } from 'react-redux';
import { loginFail } from '../store/authStore/authStore';


export const NavBar = ({ drawerWidth = 240, nameModule = 'JournalApp', handleDrawerToggle, isSidebarOpen }) => {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleMenuClose();
        dispatch(loginFail());
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

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Avatar del usuario actual */}
                        <IconButton
                            color='primary'
                            onClick={handleMenuOpen}
                            sx={{ minWidth: 44, minHeight: 44 }}
                        >
                            <Avatar
                                alt="User"
                                src="https://free.minimals.cc/assets/images/avatar/avatar-25.webp"
                                sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                            />
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                            <MenuItem onClick={handleLogout} sx={{ minHeight: 44 }}>
                                <LogoutOutlined sx={{ marginRight: 1 }} />
                                Cerrar sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
