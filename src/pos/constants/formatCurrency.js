export const formatCurrency = (value) => {
  if (isNaN(value)) return "$0";
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};