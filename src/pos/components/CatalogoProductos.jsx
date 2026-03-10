import React, { useState, useMemo } from 'react';
import {
  Grid, Box, Typography, TextField, Card, CardContent, CardMedia,
  InputAdornment, Chip
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BlockIcon from '@mui/icons-material/Block';
import { formatCurrency } from '../constants/formatCurrency';
import { ProductosData } from '../data/ProductosData';

export const CatalogoProductos = ({ addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const productos = ProductosData();

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return productos;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return productos.filter((product) =>
      product.nombre?.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm, productos]);

  // 🔥 Función para manejar el click
  const handleProductClick = (product) => {
    if (product.cantidad > 0) {
      // Pasar el producto con su cantidad máxima disponible explícita
      addToCart({
        ...product,
        cantidadMaxima: product.cantidad // 🔥 Cantidad máxima disponible en inventario
      });
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        height: { xs: '100%', lg: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1e272e',
        color: 'white',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        🛍️ Catálogo de Productos
      </Typography>

      {/* 🔍 Buscador */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar producto..."
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

      {/* 🧩 Listado de productos */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        <Grid container spacing={2}>
          {filteredProducts.map((product) => {
            const sinStock = !product.cantidad || product.cantidad === 0;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    cursor: sinStock ? 'not-allowed' : 'pointer', // 🔥 Cursor diferente
                    height: '100%',
                    bgcolor: sinStock ? '#e0e0e0' : '#f9f9f9', // 🔥 Fondo gris si no hay stock
                    borderRadius: 3,
                    overflow: 'hidden',
                    opacity: sinStock ? 0.6 : 1, // 🔥 Opacidad reducida
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                    '&:hover': sinStock ? {} : { // 🔥 No hover si no hay stock
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    },
                    position: 'relative', // 🔥 Para el overlay
                  }}
                  onClick={() => handleProductClick(product)} // 🔥 Click controlado
                >
                  {/* 🚫 Overlay cuando no hay stock */}
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

                  {/* 🖼️ Imagen mejorada */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 200,
                      bgcolor: '#ecf0f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.imagen_url ||
                        'https://cdn-icons-png.flaticon.com/512/1162/1162455.png'
                      }
                      alt={product.nombre || 'Producto sin imagen'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://cdn-icons-png.flaticon.com/512/1162/1162455.png';
                      }}
                      sx={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                        p: 2,
                        backgroundColor: '#fff',
                      }}
                    />
                  </Box>

                  {/* 💬 Contenido */}
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: sinStock ? '#7f8c8d' : '#2c3e50', // 🔥 Color diferente
                        lineHeight: 1.2,
                        mb: 1,
                      }}
                    >
                      {product.nombre}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        color: sinStock ? '#95a5a6' : '#16a085', // 🔥 Color diferente
                        fontWeight: 800,
                        fontSize: '1.4rem',
                        mb: 1,
                      }}
                    >
                      {formatCurrency(product.precio_final)}
                    </Typography>

                    {/* 🧾 Unidades disponibles */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: sinStock
                          ? 'rgba(192, 57, 43, 0.15)' // 🔥 Rojo si no hay stock
                          : product.cantidad > 0
                          ? 'rgba(39, 174, 96, 0.1)'
                          : 'rgba(192, 57, 43, 0.1)',
                      }}
                    >
                      <Inventory2OutlinedIcon
                        sx={{
                          color: sinStock
                            ? '#c0392b'
                            : product.cantidad > 0
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
                        Unidades:
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 'auto',
                          fontWeight: 800,
                          color: sinStock
                            ? '#c0392b'
                            : product.cantidad > 0
                            ? '#27ae60'
                            : '#c0392b',
                        }}
                      >
                        {product.cantidad ?? 0}
                      </Typography>
                    </Box>

                    {/* 🔥 Badge de "Sin Stock" adicional */}
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
      </Box>
    </Box>
  );
};