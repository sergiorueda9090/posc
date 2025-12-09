import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useSelector, useDispatch } from 'react-redux';
import { showThunk, deleteThunk, getAllThunks, handleFormStoreThunk } from '../../store/productoStore/productoThunks';
import { Box } from "@mui/material";
import { showAlert } from '../../store/globalStore/globalStore';
import { SearchQuery } from './SearchQuery';
import { DateRange } from './DateRange';
import { FormDialogModal} from '../../inventarioProducto/components/FormDialogModal';
import { showThunk as showCantidadProducto } from '../../store/inventarioProductoStore/inventarioProductoStoreThunks';

export function DataTable() {

  const dispatch = useDispatch();

  const { productos } = useSelector(state => state.productoStore);

  const [page,     setPage]     = React.useState(0);
  const [pageSize, setPageSize] = React.useState(30);

  React.useEffect(() => {
    dispatch(getAllThunks({ page: page + 1, pageSize }));
  }, [dispatch, page, pageSize]);

  const handleOpenModalCantidad = (id) => {
    dispatch(handleFormStoreThunk({ name: 'id', value: id }));
    dispatch(showCantidadProducto(id));
  }

  

  const columns = [
    { field: 'id',                     headerName: 'ID',                   width: 60 ,  headerAlign: 'right', align: 'right' },
    { field: 'categoria',              headerName: 'Categoria',            width: 220 , headerAlign: 'right', align: 'right' },
    { field: 'subcategoria',           headerName: 'Subcategoria',         width: 220 , headerAlign: 'right', align: 'right' },
    { field: 'proveedor',              headerName: 'Proveedor',            width: 220 , headerAlign: 'right', align: 'right' },
    { field: 'nombre',                 headerName: 'Nombre',               width: 220 , headerAlign: 'right', align: 'right' },
    { 
      field: 'unidad_medida', 
      headerName: 'Unidad de medida', 
      width: 180, 
      headerAlign: 'right', 
      align: 'right',
      valueGetter: (params) => {
        const unidadesMap = {
          'UND': 'Unidades (UND)',
          'GRS': 'Gramos (GRS)',
          'KGS': 'Kilogramos (KGS)'
        };
        return unidadesMap[params] || params;
      }
    },
    {
      field: 'genero', 
      headerName: 'Género', 
      width: 150,
      headerAlign: 'right',
      align: 'right',
      valueGetter: (params) => {
        const generoMap = {
          'M': 'Masculino',
          'F': 'Femenino',
          'U': 'Unisex'
        };
        return generoMap[params] || params;
      }
    },
    { field: 'descripcion',            headerName: 'Descripción',          width: 250 , headerAlign: 'right', align: 'right' },
    {
      field: 'precio_compra',
      headerName: 'Precio de compra',
      width: 220,
      renderCell: (params) => {
        const formattedValue =
          params.value == null
            ? ""
            : new Intl.NumberFormat("es-CO", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(params.value);

        return (
          <span style={{ width: "100%", textAlign: "right", display: "block" }}>
            {formattedValue}
          </span>
        );
      },
    },
    { field: 'porcentaje_ganancia',    headerName: 'Porcentaje ganancia',  width: 220 ,headerAlign: 'right', align: 'right'},
    { field: 'precio_final',           headerName: 'Precio Final',         width: 220,
      renderCell: (params) => {
        const formattedValue =
          params.value == null
            ? ""
            : new Intl.NumberFormat("es-CO", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(params.value);

        return (
          <span style={{ width: "100%", textAlign: "right", display: "block" }}>
            {formattedValue}
          </span>
        );
      },
     },
    { field: 'codigo_busqueda',        headerName: 'Código de búsqueda',   width: 220 ,headerAlign: 'right', align: 'right'},
    {
      field: 'imagen_url',
      headerName: 'Imagen',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params
          console.log(" === imageUrl === ",imageUrl)
        return (
          <img
            src={imageUrl}
            alt="Producto"
            style={{
              width: 60,
              height: 60,
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              border: '1px solid #eee',
            }}
          />
        );
      },
    },
    { field: 'cantidad',               headerName: 'Cantidad',             width: 100 ,headerAlign: 'right', align: 'right' },
    { field: 'creado_por',             headerName: 'Creado por',           width: 180 ,headerAlign: 'right', align: 'right'},
    {
      field: 'created_at',
      headerName: 'Fecha de creación',
      width: 200,
      headerAlign: 'right', align: 'right',
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
      filterable: false,
      disableColumnMenu: true,

      renderCell: (params) => (
        <>
          <Tooltip title="Editar producto" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => handleEdit(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar producto" arrow>
            <IconButton
              aria-label="delete"
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Agregar cantidad al producto" arrow>
            <IconButton
              aria-label="tickets"
              onClick={() => handleOpenModalCantidad(params.row.id)}
              color="secondary"
            >
              <ConfirmationNumberIcon />
            </IconButton>
          </Tooltip>
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
        rows={productos?.results || []}
        columns={columns}
        paginationMode="server"
        rowCount={productos?.count || 0} // total de registros desde el backend

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
          fontSize: '16px', // 👈 aumenta el tamaño general del texto
          "& .MuiDataGrid-columnHeaders": {
            fontSize: '17px', // 👈 tamaño de encabezados
            fontWeight: 'bold',
          },
          "& .MuiDataGrid-cell": {
            fontSize: '16px', // 👈 tamaño del contenido de las celdas
          },
          "& .even-row": { backgroundColor: "#f5f5f5" },
          "& .odd-row": { backgroundColor: "#ffffff" },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
      />
      <FormDialogModal />
    </Box>
  );
}