import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  LinearProgress,
  Divider,
} from "@mui/material";

import {
  ReceiptLong as ReporteIcon,
  TrendingUp as TopIcon,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { getAllThunks } from "../../store/posStore/reporteThunks.js";
import { DateRange } from "../components/DateRange.jsx";

import { ChartsSection } from "../components/ChartsSection.jsx";
import { ExportButtons } from "../components/ExportButtons.jsx";
import { CompareSection } from "../components/CompareSection.jsx";
import { TablaReportes } from "../components/TablaReportes.jsx";

const MainViewReporte = () => {
  const dispatch = useDispatch();
  const { resumen_general } = useSelector((state) => state.reporteStore);
  const [comparar, setComparar] = useState(false);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

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

  const resumen = resumen_general.resumen_general;
  const metodos = resumen_general.por_metodo_pago || [];
  const productos = resumen_general.productos_top || [];


  return (
    <Box sx={{ p: { xs: 2, md: 4 }, fontFamily: "Segoe UI, sans-serif" }}>
            {/* === ENCABEZADO === */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#1f1f3d" }}>
          <ReporteIcon sx={{ mr: 1, color: "#4caf50" }} />
          Reporte de Ventas
        </Typography>
        <ExportButtons data={resumen_general} />
      </Box>

      {/* === FILTROS === */}
      <DateRange />
      
      <CompareSection comparar={comparar} setComparar={setComparar} />

      <Divider sx={{ my: 3 }} />

      {/* === GRÁFICOS === */}
      <ChartsSection productos={productos} metodos={metodos} />

      <Divider sx={{ my: 4 }} />

      {/* === TOP PRODUCTOS === */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#1f1f3d",
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TopIcon sx={{ mr: 1, color: "#ff9800" }} />
        Productos Más Vendidos
      </Typography>

      {productos.length > 0 ? (
        <Box>
          {productos.map((producto, index) => (
            <Card
              key={index}
              sx={{
                mb: 1.5,
                p: 2,
                borderLeft: "5px solid #4caf50",
                bgcolor: "#fafafa",
                "&:hover": { bgcolor: "#f1f8e9" },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" fontWeight="bold">
                  {index + 1}. {producto.nombre}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#4caf50", fontWeight: "bold" }}
                >
                  {producto.total_vendido} unidades
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  (producto.total_vendido / resumen.total_unidades_vendidas) * 100
                }
                sx={{ height: 10, borderRadius: 5, mt: 1 }}
              />
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" sx={{ ml: 2 }}>
          No hay productos registrados en este rango.
        </Typography>
      )}

      <Divider sx={{ my: 4 }} />

      {/* === DETALLE DE VENTAS CON PRODUCTOS === */}
      <TablaReportes ventas={"ventas"}/>

    </Box>
  );
};

export { MainViewReporte };
