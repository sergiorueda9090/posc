export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.categoria_id) errors.categoria_id = "La categoría es obligatoria";
  if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio";
  if (!values.descripcion.trim()) errors.descripcion = "La descripción es obligatoria";

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

  if (!values.categoria_id) errors.categoria_id = "La categoría es obligatoria";
  if (!values.nombre?.trim()) errors.nombre = "El nombre no puede estar vacío";
  if (!values.descripcion.trim()) errors.descripcion = "La descripción es obligatoria";

  return errors;
};
