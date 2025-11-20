export const validateMainCreate = (values) => {
  const errors = {};
  if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio";
  if (!values.pan.trim()) errors.pan = "El número de cuenta es obligatorio";
  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};
  if (!values.nombre?.trim()) errors.nombre = "El nombre no puede estar vacío";
  if (!values.pan?.trim()) errors.pan = "El número de cuenta no puede estar vacío";
  return errors;
};
