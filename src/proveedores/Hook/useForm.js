import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateMainCreate, validateMainUpdate } from "../validator/mainValidator";
import { handleFormStoreThunk, resetFormularioThunk } from "../../store/proveedoresStore/proveedoresThunks";

export const useForm = ( dataStore ) => {
    
    const dispatch = useDispatch();
    const { idProveedor, nombre_empresa, descripcion, ciudad, creado_por_username /*email, contacto_principal, telefono, direccion,*/  } = dataStore;
    const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const validateCreate = () => {
    const dataStore = {
      nombre_empresa,
      descripcion,
      ciudad,

      /*email,
      contacto_principal,
      telefono,
      direccion,
      ciudad*/
    };
    const validationErrors = validateMainCreate(dataStore);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateUpdate = () => {
    const dataStore = {
      idProveedor,
      nombre_empresa,
      descripcion,
      ciudad,
      /*email,
      contacto_principal,
      telefono,
      direccion,*/
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
      idProveedor,
      nombre_empresa,
      descripcion,
      ciudad,
      /*email,
      contacto_principal,
      telefono,
      direccion,
      ciudad*/
    },
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  };
};
