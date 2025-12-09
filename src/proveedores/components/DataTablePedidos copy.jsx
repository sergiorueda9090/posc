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
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useSelector, useDispatch } from "react-redux";
import { getAllOrdenesThunk } from "../../store/proveedoresOrdenesStore/proveedoresOrdenesThunks";


export function DataTablePedidos() {

  const { ordenes } = useSelector((state) => state.proveedoresOrdenesStore);
  const dispatch    = useDispatch();
  
  useEffect(() => {
    dispatch(getAllOrdenesThunk());  
  }, [dispatch]);

  console.log("Órdenes desde el store:", ordenes);

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
                          <SubTablaOrdenes row={row} />
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
function SubTablaOrdenes({ row }) {
  const pageOptions = [5, 10, 25, 50, "ALL"];

  const [searchOrd, setSearchOrd] = useState("");
  const [expandedOrden, setExpandedOrden] = useState(null);

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
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedOrd.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "16px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              backgroundColor:
                                orden.estado === "Entregado" ? "#d4edda" :
                                orden.estado === "En tránsito" ? "#fff3cd" :
                                orden.estado === "Confirmada" ? "#d1ecf1" :
                                orden.estado === "Pendiente" ? "#f8d7da" : "#e2e3e5",
                              color:
                                orden.estado === "Entregado" ? "#155724" :
                                orden.estado === "En tránsito" ? "#856404" :
                                orden.estado === "Confirmada" ? "#0c5460" :
                                orden.estado === "Pendiente" ? "#721c24" : "#383d41",
                            }}
                          >
                            {orden.estado}
                          </span>
                        </TableCell>
                      </TableRow>

                      {/* 🔥 FILA EXPANDIDA CON PRODUCTOS */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                          <Collapse
                            in={expandedOrden === orden.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ m: 2, p: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
                              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                                📦 Productos en esta orden:
                              </Typography>

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
