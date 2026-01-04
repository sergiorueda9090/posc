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
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        },
        border: '1px solid #f0f0f0',
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'start', sm: 'start' },
            gap: { xs: 1, sm: 0 },
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              fontWeight: 600,
              color: '#2c3e50',
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}
          >
            {combo.nombre}
          </Typography>
          <Chip
            label={combo.activo ? 'Activo' : 'Inactivo'}
            color={combo.activo ? 'success' : 'default'}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 1.5,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
          }}
        >
          <LocalOfferIcon
            color="primary"
            sx={{ fontSize: { xs: 24, sm: 28 } }}
          />
          <Typography
            variant="h5"
            color="primary"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              fontWeight: 700,
            }}
          >
            ${combo.precio_total.toFixed(2)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            fontSize: { xs: '0.875rem', sm: '0.9rem' },
            fontWeight: 500,
          }}
        >
          {combo.num_productos} producto{combo.num_productos !== 1 ? 's' : ''}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mt: 1,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        >
          Creado por: {combo.creado_por}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: 'flex-end',
          p: { xs: 1.5, sm: 2 },
          backgroundColor: '#fafafa',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(combo.id)}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(combo.id)}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
            },
          }}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};
