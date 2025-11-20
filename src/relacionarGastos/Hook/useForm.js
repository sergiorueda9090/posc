import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateMainCreate, validateMainUpdate } from "../validator/mainValidator";
import { handleFormStoreThunk, resetFormularioThunk } from "../../store/relacionarGastoStore/relacionarGastoThunks";

// Función para formatear miles
const formatNumber = (value) => {
  if (!value) return "";
  const numeric = value.toString().replace(/\D/g, "");
  if (!numeric) return "";
  return Number(numeric).toLocaleString("es-CO");
};

export const useForm = (dataStore) => {
  const dispatch = useDispatch();
  const { idRelacionGasto, gasto_id, total_gasto, descripcion } = dataStore;
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleFormStoreThunk({ name, value }));
  };

  const validateCreate = () => {
    const dataStore = {
      gasto_id,
      total_gasto,
    };
    const validationErrors = validateMainCreate(dataStore);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateUpdate = () => {
    const dataStore = {
      gasto_id,
      idRelacionGasto,
      total_gasto,
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
      gasto_id,
      idRelacionGasto,
      total_gasto: formatNumber(total_gasto),   // 🔥🔥 formateo aquí
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
