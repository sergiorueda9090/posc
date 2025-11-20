export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.cliente_id) errors.cliente_id = "El cliente es obligatorio";
  if (!values.tarjeta_id) errors.tarjeta_id = "La tarjeta es obligatoria";
  if (!values.valor) errors.valor = "El valor es obligatorio";

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

  if (!values.cliente_id) errors.cliente_id = "El cliente es obligatorio";
  if (!values.tarjeta_id) errors.tarjeta_id = "La tarjeta es obligatoria";
  if (!values.valor) errors.valor = "El valor es obligatorio";

  return errors;
};
