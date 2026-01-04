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
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { ComboCard } from '../components/ComboCard';
import { ComboForm } from '../components/ComboForm';
import { getAllThunks, deleteThunk, showThunk, resetFormularioThunk } from '../../store/comboStore/comboThunks';
import { openModalShared, closeModalShared } from '../../store/globalStore/globalStore';
import { SimpleBackdrop } from '../../components/Backdrop/BackDrop';

export const MainView = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { combos, id } = useSelector(state => state.comboStore);
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
    <Box sx={{
      width: '100%',
    }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 4,
          mt: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
            fontWeight: 600,
            color: '#1976d2',
          }}
        >
          Gestión de Combos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            py: 1.2,
            px: 3,
            boxShadow: '0 4px 6px rgba(25, 118, 210, 0.25)',
            '&:hover': {
              boxShadow: '0 6px 10px rgba(25, 118, 210, 0.35)',
            },
          }}
        >
          Crear Combo
        </Button>
      </Box>

      {/* Filtros */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <TextField
          label="Buscar combo"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
            }
          }}
        />

        <FormControl
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 200 },
          }}
        >
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
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: { xs: 0, sm: 2 },
            maxHeight: { xs: '100%', sm: '90vh' },
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
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 600,
          }}
        >
          {id ? 'Editar Combo' : 'Crear Combo'}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
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
          <ComboForm onClose={handleCloseModal} />
        </DialogContent>
      </Dialog>

      {/* Loading Backdrop */}
      <SimpleBackdrop />
    </Box>
  );
};
