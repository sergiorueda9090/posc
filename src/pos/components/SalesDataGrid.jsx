import * as React from "react";
import {
  DataGrid,
  GridToolbar,
  gridClasses,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Button,
  Stack,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShoppingCart as ProductosIcon,
} from "@mui/icons-material";

export function SalesDataGrid({ ventas }) {
  const [openRows, setOpenRows] = React.useState({});
  const [allExpanded, setAllExpanded] = React.useState(false);

  // 🔹 Alternar una fila individual
  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🔹 Expandir o contraer todas las filas
  const toggleAllRows = () => {
    const newState = !allExpanded;
    const expandedState = ventas.reduce((acc, v) => {
      acc[v.codigo || v.id] = newState;
      return acc;
    }, {});
    setOpenRows(expandedState);
    setAllExpanded(newState);
  };

  // 🔹 Asegurar IDs únicos
  const rows = ventas.map((v, index) => ({
    id: v.codigo || `venta-${index}`,
    ...v,
  }));

  // 🔹 Totales generales con protección
  const totalesTabla = {
    subtotal_general: ventas.reduce((acc, v) => acc + Number(v.subtotal || 0), 0),
    impuesto_general: ventas.reduce((acc, v) => acc + Number(v.impuesto || 0), 0),
    total_general: ventas.reduce((acc, v) => acc + Number(v.total || 0), 0),
  };

  // 🔹 Definición de columnas
  const columns = [
    {
      field: "expand",
      headerName: "",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton size="small" onClick={() => toggleRow(params.id)}>
          {openRows[params.id] ? (
            <ExpandLessIcon color="primary" />
          ) : (
            <ExpandMoreIcon color="primary" />
          )}
        </IconButton>
      ),
    },
    { field: "codigo", headerName: "Código", width: 120 },
    { field: "cliente", headerName: "Cliente", flex: 1 },
    {
      field: "metodo_pago",
      headerName: "Método",
      width: 200,
      renderCell: (params) => {
        const pagos = params.row.pagos;
        if (pagos && pagos.length > 1) {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, py: 0.5 }}>
              {pagos.map((p, i) => (
                <Chip
                  key={i}
                  label={`${p.metodo_pago}: ${(p.monto ?? 0).toLocaleString("es-CO", { style: "currency", currency: "COP" })}`}
                  sx={{
                    bgcolor: i === 0 ? "#4caf50" : "#2196f3",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                  }}
                  size="small"
                />
              ))}
            </Box>
          );
        }
        return (
          <Chip
            label={params.value || "N/A"}
            sx={{
              bgcolor: "#4caf50",
              color: "white",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
            size="small"
          />
        );
      },
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      width: 150,
      align: "right",
      valueFormatter: (params) => {
        const val = Number(params.value || 0);
        return val.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        });
      },
      cellClassName: "subtotalCell",
    },
    {
      field: "impuesto",
      headerName: "Impuesto",
      width: 150,
      align: "right",
      valueFormatter: (params) => {
        const val = Number(params.value || 0);
        return val.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        });
      },
      cellClassName: "impuestoCell",
    },
    {
      field: "total",
      headerName: "Total",
      width: 160,
      align: "right",
      valueFormatter: (params) => {
        const val = Number(params.value || 0);
        return val.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        });
      },
      cellClassName: "totalCell",
    },
    { field: "fecha", headerName: "Fecha", width: 180 },
    { field: "creado_por", headerName: "Creado por", width: 150 },
  ];

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      {/* === BOTÓN DE EXPANDIR / CONTRAER TODO === */}
      <Stack direction="row" justifyContent="flex-end" mb={1}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={toggleAllRows}
        >
          {allExpanded ? "Contraer todo" : "Expandir todo"}
        </Button>
      </Stack>

      {/* === TABLA PRINCIPAL === */}
      <Box
        sx={{
          height: 480,
          width: "100%",
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          p: 2,
          [`& .${gridClasses.cell}`]: {
            borderColor: "rgba(224, 224, 224, 0.6)",
          },
          "& .subtotalCell": { color: "#4caf50", fontWeight: "bold" },
          "& .impuestoCell": { color: "#2196f3", fontWeight: "bold" },
          "& .totalCell": { color: "#ffb300", fontWeight: "bold" },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          slots={{ toolbar: GridToolbar }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#0d47a1",
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
            },
          }}
        />
      </Box>

      {/* === FILAS EXPANDIDAS CON PRODUCTOS === */}
      {rows.map((row) => (
        <Collapse key={row.id} in={openRows[row.id]} timeout="auto" unmountOnExit>
          <Box
            sx={{
              bgcolor: "#fafafa",
              border: "1px solid #ddd",
              borderRadius: 2,
              mt: 1,
              p: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: "#1f1f3d",
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ProductosIcon sx={{ mr: 1, color: "#ff9800" }} />
              Productos comprados:
            </Typography>

            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                "& td, & th": {
                  borderBottom: "1px solid #ddd",
                  padding: "6px 8px",
                },
                "& th": {
                  bgcolor: "#eceff1",
                  fontWeight: "bold",
                },
              }}
            >
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(row.productos_comprados || []).map((p, i) => (
                  <tr key={i}>
                    <td>{p.producto}</td>
                    <td>{p.cantidad}</td>
                    <td>
                      {Number(p.precio_unitario || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </td>
                    <td style={{ color: "#4caf50", fontWeight: "bold" }}>
                      {Number(p.subtotal_producto || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </Collapse>
      ))}

      {/* === PIE DE TOTALES === */}
      <Box
        sx={{
          bgcolor: "#263238",
          color: "white",
          display: "flex",
          justifyContent: "flex-end",
          gap: 6,
          p: 2,
          borderRadius: "0 0 10px 10px",
          mt: 2,
        }}
      >
        <Typography sx={{ color: "#4caf50", fontWeight: "bold" }}>
          Subtotal:{" "}
          {totalesTabla.subtotal_general.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </Typography>
        <Typography sx={{ color: "#2196f3", fontWeight: "bold" }}>
          Impuesto:{" "}
          {totalesTabla.impuesto_general.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </Typography>
        <Typography sx={{ color: "#ffca28", fontWeight: "bold" }}>
          Total:{" "}
          {totalesTabla.total_general.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </Typography>
      </Box>
    </Box>
  );
}
