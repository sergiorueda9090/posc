import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Tooltip, Chip, Box, Paper } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, getAllThunks, handleFormStoreThunk } from '../../store/productoStore/productoThunks';
import { showAlert } from '../../store/globalStore/globalStore';
import { SearchQuery } from './SearchQuery';
import { DateRange } from './DateRange';
import { FormDialogModal } from '../../inventarioProducto/components/FormDialogModal';
import { showThunk as showCantidadProducto } from '../../store/inventarioProductoStore/inventarioProductoStoreThunks';

const formatCurrency = (value) => {
  if (value == null) return '';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

export function DataTable() {

  const dispatch = useDispatch();
  const { productos } = useSelector(state => state.productoStore);

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  React.useEffect(() => {
    dispatch(getAllThunks({ page: page + 1, pageSize }));
  }, [dispatch, page, pageSize]);

  const handleOpenModalCantidad = (id) => {
    dispatch(handleFormStoreThunk({ name: 'id', value: id }));
    dispatch(showCantidadProducto(id));
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'imagen_url',
      headerName: 'Img',
      width: 80,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        params.value ? (
          <img
            src={params.value}
            alt=""
            style={{
              width: 42,
              height: 42,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
            }}
          />
        ) : (
          <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#bbb' }}>
            N/A
          </Box>
        )
      ),
    },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 160 },
    { field: 'categoria', headerName: 'Categoria', width: 150 },
    { field: 'subcategoria', headerName: 'Subcategoria', width: 150 },
    { field: 'proveedor', headerName: 'Proveedor', width: 150 },
    {
      field: 'genero',
      headerName: 'Genero',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const map = { 'M': { label: 'Masc', color: 'primary' }, 'F': { label: 'Fem', color: 'secondary' }, 'U': { label: 'Uni', color: 'default' } };
        const info = map[params.value] || { label: params.value || '-', color: 'default' };
        return <Chip label={info.label} color={info.color} size="small" variant="outlined" />;
      }
    },
    {
      field: 'precio_compra',
      headerName: 'P. Compra',
      width: 130,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'precio_final',
      headerName: 'P. Final',
      width: 130,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <strong>{formatCurrency(params.value)}</strong>
      ),
    },
    {
      field: 'porcentaje_ganancia',
      headerName: '% Ganancia',
      width: 110,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const val = parseFloat(params.value);
        if (isNaN(val)) return '-';
        return (
          <Chip
            label={`${val.toFixed(1)}%`}
            size="small"
            sx={{
              bgcolor: val >= 50 ? '#e8f5e9' : val >= 20 ? '#fff8e1' : '#ffebee',
              color: val >= 50 ? '#2e7d32' : val >= 20 ? '#f57f17' : '#c62828',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      }
    },
    {
      field: 'cantidad',
      headerName: 'Stock',
      width: 90,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const qty = params.value || 0;
        return (
          <Chip
            label={qty}
            size="small"
            sx={{
              bgcolor: qty > 10 ? '#e8f5e9' : qty > 0 ? '#fff8e1' : '#ffebee',
              color: qty > 10 ? '#2e7d32' : qty > 0 ? '#e65100' : '#c62828',
              fontWeight: 700,
              minWidth: 40,
            }}
          />
        );
      }
    },
    { field: 'codigo_busqueda', headerName: 'Codigo', width: 140 },
    {
      field: 'unidad_medida',
      headerName: 'Unidad',
      width: 90,
      headerAlign: 'center',
      align: 'center',
    },
    { field: 'creado_por', headerName: 'Creado por', width: 130 },
    {
      field: 'created_at',
      headerName: 'Fecha',
      width: 160,
      valueFormatter: (params) => {
        if (!params) return '';
        const date = new Date(params);
        return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar" arrow>
            <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" arrow>
            <IconButton size="small" onClick={() => handleDelete(params.row.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar cantidad" arrow>
            <IconButton size="small" onClick={() => handleOpenModalCantidad(params.row.id)} sx={{ color: '#c9a96e' }}>
              <ConfirmationNumberIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleDelete = (id) => {
    dispatch(
      showAlert({
        type: "warning",
        title: "Confirmar eliminacion",
        text: "Estas seguro de que deseas eliminar este producto?",
        confirmText: "Si, eliminar",
        cancelText: "Cancelar",
        showCancel: true,
        action: () => confirmDelete(id),
      })
    );
  };

  const confirmDelete = (id) => {
    dispatch(deleteThunk(id));
  };

  const handleEdit = (row) => {
    dispatch(showThunk(row.id));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Filtros */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: 1.5,
        p: 2,
        borderBottom: '1px solid #f0f0f0',
        bgcolor: '#fafafa',
        flexShrink: 0,
      }}>
        <SearchQuery />
        <DateRange />
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={productos?.results || []}
        columns={columns}
        paginationMode="server"
        rowCount={productos?.count || 0}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        pagination
        pageSizeOptions={[20, 50, 100]}
        rowHeight={52}
        disableRowSelectionOnClick
        sx={{
          border: 0,
          flexGrow: 1,
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#f8f9fa',
            borderBottom: '2px solid #e0e0e0',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#555',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
          },
          '& .MuiDataGrid-cell': {
            fontSize: '0.85rem',
            borderBottom: '1px solid #f5f5f5',
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: '#f5f8ff',
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            bgcolor: '#fafafa',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '2px solid #e0e0e0',
            bgcolor: '#f8f9fa',
          },
          '& .MuiDataGrid-virtualScroller': {
            overflow: 'auto',
          },
        }}
      />
      <FormDialogModal />
    </Paper>
  );
}
