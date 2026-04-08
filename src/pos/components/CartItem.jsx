import React, { useState, useMemo } from 'react';
import { Box, Typography, TextField, IconButton, Divider, Tooltip } from '@mui/material';
import { 
    Add as AddIcon, 
    Remove as RemoveIcon, 
    Close as CloseIcon, 
} from '@mui/icons-material';

import { formatCurrency } from '../constants/formatCurrency.js';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantityThunks, removeItemThunks} from '../../store/posStore/posThunks.js';

export const CartItem = ({ item }) => {

    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState(item.quantity.toString());

    const updateQuantity = (item, delta) => {
        dispatch(updateQuantityThunks(item, delta));
    };

    const removeItem = (item, delta) => {
        dispatch(removeItemThunks(item, delta));
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        // Permitir solo números
        if (value === '' || /^\d+$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleQuantityBlur = () => {
        const newQuantity = parseInt(inputValue, 10);

        // Validar que sea un número válido y mayor a 0
        if (!isNaN(newQuantity) && newQuantity > 0) {
            const delta = newQuantity - item.quantity;
            if (delta !== 0) {
                updateQuantity(item, delta);
            }
        } else {
            // Si el valor no es válido, restaurar al valor actual
            setInputValue(item.quantity.toString());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.target.blur(); // Trigger onBlur event
        }
    };

    // Sincronizar inputValue cuando item.quantity cambie
    React.useEffect(() => {
        setInputValue(item.quantity.toString());
    }, [item.quantity]);

    // Para combos: total de unidades reales que se descuentan del stock
    // (suma de cantidades de cada producto del combo × cantidad de combos)
    const unidadesPorCombo = item.isCombo
        ? (item.productos?.reduce((sum, p) => sum + (Number(p.cantidad) || 0), 0) || 1)
        : 1;
    const unidadesMostradas = unidadesPorCombo * item.quantity;

    return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
        <Box sx={{ flexGrow: 1, pr: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: item.isDiscount ? 'error.main' : 'text.primary' }}>
                {item.nombre}
            </Typography>
            {/* Desglose completo de productos del combo (fijos + categorías resueltas) */}
            {item.isCombo && item.productos?.length > 0 && (
                <Box sx={{ ml: 1, mt: 0.5, pl: 1, borderLeft: '2px solid #16a085' }}>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#2c3e50', mb: 0.3 }}>
                        Productos del Combo
                    </Typography>
                    {item.productos.map((prod, idx) => {
                        const cant = Number(prod.cantidad) || 0;
                        const precio = Number(prod.precio_combo) || 0;
                        const subtotal = cant * precio;
                        return (
                            <Box key={idx} sx={{ mb: 0.4 }}>
                                {prod.categoria_nombre && (
                                    <Typography variant="caption" sx={{ display: 'block', color: '#7f8c8d', fontStyle: 'italic', lineHeight: 1.3 }}>
                                        Categoría: {prod.categoria_nombre}
                                    </Typography>
                                )}
                                <Typography variant="caption" sx={{ display: 'block', color: '#16a085', fontWeight: 600, lineHeight: 1.3 }}>
                                    {prod.producto_nombre}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', color: '#555', lineHeight: 1.3 }}>
                                    Cantidad: {cant} x {formatCurrency(precio)} — Subtotal: {formatCurrency(subtotal)}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            )}
            {!item.isDiscount && (
                <Typography variant="caption" color="text.secondary">
                    {item.isCombo
                        ? `${formatCurrency(item.precio_final)} x ${unidadesMostradas} unidades`
                        : `${formatCurrency(item.precio_final)} x ${item.quantity}`}
                </Typography>
            )}
        </Box>

        {!item.isDiscount && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" onClick={() => updateQuantity(item, -1)} disabled={item.quantity <= 1}>
                    <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField
                    value={inputValue}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    onKeyPress={handleKeyPress}
                    size="small"
                    inputProps={{
                        style: { textAlign: 'center', padding: '4px 8px', width: '40px' },
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                    }}
                    sx={{ mx: 0.5 }}
                />
                <IconButton size="small" onClick={() => updateQuantity(item, 1)}>
                    <AddIcon fontSize="small" />
                </IconButton>
            </Box>
        )}
        
        <Typography variant="subtitle1" sx={{ width: 80, textAlign: 'right', fontWeight: 'bold', color: item.isDiscount ? 'error.main' : 'primary.main' }}>
            {formatCurrency(item.precio_final * item.quantity)}
        </Typography>
        <Tooltip title="Eliminar ítem">
            <IconButton size="small" color="error" onClick={() => removeItem(item)}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </Box>
    );
};