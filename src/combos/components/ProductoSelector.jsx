import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';

import { getAllThunks as getAllProductosThunks } from '../../store/productoStore/productoThunks';

export const ProductoSelector = ({ editingProducto, onSelect, onCancel }) => {
  const dispatch = useDispatch();
  const { productos } = useSelector(state => state.productoStore);

  const [formData, setFormData] = useState({
    producto_id: '',
    precio_combo: '',
    cantidad: 1,
  });

  const [selectedProducto, setSelectedProducto] = useState(null);

  // Preparar las opciones de productos para el Autocomplete
  const productosOptions = useMemo(() => {
    if (!productos?.results || !Array.isArray(productos.results)) return [];
    return productos.results;
  }, [productos]);

  useEffect(() => {
    dispatch(getAllProductosThunks({ pageSize: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (editingProducto && productosOptions.length > 0) {
      const producto = productosOptions.find(p => p.id === editingProducto.producto_id);
      setSelectedProducto(producto || null);
      setFormData({
        producto_id: editingProducto.producto_id,
        precio_combo: editingProducto.precio_combo,
        cantidad: editingProducto.cantidad,
      });
    }
  }, [editingProducto, productosOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductoChange = (event, newValue) => {
    setSelectedProducto(newValue);
    if (newValue) {
      setFormData({
        ...formData,
        producto_id: newValue.id,
        precio_combo: newValue.precio_final,
      });
    } else {
      setFormData({
        ...formData,
        producto_id: '',
        precio_combo: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSelect(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        pt: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Autocomplete
        fullWidth
        options={productosOptions}
        value={selectedProducto}
        onChange={handleProductoChange}
        disabled={!!editingProducto}
        getOptionLabel={(option) => option.nombre || ''}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nombre} - ${option.precio_final}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Producto"
            required
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        type="number"
        label="Precio Especial en Combo"
        name="precio_combo"
        value={formData.precio_combo}
        onChange={handleChange}
        required
        inputProps={{ step: '0.01', min: '0' }}
        sx={{
          mb: 2,
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
        }}
      />

      <TextField
        fullWidth
        type="number"
        label="Cantidad"
        name="cantidad"
        value={formData.cantidad}
        onChange={handleChange}
        required
        inputProps={{ min: '1' }}
        sx={{
          mb: 3,
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.85rem', sm: '0.875rem' },
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.85rem', sm: '0.875rem' },
            boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
            '&:hover': {
              boxShadow: '0 6px 10px rgba(25, 118, 210, 0.35)',
            },
          }}
        >
          {editingProducto ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );
};
