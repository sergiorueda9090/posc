import { TAX_RATE } from '../constants/TaxRage.js';

export const calculateTotals = (cart) => {
    // 1. Sumar subtotal de productos (excluyendo descuentos)
    const taxableSubtotal = cart
        .filter(item => !item.isDiscount)
        .reduce((sum, item) => sum + (item.precio_final * item.quantity), 0);

    // 2. Sumar el monto total de los descuentos (que son valores negativos)
    const discountAmount = cart
        .filter(item => item.isDiscount)
        .reduce((sum, item) => sum + (item.precio_final * item.quantity), 0);
    
    // 3. Subtotal antes de impuestos pero después de descuento
    const subtotalAfterDiscount = taxableSubtotal + discountAmount;
    
    // 4. Calcular el impuesto sobre el subtotal base (solo productos, no el descuento)
    const taxValue = taxableSubtotal * TAX_RATE;
    
    // 5. Total final
    const total = subtotalAfterDiscount + taxValue;

    return {
        taxableSubtotal,
        discountAmount,
        subtotalAfterDiscount,
        taxValue,
        total,
    };
};