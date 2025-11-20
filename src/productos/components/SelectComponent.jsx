import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllThunks as getAllCategorias } from "../../store/categoriaStore/categoriaThunks";
import { handleFormStoreThunk } from "../../store/productoStore/productoThunks";
import { getAllByCategoriaThunks } from "../../store/subcategoriaStore/subcategoriaThunks";

export const SelectComponent = () => {
  
  const dispatch = useDispatch();
  
  const { categorias } = useSelector((state) => state.categoriaStore);
  
  const {categoria_id} = useSelector((state) => state.productoStore);
  
  console.log("categoria_id seleccionado:", categoria_id);

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  //Cargar todas las categorías al montar
  useEffect(() => {
    dispatch(getAllCategorias());
  }, [dispatch]);

  //Mapear categorías al formato { value, label }
  useEffect(() => {

    if (categorias?.results) {

      const newOptions = categorias.results.map((cat) => ({
        value: cat.id,
        label: cat.nombre,
      }));
      setOptions(newOptions);
      

    }

  }, [categorias]);

    useEffect(() => {
      if (categoria_id && options.length > 0) {
        const found = options.find((opt) => opt.value === categoria_id);
        if (found) {
          setSelectedOption(found);
          dispatch(getAllByCategoriaThunks({ categoria_id: found.value }));
        }
      }
    }, [categoria_id, options]);

  //Cuando el usuario selecciona una categoría
  const handleChangeSelect = (event, newValue) => {

    setSelectedOption(newValue);

    dispatch(
      handleFormStoreThunk({
        name: "categoria_id",
        value: newValue?.value || null,
      })
    );

    dispatch(getAllByCategoriaThunks({ categoria_id: newValue?.value }) );
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
        <TextField {...params} label="Seleccione una categoría" />
      )}
      sx={{
        zIndex: 9999, // 🔹 Reemplaza el menuPortalTarget de react-select
      }}
    />
  );
};
