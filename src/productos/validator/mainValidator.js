export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.categoria_id) errors.categoria_id = "La categoría es obligatoria";
  if (!values.subcategoria_id) errors.subcategoria_id = "La subcategoría es obligatoria";
  if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio";
  if (!values.descripcion.trim()) errors.descripcion = "La descripción es obligatoria";
  if (!values.precio_compra) errors.precio_compra = "El precio de compra es obligatorio";
  if (!values.precio_venta) errors.precio_venta = "El precio de venta es obligatorio";
  if (!values.porcentaje_ganancia) errors.porcentaje_ganancia = "El porcentaje de ganancia es obligatorio";
  if (!values.total) errors.total = "El total es obligatorio";
  if (!values.unidad_medida) errors.unidad_medida = "La unidad de medida es obligatoria";
  if (!values.codigo_busqueda) errors.codigo_busqueda = "El código de búsqueda es obligatorio";
  if (!values.genero) errors.genero = "El género es obligatorio";
  //if (!values.cantidad) errors.cantidad = "La cantidad es obligatoria";

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

  if (!values.categoria_id) errors.categoria_id = "La categoría es obligatoria";
  if (!values.subcategoria_id) errors.subcategoria_id = "La subcategoría es obligatoria";
  if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio";
  if (!values.descripcion.trim()) errors.descripcion = "La descripción es obligatoria";
  if (!values.precio_compra) errors.precio_compra = "El precio de compra es obligatorio";
  if (!values.precio_venta) errors.precio_venta = "El precio de venta es obligatorio";
  if (!values.porcentaje_ganancia) errors.porcentaje_ganancia = "El porcentaje de ganancia es obligatorio";
  if (!values.total) errors.total = "El total es obligatorio";
  if (!values.unidad_medida) errors.unidad_medida = "La unidad de medida es obligatoria";
  if (!values.codigo_busqueda) errors.codigo_busqueda = "El código de búsqueda es obligatorio";
  if (!values.genero) errors.genero = "El género es obligatorio";
  //if (!values.cantidad) errors.cantidad = "La cantidad es obligatoria";

  return errors;
};
