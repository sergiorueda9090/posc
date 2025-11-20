import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Divider, Badge } from '@mui/material';
import {
  Autorenew as DevolucionIcon,
  Cached as CambioIcon,
  ReceiptLong as ReporteIcon,
  PointOfSale as VentaIcon,
  ExitToApp as CerrarTurnoIcon,
  Wifi as ConexionIcon,
  Person as UsuarioIcon,
  Notifications as NotificacionIcon,
  AttachMoney as VentasIcon,
  ShoppingCart as ProductosIcon,
  Timer as RelojIcon,
  Print as ImpresoraIcon,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from "react-router-dom";

import { getVentasThunk } from '../../store/posStore/posThunks';

const FooterPOS = ({
  usuario = "Cajero Principal",
  rol = "Administrador",
  turno = "Mañana",
  totalVentas = 0,
  totalProductos = 0,
  estadoConexion = true,
  estadoImpresora = true,
  notificaciones = 2,
  onDevolucion,
  onCambio,
  onReporte,
  onCerrarTurno,
}) => {
  const [horaActual, setHoraActual] = useState(new Date());
  
  const dispatch = useDispatch();
  const { ventas } = useSelector((state) => state.posStore);

  //Actualiza el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log("🔁 useEffect ejecutado: cargando ventas...");
    dispatch(getVentasThunk());
  }, [dispatch, ventas.total_ventas]);

  const horaFormateada = horaActual.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

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
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        bgcolor: '#1f1f3d',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 1,
        boxShadow: '0 -3px 10px rgba(0,0,0,0.25)',
        zIndex: 1000,
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      {/* === SECCIÓN IZQUIERDA === */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

      {/* === SECCIÓN CENTRAL (ESTADÍSTICAS DEL TURNO) === */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VentasIcon sx={{ color: '#4caf50' }} />
          {ventas && ventas.total_ventas !== undefined ? (
              <Typography variant="body2">
                <strong>
                  {ventas.total_ventas.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </strong> en ventas
              </Typography>
            ) : (
              <Typography variant="body2">Cargando ventas...</Typography>
            )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ProductosIcon sx={{ color: '#ffb300' }} />
          <Typography variant="body2">
            {ventas.total_unidades_vendidas} productos vendidos
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
