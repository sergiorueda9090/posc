import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleFormStoreThunk } from "../../store/productoStore/productoThunks";

export const SelectComponentGenero = () => {
  
  const dispatch = useDispatch();
  
  const { genero } = useSelector((state) => state.productoStore);
  
  console.log("genero seleccionado:", genero);

  const [options] = useState([
    { value: "M", label: "Masculino (M)" },
    { value: "F", label: "Femenino (F)" },
    { value: "U", label: "Unisex (U)" }
  ]);
  
  const [selectedOption, setSelectedOption] = useState(null);

  // Sincronizar el valor seleccionado con el store
  useEffect(() => {
    if (genero && options.length > 0) {
      const found = options.find((opt) => opt.value === genero);
      if (found) {
        setSelectedOption(found);
      }
    }
  }, [genero, options]);

  // Cuando el usuario selecciona un género
  const handleChangeSelect = (event, newValue) => {
    setSelectedOption(newValue);

    dispatch(
      handleFormStoreThunk({
        name: "genero",
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
        <TextField {...params} label="Seleccione un género" />
      )}
      sx={{
        zIndex: 9999,
      }}
    />
  );
};