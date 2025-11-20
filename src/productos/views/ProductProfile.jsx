import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Avatar,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

// Íconos
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReplayIcon from "@mui/icons-material/Replay";

export const ProductProfile = () => {
  // ================================
  // 🔹 DATOS DE PRUEBA (DUMMY DATA)
  // ================================
  const producto = {
    nombre: "Perfume Chipre Dama 120ml",
    codigo: "PF-CH-120",
    categoria: "Fragancias",
    estado: "Activo",
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    stock_actual: 85,
    total_vendido: 240,
    total_devoluciones: 12,
  };

  const inventario = [
    { fecha: "2025-02-01", tipo: "Entrada", cantidad: 50, usuario: "Admin" },
    { fecha: "2025-02-03", tipo: "Salida", cantidad: 10, usuario: "Vendedor 1" },
    { fecha: "2025-02-05", tipo: "Salida", cantidad: 15, usuario: "Vendedor 2" },
    { fecha: "2025-02-08", tipo: "Entrada", cantidad: 20, usuario: "Admin" },
  ];

  const ventas = [
    {
      codigo_venta: "FAC-2025-00121",
      cliente: "Ana García",
      cantidad: 1,
      total: "$68.000",
      fecha: "2025-02-10",
    },
    {
      codigo_venta: "FAC-2025-00118",
      cliente: "Carlos Ruiz",
      cantidad: 2,
      total: "$136.000",
      fecha: "2025-02-08",
    },
    {
      codigo_venta: "FAC-2025-00112",
      cliente: "María López",
      cantidad: 1,
      total: "$68.000",
      fecha: "2025-02-05",
    },
  ];

  const devoluciones = [
    {
      codigo_venta: "FAC-2025-00112",
      cantidad: 1,
      fecha: "2025-02-06",
      usuario: "Soporte",
    },
    {
      codigo_venta: "FAC-2025-00097",
      cantidad: 1,
      fecha: "2025-02-01",
      usuario: "Admin",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* ===================== */}
      {/* HEADER: FOTO + FICHA */}
      {/* ===================== */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 4,
          mb: 4,
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Avatar
          src={producto.imagen}
          alt={producto.nombre}
          sx={{ width: 140, height: 140, borderRadius: 3 }}
        />

        <Box>
          <Typography variant="h4" fontWeight="bold">
            {producto.nombre}
          </Typography>

          <Typography sx={{ color: "gray", fontSize: "1.1rem" }}>
            Código: <strong>{producto.codigo}</strong>
          </Typography>

          <Typography sx={{ color: "gray", fontSize: "1.1rem" }}>
            Categoría: <strong>{producto.categoria}</strong>
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Estado:
            <Chip
              label={producto.estado}
              color={producto.estado === "Activo" ? "success" : "default"}
              sx={{ ml: 1 }}
            />
          </Typography>
        </Box>
      </Paper>

      {/* ===================== */}
      {/* MÉTRICAS PRINCIPALES */}
      {/* ===================== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <InventoryIcon color="primary" sx={{ fontSize: 35 }} />
                <Box>
                  <Typography variant="h6">Stock Actual</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {producto.stock_actual}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <TrendingUpIcon color="success" sx={{ fontSize: 35 }} />
                <Box>
                  <Typography variant="h6">Total Vendido</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {producto.total_vendido}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <ReplayIcon color="error" sx={{ fontSize: 35 }} />
                <Box>
                  <Typography variant="h6">Devoluciones</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {producto.total_devoluciones}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===================== */}
      {/* TABLA DE INVENTARIO */}
      {/* ===================== */}
      <Section title="Movimientos de Inventario">
        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#e3f2fd" }}>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Usuario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventario.map((mov, i) => (
                <TableRow key={i}>
                  <TableCell>{mov.fecha}</TableCell>
                  <TableCell>{mov.tipo}</TableCell>
                  <TableCell>{mov.cantidad}</TableCell>
                  <TableCell>{mov.usuario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* ===================== */}
      {/* TABLA DE VENTAS */}
      {/* ===================== */}
      <Section title="Ventas del Producto">
        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#fff3e0" }}>
              <TableRow>
                <TableCell>Código Venta</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.codigo_venta}</TableCell>
                  <TableCell>{v.cliente}</TableCell>
                  <TableCell>{v.cantidad}</TableCell>
                  <TableCell>{v.total}</TableCell>
                  <TableCell>{v.fecha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* ===================== */}
      {/* TABLA DE DEVOLUCIONES */}
      {/* ===================== */}
      <Section title="Devoluciones del Producto">
        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#ffebee" }}>
              <TableRow>
                <TableCell>Código Venta</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Usuario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devoluciones.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.codigo_venta}</TableCell>
                  <TableCell>{d.cantidad}</TableCell>
                  <TableCell>{d.fecha}</TableCell>
                  <TableCell>{d.usuario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </Box>
  );
};

// Sección reutilizable
const Section = ({ title, children }) => (
  <Box sx={{ mb: 5 }}>
    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
      {title}
    </Typography>
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);
