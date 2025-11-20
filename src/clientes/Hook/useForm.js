import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateMainCreate, validateMainUpdate } from "../validator/mainValidator";
import { handleFormStoreThunk, resetFormularioThunk } from "../../store/clienteStore/clienteThunks";

export const useForm = (clientesStore) => {
    
    const dispatch = useDispatch();
    const { idCliente, nombre, apellido, email, telefono, direccion } = clientesStore;
    const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const validateCreate = () => {
    const dataStore = {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
    };
    const validationErrors = validateMainCreate(dataStore);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateUpdate = () => {
    const dataStore = {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
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
      idCliente,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
    },
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  };
};
