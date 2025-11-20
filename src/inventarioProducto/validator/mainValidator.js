export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.cantidad?.trim()) errors.cantidad = "La cantidad es obligatoria";

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

  if (!values.cantidad?.trim()) errors.cantidad = "La cantidad no puede estar vacía";

  return errors;
};
