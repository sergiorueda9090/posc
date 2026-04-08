import React, { useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Divider } from '@mui/material';
import {
  Autorenew as DevolucionIcon,
  ReceiptLong as ReporteIcon,
  ExitToApp as CerrarTurnoIcon,
  Person as UsuarioIcon,
  AttachMoney as VentasIcon,
  ShoppingCart as ProductosIcon,
  Receipt as TransaccionIcon,
} from '@mui/icons-material';
import Chip from '@mui/material/Chip';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from "react-router-dom";

import { getVentasThunk } from '../../store/posStore/posThunks';

const FooterPOS = ({
  usuario = "Cajero Principal",
  rol = "Administrador",
  onCerrarTurno,
}) => {
  const dispatch = useDispatch();
  const { ventas } = useSelector((state) => state.posStore);

  // Refresh inicial + auto-refresh cada 30s para mantener métricas del día actualizadas
  useEffect(() => {
    dispatch(getVentasThunk());
    const interval = setInterval(() => {
      dispatch(getVentasThunk());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const totalVentas = Number(ventas?.total_ventas) || 0;
  const totalUnidades = Number(ventas?.total_unidades_vendidas) || 0;
  const totalTransacciones = Number(ventas?.total_transacciones) || 0;

  const navigate = useNavigate();

  const handleReporte = () => {
    navigate("/pos/reporte");
  };

  const handleReporteDevoluciones = () => {
    navigate("/pos/devoluciones");
  }

  return (
    <Box
      sx={{
        flexShrink: 0,
        minHeight: 48,
        bgcolor: '#1a1a2e',
        color: 'white',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'space-between' },
        px: { xs: 1, sm: 2, md: 3 },
        py: 0.5,
        gap: { xs: 0.5, sm: 0 },
        boxShadow: '0 -2px 8px rgba(0,0,0,0.3)',
        borderTop: '2px solid #c9a96e',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      {/* === SECCIÓN IZQUIERDA === */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Registrar devolución">
          <IconButton color="inherit" onClick={handleReporteDevoluciones}>
            <DevolucionIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Generar reporte del turno">
          <IconButton color="inherit" onClick={handleReporte}>
            <ReporteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Cerrar turno actual">
          <IconButton color="inherit" onClick={onCerrarTurno}>
            <CerrarTurnoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* === SEPARADOR === */}
      <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

      {/* === SECCION CENTRAL (ESTADISTICAS DEL DIA) === */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: { sm: 1.5, md: 2.5 } }}>
        <Chip
          label="HOY"
          size="small"
          sx={{
            bgcolor: '#c9a96e',
            color: '#1a1a2e',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: 22,
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <VentasIcon sx={{ color: '#4caf50', fontSize: 20 }} />
          <Typography variant="body2">
            <strong>
              {totalVentas.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0,
              })}
            </strong> en ventas
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <ProductosIcon sx={{ color: '#ffb300', fontSize: 20 }} />
          <Typography variant="body2">
            <strong>{totalUnidades}</strong> productos vendidos
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.8 }}>
          <TransaccionIcon sx={{ color: '#42a5f5', fontSize: 20 }} />
          <Typography variant="body2">
            <strong>{totalTransacciones}</strong> transacciones
          </Typography>
        </Box>
      </Box>

      {/* === SEPARADOR === */}
      <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: 'rgba(255,255,255,0.3)' }} />

      {/* === SECCIÓN DERECHA (ESTADO Y USUARIO) === */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Estado de conexión */}


 
        {/* Usuario actual */}
        <Tooltip title={`Rol: ${rol}`}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UsuarioIcon sx={{ opacity: 0.8 }} />
            <Typography variant="body2">
              <strong>{usuario}</strong>
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default FooterPOS;
