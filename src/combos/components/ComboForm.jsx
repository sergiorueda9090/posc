import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { createThunks, updateThunks, addProductToComboThunk, removeProductFromComboThunk, updateProductInComboThunk } from '../../store/comboStore/comboThunks';
import { ProductoSelector } from './ProductoSelector';

export const ComboForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { id, nombre, activo, productos, precio_total } = useSelector(state => state.comboStore);

  const [formData, setFormData] = useState({
    nombre: '',
    activo: true,
  });

  const [openProductoSelector, setOpenProductoSelector] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);

  useEffect(() => {
    if (id) {
      setFormData({
        nombre: nombre || '',
        activo: activo !== undefined ? activo : true,
      });
    }
  }, [id, nombre, activo]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      dispatch(updateThunks({ ...formData, id }));
    } else {
      dispatch(createThunks(formData));
    }
  };

  const handleAddProducto = () => {
    setEditingProducto(null);
    setOpenProductoSelector(true);
  };

  const handleEditProducto = (producto) => {
    setEditingProducto(producto);
    setOpenProductoSelector(true);
  };

  const handleRemoveProducto = (productoId) => {
    if (id) {
      dispatch(removeProductFromComboThunk(id, productoId));
    }
  };

  const handleProductoSelected = (productoData) => {
    if (id) {
      if (editingProducto) {
        // Actualizar producto existente
        dispatch(updateProductInComboThunk(id, editingProducto.id, productoData));
      } else {
        // Agregar nuevo producto
        dispatch(addProductToComboThunk(id, productoData));
      }
    }
    setOpenProductoSelector(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      {/* Información del Combo */}
      <TextField
        fullWidth
        label="Nombre del Combo"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
          />
        }
        label="Combo Activo"
        sx={{ mb: 3 }}
      />

      {/* Productos en el Combo */}
      {id && (
        <>
          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Productos del Combo
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddProducto}
            >
              Agregar Producto
            </Button>
          </Box>

          {productos.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No hay productos en este combo
            </Typography>
          ) : (
            <>
              <List>
                {productos.map((producto) => (
                  <ListItem
                    key={producto.id}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditProducto(producto)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveProducto(producto.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={producto.producto_nombre}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Cantidad: {producto.cantidad} x ${producto.precio_combo.toFixed(2)}
                          </Typography>
                          {' — '}
                          <Typography component="span" variant="body2" color="primary">
                            Subtotal: ${producto.subtotal.toFixed(2)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="h6">
                  Precio Total: ${precio_total.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </>
      )}

      {/* Botones */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained">
          {id ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>

      {/* Selector de Productos */}
      <Dialog
        open={openProductoSelector}
        onClose={() => setOpenProductoSelector(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProducto ? 'Editar Producto' : 'Agregar Producto'}
        </DialogTitle>
        <DialogContent>
          <ProductoSelector
            editingProducto={editingProducto}
            onSelect={handleProductoSelected}
            onCancel={() => setOpenProductoSelector(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
