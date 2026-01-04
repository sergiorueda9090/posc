import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
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

  useEffect(() => {
    dispatch(getAllProductosThunks({ pageSize: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (editingProducto) {
      setFormData({
        producto_id: editingProducto.producto_id,
        precio_combo: editingProducto.precio_combo,
        cantidad: editingProducto.cantidad,
      });
    }
  }, [editingProducto]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si selecciona un producto, auto-llenar con precio_final
    if (name === 'producto_id') {
      const producto = productos.results?.find(p => p.id === value);
      setFormData({
        ...formData,
        [name]: value,
        precio_combo: producto ? producto.precio_final : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
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
      <FormControl
        fullWidth
        sx={{
          mb: 2,
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
        }}
        required
      >
        <InputLabel>Producto</InputLabel>
        <Select
          name="producto_id"
          value={formData.producto_id}
          label="Producto"
          onChange={handleChange}
          disabled={!!editingProducto}
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          {productos?.results?.map((producto) => (
            <MenuItem
              key={producto.id}
              value={producto.id}
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.875rem' },
              }}
            >
              {producto.nombre} - ${producto.precio_final}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
