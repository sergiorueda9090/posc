import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateMainCreate, validateMainUpdate } from "../validator/mainValidator";
import { handleFormStoreThunk, resetFormularioThunk } from "../../store/tarjetasBancariasStore/tarjetasBancariasStoreThunks";

export const useForm = ( dataStore ) => {
    
    const dispatch = useDispatch();
    const { idTarjeta, nombre, pan, descripcion } = dataStore;
    const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const validateCreate = () => {
    const dataStore = {
      nombre,
      pan,
    };
    const validationErrors = validateMainCreate(dataStore);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateUpdate = () => {
    const dataStore = {
      nombre,
      pan,
    };
    const validationErrors = validateMainUpdate(dataStore);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    dispatch(resetFormularioThunk());
    setErrors({});
  };

  return {
    formValues: {
      idTarjeta,
      nombre,
      pan,
      descripcion,
    },
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  };
};
