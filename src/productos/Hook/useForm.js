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
    precio_venta,
    porcentaje_ganancia,
    total,
    codigo_busqueda,
    unidad_medida,
    imagen,
    genero,
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
    if (precio_compra && precio_venta) {
      const precioCompra = parseFloat(precio_compra) || 0;
      const precioVenta = parseFloat(precio_venta) || 0;
      
      // Calcular el total (precio de venta)
      dispatch(
        handleFormStoreThunk({
          name: "total",
          value: precioVenta.toFixed(2),
        })
      );

      // Calcular el porcentaje de ganancia
      if (precioCompra > 0) {
        const ganancia = precioVenta - precioCompra;
        const porcentajeCalculado = (ganancia / precioCompra) * 100;
        
        dispatch(
          handleFormStoreThunk({
            name: "porcentaje_ganancia",
            value: porcentajeCalculado.toFixed(2),
          })
        );
      }
    }
  }, [precio_compra, precio_venta, dispatch]);


  const validateCreate = () => {
    const dataStore = {
      categoria_id,
      subcategoria_id,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      porcentaje_ganancia,
      total,
      codigo_busqueda,
      unidad_medida,
      genero,
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
      precio_venta,
      porcentaje_ganancia,
      total,
      codigo_busqueda,
      unidad_medida,
      genero,
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
      precio_venta: formatNumber(precio_venta),
      porcentaje_ganancia,
      total: formatNumber(total),
      codigo_busqueda,
      unidad_medida,
      genero,
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
