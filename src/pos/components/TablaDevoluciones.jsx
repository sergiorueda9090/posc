import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  TableContainer,
  Typography,
  Box,
  TextField,
  Button,
  Pagination,
  Stack,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { useSelector, useDispatch } from "react-redux";
import { getAllThunks } from "../../store/posStore/devolucionesStoreThunks";

export const TablaDevoluciones = () => {
  const dispatch = useDispatch();

  // ====== ESTADOS ======
  const [search, setSearch] = useState("");          
  const [startDate, setStartDate] = useState("");    
  const [endDate, setEndDate] = useState("");        
  const [page, setPage] = useState(1);

  const { devoluciones } = useSelector((state) => state.devolucionesStore);

  useEffect(() => {
    cargarDevoluciones();
  }, [page]);

  const cargarDevoluciones = () => {
    dispatch(
      getAllThunks({
        page,
        search,
        start_date: startDate,
        end_date: endDate,
      })
    );
  };

  const handleBuscar = () => {
    setPage(1);
    cargarDevoluciones();
  };

  const handleVerDevolucion = (dev) => {
    console.log("➡️ Ver devolución:", dev);
    // Abrir modal, drawer o detalle
  };

  // Valores de totales
  const totalGeneral = devoluciones?.count || 0;
  const totalPagina = devoluciones?.results?.length || 0;

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#1f1f3d",
          textTransform: "uppercase",
          borderBottom: "3px solid #d32f2f",
          display: "inline-block",
          pb: 0.5,
          mb: 3,
        }}
      >
        Devoluciones Realizadas
      </Typography>

      {/* =============================== */}
      {/* 🔍 BUSCADOR GLOBAL */}
      {/* =============================== */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </Box>

      {/* =============================== */}
      {/* 📆 FILTROS DE FECHA */}
      {/* =============================== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          label="Fecha Inicio"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          label="Fecha Fin"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>

      <Button
        variant="contained"
        color="error"
        sx={{ mb: 3 }}
        onClick={handleBuscar}
      >
        Buscar
      </Button>

      {/* =============================== */}
      {/* 🔢 INDICADOR DE TOTALES */}
      {/* =============================== */}
      <Typography sx={{ mb: 2, fontWeight: "bold", color: "#444" }}>
        Mostrando <strong>{totalPagina}</strong> de{" "}
        <strong>{totalGeneral}</strong> devoluciones registradas
      </Typography>

      {/* =============================== */}
      {/* 📋 TABLA */}
      {/* =============================== */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#b71c1c" }}>
            <TableRow>
              {["Código Venta", "Producto", "Cantidad", "Fecha", "Ver"].map(
                (header, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {(devoluciones?.results || []).map((dev, idx) => (
              <TableRow key={idx}>
                <TableCell>{dev.codigo_venta}</TableCell>
                <TableCell>{dev.nombre_producto}</TableCell>
                <TableCell>{dev.cantidad}</TableCell>
                <TableCell>
                  {new Date(dev.created_at).toLocaleString("es-CO")}
                </TableCell>

                {/* 🔍 Botón para ver detalle */}
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleVerDevolucion(dev)}
                    title="Ver devolución"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {(!devoluciones?.results ||
              devoluciones.results.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No hay devoluciones registradas.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =============================== */}
      {/* 🔢 PAGINACIÓN */}
      {/* =============================== */}
      <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
        {devoluciones?.count > 0 && (
          <Pagination
            count={Math.ceil(devoluciones.count / 20)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="error"
          />
        )}
      </Stack>
    </>
  );
};
