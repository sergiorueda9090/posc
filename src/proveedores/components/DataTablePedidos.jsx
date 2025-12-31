import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  TextField,
  Pagination,
  Stack,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { useSelector, useDispatch } from "react-redux";
import { getAllOrdenesThunk } from "../../store/proveedoresOrdenesStore/proveedoresOrdenesThunks";
import { showAlert } from "../../store/globalStore/globalStore";
import { URL } from "../../constants/constantGlogal";

const ESTADO_OPCIONES = [
  { value: 'pendiente',   label: 'En Cotización' },
  { value: 'confirmada',  label: 'Pagada' },
  { value: 'en_transito', label: 'En Tránsito' },
  { value: 'recibida',    label: 'Inventariada' },
];

// Función helper para convertir value a label
const getEstadoLabel = (value) => {
  const opcion = ESTADO_OPCIONES.find(op => op.value === value);
  return opcion ? opcion.label : value;
};

// Función helper para convertir label a value
const getEstadoValue = (label) => {
  const opcion = ESTADO_OPCIONES.find(op => op.label === label);
  return opcion ? opcion.value : label;
};

const estadoStyles = {
  "En Cotización": {
    bg: "#f8d7da",
    color: "#721c24",
  },
  "Pagada": {
    bg: "#d1ecf1",
    color: "#0c5460",
  },
  "En Tránsito": {
    bg: "#fff3cd",
    color: "#856404",
  },
  "Inventariada": {
    bg: "#d4edda",
    color: "#155724",
  },
};

  
export function DataTablePedidos() {

  const { ordenes } = useSelector((state) => state.proveedoresOrdenesStore);
  const { token } = useSelector((state) => state.authStore);
  const dispatch    = useDispatch();
  
  useEffect(() => {
    dispatch(getAllOrdenesThunk());  
  }, [dispatch]);

  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!ordenes || ordenes.length === 0) return [];
    if (!search.trim()) return ordenes;

    return ordenes.filter((p) =>
      p.nombre_proveedor?.toLowerCase().includes(search.toLowerCase()) ||
      p.ciudad?.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, ordenes]);

  const pageOptions = [5, 10, 25, 50, "ALL"];
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const paginatedData = useMemo(() => {
    if (rowsPerPage === "ALL") return filteredData;
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, filteredData]);

  const [expandedRow, setExpandedRow] = useState(null);

  const handleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Órdenes de Pedido por Proveedor
      </Typography>

      {/* BUSCADOR */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <SearchIcon sx={{ mr: 1, color: "gray" }} />
        <TextField
          label="Buscar proveedor..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Box>

      {/* SELECT + CONTADOR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2">
          {rowsPerPage === "ALL"
            ? `Mostrando ${filteredData.length} de ${filteredData.length} proveedores`
            : `Mostrando ${paginatedData.length} de ${filteredData.length} proveedores`}
        </Typography>

        <TextField
          select
          size="small"
          label="Filas por página"
          SelectProps={{ native: true }}
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(e.target.value);
            setPage(1);
          }}
          sx={{ width: 160 }}
        >
          {pageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "ALL" ? "Todos" : opt}
            </option>
          ))}
        </TextField>
      </Box>

      {/* TABLA PRINCIPAL */}
      <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F7C548" }}>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Proveedor
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Ciudad
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Descripción
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                # Órdenes
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#000" }}>
                Total Acumulado
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No hay proveedores con órdenes
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const bg = index % 2 === 0 ? "#FFF7E6" : "#FFFDF7";

                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      hover
                      sx={{
                        backgroundColor: bg,
                        "&:hover": { backgroundColor: "#FCECC2" },
                      }}
                    >
                      <TableCell width={60}>
                        <IconButton onClick={() => handleExpand(row.id)}>
                          {expandedRow === row.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>

                      <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>
                        {row.nombre_proveedor}
                      </TableCell>

                      <TableCell sx={{ fontSize: "16px" }}>
                        {row.ciudad}
                      </TableCell>

                      <TableCell sx={{ fontSize: "14px", color: "#666" }}>
                        {row.descripcion}
                      </TableCell>

                      <TableCell sx={{ fontSize: "16px" }}>
                        <Chip 
                          label={row.cantidad_ordenes} 
                          color="primary" 
                          size="small"
                          icon={<ShoppingCartIcon />}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "green",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                      >
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                        }).format(row.total)}
                      </TableCell>
                    </TableRow>

                    {/* FILA EXPANDIDA */}
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <SubTablaOrdenes row={row} token={token} dispatch={dispatch} />
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      {rowsPerPage !== "ALL" && filteredData.length > 0 && (
        <Stack direction="row" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={(e, v) => setPage(v)}
            color="primary"
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
}

/* =======================================================
   SUBTABLA DE ÓRDENES DE PEDIDO
======================================================== */
function SubTablaOrdenes({ row, token, dispatch }) {
  const pageOptions = [5, 10, 25, 50, "ALL"];

  const [searchOrd, setSearchOrd] = useState("");
  const [expandedOrden, setExpandedOrden] = useState(null);
  const [descargando, setDescargando] = useState(null);
  const [actualizandoEstado, setActualizandoEstado] = useState({});
  const [estadosLocales, setEstadosLocales] = useState({});

  const filteredOrd = useMemo(() => {
    if (!row.ordenesPedido || row.ordenesPedido.length === 0) return [];
    
    const term = searchOrd.toLowerCase().trim();
    if (!term) return row.ordenesPedido;

    return row.ordenesPedido.filter((o) => {
      const productosResumen = (o.productos_resumen || "").toLowerCase();
      const estado = (o.estado || "").toLowerCase();
      const numeroOrden = (o.numero_orden || "").toLowerCase();
      const total = (o.total || "").toString().toLowerCase();
      const fecha = (o.fecha || "").toString().toLowerCase();

      return (
        productosResumen.includes(term) ||
        estado.includes(term) ||
        numeroOrden.includes(term) ||
        total.includes(term) ||
        fecha.includes(term)
      );
    });
  }, [searchOrd, row.ordenesPedido]);

  const [ordPage, setOrdPage] = useState(1);
  const [ordPerPage, setOrdPerPage] = useState(10);

  const paginatedOrd = useMemo(() => {
    if (ordPerPage === "ALL") return filteredOrd;
    const start = (ordPage - 1) * ordPerPage;
    return filteredOrd.slice(start, start + ordPerPage);
  }, [filteredOrd, ordPage, ordPerPage]);

  const handleExpandOrden = (ordenId) => {
    setExpandedOrden(expandedOrden === ordenId ? null : ordenId);
  };

  // 🔥 FUNCIÓN PARA DESCARGAR PDF
  const handleDescargarPDF = async (ordenId, numeroOrden) => {
    setDescargando(ordenId);

    try {
      const response = await fetch(`${URL}/api/suppliers/ordenes/${ordenId}/pdf/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar el PDF');
      }

      // Convertir respuesta a blob
      const blob = await response.blob();

      // Crear URL temporal para descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Orden_${numeroOrden}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dispatch(showAlert({
        type: "success",
        title: "PDF Descargado",
        text: `La orden ${numeroOrden} se ha descargado correctamente`,
      }));

    } catch (error) {
      console.error("Error al descargar PDF:", error);
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "No se pudo descargar el PDF. Intente nuevamente.",
      }));
    } finally {
      setDescargando(null);
    }
  };

  // 🔥 FUNCIÓN PARA ACTUALIZAR ESTADO
  const handleCambiarEstado = async (ordenId, estadoActualLabel, nuevoEstadoValue) => {
    // Evitar doble envío
    if (actualizandoEstado[ordenId]) {
      return;
    }

    // Validar que el estado esté en las opciones permitidas
    const estadoValido = ESTADO_OPCIONES.find(op => op.value === nuevoEstadoValue);
    if (!estadoValido) {
      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: "Estado inválido seleccionado",
      }));
      return;
    }

    const nuevoEstadoLabel = estadoValido.label;

    // Mostrar confirmación
    const confirmacion = window.confirm(
      `¿Confirmas cambiar el estado de '${estadoActualLabel}' a '${nuevoEstadoLabel}'?`
    );

    if (!confirmacion) {
      // Revertir el select al valor anterior
      setEstadosLocales(prev => ({
        ...prev,
        [ordenId]: getEstadoValue(estadoActualLabel)
      }));
      return;
    }

    // Marcar como actualizando
    setActualizandoEstado(prev => ({ ...prev, [ordenId]: true }));

    try {
      const response = await fetch(`${URL}/api/suppliers/ordenes/${ordenId}/update-estado/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstadoValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el estado');
      }

      const data = await response.json();

      // Actualizar estado local
      setEstadosLocales(prev => ({
        ...prev,
        [ordenId]: data.estado
      }));

      // Recargar datos desde el servidor
      dispatch(getAllOrdenesThunk());

      dispatch(showAlert({
        type: "success",
        title: "Estado Actualizado",
        text: `El estado se cambió exitosamente a '${nuevoEstadoLabel}'`,
      }));

    } catch (error) {
      console.error("Error al actualizar estado:", error);

      // Revertir al estado anterior
      setEstadosLocales(prev => ({
        ...prev,
        [ordenId]: getEstadoValue(estadoActualLabel)
      }));

      dispatch(showAlert({
        type: "error",
        title: "Error",
        text: error.message || "No se pudo actualizar el estado. Intente nuevamente.",
      }));
    } finally {
      setActualizandoEstado(prev => ({ ...prev, [ordenId]: false }));
    }
  };

  return (
    <Card sx={{ m: 1 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          📋 Órdenes de Pedido
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            size="small"
            fullWidth
            label="Buscar orden..."
            value={searchOrd}
            onChange={(e) => {
              setSearchOrd(e.target.value);
              setOrdPage(1);
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 260,
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="body2">
              {ordPerPage === "ALL"
                ? `Órdenes: ${filteredOrd.length}`
                : `Mostrando ${paginatedOrd.length} de ${filteredOrd.length} órdenes`}
            </Typography>

            <TextField
              select
              size="small"
              label="Filas"
              SelectProps={{ native: true }}
              value={ordPerPage}
              sx={{ width: 120 }}
              onChange={(e) => {
                setOrdPerPage(e.target.value);
                setOrdPage(1);
              }}
            >
              {pageOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "ALL" ? "Todos" : o}
                </option>
              ))}
            </TextField>
          </Box>
        </Box>

        {/* TABLA ÓRDENES */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F7C548" }}>
                <TableCell width={60} />
                <TableCell><strong>Nº Orden</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Productos</strong></TableCell>
                <TableCell><strong># Items</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Tarjeta</strong></TableCell>
                <TableCell align="center"><strong>PDF</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedOrd.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No hay órdenes para este proveedor
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrd.map((orden, i) => {
                  const bg = i % 2 === 0 ? "#FFF7E6" : "#FFFDF7";

                  return (
                    <React.Fragment key={orden.id}>
                      <TableRow
                        sx={{
                          backgroundColor: bg,
                          "&:hover": { backgroundColor: "#FCECC2" },
                        }}
                      >
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleExpandOrden(orden.id)}
                          >
                            {expandedOrden === orden.id ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>
                          {orden.numero_orden}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }}>
                          {new Date(orden.fecha).toLocaleString("es-CO", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }}>
                          {orden.productos_resumen}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }}>
                          <Chip 
                            label={`${orden.cantidad_productos} productos`}
                            size="small"
                            color="info"
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "green",
                          }}
                        >
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                          }).format(orden.total)}
                        </TableCell>
                        <TableCell sx={{ fontSize: "14px" }}>
                          <FormControl size="small" fullWidth>
                            <Select 
                              value={estadosLocales[orden.id] || getEstadoValue(orden.estado)} 
                              onChange={(e) => handleCambiarEstado(orden.id, orden.estado, e.target.value)} 
                              disabled={
                                actualizandoEstado[orden.id] || 
                                getEstadoValue(orden.estado) === 'recibida' ||
                                (estadosLocales[orden.id] && estadosLocales[orden.id] === 'recibida')
                              }
                              sx={{ 
                                fontSize: "12px", 
                                fontWeight: "bold", 
                                backgroundColor: estadoStyles[getEstadoLabel(estadosLocales[orden.id] || getEstadoValue(orden.estado))]?.bg || "#e2e3e5", 
                                color: estadoStyles[getEstadoLabel(estadosLocales[orden.id] || getEstadoValue(orden.estado))]?.color || "#383d41", 
                                "& .MuiOutlinedInput-notchedOutline": { 
                                  border: "none", 
                                }, 
                                "&:hover .MuiOutlinedInput-notchedOutline": { 
                                  border: "1px solid #ccc", 
                                }, 
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { 
                                  border: "1px solid #F7C548", 
                                },
                                // Opcional: cambiar el cursor cuando está deshabilitado
                                "&.Mui-disabled": {
                                  cursor: "not-allowed",
                                  opacity: 0.7
                                }
                              }} 
                            > 
                              {ESTADO_OPCIONES.map((opcion) => ( 
                                <MenuItem key={opcion.value} value={opcion.value}> 
                                  {opcion.label} 
                                </MenuItem> 
                              ))} 
                            </Select>
                          </FormControl>
                          {actualizandoEstado[orden.id] && (
                            <CircularProgress size={16} sx={{ ml: 1, verticalAlign: "middle" }} />
                          )}
                        </TableCell>

                        <TableCell align="center">
                          {orden.tarjeta_bancaria || 'N/A'}
                        </TableCell>


                        <TableCell align="center">
                          {/* 🔥 BOTÓN DE DESCARGA PDF */}
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDescargarPDF(orden.id, orden.numero_orden)}
                            disabled={descargando === orden.id}
                          >
                            {descargando === orden.id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <PictureAsPdfIcon />
                            )}
                          </IconButton>
                        </TableCell>


                      </TableRow>



                      {/* FILA EXPANDIDA CON PRODUCTOS */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                          <Collapse
                            in={expandedOrden === orden.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ m: 2, p: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                              {/* 🔥 HEADER CON BOTÓN DE DESCARGA */}
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                  📦 Productos en esta orden:
                                </Typography>
                                
                                <Button
                                  variant="contained"
                                  color="error"
                                  startIcon={descargando === orden.id ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                                  onClick={() => handleDescargarPDF(orden.id, orden.numero_orden)}
                                  disabled={descargando === orden.id}
                                  size="small"
                                >
                                  Descargar PDF
                                </Button>
                              </Box>

                              {orden.notas && (
                                <Box sx={{ mb: 2, p: 1, backgroundColor: "#fff3cd", borderRadius: 1 }}>
                                  <Typography variant="body2">
                                    <strong>Notas:</strong> {orden.notas}
                                  </Typography>
                                </Box>
                              )}

                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                    <TableCell><strong>Producto</strong></TableCell>
                                    <TableCell align="right"><strong>Precio Unitario</strong></TableCell>
                                    <TableCell align="center"><strong>Cantidad</strong></TableCell>
                                    <TableCell align="right"><strong>Subtotal</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {orden.productos && orden.productos.map((producto) => (
                                    <TableRow key={producto.id}>
                                      <TableCell>{producto.nombre}</TableCell>
                                      <TableCell align="right">
                                        {new Intl.NumberFormat("es-CO", {
                                          style: "currency",
                                          currency: "COP",
                                        }).format(producto.precio_compra)}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Chip 
                                          label={producto.cantidad}
                                          size="small"
                                          color="default"
                                        />
                                      </TableCell>
                                      <TableCell align="right" sx={{ fontWeight: "bold", color: "green" }}>
                                        {new Intl.NumberFormat("es-CO", {
                                          style: "currency",
                                          currency: "COP",
                                        }).format(producto.subtotal)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  
                                  {/* FILA DE TOTAL */}
                                  <TableRow sx={{ backgroundColor: "#fff9c4" }}>
                                    <TableCell colSpan={2} />
                                    <TableCell align="center">
                                      <strong>TOTAL:</strong>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "18px", color: "green" }}>
                                      {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                      }).format(orden.total)}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {ordPerPage !== "ALL" && filteredOrd.length > 0 && (
          <Stack direction="row" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(filteredOrd.length / ordPerPage)}
              page={ordPage}
              onChange={(e, v) => setOrdPage(v)}
              color="primary"
              size="large"
            />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}