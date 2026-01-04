import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { NavBar } from '../../components/NavBar';
import { SideBar } from '../../components/SideBar';

const drawerWidth = 280;
const nameModule = "Combos";

export const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleDrawerToggle = () => {
    if (window.innerWidth < 600) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
