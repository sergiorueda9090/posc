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
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }} required>
        <InputLabel>Producto</InputLabel>
        <Select
          name="producto_id"
          value={formData.producto_id}
          label="Producto"
          onChange={handleChange}
          disabled={!!editingProducto}
        >
          {productos?.results?.map((producto) => (
            <MenuItem key={producto.id} value={producto.id}>
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
        sx={{ mb: 2 }}
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
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          {editingProducto ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );
};
