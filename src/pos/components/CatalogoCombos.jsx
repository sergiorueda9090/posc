import React, { useState, useMemo } from 'react';
import {
  Grid, Box, Typography, TextField, Card, CardContent,
  InputAdornment, Chip, List, ListItem, ListItemText
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BlockIcon from '@mui/icons-material/Block';
import { formatCurrency } from '../constants/formatCurrency';
import { CombosData } from '../data/CombosData';

export const CatalogoCombos = ({ addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const combos = CombosData();

  const filteredCombos = useMemo(() => {
    if (!searchTerm) return combos;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return combos.filter((combo) =>
      combo.nombre?.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm, combos]);

  const handleComboClick = (combo) => {
    if (combo.cantidadMaxima > 0) {
      // Pasar el combo con todos los datos necesarios para el carrito
      addToCart({
        ...combo,
        isCombo: true,
        cantidadMaxima: combo.cantidadMaxima,
        precio_final: combo.precio_total, // Para consistencia con productos
      });
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1e272e',
        color: 'white',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        🎁 Catálogo de Combos
      </Typography>

      {/* Buscador */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar combo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'white' }} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: 'white',
          },
        }}
        sx={{ mb: 3 }}
      />

      {/* Listado de combos */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        <Grid container spacing={2}>
          {filteredCombos.map((combo) => {
            const sinStock = !combo.cantidadMaxima || combo.cantidadMaxima === 0;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={combo.id}>
                <Card
                  sx={{
                    cursor: sinStock ? 'not-allowed' : 'pointer',
                    height: '100%',
                    bgcolor: sinStock ? '#e0e0e0' : '#f9f9f9',
                    borderRadius: 3,
                    overflow: 'hidden',
                    opacity: sinStock ? 0.6 : 1,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                    '&:hover': sinStock ? {} : {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    },
                    position: 'relative',
                  }}
                  onClick={() => handleComboClick(combo)}
                >
                  {/* Overlay cuando no hay stock */}
                  {sinStock && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <BlockIcon sx={{ fontSize: 60, color: 'white', mb: 1 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          px: 2
                        }}
                      >
                        SIN STOCK
                      </Typography>
                    </Box>
                  )}

                  {/* Icono de combo */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 80,
                      bgcolor: '#ecf0f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalOfferIcon sx={{ fontSize: 60, color: '#16a085' }} />
                  </Box>

                  {/* Contenido */}
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: sinStock ? '#7f8c8d' : '#2c3e50',
                        lineHeight: 1.2,
                        mb: 1,
                      }}
                    >
                      {combo.nombre}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color: sinStock ? '#95a5a6' : '#16a085',
                        fontWeight: 800,
                        fontSize: '1.4rem',
                        mb: 1,
                      }}
                    >
                      {formatCurrency(combo.precio_total)}
                    </Typography>

                    {/* Lista de productos incluidos */}
                    <Box
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(52, 152, 219, 0.1)',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: '#2c3e50',
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        Incluye:
                      </Typography>
                      <List dense sx={{ p: 0 }}>
                        {combo.productos?.map((producto, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.2 }}>
                            <ListItemText
                              primary={`${producto.cantidad}x ${producto.producto_nombre}`}
                              primaryTypographyProps={{
                                variant: 'caption',
                                color: sinStock ? '#7f8c8d' : '#34495e',
                                fontWeight: 500,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* Stock disponible */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: sinStock
                          ? 'rgba(192, 57, 43, 0.15)'
                          : combo.cantidadMaxima > 0
                          ? 'rgba(39, 174, 96, 0.1)'
                          : 'rgba(192, 57, 43, 0.1)',
                      }}
                    >
                      <Inventory2OutlinedIcon
                        sx={{
                          color: sinStock
                            ? '#c0392b'
                            : combo.cantidadMaxima > 0
                            ? '#27ae60'
                            : '#c0392b',
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: sinStock ? '#7f8c8d' : '#2c3e50',
                        }}
                      >
                        Disponibles:
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 'auto',
                          fontWeight: 800,
                          color: sinStock
                            ? '#c0392b'
                            : combo.cantidadMaxima > 0
                            ? '#27ae60'
                            : '#c0392b',
                        }}
                      >
                        {combo.cantidadMaxima ?? 0}
                      </Typography>
                    </Box>

                    {/* Badge de "Sin Stock" */}
                    {sinStock && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label="Sin Stock Disponible"
                          color="error"
                          size="small"
                          icon={<BlockIcon />}
                          sx={{
                            width: '100%',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Mensaje cuando no hay combos */}
        {filteredCombos.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50vh',
            }}
          >
            <LocalOfferIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {searchTerm ? 'No se encontraron combos' : 'No hay combos disponibles'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
