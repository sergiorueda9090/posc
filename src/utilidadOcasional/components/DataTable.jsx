import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, getAllThunks } from '../../store/utilidadOcasionalStore/utilidadOcasionalThunks';
import { Box } from "@mui/material";
import { showAlert } from '../../store/globalStore/globalStore';
import { SearchQuery } from './SearchQuery';
import { DateRange } from './DateRange';

export function DataTable() {

  const dispatch = useDispatch();

  const { utilidadesOcasionales } = useSelector(state => state.utilidadOcasionalStore);

  const [page,     setPage]     = React.useState(0);
  const [pageSize, setPageSize] = React.useState(30);

  React.useEffect(() => {
    dispatch(getAllThunks({ page: page + 1, pageSize }));
  }, [dispatch, page, pageSize]);

  const columns = [
    { field: 'id',                    headerName: 'ID',                   width: 60 },
    { field: 'tarjeta_id',            headerName: 'Tarjeta',                width: 180 },
    { field: 'valor',                 headerName: 'Valor',          width: 250,      
      renderCell: (params) => {
        const formattedValue =
          params.value == null
            ? ""
            : new Intl.NumberFormat("es-CO", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(params.value);

        return (
          <span style={{ width: "100%", textAlign: "left", display: "block" }}>
            {formattedValue}
          </span>
        );
      },
    },
    { field: 'descripcion',           headerName: 'Descripción',          width: 250 },
    { field: 'creado_por_username',   headerName: 'Creado por',           width: 180 },
    {
      field: 'created_at',
      headerName: 'Fecha de creación',
      width: 200,
      valueFormatter: (params) => {
        if (!params) return '';
        const date = new Date(params);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            onClick={() => handleEdit(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  //Confirmación para eliminar
  const handleDelete = (id) => {
    dispatch(
      showAlert({
        type: "warning",
        title: "Confirmar eliminación",
        text: "¿Estás seguro de que deseas eliminar este registro?",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        showCancel: true, //habilita el botón "Cancelar"
        action: () => confirmDelete(id), //acción si confirma
        cancelAction: () => console.log("Eliminación cancelada"), //acción si cancela (opcional)
      })
    );
  };

  const confirmDelete = (id) => {
    dispatch(deleteThunk(id));
    dispatch(getAllThunks({ page: page + 1, pageSize }));
  };

  const handleEdit = (row) => {
    dispatch(showThunk(row.id));
  };

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <SearchQuery />
        <DateRange   />
      </Box>

      <DataGrid
      rows={utilidadesOcasionales?.results || []}
      columns={columns}
      paginationMode="server"
      rowCount={utilidadesOcasionales?.count || 0} // total de registros desde el backend

      paginationModel={{
        page: page,
        pageSize: pageSize,
      }}
      onPaginationModelChange={(model) => {
        setPage(model.page);
        setPageSize(model.pageSize);
      }}

      pagination
      pageSizeOptions={[5, 10, 20]}
      sx={{
        border: 0,
        "& .even-row": { backgroundColor: "#f5f5f5" },
        "& .odd-row": { backgroundColor: "#ffffff" },
      }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
      }
    />
    </Box>
  );
}