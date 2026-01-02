import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export const ComboCard = ({ combo, onEdit, onDelete }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {combo.nombre}
          </Typography>
          <Chip
            label={combo.activo ? 'Activo' : 'Inactivo'}
            color={combo.activo ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LocalOfferIcon color="primary" />
          <Typography variant="h5" color="primary">
            ${combo.precio_total.toFixed(2)}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {combo.num_productos} producto{combo.num_productos !== 1 ? 's' : ''}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Creado por: {combo.creado_por}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(combo.id)}
        >
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(combo.id)}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};
