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

  //Aquí agregas todos los módulos del menú Proveedores
  const items = [
    { text: 'Usuarios',             icon: <PeopleIcon />,                     route: '/users' },
    { text: 'Proveedores',          icon: <StoreMallDirectoryIcon />,         route: '/proveedores' },
    { text: 'Clientes',             icon: <MonetizationOnIcon />,             route: '/clientes' },
    { text: 'Categorias',           icon: <CategoryIcon />,                   route: '/categorias' },
    { text: 'Subcategorias',        icon: <WidgetsIcon />,                    route: '/subcategorias' },
    { text: 'Productos',            icon: <ProductionQuantityLimitsIcon />,   route: '/productos' },
    { text: 'Pos',                  icon: <PointOfSaleIcon />,                route: '/pos' },
    { text: 'Gastos',               icon: <MoneyOffIcon />,                   route: '/gastos' },
    { text: 'Relacionar Gastos',    icon: <ArrowCircleDownIcon />,            route: '/relacionargastos' },
    { text: 'Tarjetas Bancarias',   icon: <AccountBalanceIcon />,             route: '/tarjetasbancarias' },
    { text: 'Recepción de Pagos',   icon: <RequestQuoteIcon />,               route: '/recepcionpagos' },
    { text: 'Cargos No Registrados',icon: <PendingActionsIcon />,               route: '/cargosnoregistrados' },
    { text: 'Ajuste de Saldo',      icon: <SwapHorizIcon />,                  route: '/ajustedesaldo' },
    { text: 'Utilidad ocasional',   icon: <TrendingUpIcon />,                 route: '/utilidadocasional' }
  ];

  const renderItems = (onClickHandler = null) => (
    <List>
      {items.map(({ text, icon, route }) => (
        <ListItem key={text} disablePadding>
          <StyledLink to={route} onClick={onClickHandler}>
            <ListItemButton selected={location.pathname === route}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </StyledLink>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box component="nav" sx={{ width: isSidebarOpen ? drawerWidth : 0, flexShrink: { sm: 0 } }}>
      
      {/*Drawer para móviles */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>POS</Typography>
        </Toolbar>
        <Divider />
        {renderItems(handleDrawerToggle)}
      </Drawer>

      {/* 💻 Drawer para escritorio */}
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
        <Toolbar>
          <Typography variant="h6" noWrap>POS</Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        {renderItems()}
      </Drawer>
    </Box>
  );
};
