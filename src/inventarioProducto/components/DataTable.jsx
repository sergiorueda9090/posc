// ================================
// 📦 DataTable.jsx (versión visual mejorada)
// ================================
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { deleteThunk, showCantidadThunk } from "../../store/inventarioProductoStore/inventarioProductoStoreThunks";

import { Box, Typography } from "@mui/material";
import { showAlert } from "../../store/globalStore/globalStore";

export function DataTable() {
  const dispatch = useDispatch();
  const { inventario } = useSelector((state) => state.inventarioProductoStore);

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const handleEdit = (row) => dispatch(showCantidadThunk(row.id));

  const handleDelete = (id) => {
    dispatch(
      showAlert({
        type: "warning",
        title: "Confirmar eliminación",
        text: "¿Estás seguro de que deseas eliminar este registro?",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        showCancel: true,
        action: () => confirmDelete(id),
      })
    );
  };

  const confirmDelete = (id) => {
    dispatch(deleteThunk(id));
  };

  // ✅ Columnas bien definidas y visibles
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "producto_nombre",
      headerName: "Producto",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "cantidad_unidades",
      headerName: "Cantidad",
      width: 150,
      type: "number",
      align: "right",
      headerAlign: "right",
    },
    {
      field: "fecha_ingreso",
      headerName: "Fecha de ingreso",
      width: 220,
      valueFormatter: (params) => {
        if (!params?.value) return "";
        const date = new Date(params.value);
        return date.toLocaleString("es-CO", {
          dateStyle: "short",
          timeStyle: "medium",
        });
      },
    },
    {
      field: "creado_por_username",
      headerName: "Creado por",
      width: 160,
    },
    {
      field: "actions",
      headerName: "Acciones",
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

  // ✅ Asegurar que cada fila tenga un `id` único
  const rows = inventario.map((item) => ({
    id: item.id || item.producto_id,
    ...item,
  }));

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      {rows.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          paginationMode="server"
          rowCount={inventario?.count || rows.length}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            bgcolor: "#f5f7fa", // Fondo general más neutro
            color: "#1a1a1a", // Texto oscuro para máximo contraste

            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#0d47a1",
              color: "#1927e6ff",
              fontWeight: "bold",
              fontSize: "0.9rem",
              textTransform: "uppercase",
            },

            "& .MuiDataGrid-cell": {
              color: "#222", // Texto visible
              fontSize: "0.95rem",
              fontWeight: 500,
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e3f2fd !important",
              transition: "background-color 0.3s ease-in-out",
            },

            "& .even-row": { bgcolor: "#ffffff" },
            "& .odd-row": { bgcolor: "#f4f6f8" },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? "even-row"
              : "odd-row"
          }
        />
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            mt: 3,
            color: "#777",
            fontWeight: "500",
          }}
        >
          No hay registros disponibles.
        </Typography>
      )}
    </Box>
  );
}
