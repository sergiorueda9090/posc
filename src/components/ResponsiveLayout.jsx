import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { NavBar } from './NavBar';
import { SideBar } from './SideBar';

const drawerWidth = 280;

export const ResponsiveLayout = ({ children, nameModule = '' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <NavBar
        drawerWidth={drawerWidth}
        nameModule={nameModule}
        handleDrawerToggle={handleDrawerToggle}
        isSidebarOpen={isSidebarOpen}
      />
      <SideBar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isSidebarOpen={isSidebarOpen}
      />

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          transition: 'padding 0.3s ease',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
