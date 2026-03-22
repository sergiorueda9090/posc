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

    return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
        <Box sx={{ flexGrow: 1, pr: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: item.isDiscount ? 'error.main' : 'text.primary' }}>
                {item.nombre}
            </Typography>
            {/* Mostrar productos seleccionados del combo de categoría */}
            {item.isCombo && item.productosSeleccionados?.length > 0 && (
                <Box sx={{ ml: 1, mt: 0.3 }}>
                    {item.productosSeleccionados.map((prod, idx) => (
                        <Typography key={idx} variant="caption" sx={{ display: 'block', color: '#16a085', lineHeight: 1.4 }}>
                            &bull; {prod.producto_nombre}
                        </Typography>
                    ))}
                </Box>
            )}
            {!item.isDiscount && (
                <Typography variant="caption" color="text.secondary">
                    {formatCurrency(item.precio_final)} x {item.quantity}
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