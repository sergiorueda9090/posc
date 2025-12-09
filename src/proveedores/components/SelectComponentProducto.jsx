import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllThunks as getAllProductos } from "../../store/productoStore/productoThunks";

export const SelectComponentProducto = ({ value, onChange }) => {
  const dispatch = useDispatch();
  
  const { productos } = useSelector((state) => state.productoStore);

  const [options, setOptions] = useState([]);

  // Cargar todos los productos al montar
  useEffect(() => {
    dispatch(getAllProductos());
  }, [dispatch]);

  // Mapear productos al formato necesario
  useEffect(() => {
    if (productos?.results) {
      const newOptions = productos.results.map((prod) => ({
        id: prod.id,
        label: prod.nombre,
        nombre: prod.nombre,
        precio_compra: prod.precio_compra,
        stock: prod.stock,
        categoria: prod.categoria_nombre || "Sin categoría",
      }));
      setOptions(newOptions);
    }
  }, [productos]);

  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box>
            <Typography variant="body1">{option.nombre}</Typography>
            <Typography variant="caption" color="textSecondary">
              {option.categoria} | Stock: {option.stock} | 
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(option.precio_compra)}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Seleccione un producto *" />
      )}
      sx={{ zIndex: 9999 }}
    />
  );
};