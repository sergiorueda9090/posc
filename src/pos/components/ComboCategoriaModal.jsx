import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, IconButton, CircularProgress,
  Card, CardContent, Grid, Chip, TextField, InputAdornment, Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { URL } from '../../constants/constantGlogal.js';
import { formatCurrency } from '../constants/formatCurrency';

export const ComboCategoriaModal = ({ open, combo, onConfirm, onClose }) => {
  const categoriaItems = combo?.productos?.filter(p => p.categoria_id && !p.producto_id) || [];

  // Estado: { [categoria_id]: { productos: [], loading, selected: [], search, ... } }
  const [categoriaState, setCategoriaState] = useState({});
  const { token } = useSelector(state => state.authStore);

  useEffect(() => {
    if (!open || categoriaItems.length === 0) return;

    const initial = {};
    categoriaItems.forEach(item => {
      initial[item.categoria_id] = {
        productos: [],
        loading: true,
        selected: [],
        search: '',
        categoria_nombre: item.categoria_nombre,
        precio_combo: item.precio_combo,
        cantidad: item.cantidad,
      };
    });
    setCategoriaState(initial);

    categoriaItems.forEach(async (item) => {
      try {
        const response = await axios.get(
          `${URL}/api/products/list/?categoria_id=${item.categoria_id}&page_size=1000`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const productos = (response.data?.results || []).filter(p => p.cantidad > 0);
        setCategoriaState(prev => ({
          ...prev,
          [item.categoria_id]: {
            ...prev[item.categoria_id],
            productos,
            loading: false,
          },
        }));
      } catch {
        setCategoriaState(prev => ({
          ...prev,
          [item.categoria_id]: {
            ...prev[item.categoria_id],
            productos: [],
            loading: false,
          },
        }));
      }
    });
  }, [open, combo?.id]);

  const handleToggleProduct = (categoriaId, producto) => {
    setCategoriaState(prev => {
      const current = prev[categoriaId].selected;
      const exists = current.find(p => p.id === producto.id);
      return {
        ...prev,
        [categoriaId]: {
          ...prev[categoriaId],
          selected: exists
            ? current.filter(p => p.id !== producto.id)
            : [...current, producto],
        },
      };
    });
  };

  const handleRemoveSelected = (categoriaId, productoId) => {
    setCategoriaState(prev => ({
      ...prev,
      [categoriaId]: {
        ...prev[categoriaId],
        selected: prev[categoriaId].selected.filter(p => p.id !== productoId),
      },
    }));
  };

  const handleSearchChange = (categoriaId, value) => {
    setCategoriaState(prev => ({
      ...prev,
      [categoriaId]: { ...prev[categoriaId], search: value },
    }));
  };

  // Al menos 1 producto seleccionado en cada categoría
  const allHaveSelection = categoriaItems.every(
    item => categoriaState[item.categoria_id]?.selected?.length > 0
  );

  // Total de productos seleccionados en todas las categorías
  const totalSeleccionados = Object.values(categoriaState).reduce(
    (sum, s) => sum + (s.selected?.length || 0), 0
  );

  const handleConfirm = () => {
    if (!allHaveSelection) return;

    // Construir array de productos seleccionados con info de categoría
    const productosSeleccionados = [];
    categoriaItems.forEach(item => {
      const state = categoriaState[item.categoria_id];
      state.selected.forEach(prod => {
        productosSeleccionados.push({
          producto_id: prod.id,
          producto_nombre: prod.nombre,
          precio_combo: item.precio_combo,
          cantidad: item.cantidad,
          stock_disponible: prod.cantidad,
          categoria_id: item.categoria_id,
          categoria_nombre: item.categoria_nombre,
        });
      });
    });

    // Mantener los productos individuales del combo original
    const productosOriginales = combo.productos.filter(p => p.producto_id && !p.categoria_id);

    const comboResuelto = {
      ...combo,
      productos: [...productosOriginales, ...productosSeleccionados],
      productosSeleccionados,
      isCombo: true,
      cantidadMaxima: combo.cantidadMaxima,
      precio_final: combo.precio_total,
    };

    onConfirm(comboResuelto);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#1e272e',
          color: 'white',
          py: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Seleccionar productos del combo
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {combo?.nombre} - {formatCurrency(combo?.precio_total || 0)}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {categoriaItems.map((item) => {
          const state = categoriaState[item.categoria_id];
          if (!state) return null;

          const filteredProducts = state.search
            ? state.productos.filter(p => p.nombre.toLowerCase().includes(state.search.toLowerCase()))
            : state.productos;

          return (
            <Box key={item.categoria_id} sx={{ mb: 4 }}>
              {/* Header de categoría */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1.5,
                  p: 1.5,
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                  borderLeft: '4px solid #16a085',
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                    {item.categoria_nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cantidad: {item.cantidad} &mdash; Precio combo: {formatCurrency(item.precio_combo)}
                  </Typography>
                </Box>
                {state.selected.length > 0 ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${state.selected.length} seleccionado${state.selected.length > 1 ? 's' : ''}`}
                    color="success"
                    variant="filled"
                    size="small"
                  />
                ) : (
                  <Chip label="Seleccione al menos un producto" color="warning" variant="outlined" size="small" />
                )}
              </Box>

              {/* Chips de productos seleccionados */}
              {state.selected.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                  {state.selected.map(prod => (
                    <Chip
                      key={prod.id}
                      label={prod.nombre}
                      size="small"
                      color="primary"
                      variant="outlined"
                      onDelete={() => handleRemoveSelected(item.categoria_id, prod.id)}
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
                </Box>
              )}

              {/* Buscador */}
              <TextField
                fullWidth
                size="small"
                placeholder={`Buscar en ${item.categoria_nombre}...`}
                value={state.search}
                onChange={(e) => handleSearchChange(item.categoria_id, e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {/* Lista de productos */}
              {state.loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : filteredProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No hay productos con stock en esta categoría
                </Typography>
              ) : (
                <Grid container spacing={1} sx={{ maxHeight: 250, overflowY: 'auto', pr: 1 }}>
                  {filteredProducts.map((producto) => {
                    const isSelected = state.selected.some(p => p.id === producto.id);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={producto.id}>
                        <Card
                          onClick={() => handleToggleProduct(item.categoria_id, producto)}
                          sx={{
                            cursor: 'pointer',
                            border: isSelected ? '2px solid #16a085' : '1px solid #e0e0e0',
                            bgcolor: isSelected ? 'rgba(22, 160, 133, 0.08)' : '#fff',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#16a085',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isSelected ? 700 : 500,
                                  color: '#2c3e50',
                                  fontSize: '0.85rem',
                                  flexGrow: 1,
                                }}
                              >
                                {producto.nombre}
                              </Typography>
                              {isSelected && <CheckCircleIcon sx={{ color: '#16a085', fontSize: 20, ml: 0.5 }} />}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#16a085', fontWeight: 700 }}>
                                {formatCurrency(producto.precio_final)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                <Inventory2OutlinedIcon sx={{ fontSize: 14, color: '#27ae60' }} />
                                <Typography variant="caption" sx={{ color: '#27ae60', fontWeight: 600 }}>
                                  {producto.cantidad}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          );
        })}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: '#555', pl: 1 }}>
          {totalSeleccionados} producto{totalSeleccionados !== 1 ? 's' : ''} seleccionado{totalSeleccionados !== 1 ? 's' : ''}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} sx={{ color: '#7f8c8d' }}>
            Cancelar
          </Button>
          <Badge badgeContent={totalSeleccionados} color="success">
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={!allHaveSelection}
              startIcon={<ShoppingCartIcon />}
              sx={{
                bgcolor: '#16a085',
                '&:hover': { bgcolor: '#1abc9c' },
                fontWeight: 700,
                px: 3,
              }}
            >
              Agregar todos al Carrito
            </Button>
          </Badge>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
