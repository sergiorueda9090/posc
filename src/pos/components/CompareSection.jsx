import React from "react";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";

export const CompareSection = ({ comparar, setComparar }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={comparar}
            onChange={(e) => setComparar(e.target.checked)}
            color="primary"
          />
        }
        label="Comparar con periodo anterior"
      />
      {comparar && (
        <Typography variant="body2" color="text.secondary">
          📆 Mostrando comparación del crecimiento o caída de ventas.
        </Typography>
      )}
    </Box>
  );
};
