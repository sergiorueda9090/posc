import { useState, useEffect, useMemo } from 'react';
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
  useMediaQuery,
  useTheme,
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import { createThunks, updateThunks, addProductToComboThunk, removeProductFromComboThunk, updateProductInComboThunk } from '../../store/comboStore/comboThunks';
import { ProductoSelector } from './ProductoSelector';

export const ComboForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id, nombre, activo, productos, precio_total, combos } = useSelector(state => state.comboStore);

  const [formData, setFormData] = useState({
    nombre: '',
    activo: true,
  });

  const [openProductoSelector, setOpenProductoSelector] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);

  // Obtener nombres únicos de combos existentes para el autocomplete
  const nombresExistentes = useMemo(() => {
    // Verificar que combos sea un array válido
    if (!combos || !Array.isArray(combos) || combos.length === 0) return [];
    // Extraer nombres únicos y filtrar el combo actual si está en modo edición
    const nombres = combos
      .filter(combo => !id || combo.id !== id) // Excluir el combo actual en edición
      .map(combo => combo.nombre)
      .filter(Boolean); // Filtrar valores vacíos
    // Eliminar duplicados
    return [...new Set(nombres)];
  }, [combos, id]);

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        pt: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Información del Combo */}
      <Autocomplete
        freeSolo
        options={nombresExistentes}
        value={formData.nombre}
        onChange={(event, newValue) => {
          setFormData({
            ...formData,
            nombre: newValue || '',
          });
        }}
        onInputChange={(event, newInputValue) => {
          setFormData({
            ...formData,
            nombre: newInputValue || '',
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Nombre del Combo"
            name="nombre"
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
        sx={{
          mb: 3,
          '& .MuiFormControlLabel-label': {
            fontSize: { xs: '0.9rem', sm: '1rem' },
          },
        }}
      />

      {/* Productos en el Combo */}
      {id && (
        <>
          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                fontWeight: 600,
              }}
            >
              Productos del Combo
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddProducto}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.85rem', sm: '0.875rem' },
              }}
            >
              Agregar Producto
            </Button>
          </Box>

          {productos.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                py: 3,
                fontSize: { xs: '0.85rem', sm: '0.875rem' },
              }}
            >
              No hay productos en este combo
            </Typography>
          ) : (
            <>
              <List
                sx={{
                  '& .MuiListItem-root': {
                    px: { xs: 0, sm: 2 },
                    py: { xs: 1.5, sm: 1 },
                  },
                }}
              >
                {productos.map((producto) => (
                  <ListItem
                    key={producto.id}
                    sx={{
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      gap: { xs: 2, sm: 0 },
                      borderBottom: '1px solid #f0f0f0',
                    }}
                    secondaryAction={
                      <Box
                        sx={{
                          display: 'flex',
                          gap: { xs: 1, sm: 0 },
                          width: { xs: '100%', sm: 'auto' },
                          justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                        }}
                      >
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditProducto(producto)}
                          sx={{
                            mr: { xs: 0, sm: 1 },
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveProducto(producto.id)}
                          sx={{
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={producto.producto_nombre}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}
                          >
                            Cantidad: {producto.cantidad} x ${producto.precio_combo.toFixed(2)}
                          </Typography>
                          {' — '}
                          <Typography
                            component="span"
                            variant="body2"
                            color="primary"
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              fontWeight: 600,
                            }}
                          >
                            Subtotal: ${producto.subtotal.toFixed(2)}
                          </Typography>
                        </>
                      }
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: { xs: 1.5, sm: 2 },
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 700,
                    color: '#1976d2',
                  }}
                >
                  Precio Total: ${precio_total.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </>
      )}

      {/* Botones */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-end',
          gap: 2,
          mt: 3,
        }}
      >
        <Button
          onClick={onClose}
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
          {id ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>

      {/* Selector de Productos */}
      <Dialog
        open={openProductoSelector}
        onClose={() => setOpenProductoSelector(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '80vh' },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid #e0e0e0',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
          }}
        >
          {editingProducto ? 'Editar Producto' : 'Agregar Producto'}
          <IconButton
            aria-label="close"
            onClick={() => setOpenProductoSelector(false)}
            sx={{
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: { xs: 2, sm: 3 },
          }}
        >
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
