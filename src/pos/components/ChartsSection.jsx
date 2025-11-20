import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4caf50", "#03a9f4", "#ffb300", "#e91e63", "#9c27b0"];

export const ChartsSection = ({ productos, metodos }) => {
  return (
    <Grid container spacing={4}>
      {/* === TOP PRODUCTOS === */}
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            📊 Productos más vendidos (Top 10)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productos.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_vendido" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* === MÉTODOS DE PAGO === */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            💳 Distribución por método de pago
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metodos}
                dataKey="total"
                nameKey="metodo_pago"
                outerRadius={120}
                label
              >
                {metodos.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};
