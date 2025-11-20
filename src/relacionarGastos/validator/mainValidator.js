export const validateMainCreate = (values) => {
  const errors = {};

  if (!values.gasto_id) errors.gasto_id = "El gasto es obligatorio";
  if (!values.total_gasto) errors.total_gasto = "El total del gasto es obligatorio";

  return errors;
};

export const validateMainUpdate = (values) => {
  const errors = {};

  if (!values.gasto_id) errors.gasto_id = "El gasto es obligatorio";
  if (!values.total_gasto) errors.total_gasto = "El total del gasto es obligatorio";

  return errors;
};
