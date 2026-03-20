import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';

import { getAllThunks as getAllCategoriasThunks } from '../../store/categoriaStore/categoriaThunks';

export const CategoriaSelector = ({ onSelect, onCancel }) => {
  const dispatch = useDispatch();
  const { categorias } = useSelector(state => state.categoriaStore);

  const [formData, setFormData] = useState({
    categoria_id: '',
    precio_combo: '',
    cantidad: 1,
  });

  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const categoriasOptions = useMemo(() => {
    if (!categorias?.results || !Array.isArray(categorias.results)) return [];
    return categorias.results;
  }, [categorias]);

  useEffect(() => {
    dispatch(getAllCategoriasThunks({ pageSize: 1000 }));
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoriaChange = (event, newValue) => {
    setSelectedCategoria(newValue);
    if (newValue) {
      setFormData({
        ...formData,
        categoria_id: newValue.id,
      });
    } else {
      setFormData({
        ...formData,
        categoria_id: '',
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
        options={categoriasOptions}
        value={selectedCategoria}
        onChange={handleCategoriaChange}
        getOptionLabel={(option) => option.nombre || ''}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nombre}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Categoría"
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
          Agregar
        </Button>
      </Box>
    </Box>
  );
};
