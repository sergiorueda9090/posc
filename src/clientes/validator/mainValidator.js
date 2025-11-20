export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio";
  if (!values.apellido.trim()) errors.apellido = "El apellido es obligatorio";
  if (!values.email.trim()) errors.email = "El email es obligatorio";
  else if (!/\S+@\S+\.\S+/.test(values.email))
    errors.email = "El email no tiene un formato válido";
  if (!values.telefono.trim()) errors.telefono = "El teléfono es obligatorio";
  if (!values.direccion.trim()) errors.direccion = "La dirección es obligatoria";

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

  if (!values.nombre?.trim()) errors.nombre = "El nombre no puede estar vacío";
  if (values.email && !/\S+@\S+\.\S+/.test(values.email))
    errors.email = "El email no tiene un formato válido";

  return errors;
};
