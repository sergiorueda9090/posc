import React from 'react';
import {
  Box, Divider, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, IconButton
} from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { styled } from '@mui/system';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CategoryIcon from '@mui/icons-material/Category';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
});

export const SideBar = ({ drawerWidth = 240, mobileOpen, handleDrawerToggle, isSidebarOpen }) => {
  const location = useLocation();

  //Aqui agregas todos los modulos del menu Proveedores
  const items = [
    { text: 'Usuarios',             icon: <PeopleIcon />,                     route: '/users' },
    { text: 'Proveedores',          icon: <StoreMallDirectoryIcon />,         route: '/proveedores' },
    { text: 'Clientes',             icon: <MonetizationOnIcon />,             route: '/clientes' },
    { text: 'Categorias',           icon: <CategoryIcon />,                   route: '/categorias' },
    { text: 'Subcategorias',        icon: <WidgetsIcon />,                    route: '/subcategorias' },
    { text: 'Productos',            icon: <ProductionQuantityLimitsIcon />,   route: '/productos' },
    { text: 'Combos',               icon: <WidgetsIcon />,                    route: '/combos' },
    { text: 'Pos',                  icon: <PointOfSaleIcon />,                route: '/pos' },
    { text: 'Gastos',               icon: <MoneyOffIcon />,                   route: '/gastos' },
    { text: 'Relacionar Gastos',    icon: <ArrowCircleDownIcon />,            route: '/relacionargastos' },
    { text: 'Tarjetas Bancarias',   icon: <AccountBalanceIcon />,             route: '/tarjetasbancarias' },
    { text: 'Recepcion de Pagos',   icon: <RequestQuoteIcon />,               route: '/recepcionpagos' },
    { text: 'Cargos No Registrados',icon: <PendingActionsIcon />,               route: '/cargosnoregistrados' },
    { text: 'Ajuste de Saldo',      icon: <SwapHorizIcon />,                  route: '/ajustedesaldo' },
    { text: 'Utilidad ocasional',   icon: <TrendingUpIcon />,                 route: '/utilidadocasional' }
  ];

  const drawerContent = (onClickHandler = null) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d5e 100%)',
        minHeight: { xs: 56, sm: 64 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: '#c9a96e',
              fontWeight: 700,
              letterSpacing: '1px',
              fontSize: { xs: '1rem', sm: '1.15rem' },
            }}
          >
            Perfumeria POS
          </Typography>
        </Box>
        {onClickHandler === null && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, py: 1, overflowY: 'auto' }}>
        {items.map(({ text, icon, route }) => {
          const isActive = location.pathname === route;
          return (
            <ListItem key={text} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <StyledLink to={route} onClick={onClickHandler}>
                <ListItemButton
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(201, 169, 110, 0.15)',
                      borderLeft: '3px solid #c9a96e',
                      '&:hover': {
                        backgroundColor: 'rgba(201, 169, 110, 0.25)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(26, 26, 46, 0.06)',
                    },
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 40,
                    color: isActive ? '#c9a96e' : 'rgba(0,0,0,0.54)',
                  }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#1a1a2e' : 'inherit',
                    }}
                  />
                </ListItemButton>
              </StyledLink>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: isSidebarOpen ? { sm: drawerWidth } : 0, flexShrink: { sm: 0 } }}>

      {/*Drawer para moviles */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: { xs: '85%', sm: drawerWidth },
            maxWidth: 320,
          },
        }}
      >
        {drawerContent(handleDrawerToggle)}
      </Drawer>

      {/* Drawer para escritorio */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? drawerWidth : 0,
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden',
          },
        }}
        open={isSidebarOpen}
      >
        {drawerContent()}
      </Drawer>
    </Box>
  );
};
