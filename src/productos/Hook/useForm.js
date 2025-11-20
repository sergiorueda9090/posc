import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  validateMainCreate,
  validateMainUpdate,
} from "../validator/mainValidator";
import {
  handleFormStoreThunk,
  resetFormularioThunk,
} from "../../store/productoStore/productoThunks";

export const useForm = (productoStore) => {
  const dispatch = useDispatch();

  const {
    id,
    categoria_id,
    subcategoria_id,
    nombre,
    descripcion,
    precio_compra,
    porcentaje_ganancia,
    total,
    codigo_busqueda,
    imagen,
    //cantidad,
  } = productoStore;

  const [errors, setErrors] = useState({});

  //Formatear número con separador de miles (sin $)
  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const number = parseFloat(value.toString().replace(/[^0-9.]/g, ""));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("es-CO").format(number);
  };

  //Manejar cambios y mantener valor real (sin formato)
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Eliminar puntos del valor antes de guardarlo en el store
    const cleanValue = value.replace(/\./g, "");

    dispatch(handleFormStoreThunk({ name, value: cleanValue }));
  };

  //Calcular total automáticamente
  useEffect(() => {
    if (precio_compra && porcentaje_ganancia) {
      const precio = parseFloat(precio_compra) || 0;
      const porcentaje = parseFloat(porcentaje_ganancia) || 0;
      const totalCalculado = precio + (precio * porcentaje) / 100;

      dispatch(
        handleFormStoreThunk({
          name: "total",
          value: totalCalculado.toFixed(2),
        })
      );
    }
  }, [precio_compra, porcentaje_ganancia, dispatch]);

  const validateCreate = () => {
    const dataStore = {
      categoria_id,
      subcategoria_id,
      nombre,
      descripcion,
      precio_compra,
      porcentaje_ganancia,
      total,
      codigo_busqueda,
      //cantidad,
      imagen,
    };
    const validationErrors = validateMainCreate(dataStore);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validateUpdate = () => {
    const dataStore = {
      categoria_id,
      subcategoria_id,
      nombre,
      descripcion,
      precio_compra,
      porcentaje_ganancia,
      total,
      codigo_busqueda,
      //cantidad,
      imagen,
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
      id,
      categoria_id,
      subcategoria_id,
      nombre,
      descripcion,
      precio_compra: formatNumber(precio_compra),
      porcentaje_ganancia,
      total: formatNumber(total),
      codigo_busqueda,
      //cantidad,
      imagen,
    },
    errors,
    handleChange,
    validateCreate,
    validateUpdate,
    setErrors,
    resetForm,
  };
};
