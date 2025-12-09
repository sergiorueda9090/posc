import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllThunks as getAllProveedores } from "../../store/proveedoresStore/proveedoresThunks";
import { handleFormStoreThunk } from "../../store/productoStore/productoThunks";


export const SelectComponentProveedor = () => {
  
  const dispatch = useDispatch();
  
  const { proveedores } = useSelector((state) => state.proveedoresStore);
  const { proveedor_id } = useSelector((state) => state.productoStore);
  
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Cargar todos los proveedores al montar
  useEffect(() => {
    dispatch(getAllProveedores());
  }, [dispatch]);

  // Mapear proveedores al formato { value, label }
  useEffect(() => {
    if (proveedores?.results && Array.isArray(proveedores.results) && proveedores.results.length > 0) {
      const newOptions = proveedores.results.map((prov) => ({
        value: prov.id,
        label: `${prov.nombre_empresa}`,
      }));
      setOptions(newOptions);
    }
  }, [proveedores]);

  // Sincronizar el valor seleccionado con el store
  useEffect(() => {
    if (proveedor_id && options.length > 0) {
      const found = options.find((opt) => opt.value === proveedor_id);
      if (found) {
        setSelectedOption(found);
      }
    }
  }, [proveedor_id, options]);

  // Cuando el usuario selecciona un proveedor
  const handleChangeSelect = (event, newValue) => {
    setSelectedOption(newValue);

    dispatch(
      handleFormStoreThunk({
        name: "proveedor_id",
        value: newValue?.value || null,
      })
    );
  };

  return (
    <Autocomplete
      size="small"
      options={options}
      value={selectedOption}
      onChange={handleChangeSelect}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField {...params} label="Seleccione un proveedor *" />
      )}
      sx={{
        zIndex: 9999,
      }}
    />
  );
};