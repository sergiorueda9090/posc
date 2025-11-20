import React, { useState, useMemo } from 'react';
import {
  Grid, Box, Typography, TextField, Card, CardContent, CardMedia,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
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
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  bgcolor: '#f9f9f9',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  },
                }}
                onClick={() => addToCart(product)}
              >
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
                      color: '#2c3e50',
                      lineHeight: 1.2,
                      mb: 1,
                    }}
                  >
                    {product.nombre}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#16a085',
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
                      bgcolor:
                        product.cantidad > 0
                          ? 'rgba(39, 174, 96, 0.1)'
                          : 'rgba(192, 57, 43, 0.1)',
                    }}
                  >
                    <Inventory2OutlinedIcon
                      sx={{
                        color:
                          product.cantidad > 0 ? '#27ae60' : '#c0392b',
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#2c3e50',
                      }}
                    >
                      Unidades:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 'auto',
                        fontWeight: 800,
                        color:
                          product.cantidad > 0 ? '#27ae60' : '#c0392b',
                      }}
                    >
                      {product.cantidad ?? 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};