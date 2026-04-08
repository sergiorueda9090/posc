import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Chip, Divider, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';

const HeaderPOS = ({ codigoVenta, currentClient, onChangeClient }) => {
  const navigate = useNavigate();
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const horaFormateada = horaActual.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const fechaFormateada = horaActual.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Box
      sx={{
        flexShrink: 0,
        height: 56,
        bgcolor: '#1a1a2e',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 1, sm: 2 },
        gap: { xs: 1, sm: 2 },
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        borderBottom: '2px solid #c9a96e',
      }}
    >
      {/* Botón volver */}
      <Tooltip title="Volver al panel principal" arrow>
        <IconButton
          onClick={() => navigate('/clientes')}
          sx={{
            color: '#c9a96e',
            '&:hover': { bgcolor: 'rgba(201,169,110,0.15)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>

      {/* Título */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PointOfSaleIcon sx={{ color: '#c9a96e' }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.95rem', sm: '1.1rem' },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          Punto de Venta
        </Typography>
      </Box>

      {/* Código de venta */}
      {codigoVenta && (
        <Chip
          icon={<ReceiptIcon sx={{ color: '#1a1a2e !important' }} />}
          label={codigoVenta}
          size="small"
          sx={{
            bgcolor: '#c9a96e',
            color: '#1a1a2e',
            fontWeight: 700,
            '& .MuiChip-icon': { color: '#1a1a2e' },
          }}
        />
      )}

      <Box sx={{ flexGrow: 1 }} />

      {/* Cliente */}
      {currentClient && (
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.08)',
          }}
        >
          <PersonIcon sx={{ color: '#c9a96e', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {currentClient.nombre || currentClient.name || 'Sin cliente'}
          </Typography>
          {onChangeClient && (
            <Button
              size="small"
              onClick={onChangeClient}
              sx={{
                color: '#c9a96e',
                textTransform: 'none',
                minWidth: 'auto',
                px: 1,
                fontSize: '0.75rem',
                '&:hover': { bgcolor: 'rgba(201,169,110,0.15)' },
              }}
            >
              Cambiar
            </Button>
          )}
        </Box>
      )}

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          borderColor: 'rgba(255,255,255,0.2)',
          display: { xs: 'none', sm: 'block' },
        }}
      />

      {/* Reloj */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: 1,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 20, color: '#c9a96e' }} />
        <Box sx={{ lineHeight: 1.1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {horaFormateada}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>
            {fechaFormateada}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderPOS;
