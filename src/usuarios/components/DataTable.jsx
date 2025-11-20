import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, getAllThunks } from '../../store/usersStore/usersThunks';
import { toast } from 'react-toastify';
import { URL } from '../../constants/constantGlogal';
import { Box } from "@mui/material";
import { showAlert } from '../../store/globalStore/globalStore';
import { SearchQuery } from './SearchQuery';
import { DateRange } from './DateRange';

export function DataTable() {

  const dispatch = useDispatch();

  const { users } = useSelector(state => state.usersStore);
  const [page,     setPage]     = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);

  React.useEffect(() => {
    dispatch(getAllThunks({ page: page + 1, pageSize }));
  }, [dispatch, page, pageSize]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    {
      field: "image",
      headerName: "Image",
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params.row.image ? URL + params.row.image : "";
        const fullName = `${params.row.first_name || ""} ${params.row.last_name || ""}`.trim();
        return (
          <Avatar
            alt={fullName || "User Avatar"}
            src={imageUrl}
            sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "#2196f3" }}
          >
            {!imageUrl && fullName ? fullName[0] : ""}
          </Avatar>
        );
      },
    },
    { field: 'username',   headerName: 'UserName', width: 180 },
    { field: 'first_name', headerName: 'First name', width: 180 },
    { field: 'last_name',  headerName: 'Last name', width: 180 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 180,
      renderCell: (params) => {
        const roleMap = {
          admin: "Administrador",
          vendedor: "Vendedor",
          contador: "Contador",
          cliente: "Cliente"
        };

        const role = params.row.role;
        return <span>{roleMap[role] || "Desconocido"}</span>;
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
        text: "¿Estás seguro de que deseas eliminar este usuario?",
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

  const handleEdit = async (row) => {
    await dispatch(showThunk(row.id));
  };

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <SearchQuery modulo="usuarios" />
        <DateRange   modulo="usuarios" />
      </Box>

      <DataGrid
      rows={users?.results || []}
      columns={columns}
      paginationMode="server"
      rowCount={users?.count || 0} // total de registros desde el backend

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