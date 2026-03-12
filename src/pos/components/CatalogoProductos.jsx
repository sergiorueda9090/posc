import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid, Box, Typography, TextField, Card, CardContent, CardMedia,
  InputAdornment, Chip, Pagination
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BlockIcon from '@mui/icons-material/Block';
import { formatCurrency } from '../constants/formatCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { getAllThunks } from '../../store/productoStore/productoThunks';

const PAGE_SIZE = 30;

export const CatalogoProductos = ({ addToCart }) => {
  const dispatch = useDispatch();
  const { productos } = useSelector((state) => state.productoStore);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounce de la busqueda (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch desde el backend
  useEffect(() => {
    dispatch(getAllThunks({ page, pageSize: PAGE_SIZE, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const results = productos?.results || [];
  const totalCount = productos?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = useCallback((_, value) => {
    setPage(value);
  }, []);

  const handleProductClick = (product) => {
    if (product.cantidad > 0) {
      addToCart({
        ...product,
        cantidadMaxima: product.cantidad
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
        Catalogo de Productos
      </Typography>

      {/* Buscador */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar producto por nombre, codigo o categoria..."
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
        sx={{ mb: 2 }}
      />

      {/* Paginacion debajo del buscador */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, gap: 2 }}>
          <Chip
            label={`${totalCount} productos`}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 600 }}
          />
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '& .Mui-selected': {
                bgcolor: '#c9a96e !important',
                color: '#1a1a2e',
                fontWeight: 700,
              },
            }}
          />
        </Box>
      )}

      {/* Listado de productos */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
        <Grid container spacing={2}>
          {results.map((product) => {
            const sinStock = !product.cantidad || product.cantidad === 0;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                  onClick={() => handleProductClick(product)}
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

                  {/* Imagen */}
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
                      {product.nombre}
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
                      {formatCurrency(product.precio_final)}
                    </Typography>

                    {/* Unidades disponibles */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: sinStock
                          ? 'rgba(192, 57, 43, 0.15)'
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
      </Box>
    </Box>
  );
};
