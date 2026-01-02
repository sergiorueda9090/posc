import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { ComboCard } from '../components/ComboCard';
import { ComboForm } from '../components/ComboForm';
import { getAllThunks, deleteThunk, showThunk, resetFormularioThunk } from '../../store/comboStore/comboThunks';
import { openModalShared, closeModalShared } from '../../store/globalStore/globalStore';

export const MainView = () => {
  const dispatch = useDispatch();
  const { combos } = useSelector(state => state.comboStore);
  const { openModalStore } = useSelector(state => state.globalStore);

  const [search, setSearch] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('');
  const [page] = useState(1);

  useEffect(() => {
    dispatch(getAllThunks({ page, search, activo: filtroActivo }));
  }, [dispatch, page, search, filtroActivo]);

  const handleOpenModal = () => {
    dispatch(resetFormularioThunk());
    dispatch(openModalShared());
  };

  const handleCloseModal = () => {
    dispatch(closeModalShared());
  };

  const handleEdit = (id) => {
    dispatch(showThunk(id));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este combo?')) {
      dispatch(deleteThunk(id));
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, mt:5 }}>
        <Typography variant="h4" component="h1">
          Gestión de Combos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Crear Combo
        </Button>
      </Box>

      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar combo"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filtroActivo}
            label="Estado"
            onChange={(e) => setFiltroActivo(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Activos</MenuItem>
            <MenuItem value="false">Inactivos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grid de Combos */}
      <Grid container spacing={3}>
        {combos?.results?.map((combo) => (
          <Grid item xs={12} sm={6} md={4} key={combo.id}>
            <ComboCard
              combo={combo}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}

        {(!combos?.results || combos.results.length === 0) && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No hay combos disponibles
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Modal de Formulario */}
      <Dialog
        open={openModalStore}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {useSelector(state => state.comboStore.id) ? 'Editar Combo' : 'Crear Combo'}
        </DialogTitle>
        <DialogContent>
          <ComboForm onClose={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
