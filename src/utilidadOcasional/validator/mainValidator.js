export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.tarjeta_id) errors.tarjeta_id = "La tarjeta es obligatorio";
  if (!values.valor) errors.valor = "El valor es obligatorio";

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

  if (!values.tarjeta_id) errors.tarjeta_id = "La tarjeta es obligatorio";
  if (!values.valor) errors.valor = "El valor es obligatorio";

  return errors;
};
