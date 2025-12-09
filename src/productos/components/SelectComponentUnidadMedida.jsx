import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleFormStoreThunk } from "../../store/productoStore/productoThunks";

export const SelectComponentUnidadMedida = () => {
  
  const dispatch = useDispatch();
  
  const { unidad_medida } = useSelector((state) => state.productoStore);
  
  console.log("unidad_medida seleccionada:", unidad_medida);

  const [options] = useState([
    { value: "UND", label: "Unidades (UND)" },
    { value: "GRS", label: "Gramos (GRS)" },
    { value: "KGS", label: "Kilogramos (KGS)" }
  ]);
  
  const [selectedOption, setSelectedOption] = useState(null);

  // Sincronizar el valor seleccionado con el store
  useEffect(() => {
    if (unidad_medida && options.length > 0) {
      const found = options.find((opt) => opt.value === unidad_medida);
      if (found) {
        setSelectedOption(found);
      }
    }
  }, [unidad_medida, options]);

  // Cuando el usuario selecciona una unidad de medida
  const handleChangeSelect = (event, newValue) => {
    setSelectedOption(newValue);

    dispatch(
      handleFormStoreThunk({
        name: "unidad_medida",
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
        <TextField {...params} label="Seleccione una unidad de medida" />
      )}
      sx={{
        zIndex: 9999,
      }}
    />
  );
};