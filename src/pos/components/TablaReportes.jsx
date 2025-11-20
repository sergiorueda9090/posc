import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";

import {
  ShoppingCart as ProductosIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Replay as DevolucionIcon,
} from "@mui/icons-material";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createThunk } from "../../store/posStore/devolucionesStoreThunks.js";

export const TablaReportes = (props) => {
  const dispatch = useDispatch();
  const ventasProp = props.ventas;
  const [openRows, setOpenRows] = useState({});
  const [busqueda, setBusqueda] = useState("");

  const toggleRow = (index) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ================================
  // 🔥 EVENTOS INTERNOS DEL COMPONENTE
  // ================================

  const handleDevolverVenta = (id, codigo) => {
    console.log("➡️ Devolución de venta completa:");
    console.log("ID:", id);
    console.log("Código:", codigo);
    // Aquí puedes abrir modal o ejecutar lógica
  };

  const handleDevolverProducto = (detalle_venta_id, venta_completa_id, codigo_venta, producto_id) => {
    console.log("➡️ Devolución de producto individual:");
    console.log("ID Detalle Venta:", detalle_venta_id);
    console.log("ID Venta Completa:", venta_completa_id);
    console.log("Código Venta:", codigo_venta);
    console.log("ID Producto:", producto_id);
    dispatch(createThunk({ detalle_venta_id, venta_completa_id, codigo_venta, producto_id, cantidad:1 }));
  };

  // ==================================
  //   DATOS DEL STORE
  // ==================================
  const { resumen_general } = useSelector((state) => state.reporteStore);

  const tieneDatos =
    resumen_general &&
    Object.keys(resumen_general).length > 0 &&
    resumen_general.resumen_general;

  if (!tieneDatos) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          color: "#555",
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" fontWeight="bold">
          Cargando reporte de ventas...
        </Typography>
      </Box>
    );
  }

  const ventasBase = resumen_general.detalle_ventas || [];
  const totalesTabla = resumen_general.totales_tabla || {};

  // === FILTRADO POR CÓDIGO ===
  const ventas = ventasBase.filter((v) =>
    v.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      {/* ======= BUSCADOR ======= */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Buscar por código de venta"
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#1f1f3d",
          textTransform: "uppercase",
          borderBottom: "3px solid #4caf50",
          display: "inline-block",
          pb: 0.5,
          mb: 2,
        }}
      >
        Detalle de Ventas por Cliente
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#0d47a1" }}>
            <TableRow>
              {[
                "",
                "Código",
                "Cliente",
                "Método",
                "Subtotal",
                "Impuesto",
                "Total",
                "Fecha",
                "Creado por",
                "Acciones",
              ].map((header, i) => (
                <TableCell
                  key={i}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {ventas.map((venta, idx) => (
              <React.Fragment key={idx}>
                <TableRow
                  sx={{
                    bgcolor: idx % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    "&:hover": { bgcolor: "#e3f2fd" },
                  }}
                >
                  {/* Expandir */}
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(idx)}
                      title="Ver productos comprados"
                    >
                      {openRows[idx] ? (
                        <ExpandLessIcon color="primary" />
                      ) : (
                        <ExpandMoreIcon color="primary" />
                      )}
                    </IconButton>
                  </TableCell>

                  <TableCell sx={{ fontWeight: "bold" }}>{venta.codigo}</TableCell>
                  <TableCell>{venta.cliente}</TableCell>

                  <TableCell>
                    <Chip
                      label={venta.metodo_pago}
                      color="success"
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "#4caf50",
                        color: "white",
                      }}
                    />
                  </TableCell>

                  {/* Valores */}
                  <TableCell sx={{ color: "#4caf50", fontWeight: 600 }}>
                    {(venta.subtotal ?? 0).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </TableCell>

                  <TableCell sx={{ color: "#2196f3", fontWeight: 600 }}>
                    {(venta.impuesto ?? 0).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </TableCell>

                  <TableCell sx={{ color: "#ffb300", fontWeight: "bold" }}>
                    {(venta.total ?? 0).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </TableCell>

                  <TableCell>{venta.fecha}</TableCell>
                  <TableCell>{venta.creado_por}</TableCell>

                  {/* ACCIONES */}
                    {ventasProp !== "devoluciones" ? null : (
                        <TableCell>
                            <IconButton
                            color="error"
                            title="Devolver venta completa"
                            onClick={() =>
                                handleDevolverVenta(venta.id, venta.codigo)
                            }
                            >
                            <DevolucionIcon />
                            </IconButton>
                        </TableCell>
                        
                    )}


                </TableRow>

                {/* === SUBTABLA === */}
                <TableRow>
                  <TableCell colSpan={10} sx={{ p: 0, bgcolor: "#fafafa" }}>
                    <Collapse in={openRows[idx]} timeout="auto" unmountOnExit>
                      <Box sx={{ m: 2 }}>
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

                        <Table size="small">
                          <TableHead sx={{ bgcolor: "#eceff1" }}>
                            <TableRow>
                              <TableCell>Producto</TableCell>
                              <TableCell>Cantidad</TableCell>
                              <TableCell>Precio Unitario</TableCell>
                              <TableCell>Subtotal</TableCell>
                              <TableCell>Acción</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {venta.productos_comprados.map((p, pidx) => (
                              <TableRow key={pidx}>
                                <TableCell>{p.producto}</TableCell>
                                <TableCell>{p.cantidad}</TableCell>

                                <TableCell>
                                  {(p.precio_unitario ?? 0).toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  })}
                                </TableCell>

                                <TableCell
                                  sx={{ color: "#4caf50", fontWeight: "bold" }}
                                >
                                  {(p.subtotal_producto ?? 0).toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  })}
                                </TableCell>

                                {/* ICONO DE DEVOLUCIÓN PRODUCTO */}
                                <TableCell>
                                  <IconButton
                                    color="warning"
                                    title="Devolver este producto"
                                    onClick={() =>
                                      handleDevolverProducto(
                                        p.venta_id, // detalle venta id
                                        venta.id, // venta completa id
                                        venta.codigo, // código venta
                                        p.producto_id // id producto
                                      )
                                    }
                                  >
                                    <DevolucionIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>

          {/* === TOTALES === */}
          <tfoot>
            <TableRow sx={{ bgcolor: "#263238" }}>
              <TableCell colSpan={4}>
                <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                  🔹 Totales Generales
                </Typography>
              </TableCell>

              <TableCell
                sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "1.2rem" }}
              >
                {(totalesTabla.subtotal_general ?? 0).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </TableCell>

              <TableCell
                sx={{ color: "#2196f3", fontWeight: "bold", fontSize: "1.2rem" }}
              >
                {(totalesTabla.impuesto_general ?? 0).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </TableCell>

              <TableCell
                sx={{ color: "#ffca28", fontWeight: "bold", fontSize: "1.3rem" }}
              >
                {(totalesTabla.total_general ?? 0).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </TableCell>

              <TableCell colSpan={3}></TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </TableContainer>
    </>
  );
};
