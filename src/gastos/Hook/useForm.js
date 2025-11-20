import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateMainCreate, validateMainUpdate } from "../validator/mainValidator";
import { handleFormStoreThunk, resetFormularioThunk } from "../../store/gastoStore/gastoThunks";

export const useForm = ( dataStore ) => {
    
    const dispatch = useDispatch();
    const { idGasto, nombre, descripcion } = dataStore;
    const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const validateCreate = () => {
    const dataStore = {
      nombre,
      descripcion,
    };
    const validationErrors = validateMainCreate(dataStore);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateUpdate = () => {
    const dataStore = {
      nombre,
      descripcion,
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
      idGasto,
      nombre,
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
