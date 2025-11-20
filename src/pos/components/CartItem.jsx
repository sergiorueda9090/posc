import React, { useState, useMemo } from 'react';
import { Box, Typography,  IconButton, Divider, Tooltip } from '@mui/material';
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

    const updateQuantity = (item, delta) => {
        dispatch(updateQuantityThunks(item, delta));
    };

    const removeItem = (item, delta) => {
        dispatch(removeItemThunks(item, delta));
    };

    return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
        <Box sx={{ flexGrow: 1, pr: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: item.isDiscount ? 'error.main' : 'text.primary' }}>
                {item.nombre}
            </Typography>
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
                <Typography sx={{ mx: 0.5 }}>{item.quantity}</Typography>
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