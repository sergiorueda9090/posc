import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleFormStoreThunk } from "../../store/productoStore/productoThunks";

export const SubSelectComponent = () => {

  const dispatch = useDispatch();

  const {subcategorias} = useSelector((state) => state.subcategoriaStore);
  const {subcategoria_id} = useSelector((state) => state.productoStore);

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {

    if (subcategorias.length > 0) {

      const newOptions = subcategorias.map((cat) => ({
        value: cat.id,
        label: cat.nombre,
      }));
      setOptions(newOptions);
      
    }

  }, [subcategorias]);

  //Seleccionar automáticamente si hay una categoría guardada en el store
  useEffect(() => {
    if (subcategorias?.categoria_id && options.length > 0) {
      const found = options.find(
        (opt) => opt.value === subcategorias.categoria_id
      );
      setSelectedOption(found || null);
    } else {
      setSelectedOption(null);
    }
  }, [subcategorias, options]);

  useEffect(() => {
    if (subcategoria_id && options.length > 0) {
      const found = options.find((opt) => opt.value === subcategoria_id);
      if (found) {
        setSelectedOption(found);
      }
    }
  }, [subcategoria_id, options]);
  
  //Cuando el usuario selecciona una categoría
  const handleChangeSelect = (event, newValue) => {

    setSelectedOption(newValue);
    
    dispatch(
      handleFormStoreThunk({
        name: "subcategoria_id",
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
        <TextField {...params} label="Seleccione una subcategoría" />
      )}
      sx={{
        zIndex: 9999,
      }}
    />
  );
};
