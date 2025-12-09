export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.nombre_empresa.trim()) errors.nombre_empresa = "El nombre es obligatorio";
  //if (!values.email.trim()) errors.email = "El email es obligatorio";
  //if (!values.contacto_principal.trim()) errors.contacto_principal = "El contacto es obligatorio";
  //if (!values.telefono.trim()) errors.telefono = "El telefono es obligatorio";
  //if (!values.direccion.trim()) errors.direccion = "La dirección es obligatorio";
  if (!values.ciudad.trim()) errors.ciudad = "La ciudad es obligatorio";
  

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

   if (!values.idProveedor) errors.idProveedor = "El idProveedor es obligatorio";
  if (!values.nombre_empresa.trim()) errors.nombre_empresa = "El nombre es obligatorio";
  //if (!values.email.trim()) errors.email = "El email es obligatorio";
  //if (!values.contacto_principal.trim()) errors.contacto_principal = "El contacto es obligatorio";
  //if (!values.telefono.trim()) errors.telefono = "El telefono es obligatorio";
  //if (!values.direccion.trim()) errors.direccion = "La dirección es obligatorio";
  if (!values.ciudad.trim()) errors.ciudad = "La ciudad es obligatorio";

  return errors;
};
