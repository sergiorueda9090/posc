import React, { useState } from 'react';
import { AppBar, Grid, IconButton, Toolbar, Typography, Menu, MenuItem, Badge } from '@mui/material';
import { LogoutOutlined, MenuOutlined, ChevronRight } from '@mui/icons-material';
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
            }}
        >
            <Toolbar>
                <IconButton color='inherit' edge="start" sx={{ mr: 2 }} onClick={handleDrawerToggle}>
                    {isSidebarOpen ? <ChevronRight /> : <MenuOutlined />}
                </IconButton>

                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6' noWrap>{nameModule}</Typography>


                    {/* Avatar del usuario actual */}
                    <IconButton color='primary' onClick={handleMenuOpen}>
                        <Avatar alt="User" src="https://free.minimals.cc/assets/images/avatar/avatar-25.webp" />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                        <MenuItem onClick={handleLogout}>
                            <LogoutOutlined sx={{ marginRight: 1 }} />
                            Cerrar sesión close
                        </MenuItem>
                    </Menu>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};
