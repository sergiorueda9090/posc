import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";

import {
  ReceiptLong as ReporteIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom"; 

import { useDispatch } from "react-redux";
import { getAllThunks } from "../../store/posStore/reporteThunks.js";

import { TablaReportes } from "../components/TablaReportes.jsx";
import { TablaDevoluciones } from "../components/TablaDevoluciones.jsx";

const MainViewDevoluciones = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(getAllThunks());
  }, [dispatch]);

  const handleVolver = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, fontFamily: "Segoe UI, sans-serif" }}>

      {/* === FLECHA Y TÍTULO === */}
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <IconButton
          onClick={handleVolver}
          title="Volver"
          sx={{
            bgcolor: "#e0e0e0",
            mr: 2,
            "&:hover": { bgcolor: "#bdbdbd" }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1f1f3d" }}>
          <ReporteIcon sx={{ mr: 1, color: "#4caf50" }} />
          Reporte de Devoluciones
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* === TABS === */}
      <Tabs
        value={tabValue}
        onChange={(e, nv) => setTabValue(nv)}
        sx={{ mb: 3 }}
      >
        <Tab label="Detalle de Ventas por Cliente" sx={{ fontWeight: "bold" }} />
        <Tab label="Devoluciones Realizadas" sx={{ fontWeight: "bold" }} />
      </Tabs>

      {/* === TAB 1: DETALLE DE VENTAS === */}
      {tabValue === 0 && <TablaReportes ventas="devoluciones" />}

      {/* === TAB 2: HISTORIAL DE DEVOLUCIONES === */}
      {tabValue === 1 && <TablaDevoluciones />}

    </Box>
  );
};

export { MainViewDevoluciones };
